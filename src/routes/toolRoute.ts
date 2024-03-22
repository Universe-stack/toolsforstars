import express from 'express';
import {createNewTool,updateTool,getAllToolListings, deleteTool, getToolDetails, searchTools, getpublisher} from '../controllers/toolController'
import { upvoteTool,removeUpvote,getTotalUpvotes} from '../controllers/upvoteController';
import { reportTool} from '../controllers/reportController';
import { addReview, getReviews, updateReview, deleteReview } from '../controllers/reviewController';

const toolRouter = express.Router();

//create new tool{Has to use the id now because auth hasn't been implemented to populate the req.user._id}
// The userId should match the name "userId" being passed from the users route

//move these userIds from the params to the req.body object
toolRouter.post('/createtool/:userId', createNewTool)
toolRouter.put('/updatetool/:toolId', updateTool);
toolRouter.get('/search', searchTools)
toolRouter.get('/all', getAllToolListings)
toolRouter.get('/:toolId',getToolDetails)
toolRouter.get('/:toolId/getupvotes',getTotalUpvotes)
toolRouter.delete('/deletetool/:toolId', deleteTool)
toolRouter.get('/:toolId/publisher',getpublisher)
toolRouter.post('/:toolId/:userId/upvote', upvoteTool)
toolRouter.post('/:toolId/:userId/unvote',removeUpvote )
toolRouter.post('/:toolId/:userId/report',reportTool)
toolRouter.post('/:toolId/addreview', addReview)
toolRouter.get('/:toolId/reviews', getReviews);
toolRouter.put('/:toolId/reviews/:reviewId', updateReview);
toolRouter.delete('/:toolId/deletereviews/:reviewId', deleteReview)


export default toolRouter;