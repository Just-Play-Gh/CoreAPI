import { Controller, Get } from '@nestjs/common';
import { ReviewSummaryService } from './review-summary.service';

@Controller('review-summary')
export class ReviewSummaryController {
  constructor(private readonly reviewSummaryService: ReviewSummaryService) {}
  @Get()
  async getSummaries() {
    return await this.reviewSummaryService.store();
  }
}
