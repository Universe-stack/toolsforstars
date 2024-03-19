import { Request, Response } from 'express';
import Tool from '../models/toolModel';
import Report from '../models/reportModel';
import User from '../models/userModel';

export const reportTool = async (req: Request, res: Response) => {
    try {
        const { toolId, userId} = req.params;
        const { reportcase} = req.body;

        // Check if the tool exists
        const tool = await Tool.findById(toolId);
        const user = await User.findById(userId);

        if (!tool) {
            return res.status(404).json({ message: 'Tool not found' });
        }
        
        const newReport = new Report({
            tool,
            reportcase,
            user
        });

        const reportedTool = await newReport.save();

        res.status(200).json({ message: 'Tool reported successfully', tool: reportedTool  });
    } catch (error) {
        console.error('Error reporting tool:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const viewReports = async (req: Request, res: Response) => {
    try {
        const reports = await Report.find().populate('tool').populate('user');
        res.status(200).json({ reports });
    } catch (error) {
        console.error('Error fetching reported tools:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


