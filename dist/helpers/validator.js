"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDto = void 0;
const class_validator_1 = require("class-validator");
const validateDto = async (dto, loginDto) => {
    for (const key in loginDto) {
        dto[key] = loginDto[key];
    }
    const dtoError = await (0, class_validator_1.validate)(dto);
    const errorsObject = {};
    dtoError.forEach((error) => {
        errorsObject[error.property] = Object.values(error.constraints);
    });
    return errorsObject;
};
exports.validateDto = validateDto;
//# sourceMappingURL=validator.js.map