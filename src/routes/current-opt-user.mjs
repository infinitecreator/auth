
import express from 'express' ;
import { verifyOTPUser } from '../middlewares/verify-otp-user.mjs';



const router = express.Router();

router.get('/api/users/currentotpuser',
    verifyOTPUser,
    (req, res, next) =>{
        try {
            console.log(req.session) ;
            res.status(200).send({message: "Success "}) ;


        } catch(err) {
            next(err) ;

        }
    }

) 

export {router as currentotpuserrouter} ;