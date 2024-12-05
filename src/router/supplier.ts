import { Router } from "express";
import { addNew } from "../controller/supplier";

const router = Router()

router.post('/add-new', addNew)

export default router