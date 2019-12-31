import * as T from '@helpers/ModelHelpers';
import { isProduction } from "../app";

export type FriendlyDetails = string | { [key : string] : string };

export default class FrenError extends Error {
    public innerError : any;
    public status : number;
    public name : string;
    public details: any;
    public friendlyDetails : any;

    constructor (name : string, status : number, details ?: any, innerError?: any, friendlyDetails ?: FriendlyDetails) {
        if(typeof(details) === "string") {
            super(details);
        } else if (details) {
            super(details.message)
        } else {
            super();
        }
        this.details = details;
        this.innerError = innerError;
        this.status = status;
        this.name = name;
        this.friendlyDetails = friendlyDetails;
    }

    public toJSON() {
        return Object.getOwnPropertyNames(this).reduce((a, b) => {
            a[b] = this[b];
            return a;
        }, {});
    }    
}

export const stackToResponse = (stack) => (stack ? stack.split('\n'): undefined);
export const innerErrorToResponse = (inner) => {
    return {...(inner?inner.toJSON():{}), stack: stackToResponse(inner ? inner.stack : undefined)};
}

export const errorToResponse = T.combine<any,any>(
    T.map({innerError: innerErrorToResponse, stack: stackToResponse}),
    T.omit(isProduction ? ['innerError','stack'] : []),
    T.omitNil()
)