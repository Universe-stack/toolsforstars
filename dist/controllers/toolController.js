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
exports.getpublisher = exports.searchTools = exports.getToolDetails = exports.deleteTool = exports.getCourses = exports.getapps = exports.getSaasTools = exports.getAllToolListings = exports.updateTool = exports.createNewTool = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const toolModel_1 = __importDefault(require("../models/toolModel"));
const createNewTool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, description, features, screenshots, pricing, categories, targetAudience, productType, aiEnabled } = req.body;
        const publisher = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        console.log(publisher, 'publisher');
        const newTool = new toolModel_1.default({
            name,
            description,
            features,
            screenshots,
            pricing,
            categories,
            aiEnabled,
            productType,
            targetAudience,
            publisher: publisher,
            publisherEmail: publisher
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
    var _b;
    const toolId = req.params.toolId;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id;
    try {
        const existingTool = yield toolModel_1.default.findById(toolId);
        console.log(existingTool, 'existing Tool');
        if (!existingTool) {
            return res.status(404).json({ message: 'Tool not found' });
        }
        if (!existingTool.publisher.equals(userId)) {
            return res.status(403).json({ message: 'You do not have permission to update this tool' });
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
        const tools = yield toolModel_1.default.find({ isActive: { $ne: false } }).populate('reviews');
        res.status(200).json({ tools });
    }
    catch (error) {
        console.error('Error retrieving tool listings:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getAllToolListings = getAllToolListings;
// export const getSaasTools = async (req: Request, res: Response) => {
//     try {
//         const saasTools = await Tool.find({ productType: { $in: ['saas', 'Saas'] } });
//         res.status(200).json(saasTools);
//     } catch (error) {
//         console.error('Error retrieving Saas tools:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };
const getSaasTools = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = req.query.page ? parseInt(req.query.page, 20) : 1, limit = 10, sortBy, sortOrder, category } = req.query;
        let query = yield toolModel_1.default.find({ productType: { $in: ['saas', 'Saas'] } });
        // Apply filtering
        if (category) {
            query = query.where('category').equals(category);
        }
        // Apply sorting
        // let sortCriteria;
        // if (sortBy) {
        //     sortCriteria[sortBy] = sortOrder === 'desc' ? -1 : 1;
        //     query = query.sort(sortCriteria);
        // }
        // switch (sortBy) {
        //     case 'AI':
        //         sortCriteria = { aiEnabled: sortOrder === 'desc' ? -1 : 1 };
        //         break;
        //     case 'pricesHigh':
        //         sortCriteria = { price: -1 }; 
        //         break;
        //     case 'pricesLow':
        //         sortCriteria = { price: 1 }; 
        //         break;
        //     case 'recentlyAdded':
        //         sortCriteria = { createdAt: -1 };
        //         break;
        //     case 'bestReviews':
        //         sortCriteria = { averageReviewScore: -1 }; 
        //         break;
        //     case 'bestUpvotes':
        //         sortCriteria = { totalUpvotes: -1 };
        //         break;
        //     default:
        //         sortCriteria = { _id: 1 }
        // }
        // if (Object.keys(sortCriteria) {
        //     query = query.sort(sortCriteria);
        // }
        // Apply pagination
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = yield toolModel_1.default.countDocuments();
        query = query.skip(startIndex).limit(limit);
        const tools = yield query.exec();
        // Pagination metadata
        const pagination = {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total
        };
        res.status(200).json({ tools, pagination });
    }
    catch (error) {
        console.error('Error fetching tools:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getSaasTools = getSaasTools;
const getapps = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appTools = yield toolModel_1.default.find({ productType: { $in: ['apps', 'Apps'] } });
        res.status(200).json(appTools);
    }
    catch (error) {
        console.error('Error retrieving app tools:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getapps = getapps;
const getCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield toolModel_1.default.find({ productType: { $in: ['courses', 'Courses'] } });
        res.status(200).json(courses);
    }
    catch (error) {
        console.error('Error retrieving Courses:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getCourses = getCourses;
//delete a tool
const deleteTool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c._id;
    const toolId = req.params.toolId;
    try {
        const existingTool = yield toolModel_1.default.findById(toolId);
        if (!existingTool) {
            return res.status(404).json({ message: 'Tool not found' });
        }
        if (!existingTool.publisher.equals(userId)) {
            return res.status(403).json({ message: 'You do not have permission to update this tool' });
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
        if (!(tool === null || tool === void 0 ? void 0 : tool.isActive)) {
            res.status(500).json({ message: "This resource is currently under review" });
        }
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
//For this, you'd have to create a search index on the field you wish to search, to be done in mongo db atlas
const searchTools = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Build search query
        const { name, pricing } = req.query;
        let searchQuery = {};
        if (name) {
            searchQuery.name = name.toString();
        }
        if (pricing) {
            searchQuery.pricing = parseInt(pricing.toString()); // Convert the 'pricing' parameter to a number and add it to the search query
        }
        console.log(searchQuery, "Search query");
        const tools = yield toolModel_1.default.find(searchQuery);
        console.log(tools);
        // Return the list of matching tools
        res.status(200).json({ tools });
    }
    catch (error) {
        console.error('Error searching tools:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.searchTools = searchTools;
//get Publisher Info
const getpublisher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const toolId = req.params.toolId;
        const tool = yield toolModel_1.default.findById(toolId);
        if (!tool) {
            return res.status(404).json({ message: 'Tool not found' });
        }
        const publisher = yield userModel_1.default.findById(tool.publisher);
        if (!publisher) {
            return res.status(404).json({ message: 'Product lister not found' });
        }
        res.status(200).json({ publisher });
    }
    catch (error) {
        console.error('Error fetching product lister:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getpublisher = getpublisher;
