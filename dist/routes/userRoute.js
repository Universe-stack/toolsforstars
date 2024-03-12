"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const userRouter = express_1.default.Router();
//Register a user
userRouter.post('/register', userController_1.registerUser);
//Get user profile
userRouter.get('/profile', userController_1.getUserProfile);
//update user profile
userRouter.put('/updateprofile', userController_1.updateUserProfile);
//Get all Users
userRouter.get('/all', userController_1.getAllUsers);
//delete profile
userRouter.delete('/deleteprofile/:_id', userController_1.deleteUser);
exports.default = userRouter;
