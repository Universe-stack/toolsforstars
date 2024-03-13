import express, {Request, Response} from 'express';
import User, {IUser} from '../models/userModel';
import Tool, {ITool} from '../models/toolModel';

export const createNewTool = async (req: Request, res: Response) => {
    try {
        const { name, description, features, screenshots, pricing, categories, targetAudience } = req.body;
        const productLister = req.params.userId;

        const newTool = new Tool({
            name,
            description,
            features,
            screenshots,
            pricing,
            categories,
            targetAudience,
            productLister:productLister
        });

        const savedTool = await newTool.save();

        res.status(201).json({ message: 'Tool listing created successfully', tool: savedTool });
    } catch (error) {
        console.error('Error creating tool listing:', error);
        res.status(500).json({ message: 'Server error' });
    }
};