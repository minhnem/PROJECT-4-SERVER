import SupplierModel from "../models/SupplierModel"

const addNew = async (req: any, res: any) => {
    const body = req.body
    try {
        const newSupplier = new SupplierModel(body)
        newSupplier.save()
        
        res.status(200).json({
            message: 'Thêm mới nhà cung cấp thành công.',
            data: newSupplier
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const getSuppliers = async (req: any, res: any) => {
    const {pageSize, page} = req.query
    try {
        const skip = (page - 1) * pageSize
        const suppliers = await SupplierModel.find({}).skip(skip).limit(pageSize)
        const total = await SupplierModel.countDocuments()
        res.status(200).json({
            message: 'Danh sách nhà cung cấp.',
            data: {
                suppliers,
                total
            }
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const updateSupplier = async (req: any, res: any) => {
    const body = req.body
    const { id } = req.query
    try {
        await SupplierModel.findByIdAndUpdate(id, body)
        res.status(200).json({
            message: 'Sửa thông tin thành công.',
            data: []
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const deleteSupplier = async (req: any, res: any) => {
    const {id} = req.query
    try {
        await SupplierModel.findByIdAndDelete(id)
        res.status(200).json({
            message: 'Xóa nhà cung cấp thành công.',
            data: []
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

export {addNew, getSuppliers, updateSupplier, deleteSupplier}
