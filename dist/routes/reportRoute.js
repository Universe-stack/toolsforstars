"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reportController_1 = require("../controllers/reportController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const reportRouter = express_1.default.Router();
reportRouter.get('/all', authMiddleware_1.verifyUser, authMiddleware_1.verifySuperAdmin, reportController_1.viewReports);
reportRouter.put('/:reportId/handlereport', authMiddleware_1.verifyUser, authMiddleware_1.verifySuperAdmin, reportController_1.handleReport);
exports.default = reportRouter;
