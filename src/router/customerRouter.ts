import { Router } from "express";
import { createCustomer, getVerifyCode, login } from "../controller/customer";

const router = Router()

router.post('/create-customer', createCustomer)
router.post('/verify-code', getVerifyCode)
router.post('/login', login)

export default router