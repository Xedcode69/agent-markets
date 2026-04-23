import { Router } from "express";

const authRouter = Router();

authRouter.post('/signup', (req, res)=> {
    res.send("signup route");
})

authRouter.post('/login', (req, res)=> {
    res.send("login route");
})

export default authRouter;

