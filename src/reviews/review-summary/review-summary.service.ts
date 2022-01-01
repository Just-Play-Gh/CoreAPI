import { Injectable } from '@nestjs/common';
import { Review } from '../review/entities/review.entity';
import dayjs from 'dayjs';
import { ReviewSummary } from './entities/review_summary.entity';

@Injectable()
export class ReviewSummaryService {
  async store() {
    const yesterday = dayjs().add(-1, 'days').format('YYYY-MM-DD');
    const date = dayjs().format('YYYY-MM-DD');

    const reviews = await Review.getRepository()
      .createQueryBuilder()
      .where({ createdDate: date })
      .groupBy('customerId')
      .addGroupBy('driverId')
      .addSelect('COUNT(id)', 'totalCount')
      .getRawMany();

    for (const review of reviews) {
      const summary = await ReviewSummary.findOne({
        where: [
          { customerId: review.Review_customerId },
          { driverId: review.Review_driverId },
        ],
      });

      if (summary) {
        const stars = +summary.totalStars + review.Review_stars;
        const tcount = +summary.totalCount + +review.totalCount;
        const rating = stars / tcount;
        ReviewSummary.update(+summary.id, {
          totalStars: stars,
          totalCount: tcount,
          rating: rating,
        });
      } else {
        const reviewSummary = ReviewSummary.create();
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
}
