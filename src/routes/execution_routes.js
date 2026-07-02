import {Router} from 'express'
import { execute, getMyExecutions, getSellerExecutions } from '../controllers/execution_controller.js';
import authMiddleware from '../middleware/check_authorized.js';

const executionRoutes = Router();

const buyerOnly = (req, res, next) => {
    if (req.user.role !== 'buyer') {
        return res.status(403).json({message: 'Buyer access required'});
    }

    next();
}

executionRoutes.get('/me', authMiddleware, getMyExecutions);
executionRoutes.get('/seller', authMiddleware, getSellerExecutions);
executionRoutes.post('/:agentId', authMiddleware, buyerOnly, execute);

export default executionRoutes;
