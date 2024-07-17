// @ts-nocheck
import {Request, Response} from 'express';
import Tool from '../models/toolModel';



export const upvoteTool = async (req: Request, res: Response) => {
    try {
        const { toolId } = req.params;
        const userId:any = req.user?._id;

        const tool = await Tool.findById(toolId);
        if (!tool) {
            return res.status(404).json({ message: 'Tool not found' });
        }

        if (tool.upvotedBy.includes(userId)) {
            return res.status(400).json({ message: 'User has already upvoted this tool' });
        }
        // Check if upvotes is a valid number, if not set it to 0
        if (isNaN(tool.upvotes)) {
            tool.upvotes = 0;
        } else {
            tool.upvotes += 1;
            tool.upvotedBy.push(userId);
        }
        await tool.save();

        res.status(200).json({ message: 'Tool upvoted successfully', tool });
    } catch (error) {
        console.error('Error upvoting tool:', error);
        res.status(500).json({ message: error.message });
    }
};

// Route handler for removing an upvote from a tool
export const removeUpvote = async (req: Request, res: Response) => {
    try {
        const { toolId } = req.params;
        const userId:any = req.user?._id; // Use user.id after implementing auth

        const tool = await Tool.findById(toolId);
        if (!tool) {
            return res.status(404).json({ message: 'Tool not found' });
        }

        if (!tool.upvotedBy.includes(userId)) {
            return res.status(400).json({ message: 'User has not upvoted this tool' });
        }
    
        if (tool.upvotes > 0) {
            tool.upvotes -= 1;
        }

        tool.upvotedBy = tool.upvotedBy.filter((_id) => _id !== userId);
        await tool.save();            
        res.status(200).json({ message: 'Upvote removed successfully', tool });
        
    } catch (error) {
        console.error('Error removing upvote:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

//Route for getting total amount of upvotes
export const getTotalUpvotes = async(req:Request, res:Response)=> {
    try{
        const {toolId} = req.params;

        const tool = await Tool.findById(toolId);
        console.log(tool)
        if (!tool) {
            return res.status(404).json({ message: 'Tool not found' });
        }
        if ('upvotes' in tool) {
        res.status(200).json({ upvotes: tool.upvotes }); 
        }else {
            return res.status(500).json({message: 'Tool not found'})
        }    
    }catch(error){
        console.error('Error fetching upvotes count:',error);
        res.status(500).json({ message: 'Server error' });
    }
}


