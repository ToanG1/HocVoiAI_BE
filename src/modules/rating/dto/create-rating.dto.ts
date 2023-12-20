import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Max,
} from 'class-validator';

export class CreateRatingDto {
  @IsString()
  @IsOptional()
  rmId: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  star: number;

  @IsString()
  @IsNotEmpty()
  content: string;
}
