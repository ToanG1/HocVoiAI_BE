import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Param,
  Req,
} from '@nestjs/common';
import { CreateUserDto } from 'src/modules/user/userDTO/createUser.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './authDto/login.dto';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  signUp(@Body() signUpDto: CreateUserDto) {
    return this.authService.signUp(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() signInDto: LoginDto) {
    return this.authService.login(signInDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh/:tokenId')
  refreshToken(
    @Param('tokenId') tokenId: string,
    @Body('refreshToken') refreshToken: string,
  ) {
    console.log(refreshToken);
    return this.authService.refresh(tokenId, refreshToken);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
