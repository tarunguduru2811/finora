import {Request,Response} from "express"
import { handleError } from "../utils/errors";
import { error } from "console";
import prisma from "../db";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export async function register(req:Request,res:Response){
    try{
        const {email,password,name} = req.body;

        if(!name || !password) return res.status(400).json({error:"Email and Password Required"})
        
        const existing = await prisma.user.findUnique({
            where:{email}
        })
        if(existing) return res.status(401).json({error:"User Already Exists"})

        const hashed = await bcrypt.hash(password,10);
        const user = await prisma.user.create({
            data:{email,name,password:hashed}
        })
        const {password:_,...safe} = user as any;
        return res.status(201).json(safe);
    }
    catch(error){
        console.log("Error in Register",error);
        return handleError(res,error);
    }
}

export async function  login(req:Request,res:Response) {
    try{
        const {email,password} = req.body;
        if(!email || !password) return res.status(400).json({error:"Email and Password are required"})

        const user = await prisma.user.findUnique({
            where:{email}
        })
        if(!user){
            return res.status(401).json({
                error:"Invalid Credentials"
            })
        }

        const ok = await bcrypt.compare(password,user.password);
        if(!ok) return res.status(400).json({error:"Invalid Credentials"})
        
        const token = jwt.sign({userId:user.id},process.env.JWT_SECRET!,{expiresIn:'1d'});
        return res.json({token,user})
    }catch(err){
        return handleError(res,err)
    }
}