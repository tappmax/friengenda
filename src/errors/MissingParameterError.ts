import FrenError from "./FrenError";

export default class MissingParameterError extends FrenError { 
    constructor (details ?: any, friendlyDetails ?: any) {
        super('MissingParameter', 400, details, null, friendlyDetails);
    }    
}
