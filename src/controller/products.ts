import CategoryModel from "../models/CategoryModel"
import ProductModel from "../models/ProductModel"
import SupplierModel from "../models/SupplierModel"
import SubProductModel from "../models/SubProductModel"

//Product
const getProducts = async (req: any, res: any) => {
    const {title, page, pageSize} = req.query
    const filter: any = {}
    if(title) {
        filter.slug = {$regex: title}
    }
    filter.isDeleted = false
    try {
        const skip = (page - 1) * pageSize
        const items = await ProductModel.find(filter).skip(skip).limit(pageSize).lean()
        const totalProduct = await ProductModel.find({isDeleted: false})
        const total = totalProduct.length
        const products: any[] = []  
        for (const item of items) {
            const subProducts = await SubProductModel.find({ productId: item._id, isDeleted: false });
            const product = { ...item, subProduct: subProducts };
            products.push(product);
        }
        res.status(200).json({
            message: 'Products',
            data: {
                products,
                total,
            },
        });
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const getProductDetail = async (req: any, res: any) => {
    const {id} = req.query
    try {
        const product = await ProductModel.findById(id)
        res.status(200).json({
            message: 'Lấy sản phẩm theo id thành công',
            data: product
        })
    } catch (error: any) {
       res.status(404).json({
        message: error.message
       }) 
    }
}

const addProduct = async (req: any, res: any) => {
    const body = req.body
    try {

        const item = await ProductModel.findOne({slug: body.slug})

        if(item) {
            throw new Error('Sản phẩm này đã tồn tại.')
        }

        const newProduct = new ProductModel(body)
        await newProduct.save()
        
        res.status(200).json({
            message: 'Thêm sản phẩm thành công',
            data: newProduct
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const handleDeleteSubProductInProduct = async (id: string) => {
    await SubProductModel.findByIdAndUpdate(id, {isDeleted: true})
}

const deleteProduct = async (req: any, res: any) => {
    const {id} = req.query
    try {
        const subProducts = await SubProductModel.find({productId: id})
        if(subProducts.length > 0) {
            subProducts.forEach((item: any) => handleDeleteSubProductInProduct(item._id))
        }
        await ProductModel.findByIdAndUpdate(id, {isDeleted: true})
        res.status(200).json({
            message: 'Xóa sản phẩm thành công.',
            data: []
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message 
        })
    }
}

const updateProduct = async (req: any, res: any) => {
    const body = req.body
    const {id} = req.query
    try {
        const product = await ProductModel.findByIdAndUpdate(id, body)
        res.status(200).json({
            message: 'Sửa sản phẩm thành công.',
            data: product
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message 
        })
    }
}

const filterProduct = async (req: any, res: any) => {
    const body = req.body
    const {categories, color, size, price} = body
    try {
        const filter: any = {}
        if(color) {
            filter.color = color
        } 
        if(size) {
            filter.size = size
        } 
        if(price && price.length > 0) {
            filter.price = {$gte: price[0], $lte: price[1]}
        }
        filter.isDeleted = false
        const subProduct = await SubProductModel.find(filter)
        const product: any[] = []
        if(subProduct.length > 0) {
            for(const sub of subProduct){
                const perent = await ProductModel.findOne({$and: [{_id: sub.productId}, {categories: categories}]})
                product.push(perent)
            }
        }
        const items: any[] = [] 
        if(product.length > 0) {
            product.forEach((item: any) => {
                const childrent = subProduct.filter((sub) => sub.productId === item._id.toString())
                items.push({...item._doc, subProduct: childrent})
            })
        }
        res.status(200).json({
            message: 'Lọc sản phẩm thành công.',
            data: {
                items,
                total: items.length
            }
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}


// Category
const addCategory = async (req: any, res: any) => {
    const body = req.body
    const {parentId, slug} = body
    try {
        const category = await CategoryModel.findOne({
            parentId: parentId,
            slug: slug
        })

        if (category) {
            throw Error('Danh mục đã tồn tại.')
        }

        const newCategory = new CategoryModel(body)
        await newCategory.save()

        res.status(200).json({
            message: 'Thêm mới danh mục thành công.',
            data: newCategory
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const getCategories = async (req: any, res: any) => {
    const {page, pageSize} = req.query
    try {
        const skip = (page -1) * pageSize
        const categories = await CategoryModel.find({$or: [{isDeleted: false}, {isDeleted: null}]}).skip(skip).limit(pageSize)
        const total = await CategoryModel.countDocuments()
        res.status(200).json({
            message: 'Lấy danh mục thành công.',
            data: {
                categories,
                total
            }
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const getAllCategories = async (req: any, res: any) => {
    try {
        const categories = await CategoryModel.find({$or: [{isDeleted: false}, {isDeleted: null}]})
        res.status(200).json({
            message: 'Lấy danh mục thành công.',
            data: categories,
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const getCategoryDetail = async (req: any, res: any) => {
    const {id} = req.query
    try {
        const category = await CategoryModel.findById(id)
        res.status(200).json({
            message: 'Lấy danh mục thành công.',
            data: category
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const findAndDeleteCategoryInProduct = async (id: string) => {
    const categories = await CategoryModel.find({parentId: id})
    if(categories.length > 0) {
        categories.forEach( async (item: any) => await findAndDeleteCategoryInProduct(item._id))
    }
    await handleRemoveCategoryInProduct(id)
}

const handleRemoveCategoryInProduct = async (id: string) => {
    const products = await ProductModel.find({categories: {$all: id}})
        if(products && products.length > 0){
            products.forEach( async (element: any) => {
                const cats = element._doc.categories
                const index = cats.findIndex((item: string) => item === id)
                
                if(index !== -1) {
                    cats.splice(index, 1)  
                }
                await ProductModel.findByIdAndUpdate(element._id, {categories: cats})
            })
        }
}

const deleteCategories = async (req: any, res: any) => {
    const { id, isDeleted } = req.query 
    try {
        await findAndDeleteCategoryInProduct(id)
        
        if (isDeleted) {
            await CategoryModel.findByIdAndUpdate(id, {isDeleted: true})
        } else {
            await CategoryModel.findByIdAndDelete(id)
        }

        res.status(200).json({
            message: 'Xóa danh mục thành công.',
            data: []
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const updateCategory = async (req: any, res: any) => {
    const body = req.body
    const {id} = req.query
    try {
        
        await CategoryModel.findByIdAndUpdate(id, body)
        res.status(200).json({
            message: 'Sửa danh mục thành công',
            data: []
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}


//SubProduct
const addSubProduct = async (req: any, res: any) => {
    const body = req.body
    try {
        const subProduct = new SubProductModel(body)
        await subProduct.save()
        res.status(200).json({
            message: 'Thêm biến thể sản phẩm thành công.',
            data: subProduct
        })
    } catch (error:any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const getSubProductById = async (req: any, res: any) => {
    const {id} = req.query
    try {
        const subProduct = await SubProductModel.find({productId: id})
        res.status(200).json({
            message: 'Lấy biển thể sản phẩm theo id thành công.',
            data: subProduct
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const getFilterSubProducts = async (req: any, res: any) => {
    const subProducts: any = {}
    const colors: object[] = []
    const sizes: object[] = []
    const price: number[] = []
    try {
        const items = await SubProductModel.find({isDeleted: false})
        items.forEach((item: any) => {
            if(!colors.some((element: any) => element.label === item.color)){
                colors.push({label: item.color, value: item.color})
            }
            if(!sizes.some((element: any) => element.label === item.size)){
                sizes.push({label: item.size, value: item.size})
            }
            price.push(item.price)
        })

        subProducts.colors = colors
        subProducts.sizes = sizes
        subProducts.price = [Math.min(...price), Math.max(...price)]

        res.status(200).json({
            message: 'Lấy biến thể thành công.',
            data: subProducts
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const updateSubProduct = async (req: any, res: any) => {
    const body = req.body
    const {id} = req.query
    try {
        const subProduct = await SubProductModel.findByIdAndUpdate(id, body)
        res.status(200).json({
            message: 'Sửa biến thể thành công.',
            data: subProduct
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const deleteSubProduct = async (req: any, res: any) => {
    const {id} = req.query
    try {
        await SubProductModel.findByIdAndDelete(id)
        res.status(200).json({
            message: 'Xóa biến thể thành công.',
            data: []
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

export {
    addCategory, 
    getCategories,
    getAllCategories, 
    getCategoryDetail, 
    deleteCategories, 
    updateCategory, 
    getProducts, 
    addProduct, 
    addSubProduct, 
    deleteProduct,
    getProductDetail,
    updateProduct,
    getFilterSubProducts,
    filterProduct,
    getSubProductById,
    updateSubProduct,
    deleteSubProduct,
}