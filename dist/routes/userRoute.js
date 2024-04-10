"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const express_validator_1 = require("express-validator");
require("../auth/passportJwtConfig");
const userRouter = express_1.default.Router();
//Register a user
userRouter.post('/register', [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('password').isLength({ min: 8 }),
], userController_1.registerUser);
//Login user
userRouter.post('/login', [
    (0, express_validator_1.body)('username').notEmpty(),
    (0, express_validator_1.body)('password').notEmpty(),
], userController_1.loginUser);
//logout
userRouter.post('/logout', userController_1.logout);
//create user profile
userRouter.post('/createprofile', [
    (0, express_validator_1.body)('password').notEmpty(),
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('name').notEmpty().isString().trim(),
    (0, express_validator_1.body)('age').optional().isDate()
], authMiddleware_1.verifyUser, userController_1.createUserProfile);
//Get user profile
userRouter.get('/getprofile', authMiddleware_1.verifyUser, userController_1.getUserProfile);
//update user profile
userRouter.put('/updateprofile/:_id', [
    (0, express_validator_1.param)('_id').notEmpty().isMongoId(),
    (0, express_validator_1.body)('name').notEmpty().isString().trim(),
    (0, express_validator_1.body)('age').optional().isDate(),
], authMiddleware_1.verifyUser, authMiddleware_1.verifyAdmin, userController_1.updateUserProfile);
//Get all Users
userRouter.get('/all', authMiddleware_1.verifyUser, authMiddleware_1.verifySuperAdmin, userController_1.getAllUsers);
//delete profile
userRouter.delete('/deleteprofile', authMiddleware_1.verifyUser, authMiddleware_1.verifyAdmin, userController_1.deleteUser);
//update user role
userRouter.put('/:_id/role', authMiddleware_1.verifyUser, authMiddleware_1.verifySuperAdmin, userController_1.changeUserRole);
exports.default = userRouter;
