import express from 'express';
import { viewReports, handleReport } from '../controllers/reportController';
import { verifySuperAdmin, verifyUser } from '../middlewares/authMiddleware';

const reportRouter = express.Router();

reportRouter.get('/all',verifyUser, verifySuperAdmin, viewReports)
reportRouter.put('/:reportId/handlereport', verifyUser, verifySuperAdmin, handleReport)

export default reportRouter