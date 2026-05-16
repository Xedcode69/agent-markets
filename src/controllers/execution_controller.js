import {executeAgent} from '../services/execution_service.js';

export const execute = async(req, res)=> {
    try{
        const agentId = req.params.agentId;
        const userId = req.user.id;
        const data = req.body;

        const result = await executeAgent({agentId, userId, data});
        res.status(200).json({
            success: true,
            message: 'Agent executed successfully',
            data: result
        });
    } catch (error) {
        console.error('Error executing agent:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to execute agent',
            error: error.message
        });

    }
}