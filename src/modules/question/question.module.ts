import { Module } from '@nestjs/common';
import { QuestionService } from './user/question.service';
import { QuestionController } from './user/question.controller';
import { QuestionAdminController } from './admin/question.admin.controller';
import { QuestionAdminService } from './admin/question.admin.service';
import { PrismaService } from '../prisma/prisma.service';
import { MailSenderService } from '../mail-sender/mail-sender.service';
@Module({
  controllers: [QuestionController, QuestionAdminController],
  providers: [QuestionService, QuestionAdminService, PrismaService,MailSenderService],
})
export class QuestionModule {}
