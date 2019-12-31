import TagError, { FriendlyDetails } from "./TagError";

export default class NotAuthorizedError extends TagError {
    constructor (details ?: any, friendlyDetails ?: FriendlyDetails) {
        super('NotAuthorized', 401, details, null, friendlyDetails);
    }    
}
