import TagError from '@errors/TagError'

export default class NotFoundError extends TagError {    
    constructor (details ?: any, friendlyDetails ?: any) {
        super('NotFound', 404, details, null, friendlyDetails);
    }        
}

