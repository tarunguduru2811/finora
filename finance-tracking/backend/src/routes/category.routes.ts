import { createCategory, listCategories } from "../controllers/category.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { Router } from "express";


const router = Router();

router.get("/",authenticateToken,listCategories)
router.post("/",authenticateToken,createCategory)


export default router;