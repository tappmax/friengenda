import FrenError, { FriendlyDetails } from "./FrenError";

export default class NotAuthorizedError extends FrenError {
    constructor (details ?: any, friendlyDetails ?: FriendlyDetails) {
        super('NotAuthorized', 401, details, null, friendlyDetails);
    }    
}
