import {Router} from 'express'
import { execute } from '../controllers/execution_Controller.js';
import authMiddleware from '../middleware/check_authorized.js';

const executionRoutes = Router();

executionRoutes.post('/:agentId', authMiddleware, execute);

export default executionRoutes;