import CategoryModel from "../models/CategoryModel"

const getProducts = async (req: any, res: any) => {
    try {
        res.status(200).json({
            message: "Products",
            data: []
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

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
    try {
        const categories = await CategoryModel.find()
        res.status(200).json({
            message: 'Lấy danh mục thành công.',
            data: categories
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

export {getProducts, addCategory, getCategories}