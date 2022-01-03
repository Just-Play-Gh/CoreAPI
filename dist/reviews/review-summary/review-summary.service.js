"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewSummaryService = void 0;
const common_1 = require("@nestjs/common");
const review_entity_1 = require("../review/entities/review.entity");
const dayjs_1 = __importDefault(require("dayjs"));
const review_summary_entity_1 = require("./entities/review_summary.entity");
let ReviewSummaryService = class ReviewSummaryService {
    async store() {
        const yesterday = (0, dayjs_1.default)().add(-1, 'days').format('YYYY-MM-DD');
        const date = (0, dayjs_1.default)().format('YYYY-MM-DD');
        const reviews = await review_entity_1.Review.getRepository()
            .createQueryBuilder()
            .where({ createdDate: date })
            .groupBy('customerId')
            .addGroupBy('driverId')
            .addSelect('COUNT(id)', 'totalCount')
            .getRawMany();
        for (const review of reviews) {
            const summary = await review_summary_entity_1.ReviewSummary.findOne({
                where: [
                    { customerId: review.Review_customerId },
                    { driverId: review.Review_driverId },
                ],
            });
            if (summary) {
                const stars = +summary.totalStars + review.Review_stars;
                const tcount = +summary.totalCount + +review.totalCount;
                const rating = stars / tcount;
                review_summary_entity_1.ReviewSummary.update(+summary.id, {
                    totalStars: stars,
                    totalCount: tcount,
                    rating: rating,
                });
            }
            else {
                const reviewSummary = review_summary_entity_1.ReviewSummary.create();
                reviewSummary.invoiceId = review.Review_invoiceId;
                reviewSummary.driverId = review.Review_driverId;
                reviewSummary.customerId = review.Review_customerId;
                reviewSummary.totalCount = review.totalCount;
                reviewSummary.totalStars = review.Review_stars;
                reviewSummary.rating = review.Review_stars;
                reviewSummary.save();
            }
        }
        console.log('success');
    }
};
ReviewSummaryService = __decorate([
    (0, common_1.Injectable)()
], ReviewSummaryService);
exports.ReviewSummaryService = ReviewSummaryService;
//# sourceMappingURL=review-summary.service.js.map