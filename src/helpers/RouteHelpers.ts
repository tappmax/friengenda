import * as _ from 'lodash';
import * as jwt from 'express-jwt';
import * as express from 'express';
import * as Busboy from 'busboy';
import * as imageSize from 'image-size';
import {getUserIdFromParam, getUserIdFromRequest, getTokenFromRequest} from '@helpers/RequestHelpers';
import NotAuthorizedError from '@errors/NotAuthorizedError';
import InvalidParameterError from '@errors/InvalidParameterError';
import * as UserService from '@services/UserService';
import { getSettingValue } from '@services/SettingService';
import { SettingName } from '@models/Setting';
import { UserRoleId } from '@models/User';

/**
 * Handles JWT authorization
 * @param req Request
 * @param res Response
 * @param next Next handler
 */
function handleAuthorization(req: express.Request, res: express.Response, next: any) {
    const required = jwt({
        secret: getSettingValue<string>('JWTSecretKey'),
        userProperty: 'payload',
        getToken: getTokenFromRequest
    });

    // Validate the token through passport
    required(req, res, err => {
        if (err) 
            res.error(new NotAuthorizedError(err));
        else
            next(err);
    });
}

/**
 * Handles validating the JWT in the request matches the one on the user record
 * @param req Request
 * @param res Response
 * @param next next handler
 */
async function handleJWTValidation (req: express.Request, res: express.Response, next: any) {
    // Ensure the JWT is still associated with the user
    await UserService.validateUserJWT(getUserIdFromRequest(req), getTokenFromRequest(req));

    next();
}

/**  
 * Validate the `status` of the user is not `Disabled`.
 */
 async function handleUserStatus (req: express.Request, res: express.Response, next : any) {
    if(await UserService.getUserStatus(getUserIdFromRequest(req)) === 'Disabled')
        throw new NotAuthorizedError("disabled");

    next();
}

/**
 * Parses pagination parameters into the `req.validateParams.limit` and `req.validatedParams.offset` values.
 */
function pagination(req: express.Request, res: express.Response, next : any) {
    const limit = req.query.limit ? Math.max(1, Number.parseInt(req.query.limit)) : undefined;
    const page = Math.max(1, req.query.page || 1);
    const offset = (page - 1) * limit;

    req.validatedParams.page = page;
    req.validatedParams.limit = limit;
    req.validatedParams.offset = offset;

    next();
}

/**
 * Ensures that users have the given roles.  
 * @param roles Roles(s) to accept
 */
function roleAccept(roles: UserRoleId[] | UserRoleId) {
    return async function (req: express.Request, res: express.Response, next: any) {
        roles = Array.isArray(roles) ? roles : [roles];
        for(let role of roles) {
            if(!(await UserService.getUserRole(getUserIdFromRequest(req), role)).value)
                throw new NotAuthorizedError(role);
        }

        next();
    }
}

/**
 * Ensures that users have the given roles. 
 * @param roles Roles(s) to reject
 */
function roleReject (roles: UserRoleId[] | UserRoleId) {
    return async function (req: express.Request, res: express.Response, next: any) {
        roles = Array.isArray(roles) ? roles : [roles];
        for(let role of roles) {
            if((await UserService.getUserRole(getUserIdFromRequest(req), role)).value)
                throw new NotAuthorizedError(role);
        }

        next();
    }
}

/**  
 * Validate the `userId` parameter and store the value in `req.validatedParams.userId`.
 */
export function handleUserId (req: express.Request, res: express.Response, next : any) {
    req.validatedParams.userId = getUserIdFromParam (req);
    next();
}

/**
 * Validate a parameter as a unique identifier [0-N] and store its valid in `red.validatedParams[name]`
 * @param name Name of the parameter to validate
 * @param checkExists Optionally check if the id exists
 */
export function handleId (name : string, checkExists?: (id : number) => Promise<void>) {
    return async (req: express.Request, res: express.Response, next: any) => {
        const id = Number.parseInt(req.params[name]);
        if(!id || id <= 0)
            throw new InvalidParameterError(name);
        
        req.validatedParams[name] = id;

        if(checkExists)
            await checkExists(id);

        next();
    }
}

/**
 * Wrap a request handler to automatially handle any thrown errors
 */
function handleErrors (func : express.ErrorRequestHandler )
function handleErrors (func : express.RequestHandler )
function handleErrors (func : express.RequestHandler | express.ErrorRequestHandler ) {
    if(func.length == 4)
        return async function (err: any, req: express.Request, res: express.Response, next: any) {
            try {                            
                await (func as express.ErrorRequestHandler)(err, req, res, next);
            } catch (err) {
                return res.error(err);                
            }    
        }

    return async function (req: express.Request, res: express.Response, next: any) {
        try {                            
            await (func as express.RequestHandler)(req, res, next);
        } catch (err) {
            return res.error(err);
        }    
    }
}

export interface IRequestFile {
    name : string,
    data : Buffer
};

export interface IMultipartFormOptions {
    maxFiles : number;
    mimeTypes ?: string[];
    maxImageSize ?: SettingName;
}

function multipartForm(options : IMultipartFormOptions) {
    return (req: express.Request, res: express.Response, next: any) => {
        var contentType = req.headers["content-type"];
        if(!contentType || contentType.substr(0, 20) !== 'multipart/form-data;')
            return next();

        const bb = new Busboy({headers:req.headers});
        const files : IRequestFile[] = [];
        let error : string;

        bb.on('file', (field,file,filename,encoding,mimetype) => {
            var fileData : Buffer;

            if(options.mimeTypes && !options.mimeTypes.includes(mimetype.toLowerCase())) {
                error = `${field}: unsupported mime type '${mimetype}'`;
            } else if(files.length >= options.maxFiles) {
                error = `${field}: maximum number of ${options.maxFiles} file(s) exceeded`;
            }

            file.on('data', (data) => {
                if(fileData)
                    fileData = Buffer.concat([fileData, data])
                else
                    fileData = data;
            });

            file.on('end', () => {
                if(options.maxImageSize) {
                    try {
                        const size = imageSize(fileData)
                        const maxImageSize = getSettingValue<number>(options.maxImageSize);
                        if(size.width > maxImageSize || size.height > maxImageSize) {
                            error = `${field}: maximum image size exceeded`;
                            return;
                        }
                    } catch {
                        error = `${field}: image corrupt`;
                        return;
                    }
                }

                if(!req.body[field]) 
                    req.body[field] = []

                req.body[field].push({
                    name : filename,
                    data : fileData,
                    mimetype : mimetype
                })                
            })
        });

        bb.on('field', (field,value,fieldTruncated,valueTruncated) => {
            req.body[field] = value;
        });

        bb.on('finish', () => {
            if(error)
                return res.error (new InvalidParameterError(error));

            (req as any).files = files;
                
            next();
        })

        req.pipe(bb);
    }
}

export interface IRoute {
    method: 'GET' | 'PATCH' | 'DELETE' | 'PUT' | 'POST';
    url: string;
    handlers? : express.RequestHandler | express.ErrorRequestHandler | Array<express.RequestHandler | express.ErrorRequestHandler>;
    authenticate?: boolean;
    pagination?: boolean;
    multipartForm?: IMultipartFormOptions;
    roleAccept?: UserRoleId | UserRoleId[]
    roleReject?: UserRoleId | UserRoleId[]
}

export function router (routes : IRoute[]) : express.Router {
    const router = express.Router();
    _.each(routes, route => {
        const builtinHandlers : express.RequestHandler[] = [];

        // Authorized routes
        if(route.authenticate === true || route.authenticate === undefined) {
            builtinHandlers.push(handleErrors(handleAuthorization));
            builtinHandlers.push(handleErrors(handleJWTValidation));
            builtinHandlers.push(handleErrors(handleUserStatus));            
        }

        // Routes with pagination
        if(route.pagination === true)
            builtinHandlers.push(handleErrors(pagination));

        // Routes that only accept certain roles
        if(route.roleAccept)
            builtinHandlers.push(handleErrors(roleAccept(route.roleAccept)));

        // Routes that reject certain roles
        if(route.roleReject)
            builtinHandlers.push(handleErrors(roleReject(route.roleReject)));

        // Routes with a multi-part form
        if(route.multipartForm)
            builtinHandlers.push(multipartForm(route.multipartForm))

        // All methods besides GET should validate the user status
        if(route.method !== 'GET' && route.authenticate)
            builtinHandlers.push(handleErrors(handleUserStatus));

        const wrappedHandlers = Array.isArray(route.handlers) ?
            _.map(route.handlers, handler => handleErrors(handler as any)) :
            [ handleErrors ( route.handlers as any )];

        const handlers : express.RequestHandler[] = [
            ...builtinHandlers,
            ...wrappedHandlers
        ];

        switch(route.method) {
            case 'GET': router.get(route.url, handlers); break;
            case 'PUT': router.put(route.url, handlers); break;
            case 'PATCH': router.patch(route.url, handlers); break;
            case 'DELETE': router.delete(route.url, handlers); break;
            case 'POST': router.post(route.url, handlers); break;
        }
    });

    return router;
}

