import FrenError from '@errors/FrenError'

export default class NotFoundError extends FrenError {    
    constructor (details ?: any, friendlyDetails ?: any) {
        super('NotFound', 404, details, null, friendlyDetails);
    }        
}

