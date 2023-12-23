import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from '../user.service';
import { AdminAuthGuard } from 'src/guard/adminAuth.guard';
import { PaginationInterceptor } from 'src/interceptors/pagination.interceptors';

@Controller('api/admin/user')
@UseGuards(AdminAuthGuard)
export class UserAdminController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseInterceptors(PaginationInterceptor)
  findAll() {
    return this.userService.findAll();
  }
}
