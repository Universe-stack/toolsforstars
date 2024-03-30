import express from 'express';
import {registerUser,loginUser, getUserProfile, getAllUsers, updateUserProfile,deleteUser,changeUserRole,createUserProfile } from '../controllers/userController'
import passport, { authenticate } from 'passport';
import { isAuthenticated, isPublisher, isSuperuser } from '../middlewares/authMiddleware';


const userRouter = express.Router();


//Register a user
userRouter.post('/register', registerUser)

//Login user
userRouter.post('/login', loginUser)

//create user profile
userRouter.post('/createprofile',isAuthenticated, createUserProfile)

//Get user profile
userRouter.get('/getprofile',isAuthenticated, getUserProfile)

//update user profile
userRouter.put('/updateprofile/:_id',isAuthenticated,updateUserProfile)

//Get all Users
userRouter.get('/all',isAuthenticated, isSuperuser, getAllUsers)

//delete profile
userRouter.delete('/deleteprofile/:_id',isAuthenticated, isSuperuser, deleteUser)

//update user role
userRouter.put('/:_id/role',isAuthenticated,isSuperuser,changeUserRole)


export default userRouter;