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
exports.upvoteTool = void 0;
const toolModel_1 = __importDefault(require("../models/toolModel"));
const upvoteTool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { toolId } = req.params;
        const tool = yield toolModel_1.default.findById(toolId);
        if (!tool) {
            return res.status(404).json({ message: 'Tool not found' });
        }
        // Check if upvotes is a valid number, if not set it to 0
        if (isNaN(tool.upvotes)) {
            tool.upvotes = 0;
        }
        else {
            tool.upvotes += 1;
        }
        // Save the updated tool
        yield tool.save();
        res.status(200).json({ message: 'Tool upvoted successfully', tool });
    }
    catch (error) {
        console.error('Error upvoting tool:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.upvoteTool = upvoteTool;
