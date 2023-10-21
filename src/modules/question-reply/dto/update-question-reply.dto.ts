import { PartialType } from '@nestjs/swagger';
import { CreateQuestionReplyDto } from './create-question-reply.dto';

export class UpdateQuestionReplyDto extends PartialType(CreateQuestionReplyDto) {}
