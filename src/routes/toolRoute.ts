//@ts-nocheck
import express from 'express';
import {createNewTool,updateTool,getAllToolListings, deleteTool, getToolDetails, searchTools, getpublisher ,getSaasTools, getapps, getCourses, filterSaasTools, filterApps, filterCourses} from '../controllers/toolController'
import { upvoteTool,removeUpvote,getTotalUpvotes} from '../controllers/upvoteController';
import { reportTool} from '../controllers/reportController';
import { addReview, getReviews, updateReview, deleteReview} from '../controllers/reviewController';
import { verifyAdmin, verifySuperAdmin, verifyUser } from '../middlewares/authMiddleware';
import multer from  'multer';

const toolRouter = express.Router();

const storage= multer.diskStorage({})

const fileFilter= (req,file,cb) => {
    if(file.mimetype.startsWith('image')) {
        cb(null,true)
    }else{
        cb('invalid image file!', false)
    }
}
const upload = multer({storage,fileFilter});
//create new tool{Has to use the id now because auth hasn't been implemented to populate the req.user._id}
// The userId should match the name "userId" being passed from the users route

//move these userIds from the params to the req.body object
toolRouter.post('/createtool',verifyUser,verifyAdmin,upload.fields([{ name: 'logo', maxCount: 1 },{ name: 'screenshots', maxCount: 5 }]),createNewTool);
toolRouter.put('/updatetool/:toolId', verifyUser,verifyAdmin, updateTool);
toolRouter.get('/search', searchTools);
toolRouter.get('/saas', getSaasTools);
toolRouter.get('/courses', getCourses);
toolRouter.get('/saas/filterResults', filterSaasTools);
toolRouter.get('/apps/filterResults', filterApps);
toolRouter.get('/courses/filterResults', filterCourses);
toolRouter.get('/apps', getapps);
toolRouter.get('/all', getAllToolListings);
toolRouter.get('/:toolId',getToolDetails);
toolRouter.get('/:toolId/getupvotes',getTotalUpvotes);
toolRouter.delete('/deletetool/:toolId',verifyUser,verifyAdmin, deleteTool);
toolRouter.get('/:toolId/publisher',verifyUser,getpublisher);
toolRouter.post('/:toolId/upvote',verifyUser, upvoteTool);
toolRouter.post('/:toolId/unvote',verifyUser,removeUpvote );
toolRouter.post('/:toolId/report',verifyUser, reportTool);
toolRouter.post('/:toolId/addreview',verifyUser, addReview);
toolRouter.get('/:toolId/reviews', getReviews);
toolRouter.put('/:toolId/reviews/:reviewId',verifyUser,updateReview);
toolRouter.delete('/:toolId/deletereviews/:reviewId',verifySuperAdmin, deleteReview);


export default toolRouter;