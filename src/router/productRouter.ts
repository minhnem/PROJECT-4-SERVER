import { Router } from "express";
import { 
    addCategory, 
    addProduct, 
    addSubProduct, 
    deleteCategories, 
    deleteProduct, 
    getAllCategories, 
    getCategories, 
    getCategoryDetail, 
    getProductDetail, 
    getProducts, 
    getFilterSubProducts, 
    updateCategory, 
    updateProduct, 
    filterProduct,
    getSubProductById,
    updateSubProduct,
    deleteSubProduct
} from "../controller/products";
import { verifyToken } from "../middlewares/verifyToken";

const router = Router()

router.get('/', getProducts)
router.post('/filter-product', filterProduct)
router.get('/get-product-detail', getProductDetail)
router.get('/get-sub-product', getFilterSubProducts)
router.get('/get-sub-product-detail', getSubProductById)
router.get('/get-all-categories', getAllCategories)
router.get('/get-categories', getCategories)
router.get('/category/detail', getCategoryDetail)

router.use(verifyToken)

// Product
router.post('/add-new-product', addProduct)
router.delete('/delete-product', deleteProduct)
router.put('/update-product', updateProduct)

// SubProduct
router.post('/add-sub-product', addSubProduct)
router.put('/update-sub-product', updateSubProduct)
router.delete('/delete-sub-product', deleteSubProduct)

// Category
router.post('/add-new-category', addCategory)
router.delete('/delete-category', deleteCategories)
router.put('/update-category', updateCategory)

export default router