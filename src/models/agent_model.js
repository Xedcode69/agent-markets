import {pool} from '../db/db.js'

const createAgent = async(
    name,
    description,
    endpoint_url,
    pricing_type,
    price,
    owner_id
) => {
    const query = await pool.query(
        'INSERT INTO agents (name, description, endpoint_url, pricing_type, price, owner_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [name, description, endpoint_url, pricing_type, price, owner_id]
    );
    return query.rows[0];
}

const getAllAgents = async() => {
    const query = await pool.query('SELECT * FROM agents WHERE is_active = true');
    return query.rows;
}

const getAgentById = async(id) => {
    const query = await pool.query('SELECT * FROM agents WHERE id = $1', [id]);
    return query.rows[0];
}

const getAgentsByOwnerId = async(owner_id) => {
    const query = await pool.query('SELECT * FROM agents WHERE owner_id = $1 AND is_active = true', [owner_id]);
    return query.rows;
}

const updateAgent = async(
    id,
    name,
    description,
    endpoint_url,
    price,
    owner_id
) => {
    const query = await pool.query('UPDATE agents SET name = $1, description = $2, endpoint_url = $3, price = $4 WHERE id = $5 AND owner_id = $6 RETURNING *',
    [name, description, endpoint_url, price, id, owner_id]);
    return query.rows[0];
}

const deleteAgent = async(id, owner_id) => {
    const query = await pool.query('UPDATE agents SET is_active = false WHERE id = $1 AND owner_id = $2 RETURNING *', [id, owner_id]);
    return query.rows[0];
}


export {createAgent, getAllAgents, getAgentById, getAgentsByOwnerId, updateAgent, deleteAgent};