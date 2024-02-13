import express from 'express' ;
import axios from 'axios';
import { User } from '../models/user.mjs';
import { header } from 'express-validator';
import jwt from 'jsonwebtoken' ;
const router = express.Router() ;

const JWT_KEY = 'abcdef' ;


const CLIENT_ID = '1074632169173-4d3glrbd9antddg253r7mkkp46q468e0.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:4000/auth/google/callback';

// Initiates the Google Login flow
router.get('/auth/google', (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`;
  res.redirect(url);
});

// Callback URL for handling the Google Login response
router.get('/auth/google/callback', async (req, res, next) => {
  const { code } = req.query;
    //  const code = req.headers.authorization;
     console.log(code,'code') ;

  try {
    // Exchange authorization code for access token
    const { data } = await axios.post('https://www.googleapis.com/oauth2/v3/token',  {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const { access_token, id_token } = data;
    console.log(access_token, id_token, 'id') ;

    // Use access_token or id_token to fetch user profile
    const { data: profile } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo/', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    console.log(profile, 'profile') ;
    
    const userData = await User.findOne({'email': profile.email}) ;
    console.log(userData, 'ss') ;
    const socialToken = jwt.sign({
        data: {
            email: profile.email,
        }
      }, JWT_KEY, { expiresIn: '0.05h' }) ;
    
    req.session = {
        jwt: socialToken,
        otp: socialToken
    }

    if(!userData){
        // initiate the signup process ;
        // redirect to the passoword creation page 
        // then redirect him to the homepage
        console.log(userData,'userdata') ;
        const user = new User({
            email: profile.email,
            firstName: profile.given_name,
            lastName: profile.family_name,
            status: 'active',
            cat: (new Date().getTime() / 1000)

        }) ;
        await user.save() ;
        
        
        
        
        res.writeHead(302, {
            Location: 'http://localhost:3000/verify-otp'

        }) ;
        res.end() ;

    }
    else {
        res.writeHead(302, {
            Location: 'http://localhost:3000/homepage'
        });
        res.end();

    }

    // Code to handle user authentication and retrieval using the profile data

    

  } catch (error) {
    // console.error('Error:', error.response.data.error);
    next(error) ;
    res.redirect('http://localhost:3000/login');
  }
});

// Logout route
// router.get('/logout', (req, res) => {
//   // Code to handle user logout
//   res.redirect('/login');
// });

export {router as googleauthrouter}