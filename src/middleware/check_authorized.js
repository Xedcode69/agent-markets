import jwt from 'jsonwebtoken'
import 'dotenv/config'

const authMiddleware = (req, res, next)=> {
    try {
        const header = req.headers.authorization;

        if (!header || !header.startsWith('Bearer ')){
            return res.status(403).json("Token not found");
        }

        const token = header.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    }
    catch (error) {
        console.log("authorization failed", error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export default authMiddleware;