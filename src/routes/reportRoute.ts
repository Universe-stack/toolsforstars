import express from 'express';
import { reportTool, viewReports, handleReport } from '../controllers/reportController';

const reportRouter = express.Router();

reportRouter.get('/all', viewReports)
reportRouter.put('/:reportId/handlereport', handleReport)

export default reportRouter