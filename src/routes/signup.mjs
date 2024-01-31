// const express = require('express');
import express from 'express' ;
import { body } from 'express-validator' ;
import jwt from 'jsonwebtoken';
import { User } from '../models/user.mjs';
import { validationRequest } from '../middlewares/validate-request.mjs'
import { BadRequestError } from '../errors/bad-request-error.mjs';
import { Password } from '../services/password.mjs';

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
        const password = await Password.toHashAsync(req.body.password) ;
        console.log(password, 'hashed version') ;

        const existingUser = await User.findOne({email: email});
        if(existingUser){
            // throw new Error('Email is in use') ;
            throw new BadRequestError('Email is already in use') ;
        }

        const newUser = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            
        }) ;

        await newUser.save() ;

        const token = jwt.sign({
            data: {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
            }
          }, JWT_KEY, { expiresIn: '0.1h' }) ;
                


        req.session = {
            jwt : token,
        }
        res.status(201).send({message:"Success"}) ;
        

    } catch (err){
        next(err) ;
        
    }

}) ;


export {router as signuprouter} ;