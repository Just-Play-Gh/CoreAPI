import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/resources/base.service';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewService extends BaseService {
  constructor() {
    super(Review);
  }
}
