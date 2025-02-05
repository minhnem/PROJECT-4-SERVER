"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("./src/router/user"));
const storege_1 = __importDefault(require("./src/router/storege"));
const supplier_1 = __importDefault(require("./src/router/supplier"));
const productRouter_1 = __importDefault(require("./src/router/productRouter"));
const cors_1 = __importDefault(require("cors"));
const verifyToken_1 = require("./src/middlewares/verifyToken");
dotenv_1.default.config();
const PORT = process.env.PORT;
const dbURL = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.qz32e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/auth", user_1.default);
app.use(verifyToken_1.verifyToken);
app.use("/storege", storege_1.default);
app.use("/supplier", supplier_1.default);
app.use("/product", productRouter_1.default);
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(dbURL);
        console.log("connect to db successfully");
    }
    catch (error) {
        console.log(`can not connect to db ${error}`);
    }
});
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`server is starting at http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.log(error);
});
//# sourceMappingURL=index.js.map