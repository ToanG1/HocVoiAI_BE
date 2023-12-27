import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CreateCategoryDto } from '../dto/create-category.dto';

@Injectable()
export class CategoryAdminService {
  constructor(private readonly prismaService: PrismaService) {}

  findAllByAdmin() {
    return this.prismaService.category.findMany();
  }
  
  create(data: CreateCategoryDto){
    return this.prismaService.category.create({
      data:{
        name: data.name,
        isActived: false,
      }
    })
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
