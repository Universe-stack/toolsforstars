"use strict";
// @ts-nocheck
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleReport = exports.viewReports = exports.reportTool = void 0;
const toolModel_1 = __importDefault(require("../models/toolModel"));
const reportModel_1 = __importDefault(require("../models/reportModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const dotenv_1 = __importDefault(require("dotenv"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
dotenv_1.default.config();
mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
const sendMailToPublisher = (receiver, subject, text) => __awaiter(void 0, void 0, void 0, function* () {
    const msg = {
        to: receiver,
        from: {
            name: "Create Camp",
            email: process.env.FROM_EMAIL
        },
        subject: 'Got a compaint on your tool',
        text: 'Please check it out',
        html: '<strong>Please check it out</strong>',
    };
    try {
        yield mail_1.default.send(msg);
        console.log("Email has been sent");
    }
    catch (error) {
        console.error(error);
        if (error.response) {
            console.error(error.response.body);
        }
    }
});
//https://www.youtube.com/watch?v=L46FwfVTRE0
const reportTool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { toolId } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const { reportcase } = req.body;
    try {
        // Check if the tool exists
        const tool = yield toolModel_1.default.findById(toolId);
        const user = yield userModel_1.default.findById(userId);
        if (!tool) {
            return res.status(404).json({ message: 'Tool not found' });
        }
        const newReport = new reportModel_1.default({
            tool,
            reportcase,
            user
        });
        const reportedTool = yield newReport.save();
        res.status(200).json({ message: 'Tool reported successfully', tool: reportedTool });
    }
    catch (error) {
        console.error('Error reporting tool:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.reportTool = reportTool;
const viewReports = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reports = yield reportModel_1.default.find().populate('tool').populate('user');
        res.status(200).json({ reports });
    }
    catch (error) {
        console.error('Error fetching reported tools:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.viewReports = viewReports;
const handleReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reportId = req.params.reportId;
        const { action } = req.body;
        const report = yield reportModel_1.default.findById(reportId);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        report.actionTaken = action;
        yield report.save();
        if (action === 'remove') {
            // Update the tool's status to inactive or deleted
            const toolId = report.tool; // Assuming the tool ID is stored in the report
            console.log(toolId, 'reported tool');
            const tool = yield toolModel_1.default.findById(toolId);
            console.log(tool, 'reported tool');
            if (tool) {
                tool.isActive = false; // Set the tool's status to inactive
                yield tool.save();
            }
        }
        else if (action === 'contact_owner') {
            const toolId = report.tool; // Assuming the tool ID is stored in the report
            const tool = yield toolModel_1.default.findById(toolId);
            yield (tool === null || tool === void 0 ? void 0 : tool.populate('publisherEmail'));
            console.log(tool, 'tool');
            if (tool) {
                const ownerEmail = tool.publisherEmail.email;
                const reportcase = report.reportcase;
                sendMailToPublisher(ownerEmail, 'Your resource has been reported, please review!', reportcase);
            }
        }
        else if (action === 'dismiss') {
            report.resolved = true; // Set the report's resolved status to true
            yield report.save();
        }
        res.status(200).json({ message: 'Report handled successfully' });
    }
    catch (error) {
        console.error('Error handling report:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.handleReport = handleReport;
