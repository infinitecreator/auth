// const express = require('express');
import express from 'express' ;
import { body } from 'express-validator' ;
import jwt from 'jsonwebtoken';
import { User } from '../models/user.mjs';
import { validationRequest } from '../middlewares/validate-request.mjs'
import { BadRequestError } from '../errors/bad-request-error.mjs';

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
        .withMessage('Password must be at least 8 characters and at most 30 characters')
    ],
    validationRequest,
    async (req, res, next) => {

    try {
        const email = req.body.email ;
        const password = req.body.password ; 

        const existingUser = await User.findOne({email: email});
        if(existingUser){
            // throw new Error('Email is in use') ;
            throw new BadRequestError('Email is already in use') ;
        }

        const newUser = new User({
            email: email,
            password: password,
        }) ;

        await newUser.save() ;

        jwt.sign({
            data: {
                email: email,
                password: password,
            }
          }, JWT_KEY, { expiresIn: '0.1h' }, function(err, token){
            // console.log(token, 'generated token') ;
                if(err){
                    throw new Error({message: err.message, statusCode: err.statusCode}) ;
                }
                req.session = {
                    jwt : token,
                }
                // console.log(req.session, 'req.session') ;


                req.session = {
                    jwt : token,
                }
                res.status(201).send({message:"Success"}) ;
                


          });

        // const token = jwt.sign({
        //         data: {
        //             email: email,
        //             password: password,
        //         }
        //       }, JWT_KEY, { expiresIn: '0.1h' }
        // );

        // console.log(token, 'generated token') ;
        
        // req.session = {
        //     jwt : token,
        // }
        // res.status(201).send({message:"Success"}) ;
        

    } catch (err){
        next(err) ;
        
    }

}) ;


export {router as signuprouter} ;