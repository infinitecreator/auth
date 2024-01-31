import express from "express";
import { body } from 'express-validator' ;
import { validationRequest } from "../middlewares/validate-request.mjs";
import { User } from "../models/user.mjs";
import { UserNotExists } from "../errors/user-not-exists.mjs";
import { Otp } from "../models/otp.mjs";
import otpGenerator from 'otp-generator' ;



const router = express.Router() ;

router.post('/api/users/forgotpassword', 
    [
        body('email')
        .isEmail()
        .withMessage("email must be a valid email address"),

    ],
    validationRequest,
    async (req, res, next) =>{
        try {
            const email = req.body.email ;
            const userExists = await User.findOne({email:email}) ;
            if(!userExists) {
                throw new UserNotExists('User not found') ;
            }

            const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
            const otpObject = new Otp({
                otp: otp,
                email: email,
                exp: (new Date().getTime() / 1000) + 60 ,
                cat:  new Date().getTime() / 1000 
            })
            await otpObject.save() ;
            

            res.status(201).send([{message:"success" }]) ;
            
            // generate otp and save to db
            // set expiry to 1 min
            // then return success




        } catch(err) {
            next(err) ;

        }



    }
);

export {router as forgotpasswordrouter} ;