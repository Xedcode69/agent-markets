import {pool} from '../db/db.js'

const logExecution = async(
    agentId,
    userId,
    inputData,
    outputData,
    status,
    cost,
    responseTime
) => {
    const query = await pool.query('INSERT INTO executions(agent_id, user_id, input, output, status, cost, response_time) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *', [agentId, userId, inputData, outputData, status, cost, responseTime]);

    return query.rows[0];
}

const logTransaction = async(userId, amount, type, status) => {
    const query = await pool.query('INSERT INTO transactions(user_id, amount, type, status) VALUES($1, $2, $3, $4) RETURNING *', [userId, amount, type, status]);

    return query.rows[0];
}


const getExecutionsByUserId = async(userId) => {
    const query = await pool.query('SELECT * FROM executions WHERE userId = $1 ORDER BY created_at DESC', [userId]);
    return query.rows;
}

const getExecutionsById = async(executionId) => {
    const query = await pool.query('SELECT * FROM executions WHERE id = $1', [executionId]);
    return query.rows[0];
}

export {logExecution, logTransaction, getExecutionsByUserId, getExecutionsById};
