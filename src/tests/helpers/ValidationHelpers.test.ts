import * as expect from 'expect';
import {validatePassword, validateEmail} from '@helpers/ValidationHelpers';
import InvalidParameterError from '@errors/InvalidParameterError';

describe(`validatePassword`, () => {
    test('validatePassword_MinLength_Throw', () => {
        expect(() => validatePassword({password : 'AbCF!0I'}, 'password', true)).toThrow(new InvalidParameterError('password'));
    })

    test('validatePassword_NoNumber_Throw', () => {
        expect(() => validatePassword({password : 'aBcdef!ijk'}, 'password', true)).toThrow(new InvalidParameterError('password'));
    })

    test('validatePassword_NoSpecial_Throw', () => {
        expect(() => validatePassword({password : 'aBcdef0ijk'}, 'password', true)).toThrow(new InvalidParameterError('password'));
    })

    test('validatePassword_NoUppercase_Throw', () => {
        expect(() => validatePassword({password : 'abcdef!0ijk'}, 'password', true)).toThrow(new InvalidParameterError('password'));
    })

    test('validatePassword_NoLowercase_Throw', () => {
        expect(() => validatePassword({password : 'ABCDEF!0IJK'}, 'password', true)).toThrow(new InvalidParameterError('password'));
    })

    test('validatePassword_Valid_NotThrow', () => {
        expect(() => validatePassword({password : 'AbCDEF!0IJK'}, 'password', true)).not.toThrow();
    })

});


describe(`validateEmail`, () => {
    test('validateEmail_Valid_NotThrow', async () => {
        expect(() => validateEmail({email : 'test@test.com'}, 'email', true)).not.toThrow()
    })

    test('validateEmail_MissingAt_InvalidParameter', async () => {
        expect(() => validateEmail({email:'testtest.com'}, 'email', true)).toThrow(new InvalidParameterError('email'));
    })

    test('validateEmail_MissingPeriod_InvalidParameter', async () => {
        expect(() => validateEmail({email:'test@testcom'}, 'email', true)).toThrow(new InvalidParameterError('email'));
    })
});
