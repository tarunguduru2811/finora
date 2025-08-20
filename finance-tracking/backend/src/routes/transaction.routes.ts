import { createTransaction, deleteTransaction, getRecentTransactions, getTransactions, getTransactionsById, monthlyExpense, transactionSummary, updateTransaction } from "../controllers/transaction.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { Router } from "express";

const router = Router();

router.get("/",authenticateToken,getTransactions)
router.get("/summary",authenticateToken,transactionSummary)
router.get("/monthly-expense",authenticateToken,monthlyExpense)
router.get("/recent-transactions",authenticateToken,getRecentTransactions)
// router.get('/:id',authenticateToken,getTransactionsById)
router.post('/',authenticateToken,createTransaction)
router.put('/:id',authenticateToken,updateTransaction)
router.delete('/:id',authenticateToken,deleteTransaction)

export default router