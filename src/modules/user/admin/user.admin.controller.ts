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
import { AdminAuthGuard } from 'src/guard/adminAuth.guard';
import { PaginationInterceptor } from 'src/interceptors/pagination.interceptors';
import { ChartFormattedUserDataInterceptor } from 'src/interceptors/chart-fomarted-user-data.interceptors';
import { UserAdminService } from './user.admin.service';
import { UpdateUserDto } from '../userDTO/updateUser.dto';
import { MailSenderService } from 'src/modules/mail-sender/mail-sender.service';

@Controller('api/admin/user')
@UseGuards(AdminAuthGuard)
export class UserAdminController {
  constructor(
    private readonly userService: UserAdminService,
    private readonly userAdminService: UserAdminService,
    private readonly mailSenderService: MailSenderService,
  ) {}

  @Get()
  @UseInterceptors(PaginationInterceptor)
  findAll() {
    return this.userService.findAll();
  }

  @Get('chart')
  @UseInterceptors(ChartFormattedUserDataInterceptor)
  getChartData() {
    return this.userService.findAll();
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const owner = await this.userAdminService.findOneByAdmin(id);

    return this.userService.updateUser(id, updateUserDto).then((res) => {
      this.mailSenderService.sendNotificationEmail(
        owner.email,
        `User ${id} has been updated due to our policy`,
        `Your User with id ${id} has been updated due to our policy`,
        'Contact our support team for more information',
      );
      return res;
    });
  }

  @Delete(':id')
  async ban(@Param('id') id: string) {
    const owner = await this.userAdminService.findOneByAdmin(id);

    return this.userAdminService.ban(id).then((res) => {
      this.mailSenderService.sendNotificationEmail(
        owner.email,
        `User ${id} has been baned due to our policy`,
        `Your User with id ${id} has been baned due to our policy`,
        'Contact our support team for more information',
      );
      return res;
    });
  }
}
