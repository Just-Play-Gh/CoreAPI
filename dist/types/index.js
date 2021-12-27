"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userEntities = exports.StatusType = void 0;
const customer_entity_1 = require("../customer/entities/customer.entity");
const driver_entity_1 = require("../driver/entities/driver.entity");
var StatusType;
(function (StatusType) {
    StatusType["Active"] = "1";
    StatusType["Inactive"] = "0";
})(StatusType = exports.StatusType || (exports.StatusType = {}));
exports.userEntities = {
    customer: customer_entity_1.Customer,
    driver: driver_entity_1.Driver,
};
//# sourceMappingURL=index.js.map