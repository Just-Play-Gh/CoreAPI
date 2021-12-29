import { IsNotEmpty } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty({ message: 'Review Type is required' })
  reviewType: number;

  @IsNotEmpty({ message: 'Invoice ID is required' })
  invoiceId: string;

  @IsNotEmpty({ message: 'Customer ID is required' })
  customerId: string;

  @IsNotEmpty({ message: 'Driver ID is required' })
  driverId: string;

  @IsNotEmpty({ message: 'Review is required' })
  review: string;
}
