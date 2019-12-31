import * as _ from 'lodash';
import * as express from 'express';
import { IJWTPayload } from '@models/Auth'
import * as UserService from '@services/UserService';
import InvalidParameterError from '@errors/InvalidParameterError';
import { UserRoleId } from '@models/User';

export const getTokenFromRequest = (req) => {
    const { headers: { authorization } } = req;

    if(!authorization)
        return null;

    var split : string[] = authorization.split(' ');
    if (split[0].toLowerCase() === 'token' || split[0].toLowerCase() === 'bearer')
        return split[1];

    return null;
};

export function getPayloadFromRequest (req: express.Request) : IJWTPayload {  
    return (req.payload || {}) as IJWTPayload;
}

/**
 * Returns true if the authorized user has the given option
 * @param req Request containing the user authorization
 * @param option Option to check
 * @returns true if the user has the given option
 */
export async function userHasRole (req: express.Request, roleId: UserRoleId) : Promise<boolean> {
    return (await UserService.getUserRole(getUserIdFromRequest(req), roleId)).value;
}

export function getUserIdFromRequest(req: express.Request): number {
    return getPayloadFromRequest(req).id || 0;
}

export function urlFromRequest (req: express.Request, relativeUrl? : string) {
    return `${req.protocol}://${req.get('host')}${req.baseUrl}${relativeUrl || ''}`;
}

export function isJsonResponse (req: express.Request) {
    return (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1));    
}

/**
 * Parse the `userId` parameter from the request and return its numeric valie.
 * @param req Request to read `userId` from
 */
export function getUserIdFromParam (req: express.Request) : number {
    // Use the current user?
    let userId : number;
    if (req.params.userId == 'current')
        userId = getUserIdFromRequest(req);
    else
        userId = Number.parseInt(req.params.userId);

    if(isNaN(userId))
        throw new InvalidParameterError('userId');

    return userId;
}
