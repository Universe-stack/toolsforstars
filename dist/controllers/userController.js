"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getAllUsers = exports.updateUserProfile = exports.getUserProfile = exports.registerUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const toolModel_1 = __importDefault(require("../models/toolModel"));
// Register User
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, name, role, email } = req.body;
        const isUserExisting = yield userModel_1.default.findOne({ username });
        if (isUserExisting) {
            return res.status(404).json({ message: "Username is already taken" });
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const newUser = new userModel_1.default({
            username,
            password: hashedPassword,
            name,
            role,
            email
        });
        const savedUser = yield newUser.save();
        res.status(201).json(savedUser);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
        console.log(error);
    }
});
exports.registerUser = registerUser;
//get user profile
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //const user = await User.findById(req.user._id).select('-password');
        const user = yield userModel_1.default.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getUserProfile = getUserProfile;
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, name } = req.body;
        const updatedUser = yield userModel_1.default.findByIdAndUpdate(req.user._id, { username, email, name }, { new: true });
        res.status(200).json({ message: 'User profile updated successfully', user: updatedUser });
    }
    catch (error) {
        console.log('Error updating user profile', error.message);
        res.status(500).json({ message: `server error` });
    }
});
exports.updateUserProfile = updateUserProfile;
//get all users
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.default.find({});
        if (!users) {
            return res.status(404).json({ message: "No users at the momemt" });
        }
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: `server error` });
    }
});
exports.getAllUsers = getAllUsers;
//delete user
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("deleting");
        const userId = req.user._id;
        const deletedUser = yield userModel_1.default.findByIdAndDelete(userId);
        yield toolModel_1.default.deleteMany({ userId });
        if (!deletedUser) {
            return res.status(404).json({ message: "user not deleted" });
        }
        res.status(202).json({ message: "user deleted" });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteUser = deleteUser;
//user 
