import jwt from 'jsonwebtoken'
import 'dotenv/config'

const authMiddleware = (req, res, next)=> {
    try {
        const header = req.headers.authorization;
        const cookieToken = req.cookies?.auth_token;
        const headerToken = header?.startsWith('Bearer ') ? header.split(' ')[1] : null;
        const token = cookieToken || headerToken;

        if (!token){
            return res.status(401).json({
                message: "Token not found"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            id: decoded.userId,
            role: decoded.role
        };

        next();
    }
    catch (error) {
        console.log("authorization failed", error);
        res.status(401).json({
            message: "Invalid or expired token"
        })
    }
}

export default authMiddleware;
