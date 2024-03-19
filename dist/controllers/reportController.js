"use strict";
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
exports.viewReports = exports.reportTool = void 0;
const toolModel_1 = __importDefault(require("../models/toolModel"));
const reportModel_1 = __importDefault(require("../models/reportModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const reportTool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { toolId, userId } = req.params;
        const { reportcase } = req.body;
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
