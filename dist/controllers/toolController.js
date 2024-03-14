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
exports.searchTools = exports.getToolDetails = exports.deleteTool = exports.getAllToolListings = exports.updateTool = exports.createNewTool = void 0;
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
//update tool
const updateTool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const toolId = req.params.toolId;
        const existingTool = yield toolModel_1.default.findById(toolId);
        if (!existingTool) {
            return res.status(404).json({ message: 'Tool not found' });
        }
        const { name, description, features, screenshots, pricing, categories, targetAudience } = req.body;
        existingTool.name = name !== undefined ? name : existingTool.name;
        existingTool.description = description !== undefined ? description : existingTool.description;
        existingTool.features = features !== undefined ? features : existingTool.features;
        existingTool.screenshots = screenshots !== undefined ? screenshots : existingTool.screenshots;
        existingTool.pricing = pricing !== undefined ? pricing : existingTool.pricing;
        existingTool.categories = categories !== undefined ? categories : existingTool.categories;
        existingTool.targetAudience = targetAudience !== undefined ? targetAudience : existingTool.targetAudience;
        existingTool.updatedAt = new Date();
        const updatedTool = yield existingTool.save();
        res.status(200).json({ message: 'Tool updated successfully', tool: updatedTool });
    }
    catch (error) {
        console.error('Error updating tool:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateTool = updateTool;
//get all tools
const getAllToolListings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tools = yield toolModel_1.default.find();
        res.status(200).json({ tools });
    }
    catch (error) {
        console.error('Error retrieving tool listings:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getAllToolListings = getAllToolListings;
//delete a tool
const deleteTool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const toolId = req.params.toolId;
        const existingTool = yield toolModel_1.default.findById(toolId);
        if (!existingTool) {
            return res.status(404).json({ message: 'Tool not found' });
        }
        yield toolModel_1.default.findByIdAndDelete(toolId);
        res.status(200).json({ message: 'Tool listing deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting tool listing:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteTool = deleteTool;
const getToolDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const toolId = req.params.toolId;
        const tool = yield toolModel_1.default.findById(toolId);
        if (!tool) {
            return res.status(404).json({ message: 'Tool not found' });
        }
        res.status(200).json({ tool });
    }
    catch (error) {
        console.error('Error fetching tool details:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getToolDetails = getToolDetails;
const searchTools = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Build search query
        const { query, filters } = req.query;
        let searchQuery = {};
        if (query) {
            searchQuery.$text = { $search: query.toString() };
        }
        // Apply filters if provided
        if (filters) {
            const parsedFilters = JSON.parse(filters);
            const filteredSearchQuery = Object.assign({}, searchQuery); // Clone to avoid mutation
            // Loop through parsed filters and add them to searchQuery with proper operators
            for (const [key, value] of Object.entries(parsedFilters)) {
                if (key === '_id') {
                    // Handle _id separately (e.g., validation or error handling)
                    continue; // Skip _id for now
                }
                filteredSearchQuery[key] = value; // Add other filter fields directly
            }
            searchQuery = filteredSearchQuery;
        }
        // Search for tools based on search query and filters
        const tools = yield toolModel_1.default.find(searchQuery);
        // Return the list of matching tools
        res.status(200).json({ tools });
    }
    catch (error) {
        console.error('Error searching tools:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.searchTools = searchTools;
