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
exports.getpublisher = exports.searchTools = exports.getToolDetails = exports.deleteTool = exports.filterCourses = exports.getCourses = exports.filterApps = exports.getapps = exports.filterSaasTools = exports.getSaasTools = exports.getAllToolListings = exports.updateTool = exports.createNewTool = exports.searchToolsWithAlgolia = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const toolModel_1 = __importDefault(require("../models/toolModel"));
const imageUpload_1 = __importDefault(require("../helper/imageUpload"));
const algoliasearch_1 = __importDefault(require("algoliasearch"));
const client = (0, algoliasearch_1.default)(process.env.ANGOLIA_APPLICATION_ID, process.env.ANGOLIA_ADMIN_APIKEY);
const index = client.initIndex('Createcamp');
const searchToolsWithAlgolia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query } = req.query;
        const results = yield index.search(query, {
            hitsPerPage: 10,
        });
        res.status(200).json({ tools: results.hits });
    }
    catch (error) {
        console.error('Error searching tools with Algolia:', error);
        res.status(500).json({ message: error });
    }
});
exports.searchToolsWithAlgolia = searchToolsWithAlgolia;
const createNewTool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const publisher = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!req.files || (!req.files.screenshots && !req.files.logo)) {
            return res.status(400).json({ message: 'No files uploaded' });
        }
        const uploadedImages = [];
        let logoUrl = '';
        if (req.files.logo) {
            try {
                const result = yield imageUpload_1.default.uploader.upload(req.files.logo[0].path, {
                    public_id: `${publisher}_tool_logo_${req.files.logo[0].originalname}`,
                    width: 500,
                    height: 500,
                    crop: 'fill'
                });
                logoUrl = result.secure_url;
            }
            catch (err) {
                console.error('Error uploading logo to Cloudinary:', err);
                return res.status(500).json({ message: err });
            }
        }
        if (req.files.screenshots) {
            for (const file of req.files.screenshots) {
                try {
                    const result = yield imageUpload_1.default.uploader.upload(file.path, {
                        public_id: `${publisher}_tool_screenshot_${file.originalname}`,
                        width: 500,
                        height: 500,
                        crop: 'fill'
                    });
                    uploadedImages.push(result.secure_url);
                }
                catch (err) {
                    console.error('Error uploading screenshot to Cloudinary:', err);
                    return res.status(500).json({ message: 'Error uploading screenshots' });
                }
            }
        }
        const toolData = {
            name: req.body.name,
            description: req.body.description,
            features: req.body.features ? JSON.parse(req.body.features) : [],
            pricing: req.body.pricing,
            productType: req.body.productType,
            categories: req.body.categories ? req.body.categories.split(',') : [],
            productLink: req.body.productLink,
            youtubeLink: req.body.youtubeLink,
            targetAudience: req.body.targetAudience ? req.body.targetAudience.split(',') : [],
            aiEnabled: req.body.aiEnabled === 'true',
            isActive: req.body.isActive === 'true',
            publisher: req.user._id,
            screenshots: uploadedImages,
            logo: logoUrl
        };
        const newTool = new toolModel_1.default(toolData);
        yield newTool.save();
        yield index.saveObject({
            objectID: newTool._id,
            name: newTool.name,
            description: newTool.description,
            categories: newTool.categories,
            pricing: newTool.pricing,
            productType: newTool.productType
        });
        res.status(201).json(newTool);
    }
    catch (error) {
        console.error('Error creating tool:', error);
        res.status(500).json({ message: `Internal server error,  ${error}` });
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
        const { name, description, features, screenshots, pricing, categories, targetAudience, productLink, youtubeLink, logo } = req.body;
        existingTool.name = name !== undefined ? name : existingTool.name;
        existingTool.description = description !== undefined ? description : existingTool.description;
        existingTool.features = features !== undefined ? features : existingTool.features;
        existingTool.screenshots = screenshots !== undefined ? screenshots : existingTool.screenshots;
        existingTool.logo = logo !== undefined ? logo : existingTool.logo;
        existingTool.pricing = pricing !== undefined ? pricing : existingTool.pricing;
        existingTool.categories = categories !== undefined ? categories : existingTool.categories;
        existingTool.productLink = productLink !== undefined ? productLink : existingTool.productLink;
        existingTool.targetAudience = targetAudience !== undefined ? targetAudience : existingTool.targetAudience;
        existingTool.youtubeLink = youtubeLink !== undefined ? youtubeLink : existingTool.youtubeLink;
        existingTool.updatedAt = new Date();
        const updatedTool = yield existingTool.save();
        yield index.saveObject({
            objectID: updatedTool._id,
            name: updatedTool.name,
            description: updatedTool.description,
            categories: updatedTool.categories,
            pricing: updatedTool.pricing,
        });
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
const getSaasTools = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 20 } = req.query;
        const parsedPage = parseInt(page, 20);
        const parsedLimit = parseInt(limit, 20);
        const startIndex = (parsedPage - 1) * parsedLimit;
        let saasToolsQuery = toolModel_1.default.find({ productType: { $in: ['saas', 'Saas'] } });
        const total = yield toolModel_1.default.countDocuments({ productType: { $in: ['saas', 'Saas'] } });
        saasToolsQuery = saasToolsQuery.skip(startIndex).limit(parsedLimit);
        const tools = yield saasToolsQuery.exec();
        const pagination = {
            currentPage: parsedPage,
            totalPages: Math.ceil(total / parsedLimit),
            totalItems: total
        };
        res.status(200).json({ tools, pagination });
    }
    catch (error) {
        console.error('Error retrieving Saas tools:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getSaasTools = getSaasTools;
const filterSaasTools = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Destructure query parameters with default values
        const { page = 1, limit = 20, sortBy, sortOrder = 'asc', category } = req.query;
        // Convert page and limit to integers
        const pageInt = parseInt(page, 10);
        const limitInt = parseInt(limit, 10);
        // Build query conditions dynamically
        const filterConditions = {
            productType: { $in: ['saas', 'Saas'] },
        };
        if (category) {
            filterConditions.categories = category;
        }
        // Sorting options mapping
        const sortOptions = {
            AI: { aiEnabled: sortOrder === 'desc' ? -1 : 1 },
            pricesHigh: { pricing: -1 },
            pricesLow: { pricing: 1 },
            recentlyAdded: { createdAt: -1 },
            bestReviews: { averageReviewScore: -1 },
            bestUpvotes: { totalUpvotes: -1 }
        };
        // Default to sorting by creation date if `sortBy` is not provided
        const sort = sortOptions[sortBy] || { createdAt: -1 };
        // Using aggregation to count and fetch in one query
        const tools = yield toolModel_1.default.aggregate([
            { $match: filterConditions },
            { $sort: sort },
            { $skip: (pageInt - 1) * limitInt },
            { $limit: limitInt }
        ]);
        // Get the total number of items
        const total = yield toolModel_1.default.countDocuments(filterConditions);
        // Calculate pagination
        const pagination = {
            currentPage: pageInt,
            totalPages: Math.ceil(total / limitInt),
            totalItems: total
        };
        res.status(200).json({ tools, pagination });
    }
    catch (error) {
        console.error('Error fetching tools:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.filterSaasTools = filterSaasTools;
const getapps = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = req.query.page ? parseInt(req.query.page, 20) : 1, limit = 10 } = req.query;
        const startIndex = (page - 1) * limit;
        let appsToolsQuery = toolModel_1.default.find({ productType: { $in: ['app', 'app'] } });
        const total = yield toolModel_1.default.countDocuments({ productType: { $in: ['app', 'App'] } });
        appsToolsQuery = appsToolsQuery.skip(startIndex).limit(limit);
        const tools = yield appsToolsQuery.exec();
        // Pagination metadata
        const pagination = {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total
        };
        res.status(200).json({ tools, pagination });
    }
    catch (error) {
        console.error('Error retrieving Saas tools:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getapps = getapps;
const filterApps = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = req.query.page ? parseInt(req.query.page, 10) : 1, limit = req.query.limit ? parseInt(req.query.limit, 10) : 10, sortBy, sortOrder = 'asc', category } = req.query;
        let query = toolModel_1.default.find({
            productType: { $in: ['app', 'App'] },
            categories: category ? category : { $exists: true }
        });
        if (sortBy) {
            switch (sortBy) {
                case 'AI':
                    query = query.sort({ aiEnabled: sortOrder === 'desc' ? -1 : 1 });
                    break;
                case 'pricesHigh':
                    query = query.sort({ pricing: -1 });
                    break;
                case 'pricesLow':
                    query = query.sort({ pricing: 1 });
                    break;
                case 'recentlyAdded':
                    query = query.sort({ createdAt: -1 });
                    break;
                case 'bestReviews':
                    query = query.sort({ averageReviewScore: -1 });
                    break;
                case 'bestUpvotes':
                    query = query.sort({ totalUpvotes: -1 });
                    break;
                default:
                    break;
            }
        }
        const startIndex = (page - 1) * limit;
        const total = yield toolModel_1.default.countDocuments({
            productType: { $in: ['app', 'App'] },
            categories: category ? category : { $exists: true }
        });
        query = query.skip(startIndex).limit(limit);
        const tools = yield query.exec();
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
exports.filterApps = filterApps;
const getCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = req.query.page ? parseInt(req.query.page, 20) : 1, limit = 10 } = req.query;
        const startIndex = (page - 1) * limit;
        let coursesQuery = toolModel_1.default.find({ productType: { $in: ['course', 'Course'] } });
        const total = yield toolModel_1.default.countDocuments({ productType: { $in: ['course', 'Course'] } });
        coursesQuery = coursesQuery.skip(startIndex).limit(limit);
        const courses = yield coursesQuery.exec();
        // Pagination metadata
        const pagination = {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total
        };
        res.status(200).json({ courses, pagination });
    }
    catch (error) {
        console.error('Error retrieving Saas tools:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getCourses = getCourses;
const filterCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = req.query.page ? parseInt(req.query.page, 20) : 1, limit = 10, sortBy, sortOrder, category } = req.query;
        let query = toolModel_1.default.find({
            productType: { $in: ['course', 'Course'] },
            categories: category ? category : { $exists: true } // Filter by category if provided
        });
        if (sortBy) {
            switch (sortBy) {
                case 'AI':
                    query = query.sort({ aiEnabled: sortOrder === 'desc' ? -1 : 1 });
                    break;
                case 'pricesHigh':
                    query = query.sort({ pricing: -1 });
                    break;
                case 'pricesLow':
                    query = query.sort({ pricing: 1 });
                    break;
                case 'recentlyAdded':
                    query = query.sort({ createdAt: -1 });
                    break;
                case 'bestReviews':
                    query = query.sort({ averageReviewScore: -1 });
                    break;
                case 'bestUpvotes':
                    query = query.sort({ totalUpvotes: -1 });
                    break;
                default:
                    break;
            }
        }
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = yield toolModel_1.default.find({
            productType: { $in: ['course', 'Course'] },
            categories: category ? category : { $exists: true } // Filter by category if provided
        }).countDocuments();
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
        console.error('Error fetching course:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.filterCourses = filterCourses;
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
        yield index.deleteObject(toolId);
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
