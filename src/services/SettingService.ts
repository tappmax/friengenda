import * as semver from 'semver'
import * as _ from 'lodash';
import * as express from 'express';
import * as db from '@services/DatabaseService'
import { SettingName, Setting } from '@models/Setting';
import InvalidOperationError from '@errors/InvalidOperationError';
import NotFoundError from '@errors/NotFoundError';
import NotAuthorizedError from '@errors/NotAuthorizedError';
const loadConfig = require("../config").loadConfig;

const Settings : {[key in SettingName] : Omit<Setting,'name'> & {required ?: boolean, validate ?: (value) => boolean} }= {

    AdminFirstName : {
        value: '',
        description: 'First name of automatic adminstrator account',
        required: false
    },

    AdminLastName : {
        value: '',
        description: 'Last name of automatic adminstrator account',
        required: false
    },

    AdminEmail : {
        value: '',
        description: 'Email of automatic adminstrator account',
        required: false
    },

    AdminPassword : {
        value: '',
        description: 'Password for automatic administrator account',
        required: false
    },

    AttachmentPath : {
        value : '',
        description : 'Path where attachments are saved',
        required: true
    },

    ConfirmEmailCodeTTL : {
        value : 1440,
        description : 'Time to live (in minutes) of verification code used for confirming an email address',
        access : 'Protected'
    },

    CryptoSecretKey : {
        value : '',
        description : "Secret key used by CryptoService",
        required : true
    },


    DatabaseHost: {
        value : '',
        description : 'Database server address',
        required : true
    },
    DatabasePort: {
        value : 5432,
        description : 'Database server port'
    },
    DatabaseName: {
        value : '',
        description : 'Database name',
        required : true
    },
    DatabaseUsername: {
        value : '',
        description : 'Username for database authorization',
        required : true
    },
    DatabasePassword: {
        value : '',
        description : 'Password for database authorization',
        required : true
    },

    DefaultDataset: {
        value : '2019-12',
        description: 'Date of default dataset when non exists'
    },

    EmailHost : {
        value : '',
        description : 'STMP server',
        required : true
    },
    EmailPort : {
        value : 587,
        description : 'SMTP port'
    },
    EmailSecure : {
        value : false,
        description : "Send secure SMTP requests"
    },
    EmailUsername : {
        value : '',
        description : "Username for SMTP requests",
        required : true
    },
    EmailPassword : {
        value : '',
        description : 'Password for SMTP requests',
        required : true
    },
    EmailLogger : {
        value : false,
        description : 'Enable email logger'
    },
    EmailRejectUnauthorized : {
        value : true,    
        description : 'Fail to send if SMTP certificate isnt valid'
    },
    EmailNoReply : {
        value : '',
        description : 'Email address used for sending noreply emails to admins',
        access : 'Protected',
        required : true
    },
    EmailTo : {
        value : '',
        required : false,
        description : 'Email to send all emails to. Should only be used for testing locally.'
    },
    EnableLockEmails : {
        value : false,
        description : 'Email each broker and advisor after locking a dataset',
        access : 'Protected'
    },

    ForgotPasswordCodeTTL : {
        value : 60,
        description : 'Time to live (in minutes) of verification code used for forgot password email',
        access : 'Protected'
    },

    VersionMinIOS: {
        value : '0.0.0',
        description : 'Minimum version for Field&Yield IOS application',
        access : 'Protected',
        validate : value => semver.valid(value) != null
    },
    VersionMinAndroid: {
        value : '0.0.0',
        description: 'Minimum version for Field&Yield IOS application',
        access : 'Protected',
        validate : value => semver.valid(value) != null
    },
    VersionUpgradeIOS: {
        value : '',
        description: 'Package name for upgrade to the latest version of Field&Yield IOS app',
        access : 'Protected'
    },    
    VersionUpgradeAndroid: {
        value : '',
        description: 'Package name for upgrade to latest version of Field&Yield Android app',
        access: 'Protected'
    },

    JWTSecretKey : {
        value : '',
        description : 'Secret key used to generate JWT tokens',
        required : true,
    },

    JWTTTL : {
        value : 5,
        description : 'Time to live for JWT tokens in minutes',
        access : 'Protected'
    },

    LoggerLevel : {
        value : 'info',
        description : 'Logging level (none|info|warn|error)',
        validate : (value) => ['none','info','warn','error'].includes(value)
    },

    LoggerFormat : {
        value : 'json',
        description : 'Logging format (json|simple)',
        validate : (value) => ['json','simple'].includes(value)
    },

    LoggerFilename : { 
        value: '',
        description: 'Filename to use for log'
    },

    PasswordLength : {
        value : 8,
        description : 'Minimum password length',
        access : 'Protected'
    },
    PasswordSpecial : {
        value : true,
        description : 'Does password require a special character?',
        access : 'Protected'
    },
    PasswordNumber : {
        value : true,
        description : 'Does password require a number?',
        access : 'Protected'
    },
    PasswordUppercase : {
        value : true,
        description : 'Does password require an uppercase letter?',
        access : 'Protected'
    },
    PasswordLowercase : {
        value : true,
        description : 'Does password require a lowercase letter?',
        access : 'Protected'
    },

    SettingCacheTTL : {
        value : 600, // 10 minutes
        description : 'Time to live on setting cache in seconds',
        access : 'Protected'
    },

    TagResourcesAddress : {
        value : '6501 Deane Hill Dr.|Knoxville, TN 37919|(865) 670-1844|billingdebt@tagresources.com|www.tagresources.com',
        description : 'Tag Resources Address to list on statement headers, pipes for newlines'
    },

    WebServerPort : {
        value : 3000,
        description : 'Port the webserver listens on',
        access : 'Private'
    },

    WebServerBaseUrl : {
        value : '',
        description : 'Base url for webserver',
        access : 'Private',
        required : true
    }
    
};

let cacheExpire : Number = 0;

function isCacheStale () {
    return (Date.now() >= cacheExpire);
}

/**
 * Update all setting values from database
 */
export async function updateSettingsFromDatabase  () {
    // Update the cache expiration 
    cacheExpire = Date.now() + getSettingValue<number>('SettingCacheTTL') * 1000;

    const rows = (await db.query('SELECT * FROM settings')).rows;
    if(!rows || rows.length == 0)
        return;

    // Read all application settings from database
    for(let row of rows) {
        const setting = Settings[row.name as SettingName];
        if(!setting)
            continue;

        // Private settings cannot be updated from database
        if(setting.access === 'Private')
            continue;

        setting.source = 'Database';

        switch(typeof setting.value) {
            case 'number': setting.value = Number.parseFloat(row.value); break;
            case 'string': setting.value = row.value; break;
            case 'boolean': setting.value = row.value.toLowerCase() === 'true';
        }
    }
}    

/**
 * Initialize the setting service and return a middleware handler for express that
 * automatically updates the cache periodically.
 */
export function initialize () {
    // Set default values on all settings
    for(let key in Settings) {
        let setting = Settings[key];
        setting.source = 'Default'
        setting.access = setting.access || 'Private';
    }

    // Load settings from config
    const config = loadConfig();
    if(config) {
        for(let key in config) {
            const setting = Settings[key];
            if(!setting) {
                console.warn('SettingService.initialize.UnknownSetting', {setting : key});
                continue;
            }

            try {
                setting.value = transformSettingValue(key as SettingName, config[key]);
                setting.source = 'Config';
            } catch {
                console.error('SettingService.initialize.TypeMismatch', {setting : key, value : config[key], typeExpected : typeof setting.value, typeReceived : typeof config[key]});
            }
        }
    }

    for(let key in Settings) {
        const setting = Settings[key];
        if(!setting.required)
            continue;

        if(setting.source === 'Default') {
            console.error('SettingService.initialize.MissingSetting', {setting : key});
        }
    }

    return async function (req : express.Request, res : express.Response, next : any) {
        if(isCacheStale())
            await updateSettingsFromDatabase();

        next();
    }
}

export function getSettings() : Setting[] {
    const settings : Setting[] = []
    for(let name in Settings)
        settings.push(getSetting(name as SettingName));
    return settings;
}

/**
 * Return an application setting 
 * @param name Name of setting
 */
export function getSetting(name : SettingName) : Setting {
    const setting = Settings[name];
    if(!setting)
        throw new NotFoundError('setting');

    return {
        ...setting,
        name : name
    } as Setting;
}

/**
 * Return the cached value of the given application setting
 * @param name Name of setting to return
 */
export function getSettingValue<T>(name : SettingName) : T {
    return (Settings[name].value as any) as T;
}

function transformSettingValue (name : SettingName, value : number | string | boolean) : number | string | boolean {
    const setting = Settings[name];

    // Allow strings to be converted to the real type
    if(typeof value === 'string') {
        // String to number
        if(typeof setting.value === 'number') {
            value = Number.parseFloat(value);
            if(isNaN(value))
                throw new InvalidOperationError('type mismatch');
        } else if (typeof setting.value === 'boolean') {
            value = value.toLowerCase();
            if(value === 'true')
                value = true;
            else if (value === 'false')
                value = false;
            else
                throw new InvalidOperationError('type mismatch');
        }

    // Must be of same type
    } else if(typeof value !== typeof setting.value) {
        throw new InvalidOperationError('type mismatch');    
    }

    // Validate the value
    if(typeof setting.validate === 'function' && !setting.validate(value)) 
        throw new InvalidOperationError('invalid value');

    return value
}

/**
 * Set the value of an application setting
 * @param name Name of setting
 * @param value 
 */
export async function setSetting (name: SettingName, value : number | string | boolean) {
    const setting = Settings[name];
    if(!setting)
        throw new NotFoundError('setting');

    // Ensure the setting can be modified
    if(setting.access == 'Private')
        throw new NotAuthorizedError('access');

    value = transformSettingValue(name, value);

    // Set the value in cache
    setting.value = value;
    setting.source = 'Database';

    // Set the value in database
    await db.query(`
        INSERT INTO settings (name,value) 
        VALUES ($1,$2) 
        ON CONFLICT (name)
            DO UPDATE SET value = $2 WHERE settings.name = $1`, 
        [name,setting.value.toString()]
    );    
}
