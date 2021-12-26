import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './entities/review.entity';
export declare class ReviewService {
    create(createReviewDto: CreateReviewDto): Promise<Review>;
}
