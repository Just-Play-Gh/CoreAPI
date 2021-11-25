import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewService {
  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const review = await Review.create();
    for (const key in createReviewDto) {
      review[key] = createReviewDto[key];
    }
    return await Review.save(review);
  }
}
