import { Request, Response } from 'express';
import nodeMailer from 'nodemailer'
import Tool from '../models/toolModel';
import Report from '../models/reportModel';
import User from '../models/userModel';

const html = `
    <h1>Hello world</h1>
`

//https://www.youtube.com/watch?v=L46FwfVTRE0

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



export const handleReport = async (req:Request, res:Response) => {
    try {
        const reportId = req.params.reportId;
        const { action } = req.body;
        
        const report = await Report.findById(reportId);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        report.actionTaken = action;
        await report.save();

        if (action === 'remove') {
            // Update the tool's status to inactive or deleted
            const toolId = report.tool; // Assuming the tool ID is stored in the report
            const tool = await Tool.findById(toolId);
            if (tool) {
                tool.isActive = false; // Set the tool's status to inactive
                await tool.save();
                
            }
        }
        else if (action === 'contact_owner') {
            const toolId = report.tool; // Assuming the tool ID is stored in the report
            const tool = await Tool.findById(toolId);
            if (tool) {
                const ownerEmail = tool.publisherEmail; // Assuming you have the owner's email address
                // Send an email or notification to the owner
                // Example: sendEmail(ownerEmail, 'Tool Reported', 'Your tool has been reported. Please review.');
            }
        }
        else if (action === 'dismiss') {
            report.resolved = true; // Set the report's resolved status to true
            await report.save();
        }

        res.status(200).json({ message: 'Report handled successfully' });
    } catch (error) {
        console.error('Error handling report:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
