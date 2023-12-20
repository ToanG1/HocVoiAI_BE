import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  Post,
} from '@nestjs/common';
import { AuthGuard } from 'src/guard/auth.guard';
import { PrivilegeService } from './privilege.service';

@Controller('api/privilege')
export class PrivilegeController {
  constructor(private readonly privilegeService: PrivilegeService) {}

  @Post(':rmId')
  @UseGuards(AuthGuard)
  public createPrivilege(@Param('rmId') rmId: string, @Request() req: any) {
    return this.privilegeService.create(rmId, req.user.sub);
  }

  @Get(':searchString')
  @UseGuards(AuthGuard)
  public searchPrivilege(
    @Param('searchString') searchString: string,
    @Request() req: any,
  ) {
    return this.privilegeService.search(searchString, req.user.sub);
  }
}
