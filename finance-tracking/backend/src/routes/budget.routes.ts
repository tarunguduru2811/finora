import { authenticateToken } from "../middleware/auth.middleware";
import { createBudget, deleteBudget, getBudgetById, getBudgets, getBudgetSummary, updateBudget } from "../controllers/budget.controller";
import { Router } from "express";

const router = Router();

router.post("/",authenticateToken,createBudget);
router.get("/",authenticateToken,getBudgets)
router.get("/:id",authenticateToken,getBudgetById)
router.put("/:id",authenticateToken,updateBudget)
router.delete("/:id",authenticateToken,deleteBudget);
router.get("/summary",authenticateToken,getBudgetSummary);

export default router;