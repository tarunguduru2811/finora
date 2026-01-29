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
// @ts-ignore
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


export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    // Always respond fast (security + UX)
    res.status(200).json({
      message: "If that email exists, a reset link has been sent."
    });

    if (!user) return;

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.passwordResetToken.create({
      data: { token, userId: user.id, expiresAt },
    });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
      },
    });

    await Promise.race([
      transporter.sendMail({
        from: "Finora Support <support@finora.app>",
        to: email,
        subject: "Reset Password Link",
        html: `
          <h2>Password Reset Request</h2>
          <p>Click below to reset your password:</p>
          <a href="${resetUrl}">Reset Password</a>
          <p>This link expires in 15 minutes.</p>
        `,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("SMTP timeout")), 8000)
      ),
    ]);

  } catch (err) {
    console.error("Forgot password error:", err);
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
    passport.authenticate("google", { failureRedirect: `${process.env.CLIENT_URL}/login` }, (err, user) => {
        // if (err) return next(err);
        if (!user) return res.redirect(`${process.env.CLIENT_URL}/login`);
        
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none"
        });
        res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
    })(req, res,next);
}

export function gitlabAuth(req:Request,res:Response){
    passport.authenticate("gitlab",{scope:["read_user"]})(req,res);
}

export function gitlabAuthCallback(req:Request,res:Response,next: NextFunction){
    passport.authenticate("gitlab",{failureRedirect:`${process.env.CLIENT_URL}/login`},(err:any,user:any)=>{
        // if(err) return next(err);
        if(!user) return res.redirect(`${process.env.CLIENT_URL}/login`);

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



export async function googleAuthenticate(req: Request, res: Response) {
    try {
        const authHeader = req.headers.authorization;
        const token =
            authHeader?.startsWith("Bearer ")
                ? authHeader.split(" ")[1]
                : req.cookies?.token;

        if (!token) {
            return res.status(401).json({ error: "Not Authenticated" });
        }

        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as any;

        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userDetails = {
            userId: user.id,
            name: user.name,
            email: user.email,
        };

        return res.json({ userDetails, token });

    } catch (error) {
        console.error("Error in /auth/me:", error);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}


