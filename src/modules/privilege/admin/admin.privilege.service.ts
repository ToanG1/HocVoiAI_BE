import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PrivilegeAdminService {
  constructor(private prismaService: PrismaService) {}
  getRoadmapOwnerPrivilege(rmId: string) {
    return this.prismaService.privilege.findMany({
      where: {
        rmdId: rmId,
      },
      select: {
        user: {
          select: {
            uuid: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }
 
}
