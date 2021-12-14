import { Test, TestingModule } from '@nestjs/testing';
import { invoice, userDetails } from '../test.utility';
import { InvoiceStatusType } from './entities/invoice.entity';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import mocks from 'node-mocks-http';
import { Customer } from '../customer/entities/customer.entity';
import { Driver } from '../driver/entities/driver.entity';

describe('InvoiceController', () => {
  let controller: InvoiceController;
  const req = mocks.createRequest();
  const mockInvoiceService = {
    createInvoice: jest.fn(({ amount }) => {
      console.log(invoice);
      return [{ ...invoice, amount }];
    }),
    updateInvoice: jest.fn(({ channel, channelTransactionId, status }) => {
      return { ...invoice, channel, channelTransactionId, status };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceController],
      providers: [InvoiceService],
    })
      .overrideProvider(InvoiceService)
      .useValue(mockInvoiceService)
      .compile();
    controller = module.get<InvoiceController>(InvoiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an invoice for customer', async () => {
    const result = await controller.createInvoice(
      { productId: 1, amount: 1 },
      userDetails as Driver | Customer,
    );
    console.log(result);
    expect(result).toEqual([{ ...invoice, amount: 1 }]);
  });

  // it('should update an invoice and return the updated user', async () => {
  //   const updateInvoiceDto = {
  //     invoiceId: 1,
  //     channelTransactionId: '1',
  //     channel: 'MTN',
  //     status: InvoiceStatusType.Paid,
  //   };
  //   const result = await controller.updateInvoice(updateInvoiceDto, req);
  //   expect(result).toEqual([{ ...invoice, amount: 1 }]);
  // });
});
