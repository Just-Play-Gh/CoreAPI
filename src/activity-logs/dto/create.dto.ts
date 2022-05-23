import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateActivityDto {
  @IsNotEmpty({ message: 'Log name is required' })
  logName: string;

  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @IsNotEmpty({ message: 'Subject ID is required' })
  subjectId: unknown;

  @IsNotEmpty({ message: 'Subject Type is required' })
  subjectType: string;

  @IsNotEmpty({ message: 'Causer ID is required' })
  causerId: number;

  @IsNotEmpty({ message: 'Causer Type is required' })
  causerType: string;

  @IsOptional()
  properties?: { old?: any; attributes: any };
}
