// @ts-nocheck
import { Request, Response } from 'express';
import User from '../models/userModel';
import Ad, { IAd } from '../models/adModel';


export const createAd = async (req: Request, res: Response) => {
    try {
        const { adSpace, campaignBudget,description,duration,image,link,paid,price,startingDate, title} = req.body;
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
            adSpace,
            campaignBudget,
            description,
            duration,
            image,
            link,
            paid,
            price,
            startingDate,
            title,
            publisher:findPublisher?._id,
        });

        await newAd.save();

        res.status(201).json({ message: 'Ad listing created successfully', ad: newAd });
        console.log('Ad created successfully', newAd);
    } catch (error) {
        console.error('Error creating ad listing:', error);
        res.status(500).json({ message: 'Server error', error });
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
    const { adId } = req.params
    const userId = req.user?._id

    try {
        const ad: IAd | null = await Ad.findById(adId);
        if (!ad) {
            return res.status(404).json({ message: 'Ad not found' });
        }
        if (!ad.publisher.equals(userId)) {
            return res.status(403).json({ message: 'You do not have permission to update this tool' });
        }

        res.status(200).json(ad);
    } catch (error) {
        console.error('Error fetching ad:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

//update this add with what's on create
export const updateAd = async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { adId } = req.params;

    try {
        const { title, description, price, purchaseLink, adSpace, image } = req.body;

        const ad = await Ad.findById(adId);
        if (!ad) {
            return res.status(404).json({ message: 'Ad not found' });
        }

        if (ad.userId !== userId) {
            return res.status(403).json({ message: 'You are not authorized to update this ad' });
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
    const userId = req.user?._id;  
    const { adId } = req.params;

    try {
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
