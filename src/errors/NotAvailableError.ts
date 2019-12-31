import TagError from "./TagError";

export default class NotAvailableError extends TagError {    
    constructor (details ?: any, friendlyDetails ?: any) {
        super('NotAvailable', 400, details, null, friendlyDetails);
    }    
}
