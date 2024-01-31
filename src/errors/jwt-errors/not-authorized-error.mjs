import { CustomError } from "../custom-error.mjs";

export class NotAuthorizedError extends CustomError {
    statusCode = 401;

    constructor(message){
        super(message);
        Object.setPrototypeOf(this, NotAuthorizedError.prototype) ;
    }

    serializeErrors(){
        return [{message:this.message}] ;
    }
}