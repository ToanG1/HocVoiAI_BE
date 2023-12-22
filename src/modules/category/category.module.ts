import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryAdminController } from './category.admin.controller';
@Module({
  controllers: [CategoryController, CategoryAdminController],
  providers: [CategoryService, PrismaService],
})
export class CategoryModule {}
