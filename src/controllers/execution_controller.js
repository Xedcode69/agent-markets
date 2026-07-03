import {getExecutionsBySellerId, getExecutionsByUserId} from '../models/execution_model.js';
import {executeAgent} from '../services/execution_service.js';

export const execute = async(req, res)=> {
    try{
        const agentId = req.params.agentId;
        const userId = req.user.id;
        const data = req.body;

        if (!Number.isInteger(Number(agentId))) {
            return res.status(400).json({
                success: false,
                message: 'Valid agent ID is required'
            });
        }
        if (!data || Array.isArray(data) || typeof data !== 'object' || Object.keys(data).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Execution input must be a non-empty JSON object'
            });
        }

        const result = await executeAgent({agentId, userId, data});
        res.status(200).json({
            success: true,
            message: 'Agent executed successfully',
            data: result
        });
    } catch (error) {
        console.error('Error executing agent:', error);
        const statusCode = ['Agent not found', 'Agent is not active', 'Insufficient credits', 'Invalid agent price'].includes(error.message)
            || error.message?.startsWith('Invalid execution input:')
            || error.message?.startsWith('Missing endpoint parameter:')
            ? 400
            : 500;

        res.status(statusCode).json({
            success: false,
            message: 'Failed to execute agent',
            error: error.message
        });

    }
}

export const getMyExecutions = async(req, res) => {
    try {
        const executions = await getExecutionsByUserId(req.user.id);

        res.status(200).json({
            message: 'Executions retrieved successfully',
            data: executions
        });
    } catch (error) {
        console.error('Error retrieving executions:', error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
}

export const getSellerExecutions = async(req, res) => {
    try {
        if (req.user.role !== 'seller') {
            return res.status(403).json({message: 'Seller access required'});
        }

        const executions = await getExecutionsBySellerId(req.user.id);

        res.status(200).json({
            message: 'Seller executions retrieved successfully',
            data: executions
        });
    } catch (error) {
        console.error('Error retrieving seller executions:', error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
}
