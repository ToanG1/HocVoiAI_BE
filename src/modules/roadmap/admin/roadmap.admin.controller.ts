import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { RoadmapAdminService } from './roadmap.admin.service';
import { AdminAuthGuard } from 'src/guard/adminAuth.guard';
import { PaginationInterceptor } from 'src/interceptors/pagination.interceptors';

@Controller('api/admin/roadmap')
@UseGuards(AdminAuthGuard)
export class RoadmapAdminController {
  constructor(private readonly roadmapService: RoadmapAdminService) {}

  @Get()
  @UseInterceptors(PaginationInterceptor)
  findAll() {
    return this.roadmapService.findAll();
  }
}
