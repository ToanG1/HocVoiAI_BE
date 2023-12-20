import { Injectable } from '@nestjs/common';
import { CreateQuestionReplyDto } from './dto/create-question-reply.dto';
import { UpdateQuestionReplyDto } from './dto/update-question-reply.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuestionReplyService {
  constructor(private readonly prismaService: PrismaService) {}
  create(createQuestionReplyDto: CreateQuestionReplyDto, userId: string) {
    return this.prismaService.questionReply.create({
      data: {
        content: createQuestionReplyDto.content,
        user: {
          connect: {
            uuid: userId,
          },
        },
        question: {
          connect: {
            id: createQuestionReplyDto.questionId,
          },
        },
        createdAt: new Date(),
        updateAt: new Date(),
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  findAll(qId: number) {
    return this.prismaService.questionReply.findMany({
      where: {
        questionId: Number(qId),
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prismaService.questionReply.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        user: {
          select: {
            uuid: true,
          },
        },
      },
    });
  }

  update(id: number, updateQuestionReplyDto: UpdateQuestionReplyDto) {
    return this.prismaService.questionReply.update({
      where: {
        id: Number(id),
      },
      data: {
        content: updateQuestionReplyDto.content,
        updateAt: new Date(),
      },
    });
  }

  async remove(id: number) {
    await this.prismaService.questionReply.delete({
      where: {
        id: Number(id),
      },
    });
  }
}
