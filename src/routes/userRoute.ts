import express from 'express';
import {registerUser,loginUser,logout,getUserProfile, getAllUsers, updateUserProfile,deleteUser,changeUserRole,createUserProfile } from '../controllers/userController'
import {verifyAdmin, verifyUser, verifySuperAdmin} from '../middlewares/authMiddleware';
import { body, param} from 'express-validator';
import "../auth/passportJwtConfig"

const userRouter = express.Router();



//Register a user
userRouter.post('/register',[
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
  ], registerUser)

//Login user
userRouter.post('/login',[
    body('username').notEmpty(),
    body('password').notEmpty(),
  ],loginUser)

//logout
userRouter.post('/logout', logout)

//create user profile
userRouter.post('/createprofile',[
    body('password').notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('name').notEmpty().isString().trim(),
    body('age').optional().isDate()
  ],verifyUser,createUserProfile)

//Get user profile
userRouter.get('/getprofile',verifyUser,getUserProfile)

//update user profile
userRouter.put('/updateprofile/:_id',[
    param('_id').notEmpty().isMongoId(),
    body('name').notEmpty().isString().trim(),
    body('age').optional().isDate(),
  ],verifyUser,verifyAdmin,updateUserProfile)
 
//Get all Users
userRouter.get('/all',verifyUser,verifySuperAdmin, getAllUsers)

//delete profile
userRouter.delete('/deleteprofile',verifyUser, verifyAdmin, deleteUser)

//update user role
userRouter.put('/:_id/role',verifyUser,verifySuperAdmin,changeUserRole)


export default userRouter;
