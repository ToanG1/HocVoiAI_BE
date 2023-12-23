import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { QuestionAdminController } from './question.admin.controller';
import { PrismaService } from '../prisma/prisma.service';
@Module({
  controllers: [QuestionController, QuestionAdminController],
  providers: [QuestionService, PrismaService],
})
export class QuestionModule {}
