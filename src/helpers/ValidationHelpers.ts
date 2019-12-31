import * as _ from 'lodash';
import * as emailValidator from 'email-validator';
import { getSettingValue } from '@services/SettingService';
import InvalidParameterError from '@errors/InvalidParameterError';
import MissingParameterError from '@errors/MissingParameterError';
import NotFoundError from '@errors/NotFoundError';
import { UserRoles, UserRoleId } from '@models/User';
import { OrderBy } from '@models/Pagination';
import { Address, Contact } from '@models/Contact';
import { stringToPaymentMethod } from '@models/Enums';
import { makeMonth } from './DateHelpers';

/**
 * Returns the named property value or throws a MissingParameterError if the property
 * is missing and required.
 * @param object Object to get property from
 * @param name Property of property to retrieve
 * @param required True if the property is required`
 */
function getPropertyValue (object : any, name : string, required : boolean) : any {
    const originalValue = object[name];
    if(originalValue === undefined && required)
        throw new MissingParameterError(name);

    return originalValue;
}

function validateNumber (object : any, name : string, integer : boolean, required : boolean, min : number, max : number) : number {
    const originalValue = getPropertyValue(object, name, required);
    if(originalValue === undefined)
        return;

    let value : number;    
    switch(typeof originalValue) {
        case 'string':
            if(integer)
                try { value = Number.parseInt(originalValue); } catch { }
            else
                try { value = Number.parseFloat(originalValue); } catch { }
            break;
        case 'number':
            value = originalValue;
            break;
    }

    // Ensure a value was parsed and that it meets the min and max requirements
    if(value === undefined || 
       isNaN(value) ||
       (min !== undefined && value < min) ||
       (max !== undefined && value > max)) {
        throw new InvalidParameterError(name);
    }

    return value;
}

/**
 * Validates the value of a property as an integer
 * @param object Object to validate property from
 * @param name Property name
 * @param required True if the property is required
 * @param min Optional minimal value
 * @param max Optional maximum value
 */
export function validateInteger (object : any, name : string, required: boolean = true, min? : number, max? : number) : number {
    return validateNumber(object, name, true, required, min, max);
}

/**
 * Validates the value of a property as a float
 * @param object Object to validate property from
 * @param name Property name
 * @param required True if the property is required
 * @param min Optional minimal value
 * @param max Optional maximum value
 */
export function validateFloat (object : any, name : string, required: boolean = true, min? : number, max? : number) : number {
    return validateNumber(object, name, false, required, min, max);
}

/**
 * Validates the value of a property as a string
 * @param object Object to validate property on
 * @param name Name of property to validate
 * @param required True if the property is required
 * @param min Minimum length of the string
 * @param max Maximum length of the string
 */
export function validateString (object: any, name : string, required : boolean = true, min? : number, max? : number) : string {
    const original = getPropertyValue(object, name, required);
    if(original === undefined)
        return;

    let value : string;
    switch(typeof original) {
        case 'string': value = original; break;
        case 'number': value = original.toString(); break;
    }

    if(value === undefined || 
       (min !== undefined && value.length < min) ||
       (max !== undefined && value.length > max))
        throw new InvalidParameterError(name);

    return value;
}

/**
 * Validates the value of an enum property
 * @param object Object to validate property on
 * @param name Name of property to validate
 * @param required True if the property is required
 * @param min Minimum length of the string
 * @param max Maximum length of the string
 */
export function validateEnum<T> (object: any, name : string, required : boolean, stringTo : (value : string) => T, defaultValue ?: T) : T {
    const stringValue = validateString(object, name, required);
    if(stringValue === undefined)
        return defaultValue;

    const value = stringTo(stringValue);
    if(value === undefined)
        throw new InvalidParameterError(name);

    return value;
}

/**
 * Validates the value of an enum property
 * @param object Object to validate property on
 * @param name Name of property to validate
 * @param required True if the property is required
 * @param min Minimum length of the string
 * @param max Maximum length of the string
 */
export function validateEnumArray<T> (object: any, name : string, required : boolean, stringTo : (value : string) => T) : T[] {
    const array = validateArray(object, name, required);
    if(array === undefined)
        return undefined;

    for(let e of array) {
        const value = stringTo(e);
        if(value === undefined)
            throw new InvalidParameterError(name);
    }

    return array;
}

/**
 * Validates the value of a property as json
 * @param object Object to validate property on
 * @param name Name of property to validate
 * @param required True if the property is required
 */
export function validateJSON (object: any, name : string, required : boolean = true) : any {
    const value = getPropertyValue (object, name, required);
    if(value === undefined)
        return;

    if(typeof value ==='number' || Array.isArray(value))  
        return value;

    try {
        return JSON.parse(value);
    } catch {
        throw new InvalidParameterError(name);
    }
}

/**
 * Validates the value of a property as a boolean
 * @param object Object to validate property on
 * @param name Name of property to validate
 * @param required True if the property is required
 */
export function validateBoolean (object : any, name : string, required : boolean = true) : boolean {
    const original = getPropertyValue(object, name, required);
    if(original === undefined)
        return;

    switch(typeof original) {
        case 'boolean': return original;
        case 'string':
            switch(original.toLowerCase()) {
                case 'true': return true;
                case '1': return true;
                case 'false': return false;
                case '0': return false;                    
            }
            break;
        case 'number':
            if(original === 0) return false;
            if(original === 1) return true;
            break;
    }

    throw new InvalidParameterError(name);
}

/**
 * Validates the value of a property as a boolean
 * @param object Object to validate property on
 * @param name Name of property to validate
 * @param required True if the property is required
 */
export function validateDate (object : any, name : string, required : boolean = true, min?: Date, max?: Date) : Date {
    const original = getPropertyValue(object, name, required);
    if(original === undefined)
        return;

    let value : Date;
    if(original instanceof Date) {
        value = original as Date;
    } else {
        switch(typeof original) {
            case 'string':
                const parsed = Date.parse(original) ;
                if(isNaN(parsed))
                    throw new InvalidParameterError(name);
                value = new Date(parsed)
                break;
        }    
    }

    if(value === undefined || 
       (min !== undefined && value < min) || 
       (max !== undefined && value > max))
        throw new InvalidParameterError(name);

    return value;
}

/**
 * Validates the value of a property as a month-year pair
 * @param object Object to validate property on
 * @param name Name of property to validate
 * @param required True if the property is required
 */
export function validateMonth (object : any, name : string, required : boolean = true) : string {
    const original = validateString(object, name, required);
    if(original === undefined)
        return;

    const values = original.split('-');
    if(values.length != 2)
        throw new InvalidParameterError(name);

    const year = parseInt(values[0]);
    const month = parseInt(values[1]);

    if(month < 1 || month > 12 || year < 1000 || year > 9999)
        throw new InvalidParameterError(name);

    return makeMonth(month, year);
}

/**
 * Validates the value of a property as an email address
 * @param object Source of property
 * @param name  Name of property
 * @param required True if the property is required
 */
export function validateEmail (object : any, name : string, required : boolean = true) : string {
    const email = validateString(object, name, required);
    if(email === undefined)
        return undefined;
            
    if(!emailValidator.validate(email)) 
        throw new InvalidParameterError(name);

    return email;
}

const phoneRegex = /((\(\d{3}\) ?)|(\d{3}-))?\d{3}-\d{4}/;

/**
 * Validates the value of a property as a phone number
 * @param object Source of property
 * @param name Name of property
 * @param required True if the property is required
 */
export function validatePhone(object : any, name : string, required : boolean = true) : string {
    const phone = validateString(object, name, required, 10);
    if(phone === undefined)
        return undefined;

    if(!phone.match(phoneRegex))
        throw new InvalidParameterError(name);

    return phone;
}

/**
 * Checks a given password to ensure it is complex enough
 */
export function validatePassword (object : any, name : string, required : boolean = false) : string {
    const password = validateString(object, name, required);
    if(!password)
        return undefined;

    const valid = 
        (password.length >= getSettingValue<number>('PasswordLength')) &&
        (!getSettingValue<boolean>('PasswordUppercase') || password.match('[A-Z]')) &&
        (!getSettingValue<boolean>('PasswordLowercase') || password.match('[a-z]')) &&
        (!getSettingValue<boolean>('PasswordNumber') || password.match('[0-9]')) &&
        (!getSettingValue<boolean>('PasswordSpecial') || password.match(`[\\^\\$\\*\\.\\[\\]\\{\\}\\(\\)\\?\\-\\"\\!\\@\\#\\%\\&\\/\\\\\\,\\>\\<\\'\\:\\;\\|\\_\\~]`));

    if(!valid)
        throw new InvalidParameterError(name);

    return password;
}

/**
 * Validate that the value of a property is a valid user role id
 * @param object Object that contains property
 * @param name property name
 * @param required True if the role identifer is required
 */
export function validateUserRoleId (object : any, name : string, required : boolean = true) : UserRoleId {
    const role = validateString(object, name, required);
    if(!role) 
        return undefined;

    if(!UserRoles [role])
        throw new NotFoundError('role');

    return role as UserRoleId;
}

/**
 * Validate that the value of a property is a valid url
 * @param object Object that contains property
 * @param name property name
 * @param required True if the property is required
 */
export function validateUrl (object : any, name : string, required : boolean = false) : string {
    const url = validateString(object, name, required);
    if(!url)
        return undefined;
        
    try {
        new URL(url);
        return url;
    } catch {
        throw new InvalidParameterError(name);
    }
}

const einRegex = /^[\dX]{2}-[\dX]{3}\d{4}$/;
const ssRegex = /^[\dX]{3}-[\dX]{2}-\d{4}$/;

/**
 * Validate that the value of a property is a valid tax EIN number or Social security number
 * @param object Object containing property
 * @param name Name of property
 * @param required True if the value is required
 */
export function validateEIN (object: any, name : string, required: boolean = false) : string {
    const ein = validateString(object, name, required);
    if(!ein || ein.length === 0)
        return undefined;

    if(!(ein.match(einRegex) || ein.match(ssRegex)))
        throw new InvalidParameterError(name);

    return ein;
}

const planRegex = /^[A-Z0-9]\d{2}$/;

/**
 * Validate that the value of a property is a valid plan identifier
 * @param object Object containing property
 * @param name Name of property
 * @param required True if the property is required
 */
export function validatePlanId (object: any, name: string, required: boolean) {
    const planId = validateString(object, name, required, 3, 3);
    if(planId === undefined)
        return;

    if(!planId.match(planRegex))
        throw new InvalidParameterError(name);
    return planId;
}

const contractRegex = /^\d{6}$/;

/**
 * Validate that the value of a property is a valid contract identifier
 * @param object Object containing property
 * @param name Name of property
 * @param required True if the property is required
 */
export function validateContractId (object: any, name: string, required: boolean) {
    const contractId = validateString(object, name, required, 6, 6);
    if(contractId === undefined)
        return;

    if(!contractId.match(contractRegex))
        throw new InvalidParameterError(name);

    return contractId;
}

/**
 * Validate that the value of a property is a valid array and optionally validate all array items
 * @param object Object containing property
 * @param name Name of property
 * @param required True if the property is required
 * @param itemValidator Validator to use on each item
 */
export function validateArray (object: any, name:string, required: boolean, itemValidator?: (any) => any) : any[] {
    const value = getPropertyValue(object, name, required);
    if(value === undefined)
        return;

    if(!Array.isArray(value))
        throw new InvalidParameterError(name);

    if(!itemValidator)
        return value;

    return _.map(value, v => itemValidator(v))
}

/**
 * Validate that the value of a property is a file object.
 * @param object Object containing property
 * @param name Name of property
 * @param required True if the property is required
 */
export function validateFile (object: any, name:string, required: boolean) : { name: string, data : Buffer, mimetype : string } {
    const value = getPropertyValue(object, name, required);
    if(value === undefined)
        return;

    if(!Array.isArray(value) || value.length !== 1)
        throw new InvalidParameterError(name);

    const file = value[0];

    if(!Buffer.isBuffer(file.data))
        throw new InvalidParameterError(name);

    return file;
}

/**
 * Validate that the value of a property is an array of file object.
 * @param object Object containing property
 * @param name Name of property
 * @param required True if the property is required
 */
export function validateFiles (object: any, name:string, required: boolean) : { name: string, data : Buffer, mimetype : string }[] {
    const value = getPropertyValue(object, name, required);
    if(value === undefined)
        return;

    if(!Array.isArray(value) || value.length == 0)
        throw new InvalidParameterError(name);

    for(let file of value) {
        if(!Buffer.isBuffer(file.data))
            throw new InvalidParameterError(name);
    }

    return value;
}

/**
 * Validates the value of an enum property
 * @param object Object to validate property on
 * @param name Name of property to validate
 * @param required True if the property is required
 */
export function validateOrderBy<T> (object: any, name : string, required : boolean, stringTo : (value : string) => T) : OrderBy<T>[] {
    return validateArray(object, name, required, (v) => ({
        name : validateEnum(v, 'name', true, stringTo),
        descend : validateBoolean(v, 'descend', false)
    }));
}

/**
 * Validates the value of a property is an address
 * @param object Object to validate property on
 * @param name Name of property to validate
 * @param required True if the property is required
 */
export function validateAddress<T> (object: any, name : string, required : boolean) : Address {
    const address = getPropertyValue(object, name, required);
    if(address == undefined)
        return undefined;

    return <Address> {
        line1: validateString(address, 'line1', false),
        line2: validateString(address, 'line2', false),
        city: validateString(address, 'city', false),
        state: validateString(address, 'state', false),
        zip: validateString(address, 'zip', false),
    }
}

/**
 * Validate the value of a property is an array of contacts
 * @param object Object to validate property on
 * @param name Name of property to validate
 * @param required True if the property is required
 */
export function validateContacts(object: any, name: string, required: boolean) : Contact[] {
    return validateArray(object, name, required, contact => ({
        paymentMethod : validateEnum(contact, 'paymentMethod', false, stringToPaymentMethod),
        name: validateString(contact, 'name', false),
        address : validateAddress(contact, 'address', false),
        email : validateEmail(contact, 'email', false),
        phone : validatePhone(contact, 'phone', false)
    }));
}

/**
 * Validate search text string
 * @param object Object to validate property on
 * @param name Name of property to validate
 * @param required True if the property is required
 */
export function validateSearchText(object: any, name:string, required: boolean) : string {
    const text = validateString(object, name, required);
    if(text === undefined)
        return undefined;

    return _.map(text.split(' ').filter(i => i), v => v + ":*").join(' & ');
}
