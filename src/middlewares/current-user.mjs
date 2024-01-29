import express from 'express' ;
import jwt from 'jsonwebtoken' ;

const router = express.Router();

export const currentUser = (
    req, 
    res, 
    next
) => {

    try {
        if(!req.session) return next() ;
        const currentSessionJwt = req?.session?.jwt ;

        const decoded = jwt.verify(currentSessionJwt,'abcdef');
        console.log(decoded,'decoded') ; // bar
        next() ;
        

    } catch(err){
        throw err ;
        

    }
    

}
