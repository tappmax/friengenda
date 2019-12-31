import * as _ from 'lodash';
import { isString } from 'util';

/**
 * Generates a parser for a string union type
 * @param typeStrings String for type
 */
export function parseStringUnionType<T> (typeStrings : readonly string[]) {
    return (value : string) : T => {
        if(undefined == value)
            return undefined;

        value = value.toLowerCase();
        return _.find(typeStrings, type => type.toLowerCase() == value) as any as T;    
    }
}

export type Transformer<From,To> = (value: From) => To;

/**
 * Transform an array using the given transformer
 */
export function all<From extends object,To extends object>(transform : Transformer<From,To>) : Transformer<From[],To[]> {
    return (values : From[]) : To[] => {
        return (_.map(values, value => transform(value)) as any) as To[];
    }    
}

/**
 * Combine multiple transformers into transform sequence
 */
export function combine<From extends object,To extends object>(...transforms : Transformer<From,To>[]) : Transformer<From,To> {
    return (value : From) : To => {
        if(value == null)
            return null;
        _.each(transforms, transform => {value = (transform(value) as any) as From;})
        return ((value as any) as To);
    }
}

/**
 * Rename properties
 */
export function rename<From extends object,To extends object>(properties : {[key : string] : string}) : Transformer<From,To> {
    return (value : From) : To => {
        return _.mapKeys(value as any, (v, k) => properties[k] || k) as To;
    }
}

/**
 * Omit properties
 */
export function omit<From extends object,To extends object>(properties : string | string[]) : Transformer<From,To> {
    return (value : From) : To => {
        return _.omit(value, properties) as To;
    }
}

/**
 * Pick specific properties
 */
export function pick<From extends object,To extends object>(properties : string | string[]) : Transformer<From,To> {
    return (value : From) : To => {
        return _.pick(value, properties) as To;
    }
}

/**
 * Map property values
 */
export function map<From extends object,To extends object>(properties : {[key : string] : (value : any) => any}) {
    return (value : From) : To => {
        return _.mapValues(value, (v, k) => {
            return (k in properties) ? properties[k](v) : v;    
        }) as To;
    }
}

export function reduce<From extends object, To extends object>(from : string[] | string, to: string, reducer: (value : any) => any) {
    return (value : From) : To => {
        return _.set(_.omit(value,from),to,reducer(_.pick(value,from))) as To;
    }
}

/**
 * Set a specific property
 */
export function set<From extends object, To extends object>(property: string, transform : (value : any) => any) {
    return (value : From) : To => {
        return _.set(value as any,property,transform(value)) as To;
    }
}

/**
 * Omit nil property values
 */
export function omitNil<From extends object, To extends object>() {
    return (value: From) : To => {
        return _.omitBy(value, _.isNil) as To;
    }
}

/**
 * Mask the valid of an EIN or social security number
 * @param ein 
 */
export function maskEIN (ein: string) {
    if(!ein || !isString(ein))
        return ein;

    if(ein.length === 11)
        return "XXX-XX-" + ein.substr(7);
    
    return "XX-XXX" + ein.substr(6);
}