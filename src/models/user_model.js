import {pool} from'../db/db.js'

const createUser = async(email, password, role) => {
    const result = await pool.query('INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role', [email, password, role]);
    return result.rows[0];
}  


const getUserByEmail = async(email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
}

const getUserById = async(userId) => {
    const result = await pool.query('SELECT id, email, role, credits, is_verified, created_at FROM users WHERE id = $1',[userId]);
    return result.rows[0];
}


// user related database operations

const getAllUsers = async() => {
    const result = await pool.query('SELECT id, email, role, credits, is_verified, created_at FROM users');
    return result.rows;
}

const getSellers = async() => {
    const result = await pool.query('SELECT id, email, role, credits, is_verified, created_at FROM users WHERE role = $1', ['seller']);
    return result.rows;
}

const getBuyers = async() => {
    const result = await pool.query('SELECT id, email, role, credits, is_verified, created_at FROM users WHERE role = $1', ['buyer']);
    return result.rows;
}

const addCredits = async(userId, amount, db = pool) => {
    const result = await db.query('UPDATE users SET credits = credits + $1 WHERE id = $2 RETURNING id, email, role, credits, is_verified, created_at', [amount, userId]);
    return result.rows[0];
}

export {createUser, getUserByEmail, getUserById, getAllUsers, getSellers, getBuyers, addCredits};
