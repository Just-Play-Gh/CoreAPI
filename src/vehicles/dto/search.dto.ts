import { IsNotEmpty } from 'class-validator';

export class SearchDto {
  @IsNotEmpty({ message: 'search Key is required' })
  searchKey: string;
}
