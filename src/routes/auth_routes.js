import { Router } from "express";
import {registerUser, loginUser, logoutUser} from "../controllers/auth_controller.js";
import {verifyOTP, resendOTP} from "../controllers/otp_controller.js";
import {issueCsrfToken} from "../middleware/csrf.js";

const authRoutes = Router();

authRoutes.get('/csrf-token', issueCsrfToken);
authRoutes.post('/signup', registerUser);
authRoutes.post('/verify-otp', verifyOTP);
authRoutes.post('/resend-otp', resendOTP);
authRoutes.post('/login', loginUser);
authRoutes.post('/logout', logoutUser);

export default authRoutes;

