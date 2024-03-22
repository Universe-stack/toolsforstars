import express, { Request, Response } from 'express';
import Tool, { ITool } from '../models/toolModel';
import Review from '../models/reviewModel';
import IReview from '../models/reviewModel'

export const addReview = async (req: Request, res: Response) => {
    try {
        // Extract parameters from the request
        const { toolId } = req.params;
        const { reviewContent, userId, reviewStars } = req.body;

        // Validate review stars
        if (!reviewContent || !userId || isNaN(reviewStars) || reviewStars < 1 || reviewStars > 5) {
            return res.status(400).json({ message: 'Invalid review data' });
        }

        const tool = await Tool.findById(toolId);

        if (!tool) {
            return res.status(404).json({ message: 'Tool not found' });
        }

        // Save the new review
        const newReview = new Review({
            toolId,
            userId,
            reviewContent,
            reviewStars
        });

        await newReview.save();

        // Calculate the average review stars
        const reviews = await Review.find({ toolId });
        const totalStars = reviews.reduce((acc, curr) => acc + curr.reviewStars, 0);
        const averageStars = reviews.length > 0 ? totalStars / reviews.length : 0;

        // Update the averageReviews field in the Tool model
        await Tool.findByIdAndUpdate(toolId, { averageReview: averageStars });

        res.status(201).json({ message: 'Review added successfully' });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


export const getReviews= async (req: Request, res: Response) => {
    try {
        const { toolId } = req.params;
        const reviews = await Review.find({ toolId });

        res.status(200).json({ reviews });
    } catch (error) {
        console.error('Error getting reviews:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateReview = async (req: Request, res: Response) => {
    try {
        const { toolId, reviewId } = req.params;
        const { reviewContent, reviewStars } = req.body;

        const updatedReview = await Review.findOneAndUpdate(
            { _id: reviewId, toolId },
            { reviewContent, reviewStars },
            { new: true }
        );

        if (!updatedReview) {
            return res.status(404).json({ message: 'Review not found for the specified tool' });
        }

        res.status(200).json({ message: 'Review updated successfully', review: updatedReview });
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteReview = async (req: Request, res: Response) => {
    try {
        const { toolId, reviewId } = req.params;

        const deletedReview = await Review.findOneAndDelete({ _id: reviewId, toolId });

        if (!deletedReview) {
            return res.status(404).json({ message: 'Review not found for the specified tool' });
        }

        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
