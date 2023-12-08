import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateGoalBranchDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  rmId: string;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  goalId: number;

  @ApiProperty({
    type: Date,
  })
  @IsString()
  startDate: Date;

  @ApiProperty({
    type: Date,
  })
  @IsString()
  endDate: Date;
}
