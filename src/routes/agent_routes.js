import { Router } from "express";
import {getAllAgentsController, getAgentByIdController, createAgentController, getAgentsByOwnerIdController, updateAgentController, deleteAgentController} from "../controllers/agent_controller.js";

const agentRoutes = Router();


agentRoutes.get('/agents', getAllAgentsController);

agentRoutes.post('/agents/new', createAgentController);

agentRoutes.get('/agents/owner', getAgentsByOwnerIdController);

agentRoutes.get('/agents/:id', getAgentByIdController);

agentRoutes.put('/agents/:id', updateAgentController);

agentRoutes.delete('/agents/:id', deleteAgentController);

export default agentRoutes;
