import { Router } from "express";
import { addNew, deleteSupplier, getSuppliers, updateSupplier } from "../controller/supplier";

const router = Router()

router.post('/add-new', addNew)
router.put('/update', updateSupplier)
router.delete('/delete', deleteSupplier)
router.get('/', getSuppliers)

export default router