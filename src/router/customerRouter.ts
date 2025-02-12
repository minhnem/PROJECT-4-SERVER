import { Router } from "express";
import { createCustomer } from "../controller/customer";

const router = Router()

router.post('/create-customer', createCustomer)

export default router