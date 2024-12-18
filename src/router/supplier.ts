import { Router } from "express";
import { addNew, deleteSupplier, getDatas, getForm, getSuppliers, updateSupplier } from "../controller/supplier";

const router = Router()

router.get('/', getSuppliers)
router.get('/get-form', getForm)
router.post('/get-export-data', getDatas)
router.post('/add-new', addNew)
router.put('/update', updateSupplier)
router.delete('/delete', deleteSupplier)

export default router