//@ts-nocheck
import express from 'express'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/userModel'; // Import your user model
import { PassportStatic } from 'passport'; // Import PassportStatic type
import dotenv from "dotenv";

dotenv.config();


const passportJwtConfig = (passport: PassportStatic) => {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_KEY
  };

  passport.use(
    new JwtStrategy(opts, async (jwt_payload:any, done:any) => {
      console.log(jwt_payload, "JWT PAYLOAD")
      try {
        const user = await User.findOne({
          _id: jwt_payload._id,
        }).exec();
        console.log(user, 'user of course')

        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (error) {
        return done(error, false);
      }
    })
  );
};

export default passportJwtConfig;