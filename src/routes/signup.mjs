// const express = require('express');
import express from 'express' ;
import { body } from 'express-validator' ;
import jwt from 'jsonwebtoken';
import { User } from '../models/user.mjs';
import { validationRequest } from '../middlewares/validate-request.mjs'
import { BadRequestError } from '../errors/bad-request-error.mjs';
import { Password } from '../services/password.mjs';
import SendEmail from '../helper/send-email.mjs';
import otpGenerator from 'otp-generator' ;

const JWT_KEY = "abcdef" ; 

const router = express.Router();




router.post('/api/users/signup',
    [
        body('email')
        .isEmail()
        .withMessage('Email must be valid'),

        body('password')
        .trim()
        .isLength({ min: 8, max: 30})
        .withMessage('Password must be at least 8 characters and at most 30 characters'),

        body('first_name')
        .notEmpty()
        .trim()
        .matches(/^[A-Za-z\s]+$/)
        .withMessage('Name must be alphabetic.'),
        
        body('last_name')
        .notEmpty()
        .trim()
        .matches(/^[A-Za-z\s]+$/)
        .withMessage('Name must be alphabetic.'),


    ],
    validationRequest,
    async (req, res, next) => {

    try {
        const firstName = req.body.first_name;
        const lastName = req.body.last_name ;
        const email = req.body.email ;
        const mobile = req.body.mobile;
        const password = await Password.toHashAsync(req.body.password) ;
        console.log(password, 'hashed version') ;

        const existingUser = await User.findOne({email: email});
        if(existingUser){
            // throw new Error('Email is in use') ;
            throw new BadRequestError('Email is already in use') ;
        }

        const toVerifyToken = otpGenerator.generate(20, { upperCaseAlphabets: false, specialChars: false });

        const newUser = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            mobile: mobile,
            token: toVerifyToken,
            upd: (new Date().getTime() / 1000),
            cat: (new Date().getTime() / 1000)
            
        }) ;

        

        const token = jwt.sign({
            data: {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                mobile: mobile,
                token: toVerifyToken,
                upd: (new Date().getTime() / 1000),
                cat: (new Date().getTime() / 1000)
                
            }
          }, JWT_KEY, { expiresIn: '24h' }) ;
                


        
        const tokenUrl = `${process.env.PROTOCOL}://${process.env.BACKEND_URL}/api/users/verifyaccount/${token}` ; 
        const linkUrl = `${tokenUrl} 
                        Activate your account 
                        `

        const text = `Your account has been successfully created.
              Please activate the account from the below link:

              ${linkUrl}

              Thank You
              System

              `

        const subject = "Account Confirmation"
        await SendEmail(text,`System <${email}>`,subject);
        await newUser.save() ;
        req.session = {
            jwt : token,
        }
        res.status(201).send([{message:"Successfully created Account. Please check the email and acitvate your account before logging in."}]) ;
        

    } catch (err){
        next(err) ;
        
    }

}) ;


export {router as signuprouter} ;