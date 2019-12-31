import FrenError from "./FrenError";

export default class InternalServerError extends FrenError {     
    constructor (innerError?: any) {
        super('InternalServerError', 500, undefined, innerError);
    }
}

