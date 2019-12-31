import TagError from "./TagError";

export default class MissingParameterError extends TagError { 
    constructor (details ?: any, friendlyDetails ?: any) {
        super('MissingParameter', 400, details, null, friendlyDetails);
    }    
}
