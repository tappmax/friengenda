import * as _ from 'lodash';

export type SettingAccess = 
    // Setting is accessible only within the application
    'Private' |
    // Setting is accessible to admins
    'Protected' |
    // Setting is accessible to admins and readonly to non admins
    'Public';

export type SettingSource = 
    'Default' |
    'Config' |
    'Database';

export type Setting = {
    name : string;
    description: string;
    value: number | string | boolean;
    access? : SettingAccess;
    source?: SettingSource;
}

export const SettingNames = [
    'AdminFirstName',
    'AdminLastName',
    'AdminEmail',
    'AdminPassword',

    'AttachmentPath',

    'DefaultDataset',

    'ConfirmEmailCodeTTL',

    'CryptoSecretKey',

    'DatabaseHost',
    'DatabasePort',
    'DatabaseName',
    'DatabaseUsername',
    'DatabasePassword',
    
    'EmailHost',
    'EmailPort',
    'EmailSecure',
    'EmailUsername',
    'EmailPassword',
    'EmailLogger',
    'EmailRejectUnauthorized',    
    'EmailNoReply',
    'EmailTo',
    'EnableLockEmails',

    'ForgotPasswordCodeTTL',

    'VersionMinIOS',
    'VersionMinAndroid',
    'VersionUpgradeIOS',
    'VersionUpgradeAndroid',

    'JWTSecretKey',
    'JWTTTL',

    'LoggerLevel',
    'LoggerFormat',
    'LoggerFilename',

    'PasswordLength',
    'PasswordSpecial',
    'PasswordNumber',
    'PasswordUppercase',
    'PasswordLowercase',

    'SettingCacheTTL',

    'FrenResourcesAddress',

    'WebServerPort',
    'WebServerBaseUrl',

] as const;

const SettingNamesLower = _.map(SettingNames, value=>value.toLowerCase());

export type SettingName = typeof SettingNames[number];

/**
 * Convert string to application setting name or undefined if no match
 * @param value String to convert
 * @returns Application setting name or undefined
 */
export function stringToSettingName (value : string) : SettingName {
    value = value.toLowerCase();
    const index = SettingNamesLower.indexOf(value);
    if(index === -1)
        return undefined;
    return SettingNames[index];
}

/**
 * Converts an Setting to a response
 * @param setting Setting to conver
 * @param publicOnly True if public only details should be returned
 * @returns setting as response
 */
export function settingToResponse (setting : Setting, publicOnly : boolean = true) : any {
    return !publicOnly ? _.omit(setting, ['validate', 'required']) : { name : setting.name, value : setting.value };
}

/**
 * Converts an Setting[] to an array of responses
 * @param settings Settings to conver
 * @param publicOnly True if public only details should be returned
 * @returns settings as response[]
 */
export function settingsToResponse (settings : Setting[], publicOnly : boolean = true) : any {
    return _.map(settings, setting => settingToResponse(setting, publicOnly));
}
