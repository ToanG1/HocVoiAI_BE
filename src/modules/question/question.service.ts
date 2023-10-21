import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuestionService {
  constructor(private readonly prismaService: PrismaService) {}
  getTag(tagId: number[]) {
    if (!tagId) return undefined;
    if (tagId.length > 0) {
      return this.prismaService.tag.findMany({
        where: {
          id: {
            in: tagId,
          },
        },
      });
    } else undefined;
  }

  async getCategory(categoryId: number) {
    if (categoryId !== undefined) {
      const category = await this.prismaService.category.findUnique({
        where: {
          id: categoryId,
        },
      });
      return category ? category : undefined;
    } else return undefined;
  }

  async create(createQuestionDto: CreateQuestionDto, userId: string) {
    try {
      //get tags and category which is legal
      const tags = await this.getTag(createQuestionDto.tagIds);
      const category = await this.getCategory(createQuestionDto.categoryId);

      const question = this.prismaService.question.create({
        data: {
          title: createQuestionDto.title,
          content: createQuestionDto.content,
          user: {
            connect: {
              uuid: userId,
            },
          },
          tags: {
            connect: tags,
          },
          category: {
            connect: category,
          },
          replies: {
            create: [],
          },
          createdAt: new Date(),
          updateAt: new Date(),
        },
      });
      return question;
    } catch (error) {
      return error.message;
    }
  }

  findAll() {
    try {
      return this.prismaService.question.findMany();
    } catch (error) {
      return error.message;
    }
  }

  async findOne(qId: number) {
    try {
      const q = await this.prismaService.question.findUnique({
        where: {
          id: Number(qId),
        },
        include: {
          user: {
            select: {
              uuid: true,
            },
          },
          category: true,
          tags: true,
        },
      });
      return q;
    } catch (error) {
      return error.message;
    }
  }

  async update(qId: number, updateQuestionDto: UpdateQuestionDto) {
    try {
      //get tags and category which is legal
      const tags = await this.getTag(updateQuestionDto.tagIds);
      const category = await this.getCategory(updateQuestionDto.categoryId);

      const question = this.prismaService.question.update({
        where: {
          id: qId,
        },
        data: {
          title: updateQuestionDto.title || undefined,
          content: updateQuestionDto.content || undefined,
          tags: {
            connect: tags,
          },
          category: {
            connect: category,
          },
          updateAt: new Date(),
        },
      });
      return question;
    } catch (error) {
      return error.message;
    }
  }

  async remove(qId: number) {
    try {
      const deleteReplies = this.prismaService.questionReply.deleteMany({
        where: {
          questionId: Number(qId),
        },
      });
      const deleteQuestion = this.prismaService.question.delete({
        where: {
          id: Number(qId),
        },
      });
      await this.prismaService.$transaction([deleteReplies, deleteQuestion]);
      return 'success';
    } catch (error) {
      return error.message;
    }
  }
}
