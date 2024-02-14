import express from "express";
import { BadRequestError } from "../errors/bad-request-error.mjs";
import jwt from 'jsonwebtoken' ; 
import { UserNotExists } from "../errors/user-not-exists.mjs";
import { User } from "../models/user.mjs";

const FRONTEND_URL = process.env.FRONTEND_URL ;
const PROTOCOL = process.env.PROTOCOL ;

const router = express.Router() ;


router.get('/api/users/verifyaccount/:token', 
    async (req, res, next)=> {
        try{

        
            const token = req.params.token ;
            if(!token){
                throw new BadRequestError('Token is Invalid') ;
            }
            const decoded = jwt.verify(token,'abcdef') ;

            console.log(decoded,'decoded') ;

            if(!decoded.data.email){
                throw new BadRequestError('Invalid request') ;
            }
            const email = decoded.data.email ;
            const toVerifyToken = decoded.data.token ;

            const isEmailExists = await User.findOne({'email': email}) ;
            console.log(isEmailExists,'emailExists') ;
            if(!isEmailExists) {
                throw new UserNotExists('Not found') ;
            }
            if(isEmailExists.status !== 'pending') {
                throw new BadRequestError('User is already Verified') ;
            }
            if(!isEmailExists.token) {
                throw new BadRequestError('Please Signup again as this account was used for development purposes') ;
            }
            else {
                if(isEmailExists.token === toVerifyToken){
                    const updatedUser  = await User.findOneAndUpdate(
                        {
                            'email' : email,

                        },
                        {
                            $set:
                                {
                                    status: 'active',

                                }
                        },
                        {
                            returnOriginal: false
                        }
                        
                    ) ;
                    res.writeHead(302, {
                        Location: `${PROTOCOL}://${FRONTEND_URL}/account-verified`
                    });
                    res.end();
                    // res.status(200).send([{message: "successfully activated account, you can now login."}])
                }
            }


        } catch(err){
            next(err) ;
        }
            



    }
)
export {router as verifyaccountrouter};