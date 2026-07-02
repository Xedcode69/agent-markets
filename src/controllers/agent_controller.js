import { getAllAgents, getAgentById, createAgent, getAgentsByOwnerId, updateAgent, deleteAgent} from "../models/agent_model.js";

const isPlainObject = (value) => {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

const validateAgentInputMetadata = (input_schema, example_input) => {
    if (input_schema !== undefined && input_schema !== null && !isPlainObject(input_schema)) {
        return 'Input schema must be a JSON object';
    }

    if (example_input !== undefined && example_input !== null && !isPlainObject(example_input)) {
        return 'Example input must be a JSON object';
    }

    return null;
}

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
        if (!agent) {
            return res.status(404).json({message: "Agent not found"});
        }

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
        const {name, description, endpoint_url, pricing_type, price, instructions, input_schema, example_input} = req.body;

        if (!name || !endpoint_url || !pricing_type || price === undefined) {
            return res.status(400).json({message: "Name, endpoint URL, pricing type and price are required"});
        }
        if (!['per_call', 'subscription'].includes(pricing_type)) {
            return res.status(400).json({message: "Pricing type must be per_call or subscription"});
        }
        if (!Number.isFinite(Number(price)) || Number(price) < 0) {
            return res.status(400).json({message: "Price must be a non-negative number"});
        }
        try {
            new URL(endpoint_url);
        } catch {
            return res.status(400).json({message: "Endpoint URL must be valid"});
        }
        const metadataError = validateAgentInputMetadata(input_schema, example_input);
        if (metadataError) {
            return res.status(400).json({message: metadataError});
        }

        const owner_id = req.user.id;

        const newAgent = await createAgent(
            name,
            description,
            endpoint_url,
            pricing_type,
            price,
            instructions ?? null,
            input_schema ?? null,
            example_input ?? null,
            owner_id
        );

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
        const {name, description, endpoint_url, pricing_type, price, instructions, input_schema, example_input} = req.body;

        if (!name || !endpoint_url || !pricing_type || price === undefined) {
            return res.status(400).json({message: "Name, endpoint URL, pricing type and price are required"});
        }
        if (!['per_call', 'subscription'].includes(pricing_type)) {
            return res.status(400).json({message: "Pricing type must be per_call or subscription"});
        }
        if (!Number.isFinite(Number(price)) || Number(price) < 0) {
            return res.status(400).json({message: "Price must be a non-negative number"});
        }
        try {
            new URL(endpoint_url);
        } catch {
            return res.status(400).json({message: "Endpoint URL must be valid"});
        }
        const metadataError = validateAgentInputMetadata(input_schema, example_input);
        if (metadataError) {
            return res.status(400).json({message: metadataError});
        }

        const updatedAgent = await updateAgent(
            agentId,
            name,
            description,
            endpoint_url,
            pricing_type,
            price,
            instructions ?? null,
            input_schema ?? null,
            example_input ?? null,
            owner_id
        );
        if (!updatedAgent) {
            return res.status(404).json({message: "Agent not found or not owned by you"});
        }

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
        if (!deletedAgent) {
            return res.status(404).json({message: "Agent not found or not owned by you"});
        }

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
