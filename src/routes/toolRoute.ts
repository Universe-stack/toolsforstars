import express from 'express';
import {createNewTool,updateTool,getAllToolListings, deleteTool, getToolDetails, searchTools} from '../controllers/toolController'


const toolRouter = express.Router();

//create new tool{Has to use the id now because auth hasn't been implemented to populate the req.user._id}
// The userId should match the name "userId" being passed from the users route
toolRouter.post('/createtool/:userId', createNewTool)
toolRouter.put('/updatetool/:toolId', updateTool);
toolRouter.get('/all', getAllToolListings)
toolRouter.get('/search', searchTools)
toolRouter.delete('/deletetool/:toolId', deleteTool)
toolRouter.get('/:toolId',getToolDetails)


export default toolRouter;