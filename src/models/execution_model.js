import {pool} from '../db/db.js'

const logExecution = async(
    agentId,
    userId,
    inputData,
    outputData,
    status,
    cost,
    responseTime,
    db = pool
) => {
    const query = await db.query('INSERT INTO executions(agent_id, user_id, input, output, status, cost, response_time) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *', [agentId, userId, inputData, outputData, status, cost, responseTime]);

    return query.rows[0];
}

const logTransaction = async(userId, amount, type, status, db = pool) => {
    const query = await db.query('INSERT INTO transactions(user_id, amount, type, status) VALUES($1, $2, $3, $4) RETURNING *', [userId, amount, type, status]);

    return query.rows[0];
}


const getExecutionsByUserId = async(userId) => {
    const query = await pool.query('SELECT * FROM executions WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return query.rows;
}

const getExecutionsBySellerId = async(sellerId) => {
    const query = await pool.query(`
        SELECT executions.*
        FROM executions
        JOIN agents ON agents.id = executions.agent_id
        WHERE agents.owner_id = $1
        ORDER BY executions.created_at DESC
    `, [sellerId]);
    return query.rows;
}

const getTransactionsByUserId = async(userId) => {
    const query = await pool.query('SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return query.rows;
}

const getExecutionsById = async(executionId) => {
    const query = await pool.query('SELECT * FROM executions WHERE id = $1', [executionId]);
    return query.rows[0];
}

export {logExecution, logTransaction, getExecutionsByUserId, getExecutionsBySellerId, getTransactionsByUserId, getExecutionsById};
