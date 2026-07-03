import {pool} from '../db/db.js'

const createAgent = async(
    name,
    description,
    endpoint_url,
    endpoint_method,
    pricing_type,
    price,
    instructions,
    input_schema,
    example_input,
    owner_id
) => {
    const query = await pool.query(
        'INSERT INTO agents (name, description, endpoint_url, endpoint_method, pricing_type, price, instructions, input_schema, example_input, owner_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
        [name, description, endpoint_url, endpoint_method, pricing_type, price, instructions, input_schema, example_input, owner_id]
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
    endpoint_method,
    pricing_type,
    price,
    instructions,
    input_schema,
    example_input,
    owner_id
) => {
    const query = await pool.query('UPDATE agents SET name = $1, description = $2, endpoint_url = $3, endpoint_method = $4, pricing_type = $5, price = $6, instructions = $7, input_schema = $8, example_input = $9 WHERE id = $10 AND owner_id = $11 RETURNING *',
    [name, description, endpoint_url, endpoint_method, pricing_type, price, instructions, input_schema, example_input, id, owner_id]);
    return query.rows[0];
}

const deleteAgent = async(id, owner_id) => {
    const query = await pool.query('UPDATE agents SET is_active = false WHERE id = $1 AND owner_id = $2 RETURNING *', [id, owner_id]);
    return query.rows[0];
}


export {createAgent, getAllAgents, getAgentById, getAgentsByOwnerId, updateAgent, deleteAgent};
