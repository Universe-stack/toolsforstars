import express from 'express';
import {registerUser,loginUser,logout,getUserProfile, getAllUsers, updateUserProfile,deleteUser,changeUserRole,createUserProfile } from '../controllers/userController'
import {verifyAdmin, verifyUser, verifySuperAdmin} from '../middlewares/authMiddleware';
import "../auth/passportJwtConfig"

const userRouter = express.Router();



//Register a user
userRouter.post('/register', registerUser)

//Login user
userRouter.post('/login',loginUser)

//logout
userRouter.post('/logout', logout)

//create user profile
userRouter.post('/createprofile',verifyUser,createUserProfile)

//Get user profile
userRouter.get('/getprofile',verifyUser,getUserProfile)

//update user profile
userRouter.put('/updateprofile/:_id',verifyUser,verifyAdmin,updateUserProfile)
 
//Get all Users
userRouter.get('/all',verifyUser,verifySuperAdmin, getAllUsers)

//delete profile
userRouter.delete('/deleteprofile/:_id',verifyUser, verifyAdmin, deleteUser)

//update user role
userRouter.put('/:_id/role',verifyUser,verifySuperAdmin,changeUserRole)


export default userRouter;
