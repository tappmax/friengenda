import * as _ from 'lodash';
import * as express from "express";
import { IRoute, router, handleUserId, handleId } from '@helpers/RouteHelpers'
import { validateString, validateUserRoleId, validateEnum } from '@helpers/ValidationHelpers';
import { getUserIdFromRequest } from '@helpers/RequestHelpers';
import * as UserService from '@services/UserService'
import { userToPrivateResponse, usersToPrivateResponse, userToPublicResponse, userRoleToResponse, userRolesToResponse } from "@models/User"
import { logger } from '@services/LoggerService';
import NotAuthorizedError from '@errors/NotAuthorizedError';
import { UserStatus, stringToUserStatus } from '@models/Enums';

/**
 * Set the status of a user
 */
function setUserStatus (status : UserStatus) {
    return async function (req: express.Request, res: express.Response) {
        const oldStatus = await UserService.getUserStatus(req.validatedParams.userId);
    
        logger.info('UserController.setUserStatus', { 
            adminId : getUserIdFromRequest(req), 
            userId : req.validatedParams.userId, 
            newStatus : status,
            oldStatus : oldStatus
        } );
    
        // Admins are not authorized to change the status of an unconfirmed user.
        if(oldStatus === 'Unconfirmed') 
            throw new NotAuthorizedError ('status');
    
        await UserService.setUserStatus(Number.parseInt(req.validatedParams.userId), status)
    
        res.json(userToPrivateResponse(await UserService.getUserById(req.validatedParams.userId)));
    }    
}

/**
 * All routes for the user controller
 */
const routes : IRoute[] = [ 
    // GET /users (GetAllUsers)
    {
        method : 'GET',
        url : '/users',
        pagination : true,
        handlers : async (req: express.Request, res: express.Response) => {
            res.json(usersToPrivateResponse(await UserService.getUsers(req.validatedParams.offset, req.validatedParams.limit)));
        }        
    },

    // GET /users/search (SearchUsers)
    {
        method : 'GET',
        url : '/users/search',
        pagination : true,
        roleAccept: 'UserView',
        handlers : async (req: express.Request, res: express.Response) => {
            res.json(
                usersToPrivateResponse(
                    await UserService.searchUsers({
                        email : req.query.email,
                        limit : req.validatedParams.limit,
                        offset : req.validatedParams.offset,
                        status : validateEnum<UserStatus>(req.query,'status',false,stringToUserStatus)
                    })
                )
            );
        }
        
    },

    // GET /users/current (GetCurrentUser)
    {
        method : 'GET',
        url : '/users/current',
        handlers : [
            async (req: express.Request, res: express.Response) => {           
                res.json(userToPrivateResponse(await UserService.getUserById(getUserIdFromRequest(req))));
            }
        ]
    },

    // PUT /users/current (UpdateUser)
    {
        method : 'PUT',
        url : '/users/current',
        handlers : [
            async (req: express.Request, res: express.Response) => {                                               
                // Update the user
                await UserService.updateUser(getUserIdFromRequest(req), {
                    firstName : validateString(req.body, 'firstName', true),
                    lastName : validateString(req.body, 'lastName', true)
                });
            
                // Return the updated user
                res.json(userToPrivateResponse(await UserService.getUserById(getUserIdFromRequest(req))));
            }
        ]
    },    

    // GET /users/:userId (GetUser)
    {
        method : 'GET',
        url : '/users/:userId',
        roleAccept: 'UserView',
        handlers : [
            handleUserId,
            async (req: express.Request, res: express.Response) => {
                res.json(userToPrivateResponse(await UserService.getUserById(req.validatedParams.userId)));
            }
        ]
    },

// GET /users/:userId/info (GetUserInfo)
    {
        method : 'GET',
        url : '/users/:userId/info',
        handlers : [
            handleUserId,

            async (req: express.Request, res: express.Response) => {
                res.json(userToPublicResponse(await UserService.getUserById(req.validatedParams.userId)));
            }            
        ]
    },

    // POST /users/:userId/approve (ApproveUser)
    {
        method : 'POST',
        url : '/users/:userId/approve',
        roleAccept : 'UserEdit',
        handlers : [
            handleUserId,
            setUserStatus('Active')
        ]
    },

    // POST /users/:userId/disable (DisableUser)
    {
        method : 'POST',
        url : '/users/:userId/disable',
        roleAccept : 'UserEdit',
        handlers : [
            handleUserId,
            setUserStatus('Disabled')
        ]
    },
    
    // GET /users/:userId/roles (GetUserRoles)
    {
        method : 'GET',
        url : '/users/:userId/roles',
        roleAccept: 'UserView',
        handlers : [
            handleUserId,   
            async (req: express.Request, res: express.Response) => {
                res.json(userRolesToResponse(await UserService.getUserRoles(req.validatedParams.userId)))
            }      
        ]
    },

    // GET /users/:userId/roles/:roleId (GetUserRole)
    {
        method : 'GET',
        url : '/users/:userId/roles/:roleId',
        roleAccept: 'UserView',
        handlers : [
            handleUserId,   
            async (req: express.Request, res: express.Response) => {
                res.json(
                    userRoleToResponse (
                        await UserService.getUserRole(
                            req.validatedParams.userId,
                            validateUserRoleId (req.params,'roleId',true)
                            )));
            }      
        ]
    },

    // PUT /users/:userId/roles/:roleId (EnableUserRole)
    {
        method : 'PUT',
        url : '/users/:userId/roles/:roleId',
        roleAccept : 'UserEdit',
        handlers : [
            handleUserId,
            async (req: express.Request, res: express.Response) => {
                await UserService.enableUserRole(
                    req.validatedParams.userId,
                    validateUserRoleId(req.params, 'roleId')
                )
                res.json(userRolesToResponse(await UserService.getUserRoles(req.validatedParams.userId)));
            }      
        ]
    },

    // DELETE /users/:userId/roles/:roleId (DisableUserRole)
    {
        method : 'DELETE',
        url : '/users/:userId/roles/:roleId',
        roleAccept : 'UserEdit',
        handlers : [
            handleUserId,
            async (req: express.Request, res: express.Response) => {
                await UserService.disableUserRole(
                    req.validatedParams.userId,
                    validateUserRoleId(req.params, 'roleId')
                )
                res.json(userRolesToResponse(await UserService.getUserRoles(req.validatedParams.userId)));
            }      
        ]
    }
];

/**
 * Initialize the user controller by creating an express router and returning it
 */
export function initialize () {
    return router(routes);
}

