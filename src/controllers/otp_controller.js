import {pool} from '../db/db.js'
import {sendOTPEmail }from '../services/otp_email_service.js'
import {getUserById} from '../models/user_model.js'

const verifyOTP = async (req, res) => {
    try {
        const {userId, code } = req.body;

        const queryResult = await pool.query('SELECT * from otp_codes WHERE user_id = $1 AND code = $2 ORDER BY created_at DESC LIMIT 1', [userId, code]);

        const otpRecord = queryResult.rows[0];

        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid OTP code' });
        }

        if (otpRecord.expires_at < new Date()) {
            return res.status(400).json({ message: 'OTP code has expired' });
        }

        await pool.query('UPDATE users SET is_verified = true WHERE user_id = $1', [userId]);

        await pool.query('DELETE FROM otp_codes WHERE user_id = $1', [userId]);
        
        res.status(200).json({ message: 'Email verified successfully' });


    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const resendOTP = async (req, res) => {
    try{
        const { userId } = req.body;

        // Logic for resending OTP
        const generateOTP = () => {
            return crypto.randomInt(100000, 900000).toString();
        }
        const otp = generateOTP();

        await pool.query('INSERT INTO otp_codes (user_id, code, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'2 minutes\')', [userId, otp] );
        const user = await getUserById(userId)
        sendOTPEmail(user.email , otp);
        res.status(200).json({ message: 'OTP code resent successfully' });
    

    } catch (error) {
        console.error('Error resending OTP:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export {verifyOTP, resendOTP};