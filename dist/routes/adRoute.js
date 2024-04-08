"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adController_1 = require("../controllers/adController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const adRouter = express_1.default.Router();
adRouter.post('/create', authMiddleware_1.verifyUser, authMiddleware_1.verifyAdmin, adController_1.createAd);
adRouter.get('/all', authMiddleware_1.verifyUser, authMiddleware_1.verifySuperAdmin, adController_1.getAllAds);
adRouter.get('/allads', authMiddleware_1.verifyUser, authMiddleware_1.verifyAdmin, adController_1.getPublisherAds);
adRouter.get('/:adId', authMiddleware_1.verifyUser, authMiddleware_1.verifyAdmin, adController_1.getAd);
adRouter.put('/:adId/update', authMiddleware_1.verifyUser, authMiddleware_1.verifyAdmin, adController_1.updateAd);
adRouter.delete('/:adId/remove', authMiddleware_1.verifyUser, authMiddleware_1.verifyAdmin, adController_1.deleteAd);
exports.default = adRouter;
