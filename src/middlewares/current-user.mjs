import express from 'express' ;
import jwt from 'jsonwebtoken' ;
import { User } from '../models/user.mjs';
import { BadRequestError } from '../errors/bad-request-error.mjs';

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
        console.log(decoded, 'decoded') ;
        User.findOne({'email':decoded.data.email})
        .then((user)=>{
            
            if(!user){
                throw new BadRequestError('user not found') ;
            }
            if(!user.password){
                throw new BadRequestError('User has not set their password') ;
            }
            if(user && user.status && user.status !=='active') {
                throw new BadRequestError('user has not activated their account') ;
            }

            console.log(user, 'user') ;
            next() ;

        }).catch((err)=>{
            next(err) ;
        });
        // if(!userData){
        //     throw  new BadRequestError('No user found') ;
        // }
        // console.log(userData, 'userData') ;
        // if(userData && userData.status && userData.status !== 'active') {
        //     throw new BadRequestError('User has not activated their account. Please activate first') ;

        // }
        console.log(decoded,'decoded') ; // bar
        // next() ;
        

    } catch(err){
        next (err);
        

    }
    

}
