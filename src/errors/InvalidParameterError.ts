import TagError from "./TagError";

export default class InvalidParameterError extends TagError {    
    constructor (details ?: any, friendlyDetails ?: any) {
        super('InvalidParameter', 400, details, null, friendlyDetails);
    }
}
