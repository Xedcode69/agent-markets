import express from 'express'
import cors from'cors'
import 'dotenv/config'

import authRouter from './routes/auth_routes.js'
import agentRouter from './routes/agent_routes.js'
import connectDB from './db/db.js'

const app = express()
app.use(cors())


app.use('/api/v1/auth', authRouter);
app.use('/api/v1/agents', agentRouter);

connectDB();

app.get('/', (req, res)=>{
    res.send("Welcome to Agent Markets");
})

const connection = app.listen(process.env.PORT || 3000, ()=> {
    console.log(`Server is running on  http://localhost:${process.env.PORT || 3000}`);
});

