import { Body, Controller, Delete, Get, Param, Patch, UseGuards, UseInterceptors } from '@nestjs/common';
import { AdminAuthGuard } from 'src/guard/adminAuth.guard';
import { PaginationInterceptor } from 'src/interceptors/pagination.interceptors';
import { QuestionAdminService } from './question.admin.service';
import { ChartFormattedQuestionDataInterceptor } from 'src/interceptors/chart-fomarted-question-data.interceptors';
import { UpdateQuestionDto } from '../dto/update-question.dto';

import { MailSenderService } from 'src/modules/mail-sender/mail-sender.service';

@Controller('api/admin/question')
@UseGuards(AdminAuthGuard)
export class QuestionAdminController {
  constructor(private readonly questionService: QuestionAdminService,

    private readonly mailSenderService: MailSenderService,
    ) {}

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

  @Patch(':id')
  update(@Param('id')id : string,@Body() updateQuestionDto:UpdateQuestionDto){
  
    return this.questionService
    .update(Number(id),updateQuestionDto)
    .then(async(res)=>
    {
      const owner = await this.questionService.findQuestionOwner(Number(id));
        this.mailSenderService.sendNotificationEmail(
          owner.user.email,
          `Question ${id} has been updated due to our policy`,
          `Your question with id ${id} has been updated due to our policy`,
          'Contact our support team for more information',
        );
      
      return res;
    });
  }

  @Delete(':id')
  ban(@Param('id') id: string) {
   
    return this.questionService.ban(Number(id)).then(async (res) => {

      const owner = await this.questionService.findQuestionOwner(Number(id));
      this.mailSenderService.sendNotificationEmail(
        owner.user.email,
        `Question ${id} has been ban due to our policy`,
        `Your question with id ${id} has been updated due to our policy`,
        'Contact our support team for more information',
      );
    
    return res;
    });
  }
}
