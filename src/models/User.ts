import * as _ from 'lodash'
import * as T from '@helpers/ModelHelpers';
import { dateToString } from '@helpers/DateHelpers';
import { UserStatus, stringToUserStatus } from '@models/Enums';

export type User = {
    id: number;
    email: string;
    status : UserStatus;
    firstName: string;
    lastName: string;
    created: Date;
    lastLogin: Date;    
}

export const UserRoles = {
    // Application settings
    SettingView : { description : 'Can view settings'},
    SettingEdit : { description : 'Can edit settings'},

    // Reports
    ReportView : { description: 'Can view reports' },

    ContractEdit : { description: 'Can edit contracts' },
    PlanEdit : { description: 'Can edit plans' },

    // Users
    UserView : { description: 'Can view users' },
    UserEdit : { description: 'Can edit users' },

    // Datasets
    DatasetLock : { description: 'Can lock datatsets'},
    DatasetImport : { description : 'Can import dataset totals'}

} as const;

export type UserRoleId = keyof typeof UserRoles;

export interface UserRole {
    id : string;
    description: string;
    value : boolean;
};

/**
 * Get the display name for a user
 */
export function getUserName (user : User) {
    if(user.firstName && user.lastName)
        return `${user.firstName} ${user.lastName}`.trim();
    
    return user.email;
}

/**
 * Converts an IUserRow to IUser
 */
export const rowToUser = T.combine<any,User>(
    T.rename({
        user_id: 'id',
        user_email: 'email',
        user_first_name: 'firstName',
        user_last_name: 'lastName',
        user_created_time: 'created',
        user_last_login_time: 'lastLogin',
        user_status: 'status'
    }),
    T.map({
        status: stringToUserStatus,
        created: dateToString,
        lastLogin: dateToString
    })
);

/**
 * Converts row[] to User[]
 */
export const rowsToUsers = T.all(rowToUser);

/**
 * Converts User to public response
 */
export const userToPublicResponse = T.combine<User,any> (    
    T.map({name: getUserName}),
    T.pick(['email', 'name']),
    T.omitNil()
);

/**
 * Converts User to private response
 */
export const userToPrivateResponse = T.combine<User,any> (
    T.map({name: getUserName}),
    T.omitNil()
)

/**
 * Converts User[] to private response
 */
export const usersToPrivateResponse = T.all<User,any>(userToPrivateResponse);

/**
 * Converts row to UserRole
 */
export const rowToUserRole = T.combine<any,UserRole> (
    T.rename({user_role_id: 'id'})    
)

/**
 * Converts row[] to UserRole[]
 */
export const rowsToUserRoles = T.all(rowToUserRole);

/**
 * Convert UserRole to response
 */
export function userRoleToResponse (userRole: UserRole) { return userRole as any; }

/**
 * Convert UserRole[] to response
 */
export const userRolesToResponse = T.all(userRoleToResponse);
