import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { User } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../user/userDTO/createUser.dto';
import { UpdateUserDto } from '../user/userDTO/updateUser.dto';
const Rounds = 10;

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}
  async getAllUsers() {
    try {
      return await this.prismaService.user.findMany();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async createUser(userDto: CreateUserDto) {
    try {
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
      const hashedPassword = await bcrypt.hash(userDto.password, Rounds);
      userDto.password = hashedPassword;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { notification_token, ...userData } = userDto;
      const createdUser = await this.prismaService.user.create({
        data: userData,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = createdUser;
      return result;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async getUser(userId: string) {
    try {
      const foundUser = await this.findUserById(userId);
      await this.throwNotFoundIfUserNotProvided(foundUser);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = foundUser;
      return result;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async updateUser(userId: string, updateUser: UpdateUserDto) {
    try {
      const foundUser = await this.findUserById(userId);
      await this.throwNotFoundIfUserNotProvided(foundUser);
      const updatedUser = await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: updateUser,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = updatedUser;
      return result;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async deleteUser(userId: string) {
    try {
      const foundUser = await this.findUserById(userId);
      await this.throwNotFoundIfUserNotProvided(foundUser);
      const deletedUser = await this.prismaService.user.delete({
        where: {
          id: userId,
        },
      });

      return deletedUser;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findUserById(userID: string): Promise<User | null | undefined> {
    try {
      return await this.prismaService.user.findUnique({
        where: {
          id: userID,
        },
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async throwNotFoundIfUserNotProvided(user: User) {
    if (!user) throw new HttpException('user not found', HttpStatus.NOT_FOUND);
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    try {
      const foundUser = await this.prismaService.user.findUnique({
        where: {
          email: email,
        },
      });
      if (!foundUser) {
        throw new HttpException(
          'there was no user found with this email',
          HttpStatus.NOT_FOUND,
        );
      }
      return foundUser;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
