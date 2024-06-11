import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdminAuthGuard } from 'src/guard/adminAuth.guard';
import { PaginationInterceptor } from 'src/interceptors/pagination.interceptors';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CategoryAdminService } from './category.admin.service';
import { CreateCategoryDto } from '../dto/create-category.dto';

@Controller('api/admin/category')
@UseGuards(AdminAuthGuard)
export class CategoryAdminController {
  constructor(private readonly categoryService: CategoryAdminService) {}

  @Post()
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }
  @Get()
  @UseInterceptors(PaginationInterceptor)
  findAll() {
    return this.categoryService.findAllByAdmin();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(Number(id), updateCategoryDto);
  }

  @Delete(':id')
  ban(@Param('id') id: string) {
    return this.categoryService.ban(Number(id));
  }
}
