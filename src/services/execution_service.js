import axios from 'axios';
import {pool} from '../db/db.js';
import {getAgentById} from '../models/agent_model.js';
import {logExecution, logTransaction} from '../models/execution_model.js';


const executeAgent = async({agentId, userId, data}) => {

    const client = await pool.connect();

    try{
        if (!data || Object.keys(data).length === 0) {
            throw new Error('Input data is required for agent execution');
        }

        await client.query('BEGIN');

        const agent = await getAgentById(agentId);
        if (!agent) {
            throw new Error('Agent not found');
        }
        if (!agent.is_active) {
            throw new Error('Agent is not active');
        }

        const price = Number(agent.price);
        if (!Number.isFinite(price) || price < 0) {
            throw new Error('Invalid agent price');
        }

        const checkCredit = await client.query('UPDATE users SET credits = credits - $1 WHERE id = $2 AND credits >= $1 RETURNING *', [price, userId]);
        if (checkCredit.rows.length === 0) {
            throw new Error('Insufficient credits');
        }

        const startTime = Date.now();
        let output;
        let status;
        
        try{
            const response = await axios.post(agent.endpoint_url, data, {
                timeout: 10000
            })
            output = response.data;
            status = 'completed';
        }
        catch (error) {
            output = {error: error.message};
            status = 'failed';
        }

        const responseTime = Date.now() - startTime;

        let cost = price;

        if (status === 'failed'){
            await client.query('UPDATE users SET credits = credits + $1 WHERE id = $2', [price, userId]);
            cost = 0;
        }

        await logExecution(agentId, userId, data, output, status, cost, responseTime, client);

        if (cost > 0){
            await logTransaction(userId, cost, 'usage_deduction', 'completed', client);
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
