import TagError from "./TagError";

export default class InternalServerError extends TagError {     
    constructor (innerError?: any) {
        super('InternalServerError', 500, undefined, innerError);
    }
}

