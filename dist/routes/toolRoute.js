"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const toolController_1 = require("../controllers/toolController");
const upvoteController_1 = require("../controllers/upvoteController");
const reportController_1 = require("../controllers/reportController");
const reviewController_1 = require("../controllers/reviewController");
const toolRouter = express_1.default.Router();
//create new tool{Has to use the id now because auth hasn't been implemented to populate the req.user._id}
// The userId should match the name "userId" being passed from the users route
//move these userIds from the params to the req.body object
toolRouter.post('/createtool/:userId', toolController_1.createNewTool);
toolRouter.put('/updatetool/:toolId', toolController_1.updateTool);
toolRouter.get('/search', toolController_1.searchTools);
toolRouter.get('/all', toolController_1.getAllToolListings);
toolRouter.get('/:toolId', toolController_1.getToolDetails);
toolRouter.get('/:toolId/getupvotes', upvoteController_1.getTotalUpvotes);
toolRouter.delete('/deletetool/:toolId', toolController_1.deleteTool);
toolRouter.get('/:toolId/publisher', toolController_1.getpublisher);
toolRouter.post('/:toolId/:userId/upvote', upvoteController_1.upvoteTool);
toolRouter.post('/:toolId/:userId/unvote', upvoteController_1.removeUpvote);
toolRouter.post('/:toolId/:userId/report', reportController_1.reportTool);
toolRouter.post('/:toolId/addreview', reviewController_1.addReview);
toolRouter.get('/:toolId/reviews', reviewController_1.getReviews);
toolRouter.put('/:toolId/reviews/:reviewId', reviewController_1.updateReview);
toolRouter.delete('/:toolId/deletereviews/:reviewId', reviewController_1.deleteReview);
exports.default = toolRouter;
