import {
  Controller,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Get,
} from '@nestjs/common';
import { ReportAdminService } from './report.admin.service';
import { AdminAuthGuard } from 'src/guard/adminAuth.guard';
import { PaginationInterceptor } from 'src/interceptors/pagination.interceptors';
import { ChartFormattedReportDataInterceptor } from 'src/interceptors/chart-fomarted-report-data.interceptors';

@Controller('api/admin/report')
@UseGuards(AdminAuthGuard)
export class ReportAdminController {
  constructor(private readonly reportService: ReportAdminService) {}

  @Get()
  @UseInterceptors(PaginationInterceptor)
  findAll() {
    return this.reportService.findAll();
  }

  @Get('chart')
  @UseInterceptors(ChartFormattedReportDataInterceptor)
  getChartData() {
    return this.reportService.findAll();
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.reportService.remove(Number(id));
  }
}
