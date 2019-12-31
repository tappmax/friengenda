import * as _ from 'lodash';
import * as nodemailer from 'nodemailer';
import * as email from 'email-templates';
import * as UserService from '@services/UserService';
import {User, getUserName} from '@models/User'
import {logger} from '@services/LoggerService';
import { getSettingValue } from './SettingService';
import { Attachment } from 'nodemailer/lib/mailer';
import { Dataset } from '@models/Dataset';
import { Broker } from '@models/Broker';
import { Contact } from '@models/Contact';
import { updateBrokerStatementSent } from './BrokerService';
import { Advisor } from '@models/Advisor';
import { updateAdvisorStatementSent } from './AdvisorService';
import { Manager } from '@models/Manager';
import { updateManagerStatementSent } from './ManagerService';
import { isProduction } from '../app';
import moment = require('moment');

let transporter : any;

export function initialize () {
    transporter = nodemailer.createTransport({
        host: getSettingValue<string>('EmailHost'),
        port: getSettingValue<number>('EmailPort'),
        secure: getSettingValue<boolean>('EmailSecure'),
        auth: {
            user: getSettingValue<string>('EmailUsername'), 
            pass: getSettingValue<string>('EmailPassword')
        },
        logger: getSettingValue<boolean>('EmailLogger'),
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: getSettingValue<boolean>('EmailRejectUnauthorized')
        }
    });    
}

interface ISendOptions {
    from: string;
    to: string | string[];
    bcc ?: string | string[];
    cc ?: string | string[];
    attachments?: Attachment[];
    template : string;
    templateArgs : any;
}

/**
 * Send mail to a speciic email address
 * @param from Email to send from
 * @param to Email to send to
 * @param template Template to render email with
 * @param args Template arguments
 */
export async function send(options : ISendOptions) : Promise<boolean> {
    if(options.to === [])
        return false;

    if(!options.from) {
        logger.error('MailService.send', {error: 'InvalidFromAddress', ...options});
        return false;
    } else {
        logger.info ('MailService.send', {...options, attachments: {}});
    }

    try {
        const mail = new email({
            message: { from: options.from },
            send: true,
            transport: transporter
        });
  
        await mail.send({
            template: options.template,
            message: { to: options.to, bcc : options.bcc, cc : options.cc, attachments: options.attachments },
            locals: options.templateArgs,
        });
        return true;
    } catch (err) {
        logger.error('MailService.send', { error : err, options : {...options, attachments: {}} });
        return false;
    }
}

async function userFromUserOrId(userOrId : number | User) {
    var user : User;    
    if(typeof(userOrId) == 'number') 
        return await UserService.getUserById(userOrId as number);
    
    return userOrId as User;    
}

export function getNoReplyEmail () {
    return getSettingValue<string>('EmailNoReply');
}

/**
 * Send Verification email
 */
export async function sendVerificationEmail (user : User) 
export async function sendVerificationEmail (userId : number) 
export async function sendVerificationEmail (userOrId : number | User) {
    var user = await userFromUserOrId(userOrId);
    var verificationCode = await UserService.generateUserVerificationCode(user.id, getSettingValue<number>('ConfirmEmailCodeTTL'));
    await send({
        from : getNoReplyEmail(),
        to : user.email, 
        template : `VerifyEmail`, 
        templateArgs : {
            baseURL: getSettingValue('WebServerBaseUrl'),
            email: user.email,
            verificationURL: `${getSettingValue('WebServerBaseUrl')}/auth/verifyemail/${verificationCode}`,
            name: getUserName(user)
        }
    });
}

/**
 * Send ForgotPassword email
 */
export async function sendForgotPasswordEmail (user : User) 
export async function sendForgotPasswordEmail (userId : number) 
export async function sendForgotPasswordEmail (userOrId : number | User) {
    const user = await userFromUserOrId(userOrId);
    const verificationCode = await UserService.generateUserVerificationCode(user.id, getSettingValue<number>('ForgotPasswordCodeTTL'));
    await send({
        from : getNoReplyEmail(),
        to : user.email, 
        template : `ForgotPassword`, 
        templateArgs : {
            baseURL : getSettingValue('WebServerBaseUrl'),
            email: user.email,
            verificationURL: `${getSettingValue('WebServerBaseUrl')}/auth/setpassword/${verificationCode}`,
            name: getUserName(user)
        }
    });
}

/**
 * Send Password changed email
 */
export async function sendPasswordChangedEmail (user : User) 
export async function sendPasswordChangedEmail (userId : number) 
export async function sendPasswordChangedEmail (userOrId : number | User) {
    const user = await userFromUserOrId(userOrId);
    await send({
        from : getNoReplyEmail(),
        to : user.email, 
        template : `PasswordChanged`, 
        templateArgs : {
            baseURL : getSettingValue('WebServerBaseUrl'),
            email: user.email,
            name: getUserName(user)
        }
    });
}

export async function sendBrokerStatementEmail (contact: Contact, broker: Broker, dataset: Dataset, statement: Buffer): Promise<boolean> {
    const success = await sendStatementEmail(contact.email, broker.name, dataset.month, statement);
    if (success) {
            await updateBrokerStatementSent(broker.id, dataset.id);
            return true;
        } else {
            return false;
        }
}

export async function sendAdvisorStatementEmail (contact: Contact, advisor: Advisor, dataset: Dataset, statement: Buffer): Promise<boolean> {
    const success = await sendStatementEmail(contact.email, advisor.name, dataset.month, statement);
    if (success) {
            await updateAdvisorStatementSent(advisor.id, dataset.id);
            return true;
        } else {
            return false;}
}

export async function sendManagerStatementEmail (contact: Contact, manager: Manager, dataset: Dataset, statement: Buffer): Promise<boolean> {
    const success = await sendStatementEmail(contact.email, manager.name, dataset.month, statement);
    if (success) {
            await updateManagerStatementSent(manager.id, dataset.id);
            return true;
        } else {
            return false;
        }
}

/**
 * Send statement email
 */
export async function sendStatementEmail (email: string, name: string, month: string, statement: Buffer): Promise<boolean> {
    return await send({
        from: getNoReplyEmail(),
        to: getSettingValue("EmailTo") || email,
        template: `MonthlyStatement`,
        templateArgs: {
            name,
            month: moment(month).format("MMMM YYYY")
        },
        attachments: [{
            content: statement,
            filename: `${month}_statement.pdf`
        } as Attachment]
    });
}