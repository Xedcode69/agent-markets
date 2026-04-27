import { Router } from "express";
import {registerUser, loginUser} from "../controllers/auth_controller.js";
import {verifyOTP, resendOTP} from "../controllers/otp_controller.js";

const authRouter = Router();

authRouter.post('/signup', registerUser);
authRouter.post('/verify-otp', verifyOTP);
authRouter.post('/resend-otp', resendOTP);
authRouter.post('/login', loginUser);

export default authRouter;

