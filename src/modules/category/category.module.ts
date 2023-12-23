import { Module } from '@nestjs/common';
import { CategoryService } from './user/category.service';
import { CategoryController } from './user/category.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryAdminController } from './admin/category.admin.controller';
@Module({
  controllers: [CategoryController, CategoryAdminController],
  providers: [CategoryService, PrismaService],
})
export class CategoryModule {}
