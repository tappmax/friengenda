import * as _ from 'lodash'
import * as crypto from 'crypto';
import * as db from '@services/DatabaseService';
import {randomString, encryptJSON, decryptJSON} from '@services/CryptoService';
import { User, rowToUser, rowsToUsers, UserRoleId, rowsToUserRoles, UserRole, UserRoles, rowToUserRole} from "@models/User";
import { IPaginationOptions } from '@helpers/ServiceHelpers';
import { logger } from '@services/LoggerService';
import NotFoundError from '@errors/NotFoundError';
import DatabaseError from '@errors/DatabaseError';
import AlreadyExistsError from '@errors/AlreadyExistsError';
import FrenError from '@errors/FrenError';
import InternalServerError from '@errors/InternalServerError';
import { getSettingValue } from './SettingService';
import NotAuthorizedError from '@errors/NotAuthorizedError';
import { UserStatus } from '@models/Enums';

export const sqlUserFields  = `
    users.user_id as user_id,
    users.email as user_email,
    users.created_time as user_created_time,
    users.last_login_time as user_last_login_Time,
    users.status as user_status,
    users.first_name as user_first_name,
    users.last_name as user_last_name
`;

const sqlSelectUser = `
    SELECT ${sqlUserFields} FROM users
`;

export interface ISearchUsersOptions extends IPaginationOptions {
    email?: string;
    status?: UserStatus;
}

export type UpdateUserOptions = {
    firstName: string;
    lastName: string;
}

export type AddUserOptions = {
    email: string;
    firstName: string;
    lastName: string;
    verificationCode?: string;
    password?: string;
}

/**
 * Initialize the user service.
 */
export async function initialize() {
    try {
        // Copy the options table into the database
        await db.transaction( async (tx) => {
            for(let key in UserRoles) {
                const role = UserRoles[key];
                await tx.query(`
                    INSERT INTO roles (role_id, description) VALUES ($1,$2)
                    ON CONFLICT (role_id)
                        DO UPDATE SET description=$2 WHERE roles.role_id=$1;`,
                    [key, role.description]);
            }
        });

        await db.transaction( async (tx) => {
            // Handle deprecated option names
            for(let key in UserRoles) {
                const role = UserRoles[key];
                if(role.deprecated) {
                    for(let name of role.deprecated) {
                        await tx.query(`UPDATE user_roles SET role_id=$1 WHERE role_id=$2`, [key, name]);
                        await tx.query(`DELETE FROM roles WHERE role_id=$1`, [name]);
                    }
                }
            }             
        })

        // Create the automatic admin account
        const adminEmail = getSettingValue<string>('AdminEmail');
        if(adminEmail) {
            let userId : number = 0;
            try {
                const user = await getUserByEmail(adminEmail);
                await updateUser(user.id, {
                    firstName: getSettingValue<string>('AdminFirstName'),
                    lastName: getSettingValue<string>('AdminLastName'),
                });
                await updateUserPassword(user.id, getSettingValue<string>('AdminPassword'));
                userId = user.id;
            } catch {
                userId = await addUser({
                    email: adminEmail,
                    firstName: getSettingValue<string>('AdminFirstName'),
                    lastName: getSettingValue<string>('AdminLastName'),
                    password: getSettingValue<string>('AdminPassword')
                });
            }
            await setUserStatus(userId, 'Active');
            await enableAllUserRoles(userId);
        }

    } catch (err) {
        logger.error('UserService.initialize', err)
    }
}


/**
 * Return all users in the database except for the truck to table seller
 */
export async function getUsers (offset?: number, limit?: number): Promise<User[]> {
    return rowsToUsers((await db.query(`${sqlSelectUser} ORDER BY users.user_id OFFSET $1 LIMIT $2`, [offset||0,limit||50])).rows);
}

/**
 * Retrieve a user from the database for the given identifier
 */
export async function getUserById (userId: number): Promise <User> {
    return rowToUser((await db.queryFirstOrNotFound(`${sqlSelectUser} WHERE users.user_id=$1`, [userId], 'user')));
}

/**
 * Retrieve the user from the datasbase that matches the given email address
 */
export async function getUserByEmail(email: string): Promise<User> {
    return rowToUser(
        (await db.queryFirstOrNotFound(`${sqlSelectUser} WHERE email ilike $1`,[email]))
    );
}

/**
 * Verify that the user exists or throw a NotFoundError if not
 */
export async function verifyUserExists (userId: number) {
    await db.queryFirstOrNotFound(`SELECT count(*) FROM users WHERE user_id=$1`, [userId], 'user');
}

/**
 * Retrieve the user from the database that matches the given verification code
 */
export async function getUserByVerificationCode (verificationCode: string): Promise<User> {
    return rowToUser
        ((await db.queryFirstOrNotFound(
            `${sqlSelectUser} WHERE verification_code=$1 AND verification_expiration > now()`, 
            [verificationCode, origin]
    )));
}

/**
 * Encrypt the user password
 * @param userId 
 * @param password 
 */
function encryptPassword (password: string, useSalt : string = null) : {salt: string, hash: string} {
    const salt = useSalt || crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
    return {salt : salt, hash : hash};
}

/**
 * Update the user password in the database
 **/
export async function updateUserPassword(userId : number, password: string): Promise<boolean> {
    if (!userId)
        throw "User is not in the database";

    const {salt, hash} = encryptPassword(password);
    return (await db.query('UPDATE users SET salt=$2,hash=$3,verification_code=NULL WHERE users.user_id=$1', [userId, salt, hash])).rowCount == 1
}

/**
 * Generate asa new verification code
 **/
export async function generateUserVerificationCode (userId: number, expireMinutes: number) : Promise<string> {
    var verificationCode = randomString(16);
    var result = await db.query(`UPDATE users SET verification_code=$2,verification_expiration=now()+ $3 * interval '1 minute' WHERE user_id=$1`, [userId,verificationCode,expireMinutes]);
    if(result.rowCount != 1)
        throw new NotFoundError();

    return verificationCode;
}

/**
 * Generate asa new verification code
 **/
export async function clearUserVerificationCode (userId: number) {
    await db.query(`UPDATE users SET verification_code=null,verification_expiration=null WHERE user_id=$1`, [userId]);
}

/**
 * Update the user password in the database
 **/
export async function getUserVerificationCode(userId: number) : Promise<string> {
    const sql = 'SELECT verification_code FROM users WHERE user_id=$1';
    var result = await db.query(sql, [userId]);
    if(!result || !result.rowCount)
        return null;

    return result.rows[0].verification_code;
}

/**
 * Insert the user and returns it unique identifer
 */
export async function addUser(options : AddUserOptions): Promise<number> {
    try {   
        // Encrypt the password if one was given       
        const {salt, hash} = options.password ? 
            encryptPassword(options.password) : 
            { salt : undefined, hash : undefined };

        const result = await db.query(
            `INSERT INTO users(email,salt,hash,verification_code,first_name,last_name,created_time) 
             VALUES ($1,$2,$3,$4,$5,$6,now())
             RETURNING user_id`,
            [
                options.email,
                salt,
                hash,
                options.verificationCode,
                options.firstName,
                options.lastName
            ]
        );

        return result.rows[0].user_id;
    } catch (err) {
        if(err instanceof DatabaseError && err.details.constraint == 'users_email_key')        
            throw new AlreadyExistsError ();

        else if (err instanceof FrenError)
            throw err;

        throw new InternalServerError (err);
    }
}

/**
 * Check the given password against the users stored password
 */
export async function checkPassword(userId: number, password: string): Promise<boolean> {
    const {hash, salt} = await db.queryFirstOrNotFound(`SELECT salt,hash FROM users WHERE user_id=$1`, [userId], 'user');
    const {hash:checkHash} = encryptPassword(password, salt)
    return hash == checkHash;
}

/**
 * Update the user
 */
export async function updateUser (userId: number, options: UpdateUserOptions) {
    // Update the user if there is data to set
    await db.queryFirstOrNotFound(`
        UPDATE users 
        SET 
            first_name=$2,
            last_name=$3
        WHERE user_id=$1`, 
        [
            userId,
            options.firstName,
            options.lastName
        ], 'user');
}

/**
 * Return the status of the user
 */
export async function getUserStatus (userId : number) : Promise<UserStatus> {
    return (await db.queryFirstOrNotFound('SELECT status FROM users WHERE user_id=$1',[userId])).status as UserStatus;
}

/**
 * Set the user status
 */
export async function setUserStatus (userId : number, newStatus: UserStatus) {
    var oldStatus : UserStatus;

    await db.transaction( async (tx) => {
        // Get current status and lock the row for update
        const {status: oldStatus} = await tx.queryFirstOrNotFound(`SELECT status FROM users WHERE user_id=$1 FOR UPDATE;`, [userId]);        
        if(oldStatus == newStatus)
            return;

        // Dont allow pending status to be set unless the current status is uncofirmed
        if((newStatus == 'Active') && oldStatus != 'Unconfirmed')
            return;        

        // Set the user status
        await tx.query('UPDATE users SET status=$2 WHERE user_id=$1', [userId,newStatus])
    })
}

/**
 * Update the last login time of the user to now
 */
export async function updateLastLoginTime (userId: number) {
    await db.query(`UPDATE users SET last_login_time=now() WHERE user_id=$1`, [userId]);
}

/**
 * Update the last login time of the user to now
 */
export async function getLastLoginTime (userId: number) {
    await db.query(`UPDATE users SET last_login_time=now() WHERE user_id=$1`, [userId]);
}

/**
 * Returns true if the user has a valid password set
 */
export async function userHasPassword (userId : number) : Promise<boolean> {
    return (await db.queryFirstOrNotFound(`SELECT (CASE WHEN hash IS NOT NULL THEN true ELSE false END) as pw FROM users WHERE user_id=$1`, [userId])).pw;
}

/**
 * Search for users
 */
export async function searchUsers ( options : ISearchUsersOptions) {
    var params : any[] = [options.offset||0,options.limit||50];
    var conditions : string[] = []
    var where : string = ''

    if(options.email !== undefined && options.email !== '') {
        params.push('%' + options.email + '%');
        conditions.push(`email ilike $${params.length}`)
    }

    if(options.status !== undefined) {
        params.push(options.status);
        conditions.push(`status=$${params.length}`)
    }

    if(conditions.length > 0)
        where = 'WHERE ' + conditions.join(' AND ');

    return rowsToUsers((await db.query(`${sqlSelectUser} ${where} ORDER BY users.user_id OFFSET $1 LIMIT $2`, params)).rows);
}

/**
 * Return the value of a given role for a user
 * @param userId Identifier of user
 * @param roleId Identifier of role
 */
export async function getUserRole (userId : number, roleId : UserRoleId) : Promise<UserRole> {
    const result = await db.query(`
        SELECT 
            roles.description,
            roles.role_id,
            bool_or(user_roles.user_id IS NOT NULL) as value
        FROM roles
        LEFT JOIN user_roles 
            ON user_roles.role_id = roles.role_id 
            AND user_roles.user_id = $1
                WHERE roles.role_id=$2
                GROUP BY roles.role_id`, 
        [userId, roleId]);

    if(result.rowCount == 0)
        throw new NotFoundError('option');        

    return rowToUserRole(result.rows[0]);
}

/**
 * Return the value of a given role for a given user 
 * @param userId Identifier of user
 * @param roleId Identifier of option
 */
export async function getUserRoleValue (userId : number, roleId : UserRoleId) : Promise<boolean> {
    const result = await db.query(`
        SELECT 
            roles.option_id,
            roles.description,
            (user_roles.user_id IS NOT NULL) AS value
        FROM options
        LEFT JOIN user_roles ON user_roles.role_id = roles.role_id
            AND user_roles.user_id = $1
        WHERE roles.role_id=$2`, 
        [userId, roleId]);

    if(result.rowCount == 0)
        throw new NotFoundError('option');        

    return result.rows[0].value;
}

/**
 * Enable all user roles for the given user 
 */
export async function enableAllUserRoles (userId: number) {
    await verifyUserExists(userId);
    await db.query('DELETE FROM user_roles WHERE user_id=$1', [userId]);
    await db.query('INSERT INTO user_roles (user_id,role_id) SELECT $1,role_id FROM roles', [userId]);
}

/**
 * Enable an role for the given user 
 */
export async function enableUserRole (userId: number, roleId: UserRoleId) {
    try {
        await db.query('INSERT INTO user_roles (user_id,role_id) VALUES($1,$2)', [userId, roleId]);
    } catch (err) {
        if(err instanceof DatabaseError) {
            // User doesnt exist
            if(err.details.constraint === 'user_roles_users_user_id_fkey')
                throw new NotFoundError('user');

            // Role doesnt exist
            if(err.details.constraint === 'user_roles_users_role_id_fkey')
                throw new NotFoundError('role');

            // If its already in the table thats ok, that just means its already set
            if(err.details.constraint === 'user_roles_user_id_role_id_key')
                return;
        }
        throw err;
    }    
}

/**
 * Disable a role for the given user
 */
export async function disableUserRole (userId: number, roleId: UserRoleId) {
    await verifyUserExists(userId);
    await db.query('DELETE FROM user_roles WHERE user_id=$1 AND role_id=$2;', [userId, roleId]);
}

/**
 * Get all roles for a given user.
 * @param userId Identifier of user
 */
export async function getUserRoles (userId : number) : Promise<UserRole[]> {
    return rowsToUserRoles((await db.query(`
        SELECT
            roles.role_id,
            bool_or(user_roles.user_id IS NOT NULL) AS value
        FROM roles
        LEFT JOIN user_roles ON user_roles.role_id=roles.role_id
	        AND user_roles.user_id = $1
        GROUP BY roles.role_id`, 
        [userId])).rows);
}

/**
 * Return an array of emails of all users that have the given roles
 * @param roleId Identifier of required option
 */
export async function getUserEmailsWithRoles (roles : UserRoleId[]) : Promise<string[]> {
    const result = await db.query(`
        SELECT email
        FROM user_roles 
        JOIN users ON users.user_id = user_roles.user_id
        WHERE user_roles.user_id=$1 AND user_roles.role_id IN (${roles.join(' , ')})
        GROUP BY EMAIL`);

    if(result.rowCount === 0)
        return [];

    return _.map(result.rows, row => row.email);
}

/**
 * Update the JWT stored with the user
 * @param userId Identifier of user to update
 * @param oldJWT Old JWT 
 * @param newJWT New JWT
 */
export async function updateUserJWT (userId : number, newJWT: string, oldJWT? : string) {
    // Update the JWT, if it fails then the oldJWT doesnt match
    if(oldJWT) {
        const {jwt:existingJWT} = await db.queryFirstOrNotFound(`SELECT jwt FROM users WHERE user_id=$1`, [userId], 'user');
        if(decryptJSON(existingJWT) != oldJWT)
            throw new NotAuthorizedError('jwt');

        const results = await db.query(`UPDATE users SET jwt=$1 WHERE user_id=$2`, [encryptJSON(newJWT), userId]);
        if(results.rowCount==0)
            throw new NotFoundError('user');
    } else {
        if((await db.query(`UPDATE users SET jwt=$1 WHERE user_id=$2`, [newJWT ? encryptJSON(newJWT) : null, userId])).rowCount==0)
            throw new NotFoundError('user');
    }
}

/**
 * Validate that the given JWT is associated with the given user.
 * @param userId Unique identifier of user
 * @param jwt JWT to validate
 */
export async function validateUserJWT (userId: number, jwt: string) {
    const {jwt:existingJWT} = await db.queryFirstOrNotFound(`SELECT jwt FROM users WHERE user_id=$1`, [userId], 'user');
    if(!existingJWT || decryptJSON(existingJWT) != jwt)
        throw new NotAuthorizedError('jwt');
}
