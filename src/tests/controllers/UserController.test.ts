import * as _ from 'lodash';
import {expect} from 'chai';
import * as UserService from '@services/UserService';
import {userToPrivateResponse, usersToPrivateResponse, userToPublicResponse} from '@models/User'
import {
    initializeTestService,
    shutdownTestService, 
    httpPut,
    httpGet,
    httpPatch,
    httpPost,
    expectError,
    expectSuccess,
    mockUser,
    MockUser,
    snapshotRestore,
    mockAdmin
    } from '../TestService'

let userWithAllRoles : MockUser;
let userWithNoRoles : MockUser;
let allUsers : MockUser[];

beforeAll(initializeTestService(async() => {
    userWithAllRoles = await mockAdmin('userWithAllOptions@test.com');
    userWithNoRoles = await mockUser('userWithNoOptions@test.com', 'Active', true);
    allUsers = [userWithAllRoles, userWithNoRoles];
}));

afterAll(shutdownTestService);

// #region ApproveUser

describe(`ApproveUser`, () => {
    test(`ApproveUser_Unconfirmed_NotAuthorized`, async () => {
        const user = await mockUser('unconfirmed@test.com', 'Unconfirmed');
        expectError(await httpPost(userWithAllRoles, `/v1/users/${user.id}/approve`), 401, 'NotAuthorized', 'status');
    })        

    test(`ApproveUser_Disabled_Success`, async () => {
        const user = await mockUser('disabled@test.com', 'Disabled');
        expectSuccess(await httpPost(userWithAllRoles, `/v1/users/${user.id}/approve`));
    })        

    test(`ApproveUser_UserWithNoOptions_Success`, async () => {
        const user = await mockUser('disabled@test.com', 'Disabled');
        expectError(await httpPost(userWithNoRoles, `/v1/users/${user.id}/approve`), 401, 'NotAuthorized', 'UserEdit');
    })        
})

// #endregion


// #region GetAllUsers

describe("GetAllUsers", () => {    
    test("GetAllUsers_UserWithAllOptions_Users", async () => {
        await snapshotRestore();
        expectSuccess(
            await httpGet(userWithAllRoles,'/v1/users'),
            usersToPrivateResponse(_.map(allUsers, user => user)));
    });    

    test("GetAllUsers_UserWithNoOptions_Users", async () => {
        await snapshotRestore();
        expectError(
            await httpGet(userWithAllRoles,'/v1/users'),
            401, 'NotAuthorized', 'UserView');
    });    
});

// #region GetUser

describe("GetUser", () => {

    it("GetUser_Current_User", async () => {
        expectSuccess(
            await httpGet(userWithAllRoles,'/v1/users/current'),
            userToPrivateResponse(userWithAllRoles)
        );
    })
});

// #endregion

// #region GetUserInfo

describe(`GetUserInfo`, () => {

    test('GetUserInfo_SellerAsBuyer_UserInfo', async () => {
        expectSuccess(await httpGet(userWithAllRoles,`/v1/users/${userWithAllRoles.id}/info`), userToPublicResponse(userWithAllRoles));
    });         

})

// #endregion

// #region UpdateUser

describe('UpdateUser', () => {
    let user : MockUser;
    
    beforeEach(async () => {
        await snapshotRestore();
        user = await mockUser('update_user@test.com', 'Active', true);
    })

    test('UpdateUser_FirstName_User', async () => {
        expectSuccess(
            await httpPatch(user, `/v1/users/current`, { firstName : 'Updated' }),
            userToPrivateResponse({ ...user, firstName : 'Updated' })
        );
    });   

    test('UpdateUser_FirstName_User', async () => {
        expectSuccess(
            await httpPatch(user, `/v1/users/current`, { lastName : 'Updated' }),
            userToPrivateResponse({ ...user, lastName : 'Updated' })
        );
    });   
 
})

// #endregion

// #region SearchUsers

describe('SearchUsers', () => {

    test('SearchUsers_Buyer_NotAuthorized', async() => {
        expectError(await httpGet(userWithNoRoles, `/v1/users/search`), 401, 'NotAuthorized', 'UserView')
    });

    test('SearchUsers_userWithAllOptions_Users', async() => {
        await snapshotRestore();
        expectSuccess(
            await httpGet(userWithAllRoles, `/v1/users/search`),
            usersToPrivateResponse(_.map(allUsers, user => user)), ['image']);
    });

    test('SearchUsers_Email_Users', async() => {
        expectSuccess(
            await httpGet(userWithAllRoles, `/v1/users/search`, {email:userWithAllRoles.email}),
                usersToPrivateResponse([userWithAllRoles]), ['image']);
    });

    test('SearchUsers_PartialEmail_Users', async() => {
        expectSuccess(
            await httpGet(userWithAllRoles, `/v1/users/search`, {email:'admin'}),
                usersToPrivateResponse([userWithAllRoles]));
    });

});

// #endregion
