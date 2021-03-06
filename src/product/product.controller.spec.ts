import { Test, TestingModule } from '@nestjs/testing';
import { product } from '../test.utility';
import { GetProductDto } from './dto/get-product.dto';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

describe('ProductController', () => {
  let controller: ProductController;
  const mockProductService = {
    getProduct: jest.fn(({ id }) => {
      return [product].find((product) => product.id === id);
    }),
    getProducts: jest.fn(() => {
      return [product];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [ProductService],
    })
      .overrideProvider(ProductService)
      .useValue(mockProductService)
      .compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a product when getProduct method is called', async () => {
    const result = await controller.getProduct({ id: 1 });
    expect(result).toEqual(product);
  });

  it('should return all products when getProducts method is called', async () => {
    const result = await controller.getProducts();
    expect(result).toEqual([product]);
  });
});
