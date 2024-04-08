import express from 'express';
import { createAd, getAllAds,getAd,deleteAd,updateAd, getPublisherAds } from '../controllers/adController';
import { verifyAdmin, verifySuperAdmin, verifyUser } from '../middlewares/authMiddleware';

const adRouter = express.Router();

adRouter.post('/create',verifyUser, verifyAdmin, createAd)
adRouter.get('/all', verifyUser, verifySuperAdmin, getAllAds)
adRouter.get('/allads', verifyUser, verifyAdmin, getPublisherAds)
adRouter.get('/:adId',verifyUser, verifyAdmin, getAd)
adRouter.put('/:adId/update', verifyUser, verifyAdmin, updateAd)
adRouter.delete('/:adId/remove',verifyUser, verifyAdmin, deleteAd)



export default adRouter;