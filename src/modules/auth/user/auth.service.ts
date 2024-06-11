import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../authDto/login.dto';
import { CreateUserDto } from '../../user/userDTO/createUser.dto';
import { PrismaService } from '../../prisma/prisma.service';

import * as dayjs from 'dayjs';
import { TokenType } from 'src/utils/enums/token-type.enum';
import { MailSenderService } from '../../mail-sender/mail-sender.service';
import { randomUUID } from 'crypto';

const JWT_ACCESS_TOKEN_EXPIRATION_TIME = '2h';
const JWT_REFRESH_TOKEN_EXPIRATION_TIME = '7d';

const getRefreshExpiry = () => dayjs().add(7, 'd').toDate();
const getResetCodeExpiry = () => dayjs().add(5, 'm').toDate();

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private prismaService: PrismaService,
    private mailService: MailSenderService,
  ) {}

  async isUserAdmin(email: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (user.isAdmin) return true;
    else throw new UnauthorizedException('User is not admin');
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOneByEmail(loginDto.email);
    if (!user || !user.isActivated) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }
    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new HttpException('Wrong password', HttpStatus.UNAUTHORIZED);
    }
    const payload = {
      sub: user.uuid,
      username: user.name,
      email: user.email,
    };

    const refersh_token = await this.getRefreshToken(payload);

    const deleteToken = this.prismaService.token.deleteMany({
      where: {
        userId: user.uuid,
        type: TokenType[TokenType.REFRESH_TOKEN],
      },
    });

    const token = this.prismaService.token.create({
      data: {
        user: {
          connect: user,
        },
        token: refersh_token,
        type: TokenType[TokenType.REFRESH_TOKEN],
        expiresAt: getRefreshExpiry(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return this.prismaService
      .$transaction([deleteToken, token])
      .then(async () => {
        return {
          access_token: await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: JWT_ACCESS_TOKEN_EXPIRATION_TIME,
          }),
          refersh_token: refersh_token,
          user_info: {
            userId: user.uuid,
            name: user.name,
            avatar: user.userInfo ? user.userInfo.avatar : null,
          },
        };
      });
  }

  async signUp(signUpDto: CreateUserDto) {
    const createdUser = await this.usersService.createUser(signUpDto);

    const activationToken = await this.prismaService.token.create({
      data: {
        user: {
          connect: createdUser,
        },
        token: randomUUID(),
        type: TokenType[TokenType.ACTIVATION_TOKEN],
        expiresAt: getRefreshExpiry(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    this.mailService.sendActiationEmail(
      createdUser.email,
      activationToken.token,
    );

    const payload = {
      sub: createdUser.uuid,
      username: createdUser.name,
      email: createdUser.email,
    };
    const refersh_token = await this.getRefreshToken(payload);

    await this.prismaService.token.create({
      data: {
        user: {
          connect: createdUser,
        },
        token: refersh_token,
        type: TokenType[TokenType.REFRESH_TOKEN],
        expiresAt: getRefreshExpiry(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return await {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: JWT_ACCESS_TOKEN_EXPIRATION_TIME,
      }),
      refersh_token: refersh_token,
      user_info: {
        userId: createdUser.uuid,
        name: createdUser.name,
      },
    };
  }

  async activate(activationToken: string) {
    try {
      const foundToken = await this.prismaService.token.findUnique({
        where: {
          token_type: {
            token: activationToken,
            type: TokenType[TokenType.ACTIVATION_TOKEN],
          },
        },
      });
      if (!foundToken)
        throw new HttpException(
          'Activation token is not present',
          HttpStatus.UNAUTHORIZED,
        );
      if (foundToken.expiresAt < new Date())
        throw new HttpException(
          'Activation token is expired',
          HttpStatus.UNAUTHORIZED,
        );

      const deleteToken = this.prismaService.token.delete({
        where: foundToken,
      });
      const activateUser = this.prismaService.user.update({
        where: {
          uuid: foundToken.userId,
        },
        data: {
          isActivated: true,
        },
      });
      return this.prismaService
        .$transaction([deleteToken, activateUser])
        .then(() => {
          return true;
        });
    } catch (error) {
      return false;
    }
  }

  async refresh(refershToken: string) {
    const foundToken = await this.prismaService.token.findUnique({
      where: {
        token_type: {
          token: refershToken,
          type: TokenType[TokenType.REFRESH_TOKEN],
        },
      },
      include: {
        user: true,
      },
    });
    if (!foundToken)
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
      email: foundToken.user.email,
    };

    await this.prismaService.token.update({
      where: {
        token_type: {
          token: refershToken,
          type: TokenType[TokenType.REFRESH_TOKEN],
        },
      },
      data: {
        updatedAt: new Date(),
      },
    });
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: JWT_ACCESS_TOKEN_EXPIRATION_TIME,
      }),
    };
  }

  async getRefreshToken(payload: any) {
    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    });
  }

  async signOut(userId: string) {
    try {
      await this.prismaService.token.deleteMany({
        where: {
          userId: userId,
          type: TokenType[TokenType.REFRESH_TOKEN],
        },
      });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async handleForgotPasswordCode(email: string) {
    const user = await this.usersService.findOneByEmail(email);

    const deleteOldToken = this.prismaService.token.deleteMany({
      where: {
        userId: user.uuid,
        type: TokenType[TokenType.RESET_TOKEN],
      },
    });

    const token = this.getRndCode();

    const saveToken = this.prismaService.token.create({
      data: {
        user: {
          connect: user,
        },
        token: token.toString(),
        type: TokenType[TokenType.RESET_TOKEN],
        expiresAt: getResetCodeExpiry(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    this.prismaService.$transaction([deleteOldToken, saveToken]).then(() => {
      this.mailService.sendResetPasswordSecret(email, token);
    });
  }

  getRndCode() {
    return Math.floor(Math.random() * (1000000 - 100000)) + 100000;
  }

  async checkResetCode(email: string, code: number) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) throw new NotFoundException('No user found');

    const foundToken = await this.prismaService.token.findUnique({
      where: {
        token_type: {
          token: code.toString(),
          type: TokenType[TokenType.RESET_TOKEN],
        },
      },
    });

    if (!foundToken) {
      throw new NotFoundException('Your token is wrong');
    } else if (foundToken.expiresAt < new Date()) {
      throw new NotFoundException('Your token is expired');
    }

    const deletedToken = await this.prismaService.token.delete({
      where: foundToken,
    });

    if (deletedToken) {
      return await true;
    } else return await false;
  }

  async checkUrlToken(token: string) {
    try {
      const foundToken = await this.prismaService.token.findUnique({
        where: {
          token_type: {
            token: token,
            type: TokenType[TokenType.URL_TOKEN],
          },
        },
      });

      if (!foundToken) {
        throw new NotFoundException('Your token is wrong');
      } else if (foundToken.expiresAt < new Date()) {
        throw new NotFoundException('Your token is expired');
      }

      return true;
    } catch (err) {
      return false;
    }
  }

  async handleResetPasswordUrl(email: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) throw new NotFoundException('No user found');

    const urlToken = randomUUID();

    const deleteOldToken = this.prismaService.token.deleteMany({
      where: {
        userId: user.uuid,
        type: TokenType[TokenType.URL_TOKEN],
      },
    });

    const createToken = this.prismaService.token.create({
      data: {
        user: {
          connect: user,
        },
        token: urlToken,
        type: TokenType[TokenType.URL_TOKEN],
        expiresAt: getResetCodeExpiry(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      select: {
        token: true,
      },
    });

    return this.prismaService
      .$transaction([deleteOldToken, createToken])
      .then(() => {
        return urlToken;
      });
  }

  async checkPwd(email: string, pwd: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) throw new NotFoundException('No user found');
    const isMatch = await bcrypt.compare(pwd, user.password);

    if (!isMatch) {
      throw new NotFoundException('Wrong password');
    }

    const urlToken = randomUUID();

    const deleteOldToken = this.prismaService.token.deleteMany({
      where: {
        userId: user.uuid,
        type: TokenType[TokenType.URL_TOKEN],
      },
    });

    const createToken = this.prismaService.token.create({
      data: {
        user: {
          connect: user,
        },
        token: urlToken,
        type: TokenType[TokenType.URL_TOKEN],
        expiresAt: getResetCodeExpiry(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      select: {
        token: true,
      },
    });

    return this.prismaService
      .$transaction([deleteOldToken, createToken])
      .then(() => {
        return urlToken;
      });
  }
}
