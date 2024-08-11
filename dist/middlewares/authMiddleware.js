"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySuperAdmin = exports.verifyAdmin = exports.verifyUser = exports.generateAuthToken = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel")); // Import your user model
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const passportJwtConfig_1 = __importDefault(require("../auth/passportJwtConfig"));
(0, passportJwtConfig_1.default)(passport_1.default);
// Configure passport with the local strategy
passport_1.default.use(new passport_local_1.Strategy(userModel_1.default.authenticate()));
passport_1.default.serializeUser(userModel_1.default.serializeUser());
passport_1.default.deserializeUser(userModel_1.default.deserializeUser());
// Function to generate a JWT token
const generateAuthToken = (user) => {
    // Create a payload with only the necessary user data
    const payload = {
        _id: user._id, // Assuming _id is the user's unique identifier
        username: user.username, // Add other relevant user properties
        // ... add other user-related data here
    };
    // Sign the JWT token with the payload
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_KEY, { expiresIn: 3600 });
};
exports.generateAuthToken = generateAuthToken;
// Middleware function to verify an ordinary user with a JWT
exports.verifyUser = passport_1.default.authenticate('jwt', { session: false });
// Middleware function to verify an admin user with a JWT
const verifyAdmin = (req, res, next) => {
    passport_1.default.authenticate('jwt', { session: false }, (err, user, info) => {
        console.log(user, "user");
        if (err) {
            return next(err);
        }
        if (user.role !== "publisher" && user.role !== "superuser") {
            const error = new Error('You are not authorized to perform this operation!');
            return next(error);
        }
        req.user = user;
        next();
    })(req, res, next);
};
exports.verifyAdmin = verifyAdmin;
const verifySuperAdmin = (req, res, next) => {
    passport_1.default.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (user.role !== "superuser") {
            const error = new Error('You are not authorized to perform this operation!');
            return next(error);
        }
        req.user = user;
        next();
    })(req, res, next);
};
exports.verifySuperAdmin = verifySuperAdmin;
