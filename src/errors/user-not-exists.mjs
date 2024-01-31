import { CustomError } from "./custom-error.mjs";

export class UserNotExists extends CustomError {
    statusCode = 404 ;

    constructor(message){
        super(message) ;
        Object.setPrototypeOf(this, UserNotExists.prototype);
    } ;
    
    serializeErrors(){
        return [
            {message: this.message}
        ]
    } ;
};
