import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/customer/user/entities/user.entity';
import { invoice, userDetails } from 'src/test.utility';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';

describe('InvoiceController', () => {
  let controller: InvoiceController;
  const mockInvoiceService = {
    createInvoice: jest.fn(() => {
      return [{ ...invoice }];
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
      { productId: 1 },
      userDetails as User,
    );
    console.log(result);
    expect(result).toEqual([invoice]);
  });
});
