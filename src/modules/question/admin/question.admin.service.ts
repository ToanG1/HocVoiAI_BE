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
}
