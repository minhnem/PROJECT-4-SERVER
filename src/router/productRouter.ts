import { Router } from "express";
import { addCategory, deleteCategories, getCategories } from "../controller/products";

const router = Router()

router.get('/', getCategories)
router.post('/add-new-category', addCategory)
router.delete('/delete-category', deleteCategories)

export default router