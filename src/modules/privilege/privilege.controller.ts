import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from 'src/guard/auth.guard';
import { PrivilegeService } from './privilege.service';

@Controller('api/privilege')
export class PrivilegeController {
  constructor(private readonly privilegeService: PrivilegeService) {}

  @Get(':searchString')
  @UseGuards(AuthGuard)
  public searchPrivilege(
    @Param('searchString') searchString: string,
    @Request() req: any,
  ) {
    return this.privilegeService.search(searchString, req.user.sub);
  }
}
