import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from '../dto/create-report.dto';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('report')
@UseGuards(AuthGuard)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  create(@Body() createReportDto: CreateReportDto, @Request() req: any) {
    return this.reportService.create(req.user.sub, createReportDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    const report = await this.reportService.findOne(Number(id));
    if (report.userId === req.user.sub)
      return this.reportService.remove(report);
    else throw new NotFoundException('Report Not Found');
  }
}
