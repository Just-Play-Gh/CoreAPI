"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtp = exports.generatePassword = void 0;
const generatePassword = (length) => {
    const tempPassword = Math.random()
        .toString(36)
        .slice(length || 8);
    return tempPassword;
};
exports.generatePassword = generatePassword;
const generateOtp = (length) => {
    const otp = Math.floor(Number('1'.padEnd(length, '0')) +
        Math.random() * Number('9'.padEnd(length, '9'))).toString();
    return otp;
};
exports.generateOtp = generateOtp;
//# sourceMappingURL=generator.js.map