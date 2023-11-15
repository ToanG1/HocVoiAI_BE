import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './authDto/login.dto';
import { CreateUserDto } from '../user/userDTO/createUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOneByEmail(loginDto.email);
    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new HttpException('wrong password', HttpStatus.UNAUTHORIZED);
    }
    const payload = {
      sub: user.uuid,
      username: user.name,
      isAdmin: user.isAdmin,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user_info: {
        userId: user.uuid,
        name: user.name,
        avatar: user.userInfo ? user.userInfo.avatar : null,
      },
    };
  }

  async signUp(signUpDto: CreateUserDto) {
    const createdUser = await this.usersService.createUser(signUpDto);
    const payload = { sub: createdUser.uuid, username: createdUser.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user_info: {
        userId: createdUser.uuid,
        name: createdUser.name,
      },
    };
  }
}
