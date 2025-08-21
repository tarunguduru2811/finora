import { authenticateToken } from "@/middleware/auth.middleware";
import { forgotPassword, login, register, resetPassword } from "../controllers/auth.controller";
import { Router } from "express";

const router = Router();
router.post('/register',register)
router.post('/login',login)
router.post('/forgot-password',forgotPassword)
router.post('/reset-password',resetPassword)
export default router;