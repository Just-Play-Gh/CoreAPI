"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoice = exports.product = exports.tax = exports.userDetails = exports.registerData = void 0;
const customer_entity_1 = require("./customer/entities/customer.entity");
const invoice_entity_1 = require("./invoice/entities/invoice.entity");
const tax_entity_1 = require("./tax/entities/tax.entity");
const date = new Date();
date.setFullYear(2021, 1, 1);
exports.registerData = {
    firstName: 'firstname',
    lastName: 'lastname',
    phoneNumber: '0554637373',
    email: 'email@email.com',
    password: '12323444',
};
exports.userDetails = Object.assign({ id: 1, created: date, updated: date }, exports.registerData);
exports.tax = {
    id: 1,
    value: 2.99,
    type: tax_entity_1.TaxType.Fixed,
    created: date,
    updated: date,
    description: 'Description',
    status: customer_entity_1.StatusType.Active,
};
exports.product = {
    id: 1,
    name: 'Petrol',
    pricePerLitre: 6.99,
    created: date,
    updated: date,
    description: 'Description',
    status: true,
    taxes: [exports.tax],
};
exports.invoice = {
    id: 1,
    pricePerLitre: 6.99,
    invoiceNumber: '1',
    totalAmount: 200,
    customerFullName: 'Customer Name',
    channel: 'MTN',
    channelTransactionId: '123',
    customerPhoneNumber: '0244123456',
    taxes: [exports.tax],
    status: invoice_entity_1.InvoiceStatusType.Pending,
    created: date,
    updated: date,
};
//# sourceMappingURL=test.utility.js.map