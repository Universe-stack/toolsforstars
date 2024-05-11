"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const express_1 = __importDefault(require("express"));
const toolController_1 = require("../controllers/toolController");
const upvoteController_1 = require("../controllers/upvoteController");
const reportController_1 = require("../controllers/reportController");
const reviewController_1 = require("../controllers/reviewController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const multer_1 = __importDefault(require("multer"));
const toolRouter = express_1.default.Router();
const storage = multer_1.default.diskStorage({});
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    }
    else {
        cb('invalid image file!', false);
    }
};
const upload = (0, multer_1.default)({ storage, fileFilter });
//create new tool{Has to use the id now because auth hasn't been implemented to populate the req.user._id}
// The userId should match the name "userId" being passed from the users route
//move these userIds from the params to the req.body object
toolRouter.post('/createtool', authMiddleware_1.verifyUser, authMiddleware_1.verifyAdmin, upload.array('screenshots', 5), toolController_1.createNewTool);
toolRouter.put('/updatetool/:toolId', authMiddleware_1.verifyUser, authMiddleware_1.verifyAdmin, toolController_1.updateTool);
toolRouter.get('/search', toolController_1.searchTools);
toolRouter.get('/saas', toolController_1.getSaasTools);
toolRouter.get('/courses', toolController_1.getCourses);
toolRouter.get('/saas/filterResults', toolController_1.filterSaasTools);
toolRouter.get('/apps/filterResults', toolController_1.filterApps);
toolRouter.get('/courses/filterResults', toolController_1.filterCourses);
toolRouter.get('/apps', toolController_1.getapps);
toolRouter.get('/all', toolController_1.getAllToolListings);
toolRouter.get('/:toolId', toolController_1.getToolDetails);
toolRouter.get('/:toolId/getupvotes', upvoteController_1.getTotalUpvotes);
toolRouter.delete('/deletetool/:toolId', authMiddleware_1.verifyUser, authMiddleware_1.verifyAdmin, toolController_1.deleteTool);
toolRouter.get('/:toolId/publisher', authMiddleware_1.verifyUser, toolController_1.getpublisher);
toolRouter.post('/:toolId/upvote', authMiddleware_1.verifyUser, upvoteController_1.upvoteTool);
toolRouter.post('/:toolId/unvote', authMiddleware_1.verifyUser, upvoteController_1.removeUpvote);
toolRouter.post('/:toolId/report', authMiddleware_1.verifyUser, reportController_1.reportTool);
toolRouter.post('/:toolId/addreview', authMiddleware_1.verifyUser, reviewController_1.addReview);
toolRouter.get('/:toolId/reviews', reviewController_1.getReviews);
toolRouter.put('/:toolId/reviews/:reviewId', authMiddleware_1.verifyUser, reviewController_1.updateReview);
toolRouter.delete('/:toolId/deletereviews/:reviewId', authMiddleware_1.verifySuperAdmin, reviewController_1.deleteReview);
exports.default = toolRouter;
