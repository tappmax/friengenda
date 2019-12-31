import TagError from "./TagError";

export default class InvalidOperationError extends TagError {    
    constructor (details ?: any, friendlyDetails ?: any) {
        super('InvalidOperation', 400, details, null, friendlyDetails);
    }
}
