import FrenError from "./FrenError";

export default class DatabaseError extends FrenError {
    constructor(details ?: any) {
        super('DatabaseError', 400, details);
    }
}
