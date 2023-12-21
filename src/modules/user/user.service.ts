import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../user/userDTO/createUser.dto';
import { UpdateUserDto } from '../user/userDTO/updateUser.dto';
import { TokenType } from 'src/utils/enums/token-type';

const Rounds = 10;

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}
  async getAllUsers() {
    return await this.prismaService.user.findMany();
  }

  async createUser(userDto: CreateUserDto) {
    const foundUser = await this.prismaService.user.findUnique({
      where: {
        email: userDto.email,
      },
    });
    if (foundUser) {
      throw new HttpException(
        'user with this email already exists',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hashedPassword = await bcrypt.hash(userDto.password, Rounds);
    userDto.password = hashedPassword;
    const createdUser = await this.prismaService.user.create({
      data: userDto,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = createdUser;
    return result;
  }

  async getUser(userId: string) {
    return this.prismaService.user.findUnique({
      where: {
        uuid: userId,
      },
      select: {
        uuid: true,
        name: true,
        email: true,
        isAdmin: true,
        userInfo: true,
        followers: true,
        following: true,
      },
    });
  }

  async updateUser(userId: string, updateUser: UpdateUserDto) {
    const foundUser = await this.findUserById(userId);
    await this.throwNotFoundIfUserNotProvided(foundUser);
    const updatedUser = await this.prismaService.user.update({
      where: {
        uuid: userId,
      },
      data: {
        name: updateUser.name || undefined,
        email: updateUser.email || undefined,
        password: updateUser.password || undefined,
        isAdmin: updateUser.isAdmin || undefined,
        updatedAt: new Date(),
        userInfo: {
          upsert: {
            where: {
              userId: userId,
            },
            update: {
              avatar: updateUser.avatar || undefined,
              about: updateUser.about,
              socialLink: updateUser.socialLink || undefined,
              updatedAt: new Date(),
            },
            create: {
              avatar: updateUser.avatar || undefined,
              about: updateUser.about,
              socialLink: updateUser.socialLink || undefined,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        },
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = updatedUser;
    return result;
  }

  async deleteUser(userId: string) {
    const foundUser = await this.findUserById(userId);
    await this.throwNotFoundIfUserNotProvided(foundUser);
    const deletedUser = await this.prismaService.user.delete({
      where: {
        uuid: userId,
      },
    });

    return deletedUser;
  }

  async findUserById(userID: string): Promise<User | null | undefined> {
    return await this.prismaService.user.findUnique({
      where: {
        uuid: userID,
      },
    });
  }

  async throwNotFoundIfUserNotProvided(user: User) {
    if (!user) throw new HttpException('user not found', HttpStatus.NOT_FOUND);
  }

  async findOneByEmail(email: string) {
    const foundUser = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
      include: {
        userInfo: true,
      },
    });
    if (!foundUser) {
      throw new HttpException(
        'there was no user found with this email',
        HttpStatus.NOT_FOUND,
      );
    }
    return foundUser;
  }

  async changePassword(token: string, newPassword: string) {
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

    const deleteToken = this.prismaService.token.delete({
      where: foundToken,
    });
    const updatePassword = this.prismaService.user.update({
      where: {
        uuid: foundToken.userId,
      },
      data: {
        password: await bcrypt.hash(newPassword, Rounds),
      },
    });

    this.prismaService.$transaction([deleteToken, updatePassword]);
  }
}
