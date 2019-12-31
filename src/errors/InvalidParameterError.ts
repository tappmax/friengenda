import FrenError from "./FrenError";

export default class InvalidParameterError extends FrenError {    
    constructor (details ?: any, friendlyDetails ?: any) {
        super('InvalidParameter', 400, details, null, friendlyDetails);
    }
}
