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
exports.changeUserRole = exports.deleteUser = exports.getAllUsers = exports.updateUserProfile = exports.getUserProfile = exports.createUserProfile = exports.loginUser = exports.registerUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const userProfileModel_1 = __importDefault(require("../models/userProfileModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const toolModel_1 = __importDefault(require("../models/toolModel"));
const passport_1 = __importDefault(require("passport"));
// Register User
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, name, role, email } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email, and password are required' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
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
const loginUser = (req, res, next) => {
    passport_1.default.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        // Based on the user's role, redirect to the appropriate dashboard
        if (user.role === 'publisher') {
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                return res.redirect('/');
            });
        }
        else if (user.role === 'superuser') {
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                return res.redirect('/');
            });
        }
        else {
            // Handle other roles or default redirect
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                return res.redirect('/');
            });
        }
    })(req, res, next);
};
exports.loginUser = loginUser;
//Create user profile
const createUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, name, role, picture } = req.body;
        // Check if the username and email are unique
        const existingUser = yield userProfileModel_1.default.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }
        const newUserProfile = new userProfileModel_1.default({
            username,
            email,
            name,
            role,
            picture
        });
        const savedUserProfile = yield newUserProfile.save();
        res.status(201).json({ message: 'User profile created successfully', userProfile: savedUserProfile });
    }
    catch (error) {
        console.error('Error creating user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.createUserProfile = createUserProfile;
//get user profile
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //const user = await User.findById(req.user._id).select('-password');
        const user = yield userProfileModel_1.default.findById(req.user._id).select('-password');
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
        const existingUser = yield userProfileModel_1.default.findById(req.params._id);
        if (!existingUser) {
            return res.status(404).json({ message: "user not found" });
        }
        const updatedUser = yield userProfileModel_1.default.findByIdAndUpdate(req.params._id, Object.assign(Object.assign({}, existingUser.toObject()), req.body), { new: true });
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
        const user = req.user;
        const userId = user === null || user === void 0 ? void 0 : user._id;
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
//user role management
const changeUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params._id;
        const newRole = req.body.role;
        const updatedUser = yield userModel_1.default.findByIdAndUpdate(userId, { role: newRole }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: "User role updated" });
    }
    catch (error) {
        console.error('Eror updating user role', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.changeUserRole = changeUserRole;
