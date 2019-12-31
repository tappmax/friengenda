import * as _ from 'lodash';
import * as moment from 'moment';
import * as passport_local from 'passport-local';
import * as passport from 'passport';
import * as express from "express";
import * as jwt from 'jsonwebtoken'
import { getUserIdFromRequest, isJsonResponse, getPayloadFromRequest, getTokenFromRequest } from '@helpers/RequestHelpers'
import { router, IRoute } from '@helpers/RouteHelpers';
import { renderSuccess, renderError } from '@helpers/ResponseHelpers';
import { validateString, validateEmail, validatePassword } from '@helpers/ValidationHelpers';
import * as UserService from '@services/UserService';
import * as MailService from '@services/MailService';
import { User, userToPrivateResponse } from '@models/User'
import { IJWTPayload } from '@models/Auth';
import {logger} from '@services/LoggerService';
import AlreadyExistsError from '@errors/AlreadyExistsError';
import NotAuthorizedError from '@errors/NotAuthorizedError';
import NotFoundError from '@errors/NotFoundError';
import InvalidParameterError from '@errors/InvalidParameterError';
import InternalServerError from '@errors/InternalServerError';
import MissingParameterError from '@errors/MissingParameterError';
import { getSettingValue } from '@services/SettingService';

// Initialize passport
passport.use(new passport_local.Strategy ({passReqToCallback : true},
    async (req: express.Request, username, password, done) => {
        try {
            const userAgent = req.header('User-Agent');

            let user : User;
            try {
                user = await UserService.getUserByEmail(username);
            } catch {
                logger.error('AuthController.login', { error: 'UnknownUser', email:username, userAgent : userAgent });
                return done('InvalidUser', null);
            }

            if (user.status === 'Unconfirmed') {
                logger.error('AuthController.login', { error: 'Unconfirmed', email:username, userAgent : userAgent });
                return done('NotVerified');
            }

            if (user.status === 'Disabled') {
                logger.error('AuthController.login', { error: 'Disabled', email:username, userAgent : userAgent });
                return done('InvalidUser');
            }

            const validated = await UserService.checkPassword(user.id, password);
            if (!validated) {
                logger.error('AuthController.login', { error: 'InvalidPassword', email:username, userId : user.id, userAgent : userAgent });
                return done('InvalidPassword', null)
            }

            return done(null, user);

        } catch (err) {
            done(err);
        }
    })
);

function setPasswordViewInternal (res: express.Response, verification: string, error?: string, message? : string) {
    // Render the set password view
    return res.render(`SetPassword`, {
        message : message || res.__('SetPasswordMessageForgotPassword'),
        error : error,
        action : `/v1/auth/setpassword/${verification}`
    });
}

/**
 * Defines the routes for the auth controller
 */
const routes : IRoute[] = [
   
    // POST /auth/login (Login)
    {
        method: 'POST',
        url: '/auth/login',
        authenticate : false,
        handlers : [
            // Authenticate with passport
            passport.authenticate("local", { session: false, failWithError: true }), 

            // Handle passport errors 
            (err, req, res, next) => { 
                throw new NotAuthorizedError(err,res.__((() => {
                    switch(err) {
                        case 'NotVerified': return 'ErrorUnconfirmedUserLogin';
                        case 'InvalidUser': return 'ErrorUnknownUser';
                        case 'InvalidPassword': return 'ErrorInvalidPassword';
                        default:
                            if(!req.body.username) return 'ErrorInvalidUsername';
                            if(!req.body.password) return 'ErrorInvalidPassword';
                            return 'ErrorUnknown';
                    }
                })()));
            },

            async (req: express.Request, res: express.Response) => {
                const user = req['user'] as User;
            
                // Update the users last login time
                await UserService.updateLastLoginTime(user.id);
            
                // Log all user logins
                logger.info('AuthController.login', { email: user.email, status : user.status, userAgent : req.header('User-Agent') });

                const duration = getSettingValue<number>('JWTTTL') * 60;
                const payload : IJWTPayload = {
                    id: user.id,
                    exp : moment().utc().unix() + duration
                }                

                const token = jwt.sign(payload, getSettingValue<string>('JWTSecretKey'));

                await UserService.updateUserJWT(user.id, token);

                res.json({
                    ...userToPrivateResponse(user),
                    token: token,
                    tokenExpiration: payload.exp,
                    tokenDuration: duration
                 });
            }
        ]
    },
        
    // GET /auth/logout (Logout)
    {
        method: 'GET',
        url: '/auth/logout',
        handlers : async (req: express.Request, res: express.Response) => {            
            // Clear the JWT preventing it from being used again
            await UserService.updateUserJWT(getUserIdFromRequest(req), null);

            res.success();
        }        
    },
        
    // GET /auth/token (RefreshToken)
    {
        method: 'GET',
        url: '/auth/token',
        handlers : async (req: express.Request, res: express.Response) => {       
            // Check the old key and make sure it is valid
            const oldPayload = getPayloadFromRequest(req);
            if(Date.now() / 1000 >= oldPayload.exp)
                throw new NotAuthorizedError('expired', res.__('SessionExpired'));

            // Generate a new key
            const duration = getSettingValue<number>('JWTTTL') * 60;
            const payload : IJWTPayload = {
                id: getUserIdFromRequest(req),
                exp : moment().utc().unix() + duration
            }

            const token = jwt.sign(payload, getSettingValue<string>('JWTSecretKey'));

            // Update the JWT in the server
            await UserService.updateUserJWT(
                getUserIdFromRequest(req),
                token,
                getTokenFromRequest(req));
            
            // Return the new key and the user
            res.json({
                ...userToPrivateResponse(await UserService.getUserById(getUserIdFromRequest(req))),
                token: token,
                tokenExpiration: payload.exp,
                tokenDuration: duration
                });
        }        
    },

    // POST /auth/register (Register)
    {
        method: 'POST',
        url: '/auth/register',
        roleAccept: 'UserEdit',
        handlers : async (req: express.Request, res: express.Response) => {                     
            const errors : { [s : string ] : string } = {}
            
            // Validate email
            try {
                req.body.email = validateEmail(req.body, 'email', true);
            } catch (err) {
                if(err instanceof MissingParameterError) 
                    errors.email = res.__('ErrorRegisterMissingEmail')
                else
                    errors.email = res.__('ErrorRegisterInvalidEmail')
            }                   

            if(!req.body.firstName) errors.firstName = res.__('ErrorRegisterFirstNameRequired')
            if(!req.body.lastName) errors.lastName = res.__('ErrorRegisterLastNameRequired')
                
            // Password password
            try {
                var password = validatePassword (req.body, 'password', true);
            } catch {
                errors.password = res.__('ErrorPasswordComplexity');
            }
            
            // Return errors if there are any    
            if (Object.keys(errors).length != 0)
                throw new InvalidParameterError (undefined, errors);
            
            try {
                const userId = await UserService.addUser ({
                    email: req.body.email,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    password: password});
        
                // Send verification email
                await MailService.sendVerificationEmail(userId);
        
                // Return the user object
                return res.json(userToPrivateResponse(await UserService.getUserById(userId)));
        
            } catch (err) {
                if(err instanceof AlreadyExistsError)
                    throw new InvalidParameterError({email : res.__('ErrorRegisterEmailInUse') });     
        
                throw err;
            }
        }
    },

    // POST /auth/resetpassword (ResetPassword)
    {
        method: 'POST',
        url: '/auth/resetpassword',
        roleAccept: 'UserEdit',
        handlers : async (req: express.Request, res: express.Response) => {
            await MailService.sendForgotPasswordEmail(await UserService.getUserByEmail(validateEmail(req.body, 'email', true)));
            res.success();
        }        
    },

    // POST /auth/verifyemail (VerifyEmail)
    {
        method: 'POST',
        url: '/auth/verifyemail',
        
        handlers : async (req: express.Request, res: express.Response) => {           
            const user = await UserService.getUserByEmail(validateEmail(req.body, 'email', true));
                   
            // If the user is not unconfirmed then there is no reason to send the mail
            if(user.status !== 'Unconfirmed')
                throw new InvalidParameterError('status');
        
            // Send the email to the user
            await MailService.sendVerificationEmail(user);
        
            res.success();
        }
    },

    // GET /auth/verifyemail/:verifycode (VerifyEmailView)
    {
        method: 'GET',
        url: '/auth/verifyemail/:verifycode',
        authenticate : false,
        handlers : async (req: express.Request, res: express.Response) => {
            try {
                // Look up the user by the verification code
                const user = await UserService.getUserByVerificationCode(req.params.verifycode);

                if(user.status === 'Unconfirmed')                    
                    await UserService.setUserStatus(user.id, 'Active');
        
                // If the user doesnt have a password then have them set the password now
                if(!await UserService.userHasPassword(user.id))
                    return setPasswordViewInternal(res, req.params.verifycode, null, res.__('SetPasswordMessageVerifyEmail'))
        
                // Clear the verification code now that the user is verified
                await UserService.clearUserVerificationCode(user.id);
        
                // No password needs to be set so just render success
                return renderSuccess(res, res.__('EmailVerified'));
            } catch (err) {
                return renderError(res, res.__('ErrorVerificationExpired'));
            }
        }
    },

    // GET /auth/setpassword/:verifycode (SetPasswordView)
    {
        method: 'GET',
        url: '/auth/setpassword/:verifycode',
        authenticate : false,
        handlers : async (req: express.Request, res: express.Response) => {
            try {                
                // Retrieve the user by the verfication code to ensure it is still valid
                await UserService.getUserByVerificationCode(req.params.verifycode);
            
                // Render the set password view with a custom message
                return setPasswordViewInternal(res, req.params.verifycode)
            } catch (err) {
                return renderError(res, res.__('ErrorVerificationExpired'));
            }
        }
    },

    // POST /auth/setpassword/:verifycode (SetPasswordWithCode)
    {
        method: 'POST',
        url: '/auth/setpassword/:verifycode',
        authenticate : false,
        handlers : async (req: express.Request, res: express.Response) => {
            const isJson = isJsonResponse(req);    
       
            // Verify verification code
            const verifyCode = req.params.verifycode;
            const user = await UserService.getUserByVerificationCode(verifyCode);
            if (user == null && isJson) throw new NotFoundError('user');
            if (user == null && !isJson) return setPasswordViewInternal(res, verifyCode, res.__('ErrorVerificationExpired'));
        
            // Validate password
            try {
                var password = validatePassword(req.body, 'password', true); 
            } catch (err) {
                if(err instanceof MissingParameterError) {
                    if(isJson) throw new MissingParameterError('password');
                    return setPasswordViewInternal(res, verifyCode, res.__('ErrorPasswordMissing'));        
                } else {
                    if(isJson) throw new InvalidParameterError('password');
                    return setPasswordViewInternal(res, verifyCode, res.__('ErrorPasswordComplexity'));         
                }
            }

            // Confirm password
            try {
                if(validateString (req.body, 'confirmPassword', true) != password) 
                    throw new InvalidParameterError('confirmPassword');
            } catch (err) {
                if(isJson) 
                    throw new InvalidParameterError('confirmPassword');
                
                return setPasswordViewInternal(res, verifyCode, res.__('ErrorPasswordMismatch')); 
            }
           
            // Set the new password
            const passwordUpdated = await UserService.updateUserPassword(user.id, password);
        
            // Send a mail indicating their password has changed
            try { await MailService.sendPasswordChangedEmail(user.id); } catch { }
        
            if(passwordUpdated && isJson) 
                return res.success();
        
            renderSuccess(res, res.__('PasswordUpdated'))
        }
    },

    // POST /auth/setpassword (SetPassword)
    {
        method: 'POST',
        url: '/auth/setpassword',
        
        handlers : async (req: express.Request, res: express.Response) => {
            const newPassword = validatePassword(req.body, 'newPassword', true);
            const newPasswordConfirmation = validateString(req.body, 'newPasswordConfirmation', true);
            const oldPassword = validateString(req.body, 'oldPassword', true);
            const userId = getUserIdFromRequest(req);
        
            if(newPassword != newPasswordConfirmation) 
                throw new InvalidParameterError ('newPasswordConfirmation');
                       
            if(!(await UserService.checkPassword(userId, oldPassword)))
                throw new InvalidParameterError ('oldPassword');
        
            // Update the password
            await UserService.updateUserPassword(userId, newPassword);
            
            // Send a mail indicating their password has changed
            try {
                await MailService.sendPasswordChangedEmail(userId);
            } catch (err) {
                throw new InternalServerError(err);
            }
        
            return res.success();
        }
    },

    // POST /auth/forgotpassword (ForgotPassword)
    {
        method: 'POST',
        url: '/auth/forgotpassword',
        authenticate : false,
        handlers : async (req: express.Request, res: express.Response) => {
            // Validate email 
            const  email = validateEmail(req.body, 'email', true);
        
            // Send out the email if the user is valid, otherwise just fail silently so we 
            // dont allow people to use this end point to snoop for valid email addresses
            let user : User;
            try { user = await UserService.getUserByEmail(email); } catch { }    
            if (user && user.status != 'Unconfirmed') {
                try {
                    await MailService.sendForgotPasswordEmail(user);
                } catch (err) {
                    throw new InternalServerError(err);
                }
            }
        
            return res.success()
        }
    },

    // GET /session (GetSession)
    {
        method : 'GET',
        url : '/session',
        authenticate : true,

        handlers : [
            async (req: express.Request, res: express.Response) => {
                return res.json({
                    // Return full user record
                    user : await UserService.getUserById(getUserIdFromRequest(req)),

                    // Return options as an array of valid options
                    roles : _.map(_.filter(await UserService.getUserRoles(getUserIdFromRequest(req)), value => value.value),value => value.id)
                });
            }
        ]
    }
];

/**
 * Router for all cart related requests
 */
export function initialize () {
    return router(routes);
}
