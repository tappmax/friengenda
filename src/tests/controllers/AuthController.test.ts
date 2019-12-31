import {expect} from 'chai';
import {
    mockUser,
    mockAdmin,
    httpGet,
    httpPost,
    initializeTestService,
    shutdownTestService, 
    expectError,
    expectSuccess,
    MockUser
    } from '../TestService'
import * as UserService from '@services/UserService';

let userWithAllOptions : MockUser;
let userWithNoOptions : MockUser;

beforeAll(initializeTestService(async () => {
    userWithAllOptions = await mockAdmin('userWithAllOptions@test.com'); 
    userWithNoOptions = await mockUser('userWithNoOptions@test.com', 'Active', true);
}));   

afterAll(shutdownTestService);

describe('LoginUser', () => {
    test('LoginUser_UserWithAllOptions_UserWithToken', async () => {
        const res = await httpPost(null,`/v1/auth/login`,{
            username : userWithAllOptions.email,
            password : 'password'
        });
        
        expect(res.status).to.equal(200);
        expect(res.body.token).to.not.be.null;
        expect(res.body.created).to.not.be.null;
        expect(res.body.lastLogin).to.not.be.null;
    });

    test('LoginUser_InvalidCredentials_UserWithToken', async () => {
        expectError(await httpPost(null, `/v1/auth/login`, {
            username : userWithAllOptions.email, 
            password : 'T3st!ng2'
        }),401);
    });    

    test('LoginUser_AsUnconfirmed_NotAuthorized', async () => {
        const user = await mockUser('LoginUser_AsUnconfirmed_NotAuthorized@test.com', 'Unconfirmed', false);
        expectError(await httpPost(null, `/v1/auth/login`, {
            username : user.email,
            password : 'password'
        }), 401);

        await UserService.setUserStatus(user.id, 'Active');

        expectSuccess(await httpPost(null, `/v1/auth/login`, {
            username : user.email,
            password : 'password'
        }));
    });    

});

describe('RegisterUser', () => {
    test('RegisterUser_Valid_User', async () => {
        expectSuccess(await httpPost(null, `/v1/auth/register`, {
            email: 'RegisterUser_Valid_User@test.com',
            password: 'T3st!ng1',
            firstName : 'Harvey',
            lastName: 'Jest'
        }));
    });

    test('RegisterUser_DuplicateEmail_InvalidParameter', async () => {
        const requestBody = {
            email: 'duplicate@jest.com',
            password: 'T3st!ng1',
            firstName : 'Harvey',
            lastName: 'Jest'
        }
        expectSuccess(await httpPost(null, `/v1/auth/register`, requestBody));
        expectError(await httpPost(null, `/v1/auth/register`, requestBody), 400, 'InvalidParameter');
    });                    
})

describe("VerifyUser", () => {
    test('VerifyUser_InvalidVerificationCode_Error', async () => {        
        expectError(await httpGet(null, `/v1/auth/verifyemail/blah`), 400)
    });

    test('VerifyUser_ValidVerificationCode_Success', async () => {        
        const user = await mockUser('VerifyUser_ValidVerificationCode_Success@test.com', 'Unconfirmed', false);        
        const verificationCode = await UserService.generateUserVerificationCode(user.id, 100);
        expect(verificationCode).to.not.be.null;

        // Verify email address
        const res = await httpGet(null, `/v1/auth/verifyemail/${verificationCode}`);
        expect(res.status).to.eql(200);
        expect(await UserService.getUserVerificationCode(user.id)).to.be.null;
    });

});

describe('SetPassword', () => {
    let user : MockUser;

    beforeAll( async() => { 
        user = await mockUser('SetPassword@test.com', 'Active', true);
    })

    test('SetPassword_OldPasswordBad_InvalidParameter', async() => {
        var res = await httpPost(user, `/v1/auth/setpassword`, { 
            oldPassword: 'invalid', 
            newPassword : 'T3st!ng1', 
            newPasswordConfirmation : 'T3st!ng1'});
        expectError(res, 400, 'InvalidParameter')
    });

    test('SetPassword_NewPasswordMismatch_InvalidParameter', async() => {
        expectError(await httpPost(user, `/v1/auth/setpassword`, { 
            oldPassword: 'password', 
            newPassword : 'test2', 
            newPasswordConfirmation : 'test3'}), 400, 'InvalidParameter')
    });

    test('SetPassword_NewPasswordBad_InvalidParameter', async() => {
        expectError(await httpPost(user, `/v1/auth/setpassword`, { 
            oldPassword: 'password', 
            newPassword : 'test2', 
            newPasswordConfirmation : 'test2'}), 400, 'InvalidParameter')
    });

    test('SetPassword_Valid_Success', async() => {
        expectSuccess(await httpPost(user, `/v1/auth/setpassword`, { 
            oldPassword: 'password', 
            newPassword : 'T3st!ng1', 
            newPasswordConfirmation : 'T3st!ng1'}))
        expectSuccess(await httpPost(user, `/v1/auth/login`, { username: user.email, password: 'T3st!ng1'}));
    });
});

describe('ResetPassword', () => {
    let user : MockUser
;

    beforeAll( async() => { 
        user = await mockUser('ResetPassword@test.com', 'Active', true);
    })

    test('ResetPassword_InvalidEmail_InvalidParameter', async() => {
        expectError(await httpPost(userWithAllOptions, `/v1/auth/resetpassword`, { 
            email : 'ResetPasswordtest.com'}), 400, 'InvalidParameter')
    });

    test('ResetPassword_MissingEmail_MissingParameter', async() => {
        expectError(await httpPost(userWithAllOptions, `/v1/auth/resetpassword`), 400, 'MissingParameter')
    });

    test('ResetPassword_UserWithNoOptions_NotAuthorized', async() => {
        expectError(await httpPost(userWithNoOptions, `/v1/auth/resetpassword`, { 
            email : 'ResetPassword@test.com'}), 401, 'NotAuthorized', 'UserEdit');
    });

    test('ResetPassword_Valid_Success', async() => {
        expectSuccess(await httpPost(userWithAllOptions, `/v1/auth/resetpassword`, { 
            email : 'ResetPassword@test.com'}));
    });
});

describe('VerifyEmail', () => {
    let user : MockUser;

    beforeAll( async() => { 
        user = await mockUser('VerifyEmail@test.com', 'Active', true)        
    })

    test('VerifyEmail_InvalidEmail_InvalidParameter', async() => {
        expectError(await httpPost(userWithAllOptions, `/v1/auth/resetpassword`, {email : 'VerifyEmail.com'}), 400, 'InvalidParameter')
    });

    test('VerifyEmail_MissingEmail_MissingParameter', async() => {
        expectError(await httpPost(userWithAllOptions, `/v1/auth/resetpassword`), 400, 'MissingParameter')
    });

    test('VerifyEmail_Valid_Success', async() => {
        expectSuccess(await httpPost(userWithAllOptions, `/v1/auth/verifyemail`, { email : 'VerifyEmail@test.com'}));
    });
});
