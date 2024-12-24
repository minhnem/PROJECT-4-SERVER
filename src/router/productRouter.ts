import { Router } from "express";
import { addCategory, getCategories } from "../controller/products";

const router = Router()

router.get('/', getCategories)
router.post('/add-new-category', addCategory)

export default router