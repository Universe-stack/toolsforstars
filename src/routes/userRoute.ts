import express from 'express';
import {registerUser, getUserProfile, getAllUsers, updateUserProfile,deleteUser,changeUserRole } from '../controllers/userController'


const userRouter = express.Router();


//Register a user
userRouter.post('/register', registerUser)

//Get user profile
userRouter.get('/profile',getUserProfile)

//update user profile
userRouter.put('/updateprofile',updateUserProfile)

//Get all Users
userRouter.get('/all', getAllUsers)

//delete profile
userRouter.delete('/deleteprofile/:_id', deleteUser)

//update user role
userRouter.put(':/_id/role',changeUserRole)


export default userRouter;