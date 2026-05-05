import {Router} from 'express'
import { executeAgent } from '../controllers/execution_Controller.js';
import {authMiddleware} from '../middlewares/authMiddleware.js';

const executionRoutes = Router();

executionRoutes.post('/:agentId', authMiddleware, executeAgent);

export default executionRoutes;