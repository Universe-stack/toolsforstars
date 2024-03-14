"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const toolController_1 = require("../controllers/toolController");
const toolRouter = express_1.default.Router();
//create new tool{Has to use the id now because auth hasn't been implemented to populate the req.user._id}
// The userId should match the name "userId" being passed from the users route
toolRouter.post('/createtool/:userId', toolController_1.createNewTool);
toolRouter.put('/updatetool/:toolId', toolController_1.updateTool);
toolRouter.get('/all', toolController_1.getAllToolListings);
toolRouter.get('/search', toolController_1.searchTools);
toolRouter.delete('/deletetool/:toolId', toolController_1.deleteTool);
toolRouter.get('/:toolId', toolController_1.getToolDetails);
exports.default = toolRouter;
