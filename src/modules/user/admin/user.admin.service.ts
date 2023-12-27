import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { UpdateUserDto } from '../userDTO/updateUser.dto';

import { CreateUserDto } from '../userDTO/createUser.dto';

@Injectable()
export class UserAdminService {
  constructor(
    private prismaService: PrismaService,
  ) {
    
  }
  async findAll() {
    const users = await this.prismaService.user.findMany();

    return users.map((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    });
  }

  findAllByAdmin() {
    return this.prismaService.user.findMany();
  }
 
  async updateUser(userId: string, updateUser: UpdateUserDto) {
    return this.prismaService.user.update({
      where: {
        uuid: userId,
      },
      data: {
        name: updateUser.name || undefined,
        email: updateUser.email || undefined,
        password: updateUser.password || undefined,
        isAdmin: updateUser.isAdmin || undefined,
        updatedAt: new Date(),
      },
    });
  }
  async ban(uuid: string) {
    return this.prismaService.user.update({
      where: {
        uuid: uuid,
      },
      data: {
        isActivated: false,
      },
    });
  }
  
  findOneByAdmin(uuid: string) {
    return this.prismaService.user.findUnique({
      where: {
        uuid: uuid,
      },
          select: {
            email: true,
          },
      
    });
  }
}