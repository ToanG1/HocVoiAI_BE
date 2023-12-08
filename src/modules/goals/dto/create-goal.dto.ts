import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateGoalDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  name: string;

  userId: string;
}
