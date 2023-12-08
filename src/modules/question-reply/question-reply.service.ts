import { Injectable } from '@nestjs/common';
import { CreateQuestionReplyDto } from './dto/create-question-reply.dto';
import { UpdateQuestionReplyDto } from './dto/update-question-reply.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuestionReplyService {
  constructor(private readonly prismaService: PrismaService) {}
  create(createQuestionReplyDto: CreateQuestionReplyDto, userId: string) {
    try {
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
    } catch (error) {
      return error.message;
    }
  }

  findAll(qId: number) {
    try {
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
    } catch (error) {
      return error.message;
    }
  }

  async findOne(id: number) {
    try {
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
    } catch (error) {
      return error.message;
    }
  }

  update(id: number, updateQuestionReplyDto: UpdateQuestionReplyDto) {
    try {
      return this.prismaService.questionReply.update({
        where: {
          id: Number(id),
        },
        data: {
          content: updateQuestionReplyDto.content,
          updateAt: new Date(),
        },
      });
    } catch (error) {
      return error.message;
    }
  }

  async remove(id: number) {
    try {
      await this.prismaService.questionReply.delete({
        where: {
          id: Number(id),
        },
      });
      return 'success';
    } catch (error) {
      return error.message;
    }
  }
}
