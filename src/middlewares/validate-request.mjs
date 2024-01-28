import {validationResult} from 'express-validator' ;
import { RequestValidationError } from '../errors/request-validation-error.mjs';

const validationRequest = (req, res, next) =>{
    const errors = validationResult(req) ;
    if(!errors.isEmpty()){
        throw new RequestValidationError(errors.errors) ;
    }
    next() ;


}

export {validationRequest} ;