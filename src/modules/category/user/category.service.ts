import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}
  findAll() {
    return this.prismaService.category.findMany({
      where: {
        isActived: true,
      },
    });
  }

  findAllByAdmin() {
    return this.prismaService.category.findMany();
  }
}
