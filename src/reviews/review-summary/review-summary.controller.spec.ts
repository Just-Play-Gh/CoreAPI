import { Test, TestingModule } from '@nestjs/testing';
import { ReviewSummaryController } from './review-summary.controller';

describe('ReviewSummaryController', () => {
  let controller: ReviewSummaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewSummaryController],
    }).compile();

    controller = module.get<ReviewSummaryController>(ReviewSummaryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
