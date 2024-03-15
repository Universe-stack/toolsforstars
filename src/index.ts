import express, {Express , Request, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from './utils/config'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRoute';
import toolRouter from './routes/toolRoute';
import upvoteRouter from './routes/upvoteRoute';



dotenv.config()


const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
//https://medium.com/@chiragmehta900/how-to-connect-mongodb-atlas-with-node-js-typescript-123eeadd3d5c
mongoose
  .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
      console.log(`Running on ENV = ${process.env.NODE_ENV}`);
      console.log('Connected to mongoDB.');
    })
    .catch((error) => {
      console.log('Unable to connect.');
      console.log(error);
});


//Middlewares
app.use(cookieParser());
app.use(express.json());



//routes
app.get('/', (req,res)=>{
  res.send('Welcome to Stars center!')
})

app.use("/users", userRouter);
app.use("/tools", toolRouter);
app.use("upvotes",upvoteRouter)


// Middleware
app.use(express.json());


// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
