import FrenError from '@errors/FrenError'

export default class NotImplementedError extends FrenError {  
    constructor (details ?: any) {
        super('NotImplemented', 400, details);
    }        
}

