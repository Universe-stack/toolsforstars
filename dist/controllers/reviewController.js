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
exports.deleteReview = exports.updateReview = exports.getReviews = exports.addReview = void 0;
const toolModel_1 = __importDefault(require("../models/toolModel"));
const reviewModel_1 = __importDefault(require("../models/reviewModel"));
const addReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract parameters from the request
        const { toolId } = req.params;
        const { reviewContent, userId, reviewStars } = req.body;
        // Validate review stars
        if (!reviewContent || !userId || isNaN(reviewStars) || reviewStars < 1 || reviewStars > 5) {
            return res.status(400).json({ message: 'Invalid review data' });
        }
        const tool = yield toolModel_1.default.findById(toolId);
        if (!tool) {
            return res.status(404).json({ message: 'Tool not found' });
        }
        // Save the new review
        const newReview = new reviewModel_1.default({
            toolId,
            userId,
            reviewContent,
            reviewStars
        });
        yield newReview.save();
        // Calculate the average review stars
        const reviews = yield reviewModel_1.default.find({ toolId });
        const totalStars = reviews.reduce((acc, curr) => acc + curr.reviewStars, 0);
        const averageStars = reviews.length > 0 ? totalStars / reviews.length : 0;
        // Update the averageReviews field in the Tool model
        yield toolModel_1.default.findByIdAndUpdate(toolId, { averageReview: averageStars });
        res.status(201).json({ message: 'Review added successfully' });
    }
    catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.addReview = addReview;
const getReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { toolId } = req.params;
        const reviews = yield reviewModel_1.default.find({ toolId });
        res.status(200).json({ reviews });
    }
    catch (error) {
        console.error('Error getting reviews:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getReviews = getReviews;
const updateReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { toolId, reviewId } = req.params;
        const { reviewContent, reviewStars } = req.body;
        const updatedReview = yield reviewModel_1.default.findOneAndUpdate({ _id: reviewId, toolId }, { reviewContent, reviewStars }, { new: true });
        if (!updatedReview) {
            return res.status(404).json({ message: 'Review not found for the specified tool' });
        }
        res.status(200).json({ message: 'Review updated successfully', review: updatedReview });
    }
    catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateReview = updateReview;
const deleteReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { toolId, reviewId } = req.params;
        const deletedReview = yield reviewModel_1.default.findOneAndDelete({ _id: reviewId, toolId });
        if (!deletedReview) {
            return res.status(404).json({ message: 'Review not found for the specified tool' });
        }
        res.status(200).json({ message: 'Review deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteReview = deleteReview;
