import TagError from "./TagError";

export default class DatabaseError extends TagError {
    constructor(details ?: any) {
        super('DatabaseError', 400, details);
    }
}
