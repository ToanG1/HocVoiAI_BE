import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateReportDto {
  @ApiProperty({
    description: 'Type of report',
    type: String,
    enum: [
      'USER_REPORT',
      'ROADMAP_REPORT',
      'QUESTION_REPORT',
      'QUESTION_REPLY_REPORT',
      'QUESTION_COMMENT_REPORT',
    ],
  })
  @IsString()
  type: string;

  @IsString()
  objectId: string;

  @IsString()
  reason: string;

  @IsString()
  content: string;
}
