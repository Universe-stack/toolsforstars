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
//@ts-nocheck
const passport_jwt_1 = require("passport-jwt");
const userModel_1 = __importDefault(require("../models/userModel")); // Import your user model
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const passportJwtConfig = (passport) => {
    const opts = {
        jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_KEY
    };
    passport.use(new passport_jwt_1.Strategy(opts, (jwt_payload, done) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(jwt_payload, "JWT PAYLOAD");
        try {
            const user = yield userModel_1.default.findOne({
                _id: jwt_payload._id,
            }).exec();
            console.log(user, 'user of course');
            if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        }
        catch (error) {
            return done(error, false);
        }
    })));
};
exports.default = passportJwtConfig;
