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
exports.getTotalUpvotes = exports.removeUpvote = exports.upvoteTool = void 0;
const toolModel_1 = __importDefault(require("../models/toolModel"));
const upvoteTool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { toolId } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const tool = yield toolModel_1.default.findById(toolId);
        if (!tool) {
            return res.status(404).json({ message: 'Tool not found' });
        }
        if (tool.upvotedBy.includes(userId)) {
            return res.status(400).json({ message: 'User has already upvoted this tool' });
        }
        // Check if upvotes is a valid number, if not set it to 0
        if (isNaN(tool.upvotes)) {
            tool.upvotes = 0;
        }
        else {
            tool.upvotes += 1;
            tool.upvotedBy.push(userId);
        }
        yield tool.save();
        res.status(200).json({ message: 'Tool upvoted successfully', tool });
    }
    catch (error) {
        console.error('Error upvoting tool:', error);
        res.status(500).json({ message: error.message });
    }
});
exports.upvoteTool = upvoteTool;
// Route handler for removing an upvote from a tool
const removeUpvote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { toolId } = req.params;
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id; // Use user.id after implementing auth
        const tool = yield toolModel_1.default.findById(toolId);
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
        yield tool.save();
        res.status(200).json({ message: 'Upvote removed successfully', tool });
    }
    catch (error) {
        console.error('Error removing upvote:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.removeUpvote = removeUpvote;
//Route for getting total amount of upvotes
const getTotalUpvotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { toolId } = req.params;
        const tool = yield toolModel_1.default.findById(toolId);
        console.log(tool);
        if (!tool) {
            return res.status(404).json({ message: 'Tool not found' });
        }
        if ('upvotes' in tool) {
            res.status(200).json({ upvotes: tool.upvotes });
        }
        else {
            return res.status(500).json({ message: 'Tool not found' });
        }
    }
    catch (error) {
        console.error('Error fetching upvotes count:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getTotalUpvotes = getTotalUpvotes;
