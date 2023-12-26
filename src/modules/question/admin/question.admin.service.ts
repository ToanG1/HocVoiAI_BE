import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
@Injectable()
export class QuestionAdminService {
  constructor(private prismaService: PrismaService) {}
  findAllbyAdmin() {
    return this.prismaService.question.findMany({
      include: {
        comments: true,
        replies: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  findOneByAdmin(id: number) {
    return this.prismaService.question.findUnique({
      where: {
        id: id,
      },
      select: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });
  }
}
