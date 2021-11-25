import { Invoice, InvoiceStatusType } from './invoice/entities/invoice.entity';
import { Tax, TaxType } from './tax/entities/tax.entity';

const date = new Date();
date.setFullYear(2021, 1, 1);

export const registerData = {
  firstName: 'firstname',
  lastName: 'lastname',
  phoneNumber: '0554637373',
  email: 'email@email.com',
  password: '12323444',
};

export const userDetails = {
  id: 1,
  created: date,
  updated: date,
  ...registerData,
};

export const tax = {
  id: 1,
  value: 2.99,
  type: TaxType.Fixed,
  created: date,
  updated: date,
  description: 'Description',
  status: true,
};

export const product = {
  id: 1,
  name: 'Petrol',
  pricePerLitre: 6.99,
  created: date,
  updated: date,
  description: 'Description',
  status: true,
  taxes: [tax],
};

export const invoice = {
  id: 1,
  pricePerLitre: 6.99,
  invoiceNumber: '1',
  totalAmount: 200,
  customerFullName: 'Customer Name',
  channel: 'MTN',
  channelTransactionId: '123',
  customerPhoneNumber: '0244123456',
  taxes: [tax] as Tax[],
  status: InvoiceStatusType.Pending,
  created: date,
  updated: date,
};
