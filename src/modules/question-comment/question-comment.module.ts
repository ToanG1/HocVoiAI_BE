import { Module } from '@nestjs/common';
import { QuestionCommentService } from './user/question-comment.service';
import { QuestionCommentController } from './user/question-comment.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [QuestionCommentController],
  providers: [QuestionCommentService, PrismaService],
})
export class QuestionCommentModule {}
