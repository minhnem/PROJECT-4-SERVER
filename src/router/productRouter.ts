import { Router } from "express";
import { addCategory, addProduct, addSubProduct, deleteCategories, getCategories, getCategoryDetail, getProducts, updateCategory } from "../controller/products";

const router = Router()


// Product
router.get('/', getProducts)
router.post('/add-new-product', addProduct)

// SubProduct
router.post('/add-sub-product', addSubProduct)

// Category
router.get('/get-categories', getCategories)
router.get('/category/detail', getCategoryDetail)
router.post('/add-new-category', addCategory)
router.delete('/delete-category', deleteCategories)
router.put('/update-category', updateCategory)

export default router