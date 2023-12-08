import { IsNumber, IsString } from 'class-validator';

export class CreateQuestionCommentDto {
  @IsString()
  content: string;

  userId: string;

  @IsNumber()
  questionId: number;

  @IsNumber()
  questionReplyId: number;
}
