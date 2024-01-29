
import express from 'express' ;
import { currentUser } from '../middlewares/current-user.mjs';



const router = express.Router();

router.get('/api/users/currentuser',
    currentUser,
    (req, res, next) =>{
        try {
            console.log(req.session) ;
            res.status(200).send({message: "Success signed in"}) ;


        } catch(err) {
            next(err) ;

        }
    }

) 

export {router as currentuserrouter} ;