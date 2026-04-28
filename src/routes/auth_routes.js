import { Router } from "express";
import {registerUser, loginUser} from "../controllers/auth_controller.js";
import {verifyOTP, resendOTP} from "../controllers/otp_controller.js";

const authRoutes = Router();

authRoutes.post('/signup', registerUser);
authRoutes.post('/verify-otp', verifyOTP);
authRoutes.post('/resend-otp', resendOTP);
authRoutes.post('/login', loginUser);

export default authRoutes;

