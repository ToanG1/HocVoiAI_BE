import { Module } from '@nestjs/common';
import { QuestionReplyService } from './question-reply.service';
import { QuestionReplyController } from './question-reply.controller';
import { PrismaService } from '../prisma/prisma.service';
import { QuestionService } from '../question/user/question.service';
@Module({
  controllers: [QuestionReplyController],
  providers: [QuestionReplyService, QuestionService, PrismaService],
})
export class QuestionReplyModule {}
