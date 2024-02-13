import express from 'express';
import { validationRequest } from '../middlewares/validate-request.mjs';
import { Otp } from '../models/otp.mjs';
import { body } from 'express-validator';
import { UserNotExists } from '../errors/user-not-exists.mjs';
import jwt from 'jsonwebtoken' ;

const JWT_KEY = 'abcdef' ;

const router = express.Router() ;


router.post('/api/users/verifyotp', 
    [
        body('otp')
        .notEmpty()
        .trim()
        .isLength({min: 6, max:6})
        .withMessage("otp is not valid"),

        body('email')
        .isEmail()
        .withMessage("email is not valid"),
    ],

    validationRequest,

   async (req, res, next) => {

        try{
            const email = req.body.email;
            const otpSubmitted = req.body.otp ;
            const acutalOtp = await Otp.find( { email:email }, null,  { sort: { "cat":-1 } } ).limit(1) ;

            if(!acutalOtp.length) {
                throw new UserNotExists("no otp exists") ;
            }
            const otpExp = acutalOtp[0].exp ;
            const currTime = new Date().getTime() / 1000  ;
            console.log(acutalOtp[0],'acutal') ;

            if(acutalOtp[0].otp !== otpSubmitted ){
                throw new UserNotExists("entered otp is not correct") ;
            }
            if(otpExp - currTime <=0 ) {
                throw new UserNotExists("otp expired, please try again") ;
            }

            const otpToken = jwt.sign({
                data: {
                    email: email,
                    otp: otpSubmitted,
                }
              }, JWT_KEY, { expiresIn: '0.025h' }) ;

            req.session = {
                otp: otpToken

            }

            res.status(200).send([{message:"successfully otp verified"}]) ;
            console.log(acutalOtp, 'otp') ;

        } catch(err){
            next(err) ;

        }

    }
)
export {router as verifyotprouter} ;