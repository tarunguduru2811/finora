import { authenticateToken } from "@/middleware/auth.middleware";
import { forgotPassword, gitlabAuth, gitlabAuthCallback, googleAuth, googleAuthCallback, googleAuthenticate, login, register, resetPassword, twitterAuth, twitterAuthCallback } from "../controllers/auth.controller";
import { Router } from "express";

const router = Router();
router.get("/google",googleAuth)
router.get("/google/callback",googleAuthCallback)
router.get("/gitlab",gitlabAuth)
router.get("/gitlab/callback",gitlabAuthCallback)
router.get("/twitter",twitterAuth)
router.get("/twitter/callback",twitterAuthCallback)
router.get("/me",googleAuthenticate)
router.post('/register',register)
router.post('/login',login)
router.post('/forgot-password',forgotPassword)
router.post('/reset-password',resetPassword)
export default router;