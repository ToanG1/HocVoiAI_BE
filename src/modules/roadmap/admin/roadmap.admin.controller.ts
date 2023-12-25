import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RoadmapAdminService } from './roadmap.admin.service';
import { AdminAuthGuard } from 'src/guard/adminAuth.guard';
import { PaginationInterceptor } from 'src/interceptors/pagination.interceptors';
import { ChartFormattedRoadmapDataInterceptor } from 'src/interceptors/chart-fomarted-roadmap-data.interceptors';
import { UpdateRoadmapDto } from '../dto/update-roadmap.dto';
import { MailSenderService } from 'src/modules/mail-sender/mail-sender.service';
import { PrivilegeAdminService } from 'src/modules/privilege/admin/admin.privilege.service';

@Controller('api/admin/roadmap')
@UseGuards(AdminAuthGuard)
export class RoadmapAdminController {
  constructor(
    private readonly roadmapService: RoadmapAdminService,
    private readonly mailSenderService: MailSenderService,
    private readonly privilegeService: PrivilegeAdminService,
  ) {}

  @Get()
  @UseInterceptors(PaginationInterceptor)
  findAll() {
    return this.roadmapService.findAll();
  }

  @Get('chart')
  @UseInterceptors(ChartFormattedRoadmapDataInterceptor)
  getChartData() {
    return this.roadmapService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoadmapDto: UpdateRoadmapDto) {
    return this.roadmapService
      .update(id, updateRoadmapDto)
      .then(async (res) => {
        const owners = await this.privilegeService.getRoadmapOwnerPrivilege(id);
        owners.map((owner) => {
          this.mailSenderService.sendNotificationEmail(
            owner.user.email,
            `Roadmap ${id} has been updated due to our policy`,
            `Your roadmap with id ${id} has been updated due to our policy`,
            'Contact our support team for more information',
          );
        });
        return res;
      });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roadmapService.remove(id).then(async (res) => {
      const owners = await this.privilegeService.getRoadmapOwnerPrivilege(id);
      owners.map((owner) => {
        this.mailSenderService.sendNotificationEmail(
          owner.user.email,
          `Roadmap ${id} has been banned due to our policy`,
          `Your roadmap with id ${id} has been banned due to our policy`,
          'Contact our support team for more information',
        );
      });
      return res;
    });
  }
}
