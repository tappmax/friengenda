import TagError from '@errors/TagError'

export default class NotImplementedError extends TagError {  
    constructor (details ?: any) {
        super('NotImplemented', 400, details);
    }        
}

