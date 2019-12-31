import FrenError from "./FrenError";

export default class InvalidOperationError extends FrenError {    
    constructor (details ?: any, friendlyDetails ?: any) {
        super('InvalidOperation', 400, details, null, friendlyDetails);
    }
}
