import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './authDto/login.dto';
import { CreateUserDto } from '../user/userDTO/createUser.dto';
import { PrismaService } from '../prisma/prisma.service';

import * as dayjs from 'dayjs';

const JWT_ACCESS_TOKEN_EXPIRATION_TIME = '5h';
const JWT_REFRESH_TOKEN_EXPIRATION_TIME = '7d';

const getRefreshExpiry = () => dayjs().add(7, 'd').toDate();

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async login(loginDto: LoginDto) {
    try {
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

      const refersh_token = await this.getRefreshToken(payload);

      const token = await this.prismaService.token.create({
        data: {
          user: {
            connect: user,
          },
          refreshToken: refersh_token,
          expiresAt: getRefreshExpiry(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return {
        access_token: await this.jwtService.signAsync(payload, {
          secret: process.env.JWT_SECRET,
          expiresIn: JWT_ACCESS_TOKEN_EXPIRATION_TIME,
        }),
        refersh_token: refersh_token,
        tokenId: token.id,
        user_info: {
          userId: user.uuid,
          name: user.name,
          avatar: user.userInfo ? user.userInfo.avatar : null,
        },
      };
    } catch (err) {
      console.log(err);
    }
  }

  async signUp(signUpDto: CreateUserDto) {
    const createdUser = await this.usersService.createUser(signUpDto);
    const payload = { sub: createdUser.uuid, username: createdUser.name };
    const refersh_token = await this.getRefreshToken(payload);

    const token = await this.prismaService.token.create({
      data: {
        user: {
          connect: createdUser,
        },
        refreshToken: refersh_token,
        expiresAt: getRefreshExpiry(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: JWT_ACCESS_TOKEN_EXPIRATION_TIME,
      }),
      refersh_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: JWT_REFRESH_TOKEN_EXPIRATION_TIME,
      }),
      tokenId: token.id,
      user_info: {
        userId: createdUser.uuid,
        name: createdUser.name,
      },
    };
  }

  async refresh(tokenId: string, refershToken: string) {
    const foundToken = await this.prismaService.token.findUnique({
      where: {
        id: tokenId,
      },
      include: {
        user: true,
      },
    });
    if (!foundToken || foundToken.refreshToken !== refershToken)
      throw new HttpException(
        'Refresh token is not present',
        HttpStatus.UNAUTHORIZED,
      );
    const exp = new Date(foundToken.expiresAt);
    const now = new Date();
    if (exp < now)
      throw new HttpException(
        'Refresh token is expired!',
        HttpStatus.UNAUTHORIZED,
      );
    const payload = {
      sub: foundToken.user.uuid,
      username: foundToken.user.name,
      isAdmin: foundToken.user.isAdmin,
    };

    await this.prismaService.token.update({
      where: {
        id: tokenId,
      },
      data: {
        updatedAt: new Date(),
      },
    });
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async getRefreshToken(payload: any) {
    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    });
  }

  async signOut(tokenId: string) {
    try {
      await this.prismaService.token.delete({
        where: {
          id: tokenId,
        },
      });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
