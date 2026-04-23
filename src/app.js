import express from 'express'
import cors from'cors'
import 'dotenv/config'

import authRouter from './routes/auth_routes.js'
import agentRouter from './routes/agent_routes.js'

const app = express()
app.use(cors())

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/agents', agentRouter);


app.get('/', (req, res)=>{
    res.send("Welcome to Agent Markets");
})

const connection = app.listen(process.env.PORT || 3000, ()=> {
    try {
        if (connection){
            console.log("connected to server on http://localhost:3000");
        }
    } catch (error) {
        console.log("Couln't connect to server", error)
    }
});

