import express from 'express'
import cors from'cors'
import 'dotenv/config'

import {createUsersTable, createAgentsTable, createExecutionsTable, createTransactionsTable,
    createRatingsTable } from './migrations/tables.js'

import authRoutes from './routes/auth_routes.js'
import agentRoutes from './routes/agent_routes.js'
import userRoutes from './routes/user_routes.js'
import {connectDB} from './db/db.js'

const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/agents', agentRoutes);
app.use('/api/v1/users', userRoutes);

const startServer = async () => {
    await connectDB();
    await createUsersTable();
    await createAgentsTable();
    await createExecutionsTable();
    await createTransactionsTable();
    await createRatingsTable();

    const connection = app.listen(process.env.PORT || 3000, ()=> {
    console.log(`Server is running on  http://localhost:${process.env.PORT || 3000}`);
    });
};

startServer();

app.get('/', (req, res)=>{
    res.send("Welcome to Agent Markets");
});