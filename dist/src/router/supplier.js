"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supplier_1 = require("../controller/supplier");
const router = (0, express_1.Router)();
router.get('/', supplier_1.getSuppliers);
router.get('/get-form', supplier_1.getForm);
router.get('/get-supplier-detail', supplier_1.getSupplierDetail);
router.post('/get-export-data', supplier_1.getDatas);
router.post('/add-new', supplier_1.addNew);
router.put('/update', supplier_1.updateSupplier);
router.delete('/delete', supplier_1.deleteSupplier);
exports.default = router;
//# sourceMappingURL=supplier.js.map