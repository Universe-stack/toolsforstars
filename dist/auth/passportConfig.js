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
// @ts-nocheck
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const userModel_1 = __importDefault(require("../models/userModel")); // Import your User model
// passport.use(new LocalStrategy(
//   {
//     usernameField: 'email',
//     passwordField: 'password'
//   },
//   async (email: string, password: string, done: any) => {
//     try {
//       const user: IUser | null = await User.findOne({ email });
//       if (!user || !(await user.isValidPassword(password))) {
//         return done(null, false, { message: 'Invalid email or password' });
//       }
//       return done(null, user);
//     } catch (error) {
//       return done(error);
//     }
//   }
// ));
passport_1.default.serializeUser((user, done) => {
    console.log(`Inside serialize user`);
    done(null, user._id);
});
passport_1.default.deserializeUser((_id, done) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Inside Deserialize user`);
    console.log(`Deserializing user ID: ${_id}`);
    try {
        yield userModel_1.default.findOne({ _id }, (err, user) => {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(new Error("User Not Found"));
            }
            done(null, user);
        });
    }
    catch (err) {
        done(err, null);
    }
}));
exports.default = passport_1.default.use(new passport_local_1.Strategy({ usernameField: "email" }, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'User not found' });
        }
        const isValidPassword = yield user.isValidPassword(password);
        if (!isValidPassword) {
            return done(null, false, { message: 'Invalid password' });
        }
        return done(null, user);
    }
    catch (error) {
        console.error(error); // Log the error for debugging
        return done(error); // Pass the error to the authentication middleware
    }
})));
