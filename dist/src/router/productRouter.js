"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_1 = require("../controller/products");
const router = (0, express_1.Router)();
// Product
router.get('/', products_1.getProducts);
router.get('/get-product-detail', products_1.getProductDetail);
router.post('/add-new-product', products_1.addProduct);
router.delete('/delete-product', products_1.deleteProduct);
router.put('/update-product', products_1.updateProduct);
router.post('/filter-product', products_1.filterProduct);
// SubProduct
router.post('/add-sub-product', products_1.addSubProduct);
router.get('/get-sub-product', products_1.getFilterSubProducts);
router.get('/get-sub-product-detail', products_1.getSubProductById);
router.put('/update-sub-product', products_1.updateSubProduct);
router.delete('/delete-sub-product', products_1.deleteSubProduct);
// Category
router.get('/get-all-categories', products_1.getAllCategories);
router.get('/get-categories', products_1.getCategories);
router.get('/category/detail', products_1.getCategoryDetail);
router.post('/add-new-category', products_1.addCategory);
router.delete('/delete-category', products_1.deleteCategories);
router.put('/update-category', products_1.updateCategory);
exports.default = router;
//# sourceMappingURL=productRouter.js.map