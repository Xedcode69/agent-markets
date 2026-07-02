import express from 'express'
import cors from'cors'
import cookieParser from 'cookie-parser'
import 'dotenv/config'

import {createUsersTable, createOtpCodesTable, createAgentsTable, createExecutionsTable, createTransactionsTable,
    createRatingsTable } from './migrations/tables.js'

import authRoutes from './routes/auth_routes.js'
import agentRoutes from './routes/agent_routes.js'
import userRoutes from './routes/user_routes.js'
import executionRoutes from './routes/execution_routes.js'
import {csrfMiddleware} from './middleware/csrf.js'
import {connectDB} from './db/db.js'

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use(csrfMiddleware);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/agents', agentRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/executions', executionRoutes);

const startServer = async () => {
    await connectDB();
    await createUsersTable();
    await createOtpCodesTable();
    await createAgentsTable();
    await createExecutionsTable();
    await createTransactionsTable();
    await createRatingsTable();

    const port = process.env.PORT || 5000;
    app.listen(port, ()=> {
    console.log(`Server is running on  http://localhost:${port}`);
    });
};

startServer();

app.get('/', (req, res)=>{
    res.send("Welcome to Agent Markets");
});
