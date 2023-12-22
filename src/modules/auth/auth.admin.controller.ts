import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './authDto/login.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { UserService } from '../user/user.service';

@Controller('api/admin/auth')
export class AuthAdminController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async isUserAdmin(email: string) {
    const user = await this.userService.findOneByEmail(email);
    if (user.isAdmin) return true;
    else throw new UnauthorizedException("You don't have permission");
  }

  @Post('login')
  async login(@Body() signInDto: LoginDto) {
    if (await this.isUserAdmin(signInDto.email))
      return this.authService.login(signInDto);
  }

  @UseGuards(AuthGuard)
  @Get('logout')
  logout(@Request() req: any) {
    return this.authService.signOut(req.user.sub);
  }

  @Get('check-admin')
  @UseGuards(AuthGuard)
  async checkAdmin(@Request() req: any) {
    return await this.isUserAdmin(req.user.email);
  }
}
