// const express = require('express') ;
import express from 'express' ;
// const NextFunction = require('express-next-function');
const app = express() ;
// const cors = require('cors')
import cors from 'cors' ;
import 'dotenv/config' ;
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
import { verifyaccountrouter } from './src/routes/verify-account.mjs';
import { currentotpuserrouter } from './src/routes/current-opt-user.mjs';
import { googleauthrouter } from './src/routes/google-auth.mjs';
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');
// const fs = require('fs');
// const customCss = fs.readFileSync((process.cwd()+"/swagger.css"), 'utf8');

const port = 4000 ;

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, customCss)) ;
app.set('trust proxy', true);
app.use(cookieSession( {
    signed: false,
    secure: process.env.SECURE_COOKIE,
    sameSite: 'none',
    
}
));
app.use(cors({
    origin: ['http://localhost:3000','https://front-auth.netlify.app'],    
    credentials: true,
    allowedHeaders: ['Content-Type', '*']
})) ;
app.use(bodyParser.urlencoded({ extended: true })) ;
app.use(bodyParser.json());
app.use(signuprouter) ;
app.use(signinrouter) ;
app.use(signoutrouter) ;
app.use(currentuserrouter);
app.use(forgotpasswordrouter) ;
app.use(verifyotprouter) ;
app.use(updaterouter) ;
app.use(verifyaccountrouter) ;
app.use(currentotpuserrouter) ;
app.use(googleauthrouter) ;

// const MONGO_URI = process.env.MONGO_URI ;
// console.log(process.env,'env'); 
console.log(`mongodb+srv://xrniraj:${encodeURIComponent('Neverknow123@')}@auth.ueq5owu.mongodb.net/?retryWrites=true&w=majority`) ;

const start = async () =>{
    // throw new Error(`Cannot start`) ;
    try{
        await mongoose.connect(`mongodb+srv://xrniraj:Theniraj123@auth.ueq5owu.mongodb.net/?retryWrites=true&w=majority`) ;
        console.log('connected to mongodb cloud instance') ;

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


