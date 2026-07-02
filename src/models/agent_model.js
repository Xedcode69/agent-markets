import {pool} from '../db/db.js'

const createAgent = async(
    name,
    description,
    endpoint_url,
    pricing_type,
    price,
    instructions,
    input_schema,
    example_input,
    owner_id
) => {
    const query = await pool.query(
        'INSERT INTO agents (name, description, endpoint_url, pricing_type, price, instructions, input_schema, example_input, owner_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
        [name, description, endpoint_url, pricing_type, price, instructions, input_schema, example_input, owner_id]
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
    pricing_type,
    price,
    instructions,
    input_schema,
    example_input,
    owner_id
) => {
    const query = await pool.query('UPDATE agents SET name = $1, description = $2, endpoint_url = $3, pricing_type = $4, price = $5, instructions = $6, input_schema = $7, example_input = $8 WHERE id = $9 AND owner_id = $10 RETURNING *',
    [name, description, endpoint_url, pricing_type, price, instructions, input_schema, example_input, id, owner_id]);
    return query.rows[0];
}

const deleteAgent = async(id, owner_id) => {
    const query = await pool.query('UPDATE agents SET is_active = false WHERE id = $1 AND owner_id = $2 RETURNING *', [id, owner_id]);
    return query.rows[0];
}


export {createAgent, getAllAgents, getAgentById, getAgentsByOwnerId, updateAgent, deleteAgent};
