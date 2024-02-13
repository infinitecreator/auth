import express from 'express';
import { validationRequest } from '../middlewares/validate-request.mjs';
import { body } from 'express-validator' ;
const router = express.Router();
import { User } from '../models/user.mjs';
import { BadRequestError } from '../errors/bad-request-error.mjs';
import { Password } from '../services/password.mjs';
import jwt from 'jsonwebtoken' ;

const JWT_KEY = 'abcdef' ;

router.post('/api/users/signin', 
    [
        body('email')
        .isEmail()
        .withMessage('Email must be valid'),

        body('password')
        .trim()
        .isLength({min: 8, max: 30})
        .withMessage('Password must be at between 8 and 30 characters'),
    ],
    validationRequest, 
    async (req, res, next) =>{

        try {
            // console.log(req.session, 'session') ;
            const email = req?.body?.email ;
            const user = await User.findOne({email: email}) 
            if(!user){
                throw new BadRequestError("User is not registered. Please register first");

            }
            if(!user.status){
                throw new BadRequestError("please register again, this was creadted in develpment mode");
            }
            if(user.status!=='active'){
                throw new BadRequestError("User is not activated, please activate first then try to login.")
            }
            const password = req?.body?.password ;
            const actual = user.password ;
            // const [actualPassword, salt] = actual.split(":") ;
            const passwordMatched = await Password.compareAsync(password, actual) ;
            if(!passwordMatched){
                throw new BadRequestError("wrong username/email or password") ;
            }
            // const currentSessionJwt = req?.session?.jwt ;

            // const decoded = jwt.verify(currentSessionJwt,'abcdef');
            // console.log(decoded,'decoded') ; // bar

            // no need to check the current session as the request to sign
            // in will only come when the user is logged out
            // so create the new session and just asssing it to the request object

            const token = jwt.sign({
                data: {
                    email: email,
                    password: actual,
                }
              }, JWT_KEY, { expiresIn: '0.1h' }) ;
                    
    
    
            req.session = {
                jwt : token,
            }
            res.status(200).send({message:"Success"}) ;



        } catch(err){
            next(err) ;
        }


    }

)

export {router as signinrouter} ;