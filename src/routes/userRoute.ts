import express from 'express';
import {registerUser, getUserProfile, getAllUsers, updateUserProfile,deleteUser,changeUserRole,createUserProfile } from '../controllers/userController'


const userRouter = express.Router();


//Register a user
userRouter.post('/register', registerUser)

//create user profile
userRouter.post('/createprofile', createUserProfile)

//Get user profile
userRouter.get('/getprofile',getUserProfile)

//update user profile
userRouter.put('/updateprofile/:_id',updateUserProfile)

//Get all Users
userRouter.get('/all', getAllUsers)

//delete profile
userRouter.delete('/deleteprofile/:_id', deleteUser)

//update user role
userRouter.put('/:_id/role',changeUserRole)


export default userRouter;