import { Controller } from '@nestjs/common';
import { BaseController } from 'src/resources/base.controller';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';

@Controller('reviews')
export class ReviewController extends BaseController {
  constructor(private readonly reviewService: ReviewService) {
    super(reviewService);
    this.dtos = { store: CreateReviewDto };
  }
}
