import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from '../authDto/login.dto';
import { AuthService } from '../user/auth.service';
import { AdminAuthGuard } from 'src/guard/adminAuth.guard';

@Controller('api/admin/auth')
export class AuthAdminController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() signInDto: LoginDto) {
    if (await this.authService.isUserAdmin(signInDto.email))
      return this.authService.login(signInDto);
  }

  @Post('refresh')
  refreshToken(@Body('refreshToken') refreshToken: string) {
    if (refreshToken) {
      return this.authService.refresh(refreshToken);
    } else throw new UnauthorizedException('Refresh token is required');
  }

  @Get('logout')
  @UseGuards(AdminAuthGuard)
  logout(@Request() req: any) {
    return this.authService.signOut(req.user.sub);
  }

  @Get('check-admin')
  @UseGuards(AdminAuthGuard)
  async checkAdmin() {
    return true;
  }
}
