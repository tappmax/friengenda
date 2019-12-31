import FrenError from "./FrenError";

export default class NotAllowedError extends FrenError {    
    constructor (details ?: any, friendlyDetails ?: any) {
        super('NotAllowed', 400, details, null, friendlyDetails);
    }    
}
