import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { AdminAuthGuard } from 'src/guard/adminAuth.guard';
import { PaginationInterceptor } from 'src/interceptors/pagination.interceptors';
import { QuestionAdminService } from './question.admin.service';
import { ChartFormattedQuestionDataInterceptor } from 'src/interceptors/chart-fomarted-question-data.interceptors';

@Controller('api/admin/question')
@UseGuards(AdminAuthGuard)
export class QuestionAdminController {
  constructor(private readonly questionService: QuestionAdminService) {}

  @Get()
  @UseInterceptors(PaginationInterceptor)
  findAll() {
    return this.questionService.findAllbyAdmin();
  }

  @Get('chart')
  @UseInterceptors(ChartFormattedQuestionDataInterceptor)
  getChartData() {
    return this.questionService.findAllbyAdmin();
  }
}
