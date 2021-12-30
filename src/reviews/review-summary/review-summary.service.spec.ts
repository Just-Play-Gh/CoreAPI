import { Test, TestingModule } from '@nestjs/testing';
import { ReviewSummaryService } from './review-summary.service';

describe('ReviewSummaryService', () => {
  let service: ReviewSummaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReviewSummaryService],
    }).compile();

    service = module.get<ReviewSummaryService>(ReviewSummaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
