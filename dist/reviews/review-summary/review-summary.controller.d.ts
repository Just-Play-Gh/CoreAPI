import { ReviewSummaryService } from './review-summary.service';
export declare class ReviewSummaryController {
    private readonly reviewSummaryService;
    constructor(reviewSummaryService: ReviewSummaryService);
    getSummaries(): Promise<void>;
}
