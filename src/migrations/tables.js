import {pool} from '../db/db.js';

const createUsersTable = async() => {
    const query = `CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT CHECK (role in ('buyer', 'seller')) NOT NULL,
        credits INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;

        try {
            await pool.query(query);
            console.log('Users table created successfully');
        }
        catch (error) {
            console.error('Error creating users table:', error);
        }
}

const createAgentsTable = async() => {
    const query = `CREATE TABLE IF NOT EXISTS agents(
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        endpoint_url TEXT NOT NULL,
        pricing_type TEXT CHECK(pricing_type in ('per_call', 'subscription')) NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;

        try {
            await pool.query(query);
            console.log('Agents table created successfully');
        }
        catch (error) {
            console.error('Error creating agents table:', error);
        }
}

const createExecutionsTable = async() => {
    const query = `CREATE TABLE IF NOT EXISTS executions(
        id SERIAL PRIMARY KEY,
        agent_id INTEGER REFERENCES agents(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        input JSONB,
        output JSONB,
        status TEXT CHECK(status in ('pending', 'completed', 'failed')) NOT NULL,
        cost NUMERIC(10, 2) NOT NULL,
        response_time INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;

        try {
            await pool.query(query);
            console.log('Executions table created successfully');
        }
        catch (error) {
            console.error('Error creating executions table:', error);
        }
}

const createTransactionsTable = async() => {
    const query = `CREATE TABLE IF NOT EXISTS transactions(
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        amount NUMERIC(10, 2) NOT NULL,
        type TEXT CHECK(type in ('credit_purchase', 'usage_deduction')) NOT NULL,
        status TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;

        try {
            await pool.query(query);
            console.log('Transactions table created successfully');
        }
        catch (error) {
            console.error('Error creating transactions table:', error);
        }
}

const createRatingsTable = async() => {
    const query = `CREATE TABLE IF NOT EXISTS ratings(
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        agent_id INTEGER REFERENCES agents(id) ON DELETE CASCADE,
        rating INTEGER CHECK (rating BETWEEN 1 AND 5) NOT NULL,
        review TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, agent_id)
        );`;

        try {
            await pool.query(query);
            console.log('Ratings table created successfully');
        }
        catch (error) {
            console.error('Error creating ratings table:', error);
        }
}

export {
    createUsersTable,
    createAgentsTable,
    createExecutionsTable,
    createTransactionsTable,
    createRatingsTable
}

