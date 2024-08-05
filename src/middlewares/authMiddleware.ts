//@ts-nocheck
import { Request, Response} from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import jwt from 'jsonwebtoken';
import User from '../models/userModel'; // Import your user model
import dotenv from 'dotenv';
dotenv.config(); 
import passportJwtConfig from '../auth/passportJwtConfig';
passportJwtConfig(passport);

// Configure passport with the local strategy
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Function to generate a JWT token
export const generateAuthToken = (user) => {
  // Create a payload with only the necessary user data
  const payload = {
    _id: user._id, // Assuming _id is the user's unique identifier
    username: user.username, // Add other relevant user properties
    // ... add other user-related data here
  };
  // Sign the JWT token with the payload
  return jwt.sign(payload, process.env.JWT_KEY, { expiresIn: 3600 });
}

// Middleware function to verify an ordinary user with a JWT
export const verifyUser = passport.authenticate('jwt', { session: false });



// Middleware function to verify an admin user with a JWT
export const verifyAdmin = (req:Request, res:Response, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    console.log(user, "user");
    if (err) {
      return next(err);
    }
    if (user.role !== "publisher" && user.role !== "superuser") {
      const error = new Error('You are not authorized to perform this operation!');
      return next(error);
    }
    req.user = user;
    next();
  })(req, res, next);
};


export const verifySuperAdmin = (req:Request, res:Response, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (user.role !== "superuser") {
      const error = new Error('You are not authorized to perform this operation!');
      return next(error);
    }  
    req.user = user;
    next();
  })(req, res, next);
};