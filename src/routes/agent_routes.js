import { Router } from "express";

const agentRoutes = Router();


agentRoutes.get('/agents', (req, res)=> {
    res.send("get all agents route");
})

agentRoutes.post('/agents', (req, res)=> {
    res.send("create agent route");
})

agentRoutes.get('/agents/:id', (req, res)=> {
    res.send("get agent by id route");
})

agentRoutes.delete('/agents/:id', (req, res)=> {
    res.send("delete agent by id route");
})

export default agentRoutes;
