import express from 'express';
import { reportTool, viewReports } from '../controllers/reportController';

const reportRouter = express.Router();

reportRouter.get('/all', viewReports)

export default reportRouter