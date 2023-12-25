import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from '../user.service';
import { AdminAuthGuard } from 'src/guard/adminAuth.guard';
import { PaginationInterceptor } from 'src/interceptors/pagination.interceptors';
import { ChartFormattedUserDataInterceptor } from 'src/interceptors/chart-fomarted-user-data.interceptors';

@Controller('api/admin/user')
@UseGuards(AdminAuthGuard)
export class UserAdminController {
  constructor(private readonly userService: UserService) {}

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
}
