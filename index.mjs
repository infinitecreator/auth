// const express = require('express') ;
import express from 'express' ;
// const NextFunction = require('express-next-function');
const app = express() ;
// const cors = require('cors')
import cors from 'cors' ;
// const bodyParser = require('body-parser');
import bodyParser from 'body-parser' ;
import cookieSession from 'cookie-session' ;
// const mongoose = require('mongoose');
import mongoose from 'mongoose';
import { signuprouter } from './src/routes/signup.mjs';
import { signinrouter } from './src/routes/signin.mjs';
import { signoutrouter } from './src/routes/signout.mjs';
import { currentuserrouter } from './src/routes/current-user.mjs';
import { forgotpasswordrouter } from './src/routes/forgot-password.mjs';
import { verifyotprouter } from './src/routes/verify-otp.mjs';
import { updaterouter } from './src/routes/update.mjs';
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');
// const fs = require('fs');
// const customCss = fs.readFileSync((process.cwd()+"/swagger.css"), 'utf8');

const port = 4000 ;

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, customCss)) ;
app.set('trust proxy', true);
app.use(cookieSession( {
    signed: false,
    secure: false,
}
));
app.use(cors()) ;
app.use(bodyParser.urlencoded({ extended: true })) ;
app.use(bodyParser.json());
app.use(signuprouter) ;
app.use(signinrouter) ;
app.use(signoutrouter) ;
app.use(currentuserrouter);
app.use(forgotpasswordrouter) ;
app.use(verifyotprouter) ;
app.use(updaterouter) ;


const start = async () =>{
    // throw new Error(`Cannot start`) ;
    try{
        await mongoose.connect('mongodb://localhost:27017/nodejs-auth');
        console.log('connected to mongodb') ;

    } catch(err){
        // console.log(err) ;
        throw err ;
        // NextFunction(err) ;
        // return err ;
        // next('error connecting to mongodb') ;

    }

    app.listen(port, () =>{
        console.log(`the app is listening on port ${port}`) ;
    
    }) ;
}

start() ;

const jwtErrors = ['TokenExpiredError', 'JsonWebTokenError', 'NotBeforeError'] ;

app.use((err, req,res,next) => {
    console.log(err) ;

//    console.log(err.name in jwtErrors, 'wow') ;
    if(err && err.statusCode) res.status(err.statusCode).send( err.serializeErrors()) ;
    else if(err && jwtErrors.includes(err.name)){
        res.status(401).send([{message: err.message}]) ;
    }
    else res.status(500).send([{message: err.message || "Internal Server Error"}]) ;
    
    next() ;

}) ;


