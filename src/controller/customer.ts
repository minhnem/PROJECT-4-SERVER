import CustomerModel from "../models/CustomerModel"
import bcrypt from 'bcrypt'
import { getAccesstoken } from "../utils/getAccesstoken"



const createCustomer = async (req: any, res: any) => {
    const body = req.body
    const {email, password} = body

    try {
        const item = await CustomerModel.findOne({email})
        if(item) {
            throw new Error('Tài khoản đã tồn tại!!')
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        body.password = hashPassword

        const customer: any = new CustomerModel(body)
        await customer.save()

        delete customer._doc.password

        res.status(200).json({
            message: 'Đăng ký thành công.',
            data: {
                ...customer._doc,
                accesstoken: await getAccesstoken({
                    _id: customer._id,
                    email: customer.email,
                    rule: 1,
                })
            }
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

export {createCustomer}