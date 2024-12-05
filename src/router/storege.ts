import { Router } from "express";
import { getProducts } from "../controller/products";

const router = Router()

router.get("/products", getProducts)

export default router