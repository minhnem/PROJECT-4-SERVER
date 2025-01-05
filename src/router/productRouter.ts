import { Router } from "express";
import { addCategory, deleteCategories, getCategories, updateCategory } from "../controller/products";

const router = Router()

router.get('/', getCategories)
router.post('/add-new-category', addCategory)
router.delete('/delete-category', deleteCategories)
router.put('/update-category', updateCategory)

export default router