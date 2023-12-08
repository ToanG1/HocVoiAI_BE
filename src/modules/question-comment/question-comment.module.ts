import { Module } from '@nestjs/common';
import { QuestionCommentService } from './question-comment.service';
import { QuestionCommentController } from './question-comment.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [QuestionCommentController],
  providers: [QuestionCommentService, PrismaService],
})
export class QuestionCommentModule {}
