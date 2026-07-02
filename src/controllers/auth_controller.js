import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import 'dotenv/config'
import {pool} from'../db/db.js'
import {createUser, getUserByEmail} from '../models/user_model.js'
import {sendOTPEmail} from '../services/otp_email_service.js'

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
}

const clearCookieOptions = {
    httpOnly: cookieOptions.httpOnly,
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite
}

const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const registerUser = async (req, res)=> {
    try {
        const {email, password, role} = req.body;

        if (!email || !password || !role){
            return res.status(400).json({
                message: 'Email, password and role are required'
            })
        }
        if (!isValidEmail(email)) {
            return res.status(400).json({
                message: 'Enter a valid email address'
            })
        }
        if (password.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters'
            })
        }
        if (!['buyer', 'seller'].includes(role)) {
            return res.status(400).json({
                message: 'Role must be buyer or seller'
            })
        }
        
        const existingUser =  await getUserByEmail(email);
        if (existingUser){
            return res.status(400).json({
                message: 'User already exists'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await createUser(email, hashedPassword, role);

        const generateOTP = () => {
            return crypto.randomInt(100000, 900000).toString();
        }

        const otp = generateOTP();
        await pool.query('INSERT INTO otp_codes (user_id, code, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'5 minutes\')', [newUser.id, otp] );

        await sendOTPEmail(email, otp);
        res.status(200).json({
            message: 'OTP sent successfully',
            userId: newUser.id
        });

    }
    catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
}


export const loginUser = async(req, res) => {
    try {
        const {email, password} = req.body;

        if (!email || !password){
            return res.status(400).json({
                message: 'Email and password are required'
            })
        }
        if (!isValidEmail(email)) {
            return res.status(400).json({
                message: 'Enter a valid email address'
            })
        }

        const existingUser = await getUserByEmail(email);

        if (!existingUser) {
            return res.status(400).json({
                message: 'User does not exist'
            })
        }

        const isPassword = await bcrypt.compare(password, existingUser.password);

        if (!isPassword){
            return res.status(400).json({
                message: 'Incorrect password'
            })
        }

        if (existingUser.is_verified != true) {
            return res.status(400).json({
                message: 'User not verified'
            })
        }

        const token = jwt.sign({
            userId: existingUser.id,
            role: existingUser.role
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        res.cookie('auth_token', token, cookieOptions);

        res.status(200).json({
            message: "Login successful",
            user: {
                id: existingUser.id,
                email: existingUser.email,
                role: existingUser.role
            }
        })

    }
    catch (error){
        console.error("failed to login", error);
        res.status(500).json({
            message: 'Internal server error'
        })
    }
}

export const logoutUser = async(req, res) => {
    res.clearCookie('auth_token', clearCookieOptions);

    res.status(200).json({
        message: 'Logout successful'
    });
}
