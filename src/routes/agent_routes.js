import { Router } from "express";

const agentRouter = Router();


agentRouter.get('/agents', (req, res)=> {
    res.send("get all agents route");
})

agentRouter.post('/agents', (req, res)=> {
    res.send("create agent route");
})

agentRouter.get('/agents/:id', (req, res)=> {
    res.send("get agent by id route");
})

agentRouter.delete('/agents/:id', (req, res)=> {
    res.send("delete agent by id route");
})

export default agentRouter;
