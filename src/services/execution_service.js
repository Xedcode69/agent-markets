import axios from 'axios';
import {pool} from '../db/db.js';
import {getAgentById} from '../models/agent_model.js';
import {logExecution, logTransaction} from '../models/execution_model.js';


const executeAgent = async({agentId, userId, inputData}) => {

    const client = await pool.connect();

    try{
        await client.query('BEGIN');

        const agent = await getAgentById(agentId);
        if (!agent) {
            throw new Error('Agent not found');
        }

        const checkCredit = await pool.query('UPDATE users SET credits = credits - $1 WHERE id = $2 AND credits >= $1 RETURNING *', [agent.cost, userId]);
        if (checkCredit.row.length === 0) {
            throw new Error('Insufficient credits');
        }

        const starrTime = Date.now();
        try{
            const response = axios.post(agent.endpoint_url, inputData, {
                timeout: 10000
            })
            let output = response.data;
            let status = 'completed';
        }
        catch (error) {
            let output = {error: error.message};
            let status = 'failed';
        }

        const responseTime = Date.now() - startTime;

        let cost = agent.cost;

        if (status === 'failed'){
            await pool.query('UPDATE users SET credits = credits + $1 WHERE id = $2', [agent.price, userId]);
            cost = 0;
        }

        await logExecution(agentId, userId, inputData, output, status, cost, responseTime);

        if (cost > 0){
            await logTransaction(userId, cost, 'usage_deduction', 'completed');
        }

        await client.query('COMMIT');
        return {output, status, cost, responseTime};



    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error executing agent:', error);
        throw error;
    }
    finally{
        client.release();
    }
}

export {executeAgent};