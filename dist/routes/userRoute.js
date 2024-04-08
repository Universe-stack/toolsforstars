"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
require("../auth/passportJwtConfig");
const userRouter = express_1.default.Router();
//Register a user
userRouter.post('/register', userController_1.registerUser);
//Login user
userRouter.post('/login', userController_1.loginUser);
//logout
userRouter.post('/logout', userController_1.logout);
//create user profile
userRouter.post('/createprofile', authMiddleware_1.verifyUser, userController_1.createUserProfile);
//Get user profile
userRouter.get('/getprofile', authMiddleware_1.verifyUser, userController_1.getUserProfile);
//update user profile
userRouter.put('/updateprofile/:_id', authMiddleware_1.verifyUser, authMiddleware_1.verifyAdmin, userController_1.updateUserProfile);
//Get all Users
userRouter.get('/all', authMiddleware_1.verifyUser, authMiddleware_1.verifySuperAdmin, userController_1.getAllUsers);
//delete profile
userRouter.delete('/deleteprofile', authMiddleware_1.verifyUser, authMiddleware_1.verifyAdmin, userController_1.deleteUser);
//update user role
userRouter.put('/:_id/role', authMiddleware_1.verifyUser, authMiddleware_1.verifySuperAdmin, userController_1.changeUserRole);
exports.default = userRouter;
