"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adController_1 = require("../controllers/adController");
const adRouter = express_1.default.Router();
adRouter.post('/create', adController_1.createAd);
adRouter.get('/all', adController_1.getAllAds);
adRouter.put('/:adId', adController_1.getAd);
adRouter.put('/:adId/update', adController_1.updateAd);
adRouter.delete('/:adId/remove', adController_1.deleteAd);
exports.default = adRouter;
