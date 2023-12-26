import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoryAdminService {
  constructor(private readonly prismaService: PrismaService) {}

  findAllByAdmin() {
    return this.prismaService.category.findMany();
  }

  update(id: number, data: UpdateCategoryDto) {
    return this.prismaService.category.update({
      where: {
        id: id,
      },
      data: {
        name: data.name,
        isActived: data.isActived,
      },
    });
  }

  ban(id: number) {
    return this.prismaService.category.update({
      where: {
        id: id,
      },
      data: {
        isActived: false,
      },
    });
  }
}
