import { Module } from '@nestjs/common';
import { CategoryService } from './user/category.service';
import { CategoryController } from './user/category.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryAdminController } from './admin/category.admin.controller';
import { MailSenderService } from '../mail-sender/mail-sender.service';
import { CategoryAdminService } from './admin/category.admin.service';
@Module({
  controllers: [CategoryController, CategoryAdminController],
  providers: [CategoryService, PrismaService, MailSenderService, CategoryAdminService],
})
export class CategoryModule {}
