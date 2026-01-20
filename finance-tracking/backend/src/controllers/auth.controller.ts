import { NextFunction, Request,Response} from "express"
import { handleError } from "../utils/errors";
import { error, profile } from "console";
import prisma from "../db";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import nodemailer from "nodemailer"
import passport from "passport"
import {Strategy as GoogleStrategy} from "passport-google-oauth20"
import {Strategy as GitLabStrategy} from "passport-gitlab2"
// import {Strategy as TwitterStrategy} from "passport-twitter"
import dotenv from 'dotenv';
dotenv.config();


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

// passport.use(new TwitterStrategy({
//     consumerKey:process.env.TWITTER_CLIENT_ID!,
//     consumerSecret:process.env.TWITTER_CLIENT_SECRET!,
//     callbackURL:process.env.TWITTER_CALLBACK_URL!,
//    },
//    async (accessToken:string,refreshToken:string,profile:any,done:(err:any,user?:any)=>void)=>{
//     try{
//         let user = await prisma.user.findUnique({
//             where:{providerId:profile.id}
//         })

//         if(!user){
//             user = await prisma.user.create({
//                 data:{
//                         email:profile.emails?.[0].value || "",
//                         name:profile.displayName,
//                         provider:"twitter",
//                         providerId:profile.id,
//                         password:"" //TODO:handle password for oauth users
//                 }
//             })
//         }
//         return done(null,user)
//     }catch(err){
//         return done(err,null);
//     }
//    }

// ))

passport.use(new GitLabStrategy({
    clientID:process.env.GITLAB_CLIENT_ID!,
    clientSecret:process.env.GITLAB_CLIENT_SECRET!,
    callbackURL:process.env.GITLAB_CALLBACK_URL!,
   },
   async (accessToken:string,refreshToken:string,profile:any,
    done:(error:any,user?:any)=>void)  => {
        try{
            let user = await prisma.user.findUnique({
                where:{providerId:profile.id}
            })

            if(!user){
                user = await prisma.user.create({
                    data:{
                        email:profile.emails?.[0].value || "",
                        name:profile.displayName,
                        provider:"gitlab",
                        providerId:profile.id,
                        password:"" //TODO:handle password for oauth users
                    }
                })                
            }
            return done(null,user)
        }catch(err){
            return done(err,null);
        }
    }
   )
)

passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID!,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL:process.env.GOOGLE_CALLBACK_URL!,
    },
    async (accessToken:string,refreshToken:string,profile:any,
        done:(error:any,user?:any)=>void) => {
        try{
            let user = await prisma.user.findUnique(
                {where:{providerId:profile.id}}
            )

            if(!user){
                user = await prisma.user.create({
                    data:{
                        email:profile.emails?.[0].value || "",
                        name:profile.displayName,
                        provider:"google",
                        providerId:profile.id,
                        password:"" //TODO:handle password for oauth users
                    }
                })
            }
            return done(null,user)
        }catch(err){
            return done(err,null)
        }
    }
))



//Serialize / Deserialize user (for passport session)
passport.serializeUser((user: any, done:(error:any,user:any)=>void) => done(null, user.id))
passport.deserializeUser(async (id:number,done:(error:any,user:any)=>void)=>{
    const user = await prisma.user.findUnique({where:{id}})
    done(null,user)
})

export function googleAuth(req: Request, res: Response) {
    passport.authenticate("google", { scope: ["profile", "email"] })(req, res);
}

export function googleAuthCallback(req: Request, res: Response,next: NextFunction) {
    passport.authenticate("google", { failureRedirect: "/api/auth/login" }, (err, user) => {
        // if (err) return next(err);
        if (!user) return res.redirect("/api/auth/login");
        
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });
        res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
    })(req, res,next);
}

export function gitlabAuth(req:Request,res:Response){
    passport.authenticate("gitlab",{scope:["read_user"]})(req,res);
}

export function gitlabAuthCallback(req:Request,res:Response,next: NextFunction){
    passport.authenticate("gitlab",{failureRedirect:"/login"},(err:any,user:any)=>{
        // if(err) return next(err);
        if(!user) return res.redirect("/api/auth/login");

        const token = jwt.sign(
            {userId:user.id},
            process.env.JWT_SECRET!,
            {expiresIn:"7d"}
        )

        res.cookie("token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:"lax",
        })

        res.redirect(`${process.env.CLIENT_URL}/dashboard`)
    })(req,res,next)
}

// export function twitterAuth(req:Request,res:Response){
//     try{
//          console.log("Called twitterAuth")
//          passport.authenticate("twitter")(req,res);
//     }catch(err){
//         console.log("Error in while authenticating using twitter",err)
//     }
//     }
   

export function twitterAuthCallback(req: Request, res: Response, next:  NextFunction) {
    console.log("Twitter Callback Called")
    passport.authenticate("twitter", { failureRedirect: "/api/auth/login" }, (err: any, user: any) => {
         console.log("NEXT IS:", typeof next);
      if (err) return next(err); // ✅ Now this works
      if (!user) return res.redirect("/login");
  
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );
  
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
  
      res.redirect(`${process.env.CLIENT_URL}/dashboard`);
    })(req, res, next); // ✅ MUST INCLUDE `next`
  }



export async function googleAuthenticate(req:Request,res:Response){
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(' ')[1] || req.cookies.token;
    console.log("Token in me route....",token);
    if(!token) return res.status(401).json({error:"Not Authenticated"})
    console.log("Token....",token)
    const payload = jwt.verify(token,process.env.JWT_SECRET!) as any;
    console.log("Payload:",payload);
    const userId = payload.userId;

    const user = await prisma.user.findUnique({
        where:{id:userId}
    })

    const {password,...safeUser} = user as any;
    const userDetails = {
        userId:user?.id,
        name:user?.name,
        email:user?.email
    }
    return res.json({userDetails,token});
}

