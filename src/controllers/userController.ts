import express, {Request, Response} from 'express';
import User, {IUser} from '../models/userModel';
import bcrypt from 'bcryptjs';
import { Jwt } from 'jsonwebtoken';
import Tool, {ITool} from '../models/toolModel';


declare global {
  namespace Express {
    interface Request {
      user?: any,
    }
  }
}


// Register User
export const registerUser = async (req:Request,res:Response )=> {
    try{
        const {username, password, name, role, email} = req.body;
        
        const isUserExisting = await User.findOne({username});
        if(isUserExisting){
            return res.status(404).json({message: "Username is already taken"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser:IUser = new User({
            username,
            password:hashedPassword,
            name,
            role,
            email
        })

        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
    } catch(error){
        res.status(500).json({message: 'Server error'})
        console.log(error)
    }
}


//get user profile
export const getUserProfile = async (req: Request, res: Response) => {
    try {
      //const user = await User.findById(req.user._id).select('-password');
      const user = await User.findById((req.user as { _id: string })._id).select('-password');
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
};

export const updateUserProfile = async(req:Request, res:Response)=> {
    try{
       
       const {username, email, name} = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {username, email, name},
            {new: true}
        )
    
        res.status(200).json({message: 'User profile updated successfully', user: updatedUser})

    }catch(error:any){
        console.log('Error updating user profile', error.message)
        res.status(500).json({message:`server error`})
    }
}

//get all users
export const getAllUsers = async (req:Request, res:Response)=> {
    try{
        const users = await User.find({})
        if (!users) {
            return res.status(404).json({message: "No users at the momemt"})
        }
        res.status(200).json(users)
    }catch(error:any){
        res.status(500).json({message: `server error`})
    }
}

//delete user
export const deleteUser = async (req:Request, res:Response) => {
    try{
        console.log("deleting")
        const userId = req.user._id;
        const deletedUser = await User.findByIdAndDelete(userId);
        await Tool.deleteMany({userId})

        if (!deletedUser) {
            return res.status(404).json({ message:"user not deleted"});
        }
        res.status(202).json({message:"user deleted"})
    } catch(error){
        res.status(500).json({ message: 'Server error' });
    }
}

//user 