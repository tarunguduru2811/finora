import { createCategory, expensesByCategory, getCategorySpendSummary, getTransactionByCategoryId, listCategories } from "../controllers/category.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { Router } from "express";


const router = Router();

router.get("/",authenticateToken,listCategories)
router.get("/expenses-by-category",authenticateToken,expensesByCategory)
router.post("/",authenticateToken,createCategory)
router.get("/:categoryId/transactions", authenticateToken, getTransactionByCategoryId);
router.get("/spend-summary", authenticateToken, getCategorySpendSummary);

export default router;