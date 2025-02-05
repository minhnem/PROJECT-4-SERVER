"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatorRandomText = void 0;
const generatorRandomText = (num) => {
    const characters = "ABCDEFHKIHLMNOPQRSTUVWXYZAabcdefghiklmnopqrstuvwxyz1234567890";
    let text = "";
    for (let i = 0; i < characters.length; i++) {
        if (text.length <= (num ? num : 10)) {
            const str = characters[Math.floor(Math.random() * characters.length)];
            text += str;
        }
    }
    return text.toLocaleUpperCase();
};
exports.generatorRandomText = generatorRandomText;
//# sourceMappingURL=generatorRandomText.js.map