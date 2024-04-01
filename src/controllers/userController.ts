import express, {Request, Response, NextFunction} from 'express';
import User, {IUser} from '../models/userModel';
import  UserProfile, {IUserProfile} from '../models/userProfileModel';
import bcrypt from 'bcryptjs';
import Tool, {ITool} from '../models/toolModel';
import passport from 'passport';



declare global {
  namespace Express {
    interface Request {
      user?: User | undefined,
    }
  }
}


// Register User
export const registerUser = async (req:Request,res:Response )=> {
    try{
        const {username, password, name, role, email} = req.body;
        
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email, and password are required' });
        }
      
          
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }


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


export const loginUser = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', (err: Error | null, user: any, info: any) => {
      if (err) { return next(err); }
      if (!user) { return res.status(401).json({ message: 'Invalid email or password' }); }
  
      // Based on the user's role, redirect to the appropriate dashboard
      if (user.role === 'publisher') {
        req.logIn(user, (err) => {
          if (err) { return next(err); }
          return res.redirect('/');
        });
      } else if (user.role === 'superuser') {
        req.logIn(user, (err) => {
          if (err) { return next(err); }
          return res.redirect('/');
        });
      } else {
        // Handle other roles or default redirect
        req.logIn(user, (err) => {
          if (err) { return next(err); }
          return res.redirect('/');
        });
      }
    })(req, res, next);
  };

//Create user profile
export const createUserProfile = async (req: Request, res: Response) => {
    try {
        const { username, email, name, role, picture } = req.body;

        // Check if the username and email are unique
        const existingUser = await UserProfile.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        const newUserProfile:IUserProfile = new UserProfile({
            username,
            email,
            name,
            role,
            picture
        });

        const savedUserProfile = await newUserProfile.save();

        res.status(201).json({ message: 'User profile created successfully', userProfile: savedUserProfile });
    } catch (error) {
        console.error('Error creating user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};



//get user profile
export const getUserProfile = async (req: Request, res: Response) => {
    try {
      //const user = await User.findById(req.user._id).select('-password');
      const user = await UserProfile.findById((req.user as { _id: string })._id).select('-password');
  
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
       
        const existingUser = await UserProfile.findById(req.params._id);

        if(!existingUser) {
            return res.status(404).json({message: "user not found"})
        }

        const updatedUser = await UserProfile.findByIdAndUpdate(
            req.params._id,
            {...existingUser.toObject(), ...req.body},
            {new:true}
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

        const user = req.user as IUser;
        const userId = user?._id;
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

//user role management
export const changeUserRole = async(req:Request,res:Response) => {
 try{
    const userId = req.params._id;
    const newRole = req.body.role;

    const updatedUser = await User.findByIdAndUpdate(userId, {role:newRole}, {new:true});
    if (!updatedUser) {
        return res.status(404).json({message:'User not found'})
    }

    res.status(200).json({message:"User role updated"})
 }catch(error) {
    console.error('Eror updating user role',error);
    res.status(500).json({message: 'Server error'})
 }
}