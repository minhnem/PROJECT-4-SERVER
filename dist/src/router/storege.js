"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_1 = require("../controller/products");
const router = (0, express_1.Router)();
router.get("/products", products_1.getProducts);
exports.default = router;
//# sourceMappingURL=storege.js.map