import { getAllAgents, getAgentById, createAgent, getAgentsByOwnerId, updateAgent, deleteAgent} from "../models/agent_model.js";

const getAllAgentsController = async(req, res) => {
    try{
        const agents = await getAllAgents();

        res.status(200).json({
            message: "Agents retrieved successfully",
            data: agents
        })
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving agents",
            error: error.message
        })
    }
}

const getAgentByIdController = async(req, res) => {
    try {
        const agentId = req.params.id;

        const agent = await getAgentById(agentId);

        res.status(200).json({
            message: "Agent retrieved successfully",
            data: agent
        })
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving agent",
            error: error.message
        })
    }
}

const createAgentController  = async(req, res) => {
    try {
        const {name, description, endpoint_url, pricing_type, price} = req.body;

        const owner_id = req.user.id;

        const newAgent = await createAgent(name, description, endpoint_url, pricing_type, price, owner_id);

        res.status(201).json({
            message: "Agent created successfully",
            data: newAgent
        })
    } catch (error) {
        res.status(500).json({
            message: "Error creating agent",
            error: error.message
        })
    }
}

const getAgentsByOwnerIdController = async(req, res) => {
    try{
        const owner_id = req.user.id;

        const agents = await getAgentsByOwnerId(owner_id);

        res.status(200).json({
            message: "Agents retrieved successfully",
            data: agents
        })
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving agents",
            error: error.message
        })
    }
}

const updateAgentController = async(req, res) => {
    try {
        const agentId = req.params.id;
        const owner_id = req.user.id;
        const {name, description, endpoint_url, price} = req.body;

        const updatedAgent = await updateAgent(name, description, endpoint_url, price, agentId, owner_id);

        res.status(200).json({
            message: "Agent updated successfully",
            data: updatedAgent
        })
    } catch (error) {
        res.status(500).json({
            message: "Error updating agent",
            error: error.message
        })
    }
}

const deleteAgentController = async(req, res) => {
    try {
        const agentId = req.params.id;
        const owner_id = req.user.id;

        const deletedAgent = await deleteAgent(agentId, owner_id);

        res.status(200).json({
            message: "Agent deleted successfully",
            data: deletedAgent
        })
    } catch (error) {
        res.status(500).json({
            message: "Error deleting agent",
            error: error.message
        })
    }
}

export {getAllAgentsController, getAgentByIdController, createAgentController, getAgentsByOwnerIdController, updateAgentController, deleteAgentController};