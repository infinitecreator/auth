import { CustomError } from "./custom-error.mjs";
// import {ValidationError} from "express-validator"

export class RequestValidationError extends CustomError {

    statusCode = 400 ;
    constructor(errors){
        super("Invalid request parameters");
        this.errors = errors ;
        Object.setPrototypeOf(this, RequestValidationError.prototype) ;
    } ;
    serializeErrors(){
        // console.log(this.errors, 'this') ;
        const customErr = this.errors.map((err)=>{
            // console.log('err', err,'err') ;
            if(err.type == 'field'){
                return {message: err.msg, field: err.path} ;
            }
            return {message: err.msg} ;
        });
        return customErr ;

    }
}