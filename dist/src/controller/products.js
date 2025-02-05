"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubProduct = exports.updateSubProduct = exports.getSubProductById = exports.filterProduct = exports.getFilterSubProducts = exports.updateProduct = exports.getProductDetail = exports.deleteProduct = exports.addSubProduct = exports.addProduct = exports.getProducts = exports.updateCategory = exports.deleteCategories = exports.getCategoryDetail = exports.getAllCategories = exports.getCategories = exports.addCategory = void 0;
const CategoryModel_1 = __importDefault(require("../models/CategoryModel"));
const ProductModel_1 = __importDefault(require("../models/ProductModel"));
const SubProductModel_1 = __importDefault(require("../models/SubProductModel"));
//Product
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, page, pageSize } = req.query;
    const filter = {};
    if (title) {
        filter.slug = { $regex: title };
    }
    filter.isDeleted = false;
    try {
        const skip = (page - 1) * pageSize;
        const items = yield ProductModel_1.default.find(filter).skip(skip).limit(pageSize).lean();
        const totalProduct = yield ProductModel_1.default.find({ isDeleted: false });
        const total = totalProduct.length;
        const products = [];
        for (const item of items) {
            const subProducts = yield SubProductModel_1.default.find({ productId: item._id, isDeleted: false });
            const product = Object.assign(Object.assign({}, item), { subProduct: subProducts });
            products.push(product);
        }
        res.status(200).json({
            message: 'Products',
            data: {
                products,
                total,
            },
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.getProducts = getProducts;
const getProductDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    try {
        const product = yield ProductModel_1.default.findById(id);
        res.status(200).json({
            message: 'Lấy sản phẩm theo id thành công',
            data: product
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.getProductDetail = getProductDetail;
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const item = yield ProductModel_1.default.findOne({ slug: body.slug });
        if (item) {
            throw new Error('Sản phẩm này đã tồn tại.');
        }
        const newProduct = new ProductModel_1.default(body);
        yield newProduct.save();
        res.status(200).json({
            message: 'Thêm sản phẩm thành công',
            data: newProduct
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.addProduct = addProduct;
const handleDeleteSubProductInProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield SubProductModel_1.default.findByIdAndUpdate(id, { isDeleted: true });
});
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    try {
        const subProducts = yield SubProductModel_1.default.find({ productId: id });
        if (subProducts.length > 0) {
            subProducts.forEach((item) => handleDeleteSubProductInProduct(item._id));
        }
        yield ProductModel_1.default.findByIdAndUpdate(id, { isDeleted: true });
        res.status(200).json({
            message: 'Xóa sản phẩm thành công.',
            data: []
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.deleteProduct = deleteProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { id } = req.query;
    try {
        const product = yield ProductModel_1.default.findByIdAndUpdate(id, body);
        res.status(200).json({
            message: 'Sửa sản phẩm thành công.',
            data: product
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.updateProduct = updateProduct;
const filterProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { categories, color, size, price } = body;
    try {
        const filter = {};
        if (color) {
            filter.color = color;
        }
        if (size) {
            filter.size = size;
        }
        if (price && price.length > 0) {
            filter.price = { $gte: price[0], $lte: price[1] };
        }
        filter.isDeleted = false;
        const subProduct = yield SubProductModel_1.default.find(filter);
        const product = [];
        if (subProduct.length > 0) {
            for (const sub of subProduct) {
                const perent = yield ProductModel_1.default.findOne({ $and: [{ _id: sub.productId }, { categories: categories }] });
                product.push(perent);
            }
        }
        const items = [];
        if (product.length > 0) {
            product.forEach((item) => {
                const childrent = subProduct.filter((sub) => sub.productId === item._id.toString());
                items.push(Object.assign(Object.assign({}, item._doc), { subProduct: childrent }));
            });
        }
        res.status(200).json({
            message: 'Lọc sản phẩm thành công.',
            data: {
                items,
                total: items.length
            }
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.filterProduct = filterProduct;
// Category
const addCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { parentId, slug } = body;
    try {
        const category = yield CategoryModel_1.default.findOne({
            parentId: parentId,
            slug: slug
        });
        if (category) {
            throw Error('Danh mục đã tồn tại.');
        }
        const newCategory = new CategoryModel_1.default(body);
        yield newCategory.save();
        res.status(200).json({
            message: 'Thêm mới danh mục thành công.',
            data: newCategory
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.addCategory = addCategory;
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, pageSize } = req.query;
    try {
        const skip = (page - 1) * pageSize;
        const categories = yield CategoryModel_1.default.find({ $or: [{ isDeleted: false }, { isDeleted: null }] }).skip(skip).limit(pageSize);
        const total = yield CategoryModel_1.default.countDocuments();
        res.status(200).json({
            message: 'Lấy danh mục thành công.',
            data: {
                categories,
                total
            }
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.getCategories = getCategories;
const getAllCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield CategoryModel_1.default.find({ $or: [{ isDeleted: false }, { isDeleted: null }] });
        res.status(200).json({
            message: 'Lấy danh mục thành công.',
            data: categories,
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.getAllCategories = getAllCategories;
const getCategoryDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    try {
        const category = yield CategoryModel_1.default.findById(id);
        res.status(200).json({
            message: 'Lấy danh mục thành công.',
            data: category
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.getCategoryDetail = getCategoryDetail;
const findAndDeleteCategoryInProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield CategoryModel_1.default.find({ parentId: id });
    if (categories.length > 0) {
        categories.forEach((item) => __awaiter(void 0, void 0, void 0, function* () { return yield findAndDeleteCategoryInProduct(item._id); }));
    }
    yield handleRemoveCategoryInProduct(id);
});
const handleRemoveCategoryInProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield ProductModel_1.default.find({ categories: { $all: id } });
    if (products && products.length > 0) {
        products.forEach((element) => __awaiter(void 0, void 0, void 0, function* () {
            const cats = element._doc.categories;
            const index = cats.findIndex((item) => item === id);
            if (index !== -1) {
                cats.splice(index, 1);
            }
            yield ProductModel_1.default.findByIdAndUpdate(element._id, { categories: cats });
        }));
    }
});
const deleteCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, isDeleted } = req.query;
    try {
        yield findAndDeleteCategoryInProduct(id);
        if (isDeleted) {
            yield CategoryModel_1.default.findByIdAndUpdate(id, { isDeleted: true });
        }
        else {
            yield CategoryModel_1.default.findByIdAndDelete(id);
        }
        res.status(200).json({
            message: 'Xóa danh mục thành công.',
            data: []
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.deleteCategories = deleteCategories;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { id } = req.query;
    try {
        yield CategoryModel_1.default.findByIdAndUpdate(id, body);
        res.status(200).json({
            message: 'Sửa danh mục thành công',
            data: []
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.updateCategory = updateCategory;
//SubProduct
const addSubProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const subProduct = new SubProductModel_1.default(body);
        yield subProduct.save();
        res.status(200).json({
            message: 'Thêm biến thể sản phẩm thành công.',
            data: subProduct
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.addSubProduct = addSubProduct;
const getSubProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    try {
        const subProduct = yield SubProductModel_1.default.find({ productId: id });
        res.status(200).json({
            message: 'Lấy biển thể sản phẩm theo id thành công.',
            data: subProduct
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.getSubProductById = getSubProductById;
const getFilterSubProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subProducts = {};
    const colors = [];
    const sizes = [];
    const price = [];
    try {
        const items = yield SubProductModel_1.default.find({ isDeleted: false });
        items.forEach((item) => {
            if (!colors.some((element) => element.label === item.color)) {
                colors.push({ label: item.color, value: item.color });
            }
            if (!sizes.some((element) => element.label === item.size)) {
                sizes.push({ label: item.size, value: item.size });
            }
            price.push(item.price);
        });
        subProducts.colors = colors;
        subProducts.sizes = sizes;
        subProducts.price = [Math.min(...price), Math.max(...price)];
        res.status(200).json({
            message: 'Lấy biến thể thành công.',
            data: subProducts
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.getFilterSubProducts = getFilterSubProducts;
const updateSubProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { id } = req.query;
    try {
        const subProduct = yield SubProductModel_1.default.findByIdAndUpdate(id, body);
        res.status(200).json({
            message: 'Sửa biến thể thành công.',
            data: subProduct
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.updateSubProduct = updateSubProduct;
const deleteSubProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    try {
        yield SubProductModel_1.default.findByIdAndDelete(id);
        res.status(200).json({
            message: 'Xóa biến thể thành công.',
            data: []
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.deleteSubProduct = deleteSubProduct;
//# sourceMappingURL=products.js.map