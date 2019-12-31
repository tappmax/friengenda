import TagError from "./TagError";

export default class AlreadyExistsError extends TagError {    
    constructor (details ?: any) {
        super('AlreadyExists', 400, details);
    }
}
