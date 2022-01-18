import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  providers: [ReviewService],
  controllers: [ReviewController],
  imports: [SharedModule],
})
export class ReviewModule {}
