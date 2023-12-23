import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { AdminAuthGuard } from 'src/guard/adminAuth.guard';
import { QuestionService } from '../user/question.service';
import { PaginationInterceptor } from 'src/interceptors/pagination.interceptors';

@Controller('api/admin/question')
@UseGuards(AdminAuthGuard)
export class QuestionAdminController {
  constructor(private readonly questionService: QuestionService) {}

  @Get()
  @UseInterceptors(PaginationInterceptor)
  findAll() {
    return this.questionService.findAllByAdmin();
  }
}
