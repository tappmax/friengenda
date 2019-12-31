import FrenError from "./FrenError";

export default class NotAvailableError extends FrenError {    
    constructor (details ?: any, friendlyDetails ?: any) {
        super('NotAvailable', 400, details, null, friendlyDetails);
    }    
}
