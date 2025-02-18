import CustomerModel from "../models/CustomerModel"
import bcrypt from 'bcrypt'
import { getAccesstoken } from "../utils/getAccesstoken"
import { generatorRandomText } from "../utils/generatorRandomText"
import { handleSendEmail } from "../utils/handleSendEmail"

let codeSend = ''

const getVerifyCode = async (req: any, res: any) => {
    const body = req.body
    const {email} = body
    try {
        const item = await CustomerModel.findOne({email})
        if(item) {
            throw new Error('Tài khoản đã tồn tại!!')
        }

        const newCode = generatorRandomText(6)
        codeSend = newCode

        await handleSendEmail({
            from: 'Project - 04',
            to: email,
            subject: "Hello ✔",
            text: "Hello world?",
            html: `<b>Mã xác minh của bạn là: ${newCode}</b>`,
        })

        res.status(200).json({
            message: 'Gửi mã xác minh thành công.',
            data: []
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const createCustomer = async (req: any, res: any) => {
    const body = req.body
    const {password, code} = body

    try {
        if(code.toUpperCase() !== codeSend) {
            throw new Error('Mã xác minh của bạn không đúng!!')
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


const login = async (req: any, res: any) => {
    const body = req.body
    const {email, password} = body
    try {
        const item: any = await CustomerModel.findOne({email})
        if(!item) {
            throw new Error('Tài khoản không tồn tại!!!')
        }

        const isMatchPassword = await bcrypt.compare(password, item.password)
        if(!isMatchPassword) {
            throw new Error('Sai tài khoản hoặc mật khẩu!!!')
        }

        const customer = item._doc
        const accesstoken = await getAccesstoken({_id: customer._id, email: email, rule: 1})

        res.status(200).json({
            message: 'Đăng nhập thành công.',
            data: {
                customer,
                accesstoken
            }
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

export {createCustomer, getVerifyCode, login}