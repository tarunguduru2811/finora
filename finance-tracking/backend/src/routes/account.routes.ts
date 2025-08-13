import { createAccount, listAccounts } from "../controllers/account.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import {Router} from "express"


const router = Router();
router.get("/",authenticateToken,listAccounts)
router.post("/",authenticateToken,createAccount)

export default router