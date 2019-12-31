import * as _ from 'lodash';
import * as supertest from 'supertest';
import chaiDiff from 'chai-jest-diff';
import {expect,assert,config as chaiConfig,AssertionError,use as chaiUse} from 'chai';
import * as app from '../app';
import * as db from '@services/DatabaseService';
import * as UserService from '@services/UserService';
import {User } from '@models/User'
import { UserStatus } from '@models/Enums';

let DateHelpers = require('@helpers/DateHelpers');

chaiConfig.includeStack = true;
chaiConfig.showDiff = false;

chaiUse(chaiDiff());

jest.mock('@services/MailService');
jest.mock('@services/StripeService');

/// Mock the currentServerTime method so we can ensure records are generated with unique created times.
let currentTime = new Date();
DateHelpers.currentServerTime = jest.fn(() => {
    const result = currentTime;
    currentTime.setSeconds(currentTime.getSeconds() + 1);
    return result;
})

export interface MockUser extends User {
    /**
     * JWT token
     */
    token : string;

    /**
     * Mocked payment methods
     */
    paymentMethods : { [key : string] : string }
}

let request : supertest.SuperTest<supertest.Test>;

const mockUsers : { [key:number] : MockUser}= { }

/**
 * Initialzie the 
 */
export function initializeTestService (initialize ?: () => Promise<void>) {
    return async () => {
        try {
            await app.initialize();
            request = supertest(app.app);
    
            await snapshotEmpty();
    
            if(initialize)
                await initialize();

            await snapshotCreate();
        } catch (err) {
            console.log(err);
        }    
    }
}

/**
 * Shutdown test service
 */
export async function shutdownTestService ( ) {
    await snapshotRestore();
    await db.shutdown();
}
 
/**
 * Create a mock user
 * @param email Email address of user
 * @param status Status of user
 * @param authorize True if the user should be logged in
 */
export async function mockUser (email: string, status: UserStatus = 'Active', authorize : boolean = false) {
    let user : MockUser;

    try {
        const userId = await UserService.addUser({ email: email, firstName: 'Bob', lastName: 'Evans', password: 'password'});
        switch(status) {
            case 'Active': await UserService.setUserStatus(userId, 'Active'); break;
            case 'Disabled': await UserService.setUserStatus(userId, 'Disabled'); break;
        } 

        // Authorize the user?
        let token : string;
        if(authorize) {
            try {
                const res = await request
                    .post('/v1/auth/login')
                    .send({username: email, password: 'password', origin: origin});
        
                token = 'bearer ' + res.body.token;
            } catch (err) {
                assert.fail(err);
            }            
        }

        user = {
            ...await UserService.getUserById(userId),
            token : token,
            paymentMethods : {}
        };

        // Save the mock user
        mockUsers[userId] = user;

    } catch (err) {
        assert.fail();
    }

    return user;
}

/**
 * Return the mock user by its user identifier
 * @param userId Identifier of mock user
 */
export function getMockUserById (userId : number) : MockUser {
    return mockUsers[userId];
}

/**
 * Create a mock admin user
 * @param email email address
 */
export async function mockAdmin (email : string) : Promise<MockUser> {
    const user = await mockUser(email, 'Active', true);
    await UserService.enableAllUserRoles(user.id);
    return user;
}

/**
 * Expect the enum values to match the database enum values
 * @param enumObject object containing enum values
 * @param enumName name of enum in the database
 */
export async function expectEnumToMatch (enumObject : any, enumName : string) {
    try {
        const result = await db.query(`SELECT enumlabel FROM pg_enum WHERE enumtypid = $1::regtype ORDER BY oid;`, [enumName]);
        if(Array.isArray(enumObject)) {
            _.each(result.rows, (row) => {
                expect(enumObject).includes(row.enumlabel);
            })
        } else if (typeof enumObject == 'function') {
            _.each(result.rows, (row) => {
                expect(enumObject(row.enumlabel)).is.not.undefined;
            })
        } else {
            _.each(result.rows, (row) => {
                expect(enumObject).contains.keys([row.enumlabel]);
            })
        }
    } catch (err) {
        // Move the stack frame outside of the expectSuccess function
        if(err instanceof AssertionError)
            throw new AssertionError(err.message, {showDiff : false}, expectEnumToMatch);   

        throw err;
    }
}

/**
 * Expect a successful response and optionally expect a body value
 * @param res Super test response
 * @param body Optional body to compare against
 * @param exclude Optional list of fields within the body to omit from comparison
 */
export function expectSuccess(res : supertest.Response, expectBody ?: any, exclude?: string[]) {
    try {
        expect(res.status).to.equal(200);

        if(expectBody) {
            let body: any = res.body;
            if(exclude) {
                if(Array.isArray(body)) 
                    body = _.map(body, b => _.omit(b, exclude))
                else 
                    body = _.omit(body, exclude);
                    
                if(Array.isArray(expectBody)) 
                    expectBody = _.map(expectBody, b => _.omit(b, exclude))
                else
                    expectBody = _.omit(expectBody, exclude);
            }            
            expect(body).to.eql(expectBody);
        }

    } catch (err) {
        // Move the stack frame outside of the expectSuccess function
        if(err instanceof AssertionError) {
            throw new AssertionError(err.message, {showDiff : false}, expectSuccess);   
        } else {
            throw err;
        }
    }        
}

/**
 * Expect errors response to be the given status and error code
 */
export function expectError(res : supertest.Response, status: number, error?: string, code?: string) {
    try {
        expect(res.status).to.equal(status);
        if(error)
            expect(res.body.error).to.equal(error);

        if(code) {
            if(typeof res.body.details === 'string')        
                expect(res.body.details).to.equal(code);
            else if(code)
                expect(res.body.details.code).to.equal(code);
        }
    } catch (err) {
        // Move the stack frame outside of the expectError function
        if(err instanceof AssertionError) {
            throw new AssertionError(err.message, {showDiff : false}, expectError);   
        } else {
            throw err;
        }
    }        
}

/**
 * Build a super test request
 * @param request Base request
 * @param user Authorized user
 * @param body Optional body of request
 * @param query Optional query parameters
 */
function buildRequest(request : supertest.Test, user : MockUser, body?: any, query?: any) : supertest.Test { 
    if(user && user.token)
        request.set('Authorization', user.token);

    if(body) {
        if(typeof body === 'string')
            request.type('text/plain');

        request.send(body);
    }

    if(query)
        request.query(query);

    return request;
}

/**
 * Helper method to post using authorization for a user
 */
export function httpPost (user : MockUser, url : string, body?: any, query? : any) : supertest.Test {
    return buildRequest(request.post(url), user, body, query);
}

/**
 * Helper method to get using authorization for a user
 */
export function httpGet (user : MockUser, url : string, query?: any) : supertest.Test {
    return buildRequest(request.get(url), user, undefined, query);
}

/**
 * Helper method to put using authorization for a user
 */
export function httpPut (user : MockUser, url : string, body?: any, query?: any) : supertest.Test {
    return buildRequest(request.put(url), user, body, query);
}

/**
 * Helper method to put using authorization for a user
 */
export function httpPatch (user : MockUser, url : string, body?: any, query?: any) : supertest.Test {
    return buildRequest(request.patch(url), user, body, query);
}

/**
 * Helper method to put using authorization for a user
 */
export function httpDelete (user : MockUser, url : string, body?: any, query? : any) : supertest.Test {
    return buildRequest(request.delete(url), user, body, query);
}

const snapshotTables = [
    { name : 'users_roles', id : 'user_id' },
    { name : 'users', id : 'user_id', delete : async (tx : db.Transaction, ids) => {
        await tx.query(`DELETE FROM users_groups WHERE NOT(user_id = ANY ($1::integer[]))`, [ids]);
        await tx.query(`DELETE FROM users WHERE NOT(user_id = ANY ($1::integer[]))`, [ids]);
    }}
]

let snapshot;

export async function snapshotEmpty() {
    snapshot = { }
    await snapshotRestore();
}

export async function snapshotCreate () {
    snapshot = { }
    for(let table of snapshotTables) {
        snapshot[table.name] = _.map((await db.query(`SELECT ${table.id} AS id FROM ${table.name} GROUP BY ${table.id}`)).rows, row=>row.id);
    }
}

export async function snapshotRestore ( ) {
    if(!snapshot)
        return;

    await db.transaction( async (tx) => {
        for(let table of snapshotTables) {
            const ids = [0, ...(snapshot[table.name] || [])];
    
            if(table.delete) 
                await table.delete(tx, ids);
            else
                await tx.query(`DELETE FROM ${table.name} WHERE NOT (${table.id} = ANY ($1::integer[]))`, [ids]);            
        }    
    });
}
