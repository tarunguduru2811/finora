import { createTransaction, deleteTransaction, getTransactions, getTransactionsById, updateTransaction } from "../controllers/transaction.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { Router } from "express";

const router = Router();

router.get("/",authenticateToken,getTransactions)
router.get('/:id',authenticateToken,getTransactionsById)
router.post('/',authenticateToken,createTransaction)
router.put('/:id',authenticateToken,updateTransaction)
router.delete('/:id',authenticateToken,deleteTransaction)

export default router