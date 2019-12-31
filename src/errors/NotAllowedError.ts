import TagError from "./TagError";

export default class NotAllowedError extends TagError {    
    constructor (details ?: any, friendlyDetails ?: any) {
        super('NotAllowed', 400, details, null, friendlyDetails);
    }    
}
