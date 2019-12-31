import FrenError from "./FrenError";

export default class AlreadyExistsError extends FrenError {    
    constructor (details ?: any) {
        super('AlreadyExists', 400, details);
    }
}
