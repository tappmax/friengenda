import {User} from '@models/User'
import * as userService from '@services/UserService';
import { getSettingValue } from '@services/SettingService';

export async function send(to: string, template: string, args: any) : Promise<void> {
}

async function userFromUserOrId(userOrId : number | User) {
    var user : User;    
    if(typeof(userOrId) == 'number') 
        return await userService.getUserById(userOrId as number);
    
    return userOrId as User;    
}

export async function sendVerificationEmail (user : User) 
export async function sendVerificationEmail (userId : number) 
export async function sendVerificationEmail (userOrId : number | User) {
    const user = await userFromUserOrId(userOrId);
    await userService.generateUserVerificationCode(user.id, getSettingValue<number>('ConfirmEmailCodeTTL'));
}

/**
 * Send ForgotPassword email
 */
export async function sendForgotPasswordEmail (user : User) 
export async function sendForgotPasswordEmail (userId : number) 
export async function sendForgotPasswordEmail (userOrId : number | User) {
    const user = await userFromUserOrId(userOrId);
    await userService.generateUserVerificationCode(user.id, getSettingValue<number>('ForgotPasswordCodeTTL'));
}

/**
 * Send Password changed email
 */
export async function sendPasswordChangedEmail (user : User) 
export async function sendPasswordChangedEmail (userId : number) 
export async function sendPasswordChangedEmail (userOrId : number | User) {
}

export function initialize () {
}

export function getNoReplyEmail () { return "noreply@test.com"; }
export function getOrdersEmail () { return "noreply@test.com"; } 
