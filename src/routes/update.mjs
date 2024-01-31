import express from "express";
// import body from 'express-validator' ;
import { validationRequest } from "../middlewares/validate-request.mjs";
import { BadRequestError } from "../errors/bad-request-error.mjs";
import { Password } from "../services/password.mjs";
import { NotAuthorizedError } from "../errors/jwt-errors/not-authorized-error.mjs";
import jwt from 'jsonwebtoken' ;
import { User } from "../models/user.mjs";
import { body } from "express-validator";


const router = express.Router() ;


router.patch('/api/users/update',
    [
        body('password')
        .optional()
        .trim()
        .isLength({min:8, max:30})
        .withMessage('password must be between 8 and 30 characters'),

        body('first_name')
        .optional()
        .trim()
        .matches(/^[A-Za-z\s]+$/)
        .withMessage('first name must be only alphabetical and cannot be empty'),

        body('last_name')
        .optional()
        .trim()
        .matches(/^[A-Za-z\s]+$/)
        .withMessage('first name must be only alphabetical and cannot be empty'),
        


    ],
    validationRequest,

    async (req, res, next) => {
        try {

            if(!req.body || Object.keys(req.body).length === 0) {
                throw new BadRequestError('field is required to update') ;
            }
            if(!req.session || Object.keys(req.session).length === 0) {
                throw new NotAuthorizedError("not authorized")
            }
            const password = req.body.password ;
            const firstName = req.body.first_name ;
            const lastName = req.body.last_name ;
    
            let decoded  = "" ;
            console.log(req.session, 'session') ;
            if(req.session.jwt){
                // logged in session
                decoded = jwt.verify(req.session.jwt, 'abcdef');
    
            }
            if(req.session.otp){
                //forgot password session
                decoded = jwt.verify(req.session.otp,'abcdef') ;
    
            }
            console.log(decoded, 'decoded') ;
    
            const objUpdate = {}
            if(password) objUpdate.password = Password.toHashAsync(password) ;
            if(firstName) objUpdate.firstName = firstName ;
            if(lastName) objUpdate.lastName = lastName ; 
            const email = decoded.data.email ;

            const updatedDoc = await User.findOneAndUpdate(
                { "email": email } ,
                {
                    $set: objUpdate,
                },
                { returnOriginal: false },
            ) ;
            console.log(email,'email');
            console.log(updatedDoc,'updatedDoc') ;

            res.status(202).send([{message:"successfully updated"}]) ;
        

        } catch(err){
            next(err) ;

        }
         

    }

)

export {router as updaterouter} ;