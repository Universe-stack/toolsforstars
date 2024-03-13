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
exports.createNewTool = void 0;
const toolModel_1 = __importDefault(require("../models/toolModel"));
const createNewTool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, features, screenshots, pricing, categories, targetAudience } = req.body;
        const productLister = req.params.userId;
        const newTool = new toolModel_1.default({
            name,
            description,
            features,
            screenshots,
            pricing,
            categories,
            targetAudience,
            productLister: productLister
        });
        const savedTool = yield newTool.save();
        res.status(201).json({ message: 'Tool listing created successfully', tool: savedTool });
    }
    catch (error) {
        console.error('Error creating tool listing:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.createNewTool = createNewTool;
