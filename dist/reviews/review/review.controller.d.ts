import { BaseController } from 'src/resources/base.controller';
import { ReviewService } from './review.service';
export declare class ReviewController extends BaseController {
    private readonly reviewService;
    constructor(reviewService: ReviewService);
}
