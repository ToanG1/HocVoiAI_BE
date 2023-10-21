import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateQuestionReplyDto {
  @ApiProperty({
    description: 'content (in html) of the question reply',
    example: '<h1>hello</h1>',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'question id',
    example: 1,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  questionId: number;
}
