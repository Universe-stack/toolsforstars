import express, {Request, Response} from 'express';
import Upvote from '../models/upvoteModel';
import IUpvote from '../models/upvoteModel';
import User, {IUser} from '../models/userModel';
import Tool, {ITool} from '../models/toolModel';



export const upvoteTool = async (req: Request, res: Response) => {
    try {
        const { toolId } = req.params;

        const tool = await Tool.findById(toolId);
        if (!tool) {
            return res.status(404).json({ message: 'Tool not found' });
        }

        // Check if upvotes is a valid number, if not set it to 0
        if (isNaN(tool.upvotes)) {
            tool.upvotes = 0;
        } else {
            tool.upvotes += 1;
        }
        // Save the updated tool
        await tool.save();

        res.status(200).json({ message: 'Tool upvoted successfully', tool });
    } catch (error) {
        console.error('Error upvoting tool:', error);
        res.status(500).json({ message: 'Server error' });
    }
};