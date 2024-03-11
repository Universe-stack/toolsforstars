import express, {Request, Response} from 'express';
import User, {IUser} from '../models/userModel';
import bcrypt from 'bcryptjs';
import { Jwt } from 'jsonwebtoken';


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