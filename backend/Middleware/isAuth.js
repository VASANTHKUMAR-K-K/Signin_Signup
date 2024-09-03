import jwt from 'jsonwebtoken';
import { User } from "../Models/User.js";

export const isAuth = async (req, res, next) => {
    try {
        const token = req.headers.token;
        //console.log(token)
        if(!token){
            return res.status(403).json({
                message: "please login to access...",
            });
        }
        //DECODE JWT SOGNED
        const decodeData = jwt.verify(token, process.env.JWT_SECRETE);
        req.User = await User.findById(decodeData._id);
        next()
    } catch (error) {
        return res.status(403).json({
            message: "please login to access", 
        })
    }
}