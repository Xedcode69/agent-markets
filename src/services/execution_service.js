import axios from 'axios';
import {pool} from '../db/db.js';
import {getAgentById} from '../models/agent_model.js';
import {logExecution, logTransaction} from '../models/execution_model.js';
import {validateJsonSchema} from '../utils/json_schema_validator.js';

const isPlainObject = (value) => {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

const getPathValue = (data, path) => {
    return path.split('.').reduce((current, key) => {
        if (!isPlainObject(current)) {
            return undefined;
        }

        return current[key];
    }, data);
}

const resolveEndpointTemplate = (endpointUrl, data) => {
    const usedKeys = new Set();
    const url = endpointUrl.replace(/:([A-Za-z_][A-Za-z0-9_.]*)|\{([A-Za-z_][A-Za-z0-9_.]*)\}/g, (match, colonKey, braceKey) => {
        const key = colonKey || braceKey;
        const value = getPathValue(data, key);

        if (value === undefined || value === null || value === '') {
            throw new Error(`Missing endpoint parameter: ${key}`);
        }

        usedKeys.add(key);
        return encodeURIComponent(String(value));
    });

    return {url, usedKeys};
}

const buildQueryParams = (data, usedKeys) => {
    return Object.fromEntries(
        Object.entries(data).filter(([key, value]) => {
            return !usedKeys.has(key) && value !== undefined && value !== null && value !== '';
        })
    );
}

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

        const validationErrors = validateJsonSchema(data, agent.input_schema);
        if (validationErrors.length > 0) {
            throw new Error(`Invalid execution input: ${validationErrors.join('; ')}`);
        }

        const endpoint = resolveEndpointTemplate(agent.endpoint_url, data);
        const endpointMethod = agent.endpoint_method || 'POST';

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
            const response = endpointMethod === 'GET'
                ? await axios.get(endpoint.url, {
                    params: buildQueryParams(data, endpoint.usedKeys),
                    timeout: 10000
                })
                : await axios.post(endpoint.url, data, {
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
