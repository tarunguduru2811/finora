import {Request,Response ,NextFunction} from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();
interface JwtPayloadCustom{
    userId:number
}

export function authenticateToken(req:Request,res:Response,next:NextFunction){
    try{
        const authHeader = req.headers["authorization"]
        const token = authHeader && authHeader.split(' ')[1];
        console.log("Token....",token);
        if(!token) return res.status(401).json({error:"Missing Token"})
        
        const secret = process.env.JWT_SECRET!;
        
        const payload =  jwt.verify(token,secret) as JwtPayloadCustom
        (req as any).user = {userId : payload.userId};
        console.log("UserID....",(req as any).user.userId)
        next();
    }
    catch(error){
        return res.status(400).json({error:"Inavlid or Expired Token"})
    }
}