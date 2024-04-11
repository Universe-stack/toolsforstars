import express from 'express';
import mongoose from 'mongoose';
import config from './utils/config'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import './auth/passportJwtConfig'
import userRouter from './routes/userRoute';
import toolRouter from './routes/toolRoute';
import reportRouter from './routes/reportRoute';
import adRouter from './routes/adRoute';
import cors from 'cors';
import helmet from 'helmet';
import "./auth/passportJwtConfig"

dotenv.config()


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(helmet());

app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "font-src": ["'self'", "external-website.com"],
      // allowing styles from any website
      "style-src": null,
    },
  })
)

app.use(
  helmet.referrerPolicy({
    policy: "no-referrer",
  })
)

app.use(
  helmet({
    noSniff: false,
  })
)

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
//app.use("/upvotes",upvoteRouter);
app.use("/reports",reportRouter)
app.use("/ads",adRouter);


// Middleware
app.use(express.json());


// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
