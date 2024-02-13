import express from 'express' ;
import jwt from 'jsonwebtoken' ;

const router = express.Router();

export const verifyOTPUser= (
    req, 
    res, 
    next
) => {

    try {
        if(!req.session) return next() ;
        const currentOTPSessionJwt = req?.session?.otp ;

        const decoded = jwt.verify(currentOTPSessionJwt,'abcdef');
        console.log(decoded,'decoded') ; // bar
        next() ;
        

    } catch(err){
        throw err ;
        

    }
    

}