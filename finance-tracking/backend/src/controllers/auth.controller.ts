import {Request,Response} from "express"
import { handleError } from "../utils/errors";
import { error } from "console";
import prisma from "../db";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import nodemailer from "nodemailer"

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


export async function forgotPassword(req:Request,res:Response){
    try{
        const {email} = req.body;
        const user = await prisma.user.findUnique({
            where:{email}
        })

        if(!user){
            return res.status(401).json({error:"User Not Found"})
        }

        const token = crypto.randomBytes(32).toString("hex")
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000)
        await prisma.passwordResetToken.create({
            data: {
              token,
              userId: user.id,
              expiresAt,
            },
          });

        const resetUrl = `http://localhost:3000/reset-password/?token=${token}`
        const transporter = await nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS
            }
        })

        await transporter.sendMail({
            from:`Finora Support`,
            to:email,
            subject:"Reset Password Link",
            html:
            `<h2>Password Reset Request</h2>
            <p>We received a request to reset your password.Click below link:</p>
             <a href="${resetUrl}" style="color:#2563eb; font-weight:bold;">Reset Password</a>
        <p>This link will expire in 15 minutes.</p>`
        })

        console.log("Reset Link...",resetUrl)
        return res.status(201).json({message:"Reset Link Sent to Email Successfully"})

    }catch(err){
        return handleError(res,err)
    }
}

export async function resetPassword(req:Request,res:Response){
    try{
        const {token,password} = req.body;
        const resetToken = await prisma.passwordResetToken.findUnique({
            where:{token}
        })

        if(!resetToken || resetToken.expiresAt < new Date()){
            return res.status(401).json({error:"Invalid or Expired Token"})
        }

        const hashedPassword = await bcrypt.hash(password,10);

        await prisma.user.update({
            where:{id:resetToken.userId},
            data:{password:hashedPassword}
        })

        await prisma.passwordResetToken.delete({where:{id:resetToken.id}})

        return res.status(200).json({message:"Password Reset Successful"})
    }catch(err){
        return handleError(res,err)
    }
}