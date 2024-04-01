import { Request, Response } from 'express';
import Tool from '../models/toolModel';
import User from '../models/userModel';
import {IUser} from '../models/userModel';
import Ad, { IAd } from '../models/adModel';


declare global {
    namespace Express {
      interface User {
        _id: string; // Assuming _id is a string
      }
    }
}

export const createAd = async (req: Request, res: Response) => {
    try {
        const { title, description, price, purchaseLink, adSpace,image } = req.body;
        const userId:string | undefined = req.user?._id;

        const findPublisher = await User.findById(userId)
        if(!findPublisher){
            res.status(404).json({message:"No publisher found"})
        }

        const totalAds = await Ad.countDocuments({ adSpace });
        const maxAdsAllowed = 5;
        if (totalAds >= maxAdsAllowed) {
            return res.status(400).json({ message: `Ad space '${adSpace}' is full. Maximum ${maxAdsAllowed} ads allowed. Try again later` });
        }

        const newAd: IAd = new Ad({
            title,
            description,
            price,
            publisher:findPublisher?._id,
            purchaseLink,
            adSpace,
            image
        });

        await newAd.save();

        res.status(201).json({ message: 'Ad listing created successfully', ad: newAd });
        console.log('Ad created successfully', newAd);
    } catch (error) {
        // Handle errors
        console.error('Error creating ad listing:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


export const getAllAds = async (req: Request, res: Response) => {
    try {
        const ads: IAd[] = await Ad.find();
        res.status(200).json(ads);
    } catch (error) {
        console.error('Error retrieving ads:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getPublisherAds = async(req:Request, res:Response)=> {
    try{
        const publisher = req.user?._id
        if(!publisher){
            res.status(404).json({message:"You're not logged in"})
        }
        const ads = await Ad.find({publisher:publisher})
        if (!ads || ads.length === 0){
            res.status(404).json({message:"You don't have any active ads"})
        }

        res.status(200).json({message:"Ads successfully retrieved", ads})

    }catch (error){
        console.error('Error retrieving ads:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export const getAd = async (req: Request, res: Response) => {
    try {
        const { adId } = req.params;
        const ad: IAd | null = await Ad.findById(adId);
        if (!ad) {
            return res.status(404).json({ message: 'Ad not found' });
        }

        res.status(200).json(ad);
    } catch (error) {
        console.error('Error fetching ad:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateAd =  async (req: Request, res: Response) => {
    try {
        const adId = req.params.adId;
        const { title, description, price, purchaseLink, adSpace,image } = req.body;

        const ad = await Ad.findById(adId);
        if (!ad) {
            return res.status(404).json({ message: 'Ad not found' });
        }

        if (title) ad.title = title;
        if (description) ad.description = description;
        if (price) ad.price = price;
        if (purchaseLink) ad.purchaseLink = purchaseLink;
        if (image) ad.image = image;
        if (adSpace) ad.adSpace = adSpace;

        await ad.save();

        res.status(200).json({ message: 'Ad listing updated successfully' });
    } catch (error) {
        console.error('Error updating ad:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteAd = async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        
        const { adId } = req.params;
        const deletedAd = await Ad.findByIdAndDelete(adId);

        if (!deletedAd) {
            return res.status(404).json({ message: 'Ad not found' });
        }

        if (deletedAd.publisher.toString() !== userId?.toString()) {
            return res.status(403).json({ message: 'You are not authorized to delete this ad' });
        }

        res.status(200).json({ message: 'Ad listing deleted successfully' });
    } catch (error) {
        console.error('Error deleting ad:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
