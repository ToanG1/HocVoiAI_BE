import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrivilegeService {
  constructor(private readonly prismaService: PrismaService) {}
  getPrivilege(uuid: string, rmId: string) {
    return this.prismaService.privilege.findUnique({
      where: {
        userId_rmdId: {
          userId: uuid,
          rmdId: rmId,
        },
      },
      select: {
        type: true,
      },
    });
  }
  removeAllPrivileges(rmId: string) {
    return this.prismaService.privilege.deleteMany({
      where: {
        rmdId: rmId,
      },
    });
  }

  getAllPrivilege(uuid: string) {
    return this.prismaService.privilege.findMany({
      where: {
        userId: uuid,
      },
      select: {
        createdAt: true,
        roadmapDetail: {
          select: {
            id: true,
            title: true,
            avatar: true,
            description: true,
            level: true,
            duration: true,
            topics: true,
            language: true,
            category: true,
            tags: true,
            isPublic: true,
            rating: true,
            createdAt: true,
            updateAt: true,
          },
        },
        progress: true,
      },
    });
  }
}
