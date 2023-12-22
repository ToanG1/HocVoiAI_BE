import { Controller, Get, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { AdminAuthGuard } from 'src/guard/adminAuth.guard';

@Controller('api/admin/category')
@UseGuards(AdminAuthGuard)
export class CategoryAdminController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll() {
    return this.categoryService.findAllByAdmin();
  }
}
