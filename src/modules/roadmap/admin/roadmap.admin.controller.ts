import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { RoadmapAdminService } from './roadmap.admin.service';
import { AdminAuthGuard } from 'src/guard/adminAuth.guard';
import { PaginationInterceptor } from 'src/interceptors/pagination.interceptors';
import { ChartFormattedDataInterceptor } from 'src/interceptors/chart-fomarted-data.interceptors';

@Controller('api/admin/roadmap')
@UseGuards(AdminAuthGuard)
export class RoadmapAdminController {
  constructor(private readonly roadmapService: RoadmapAdminService) {}

  @Get()
  @UseInterceptors(PaginationInterceptor)
  findAll() {
    return this.roadmapService.findAll();
  }

  @Get('chart')
  @UseInterceptors(ChartFormattedDataInterceptor)
  getChartData() {
    return this.roadmapService.findAll();
  }
}
