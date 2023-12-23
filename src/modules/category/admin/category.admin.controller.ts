import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { CategoryService } from '../user/category.service';
import { AdminAuthGuard } from 'src/guard/adminAuth.guard';
import { PaginationInterceptor } from 'src/interceptors/pagination.interceptors';

@Controller('api/admin/category')
@UseGuards(AdminAuthGuard)
export class CategoryAdminController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @UseInterceptors(PaginationInterceptor)
  findAll() {
    return this.categoryService.findAllByAdmin();
  }
}
