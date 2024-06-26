// @ts-nocheck

import { Request, Response } from 'express';
import Tool from '../models/toolModel';
import Report from '../models/reportModel';
import User from '../models/userModel';
import { createTransport } from 'nodemailer'
import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";
dotenv.config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY);



const sendMailToPublisher = async (receiver: any, subject: string, text: any) => {
    const msg = {
        to: receiver,
        from: {
            name: "Create Camp",
            email:process.env.FROM_EMAIL
        }, 
        subject: 'Got a compaint on your tool',
        text: 'Please check it out',
        html: '<strong>Please check it out</strong>',
        };
    try {
    await sgMail.send(msg);
    console.log("Email has been sent")
    } catch (error) {
    console.error(error);

    if (error.response) {
        console.error(error.response.body)
    }
    }
};
//https://www.youtube.com/watch?v=L46FwfVTRE0

export const reportTool = async (req: Request, res: Response) => {
    
    const { toolId} = req.params;
    const userId = req.user?._id;
    const { reportcase} = req.body;

    try {
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
            console.log(toolId, 'reported tool')
            const tool = await Tool.findById(toolId);
            console.log(tool, 'reported tool')
            if (tool) {
                tool.isActive = false; // Set the tool's status to inactive
                await tool.save();
            }
        }
        else if (action === 'contact_owner') {
            const toolId = report.tool; // Assuming the tool ID is stored in the report
            const tool = await Tool.findById(toolId);
            await tool?.populate('publisherEmail');
            console.log(tool, 'tool')
            if (tool) {
                const ownerEmail = tool.publisherEmail.email;
                const reportcase = report.reportcase;
                sendMailToPublisher(ownerEmail, 'Your resource has been reported, please review!', reportcase);
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
