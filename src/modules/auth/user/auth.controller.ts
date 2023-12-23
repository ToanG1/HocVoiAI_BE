import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Param,
  Query,
  Request,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/modules/user/userDTO/createUser.dto';
import { AuthService } from './auth.service';
import { LoginDto } from '../authDto/login.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { UserService } from '../../user/user.service';

@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('signup')
  async signUp(@Body() signUpDto: CreateUserDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('activate')
  async activate(@Query('code') activationToken: string) {
    if (!activationToken)
      throw new NotFoundException('Activation code not found');
    return this.authService.activate(activationToken);
  }

  @Post('login')
  async login(@Body() signInDto: LoginDto) {
    return this.authService.login(signInDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refreshToken(@Body('refreshToken') refreshToken: string) {
    if (refreshToken) {
      return this.authService.refresh(refreshToken);
    } else throw new UnauthorizedException('Refresh token is required');
  }

  @UseGuards(AuthGuard)
  @Get('logout')
  logout(@Request() req: any) {
    return this.authService.signOut(req.user.sub);
  }

  @Get('forgot-pwd')
  async pwdReset(@Query('email') email: string) {
    await this.authService.handleForgotPasswordCode(email);
  }

  @Post('check-reset-code')
  async CheckPwdResetCode(
    @Query('email') email: string,
    @Query('code') code: number,
  ) {
    if (await this.authService.checkResetCode(email, code))
      return this.authService.handleResetPasswordUrl(email);
    return null;
  }

  @Post('reset-pwd/:token')
  resetPassword(@Param('token') token: string, @Body('pwd') pwd: string) {
    return this.userService.changePassword(token, pwd);
  }

  @Get('check-url-token')
  checkUrlToken(@Query('token') token: string) {
    return this.authService.checkUrlToken(token);
  }

  @Get('authenticate')
  @UseGuards(AuthGuard)
  authenticate() {
    return true;
  }

  @Post('change-pwd')
  @UseGuards(AuthGuard)
  changePassword(@Body('pwd') pwd: string, @Request() req: any) {
    return this.authService.checkPwd(req.user.email, pwd);
  }
}
