"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const toolSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String },
    features: { type: [String] },
    screenshots: { type: [String] },
    logo: { type: [String] },
    pricing: { type: Number, default: 0 },
    productType: { type: String, enum: ['app', 'saas', 'course'], default: 'app', required: true },
    categories: { type: [String] },
    productLink: { type: String, required: true },
    youtubeLink: { type: String, required: true },
    upvotes: { type: Number, default: 0 },
    upvotedBy: { type: [mongoose_1.Schema.Types.ObjectId] },
    targetAudience: { type: [String] },
    isActive: { type: Boolean, default: true },
    reviews: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Review' },
    averageReview: { type: Number, default: 0 },
    aiEnabled: { type: Boolean, default: false },
    publisher: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    publisherEmail: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
exports.default = mongoose_1.default.model('Tool', toolSchema);
