import { createRecurring, deleteRecurringRule, getRecurringRules, updateRecurringRule } from "../controllers/recurringRule.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { Router } from "express";


const router = Router();


router.get("/",authenticateToken,getRecurringRules);
router.post("/",authenticateToken,createRecurring);
router.put("/:id",authenticateToken,updateRecurringRule)
router.delete("/:id",authenticateToken,deleteRecurringRule)

export default router;