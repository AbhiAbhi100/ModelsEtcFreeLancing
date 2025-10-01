import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async(req,res,next)=>{
    try {
        const header = req.headers.authorization || "";
        const token = header.startsWith("Bearer ")? header.split(" ")[1]:null;

        if(!token) return res.status(401).json({message:"No token"});

        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if(!user || user.isBanned) return res.status(401).json({message:"Invalid user"});

        req.user = {id:user._id,role:user.role,email:user.email};
        next();

    } catch (error) {
        return res.status(401).json({message:"Not authorized"});
    }
};