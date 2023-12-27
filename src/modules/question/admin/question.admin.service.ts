import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { UpdateQuestionDto } from '../dto/update-question.dto';
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
  findQuestionOwner(id: number){
    return this.prismaService.question.findUnique({
      where :{
        id:id,
      },
      select:{
        user:{
          select:{
            email: true,
          },
        },
      },
    });
  }
  async update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return this.prismaService.question.update({
      where: {
        id: id,
      },
      data: {
        title: updateQuestionDto.title,
        content: updateQuestionDto.content,
        isActivated: updateQuestionDto.isActivated,
      },
    });
  }
  async ban(id: number) {
    return this.prismaService.question.update({
      where: {
        id: id,
      },
      data: {
        isActivated: false,
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
