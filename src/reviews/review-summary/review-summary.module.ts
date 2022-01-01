import { Module } from '@nestjs/common';
import { ReviewSummaryService } from './review-summary.service';
import { ReviewSummaryController } from './review-summary.controller';

@Module({
  providers: [ReviewSummaryService],
  controllers: [ReviewSummaryController]
})
export class ReviewSummaryModule {}
