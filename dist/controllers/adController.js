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
exports.deleteAd = exports.updateAd = exports.getAd = exports.getAllAds = exports.createAd = void 0;
const adModel_1 = __importDefault(require("../models/adModel"));
const createAd = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, price, publisher, purchaseLink, adSpace } = req.body;
        const totalAds = yield adModel_1.default.countDocuments({ adSpace });
        const maxAdsAllowed = 5;
        if (totalAds >= maxAdsAllowed) {
            return res.status(400).json({ message: `Ad space '${adSpace}' is full. Maximum ${maxAdsAllowed} ads allowed. Try again later` });
        }
        const newAd = new adModel_1.default({
            title,
            description,
            price,
            publisher,
            purchaseLink,
            adSpace
        });
        yield newAd.save();
        res.status(201).json({ message: 'Ad listing created successfully', ad: newAd });
        console.log('Ad created successfully', newAd);
    }
    catch (error) {
        // Handle errors
        console.error('Error creating ad listing:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.createAd = createAd;
const getAllAds = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ads = yield adModel_1.default.find();
        res.status(200).json(ads);
    }
    catch (error) {
        console.error('Error retrieving ads:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getAllAds = getAllAds;
const getAd = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adId } = req.params;
        const ad = yield adModel_1.default.findById(adId);
        if (!ad) {
            return res.status(404).json({ message: 'Ad not found' });
        }
        res.status(200).json(ad);
    }
    catch (error) {
        console.error('Error fetching ad:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getAd = getAd;
const updateAd = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adId = req.params.adId;
        const { title, description, price, purchaseLink, adSpace } = req.body;
        const ad = yield adModel_1.default.findById(adId);
        if (!ad) {
            return res.status(404).json({ message: 'Ad not found' });
        }
        if (title)
            ad.title = title;
        if (description)
            ad.description = description;
        if (price)
            ad.price = price;
        if (purchaseLink)
            ad.purchaseLink = purchaseLink;
        if (adSpace)
            ad.adSpace = adSpace;
        yield ad.save();
        res.status(200).json({ message: 'Ad listing updated successfully' });
    }
    catch (error) {
        console.error('Error updating ad:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateAd = updateAd;
const deleteAd = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adId } = req.params;
        const deletedAd = yield adModel_1.default.findByIdAndDelete(adId);
        if (!deletedAd) {
            return res.status(404).json({ message: 'Ad not found' });
        }
        res.status(200).json({ message: 'Ad listing deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting ad:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteAd = deleteAd;
