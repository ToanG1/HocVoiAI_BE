import { Injectable } from '@nestjs/common';
import { CreateQuestionCommentDto } from '../dto/create-question-comment.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class QuestionCommentService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createQuestionCommentDto: CreateQuestionCommentDto) {
    return this.prismaService.questionComment.create({
      data: {
        content: createQuestionCommentDto.content,
        userId: createQuestionCommentDto.userId,
        questionId: createQuestionCommentDto.questionId,
        questionReplyId: createQuestionCommentDto.questionReplyId || undefined,
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

  findAllById(id: number) {
    return this.prismaService.questionComment.findMany({
      where: {
        questionReplyId: id,
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

  findOne(id: number) {
    return `This action returns a #${id} questionComment`;
  }

  update(id: number) {
    return `This action updates a #${id} questionComment`;
  }

  remove(id: number) {
    return this.prismaService.questionComment.delete({
      where: {
        id,
      },
    });
  }
}
