import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
})

const connectDB = async () => {
    try {
        await pool.query('SELECT NOW()');
        console.log("connected to database successfully");
    } catch (error) {
        console.log("Couldn't connect to database", error);
    }
}

export {pool, connectDB};