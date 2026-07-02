import { Router } from "express";
import {getAllAgentsController, getAgentByIdController, createAgentController, getAgentsByOwnerIdController, updateAgentController, deleteAgentController} from "../controllers/agent_controller.js";
import authMiddleware from '../middleware/check_authorized.js'

const agentRoutes = Router();

const sellerOnly = (req, res, next) => {
    if (req.user.role !== 'seller') {
        return res.status(403).json({message: 'Seller access required'});
    }

    next();
}

agentRoutes.get('/', getAllAgentsController);
agentRoutes.get('/agents', getAllAgentsController);

agentRoutes.post('/', authMiddleware, sellerOnly, createAgentController);
agentRoutes.post('/agents/new', authMiddleware, sellerOnly, createAgentController);

agentRoutes.get('/owner', authMiddleware, sellerOnly, getAgentsByOwnerIdController);
agentRoutes.get('/agents/owner', authMiddleware, sellerOnly, getAgentsByOwnerIdController);

agentRoutes.get('/:id', getAgentByIdController);
agentRoutes.get('/agents/:id', getAgentByIdController);

agentRoutes.put('/:id', authMiddleware, sellerOnly, updateAgentController);
agentRoutes.put('/agents/:id', authMiddleware, sellerOnly, updateAgentController);

agentRoutes.delete('/:id', authMiddleware, sellerOnly, deleteAgentController);
agentRoutes.delete('/agents/:id', authMiddleware, sellerOnly, deleteAgentController);

export default agentRoutes;
