import express from 'express';
import { createAd, getAllAds,getAd,deleteAd,updateAd } from '../controllers/adController';

const adRouter = express.Router();

adRouter.post('/create', createAd)
adRouter.get('/all', getAllAds)
adRouter.put('/:adId', getAd)
adRouter.put('/:adId/update', updateAd)
adRouter.delete('/:adId/remove', deleteAd)



export default adRouter;