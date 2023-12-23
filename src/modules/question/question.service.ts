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
  }

  findAll() {
    return this.prismaService.question.findMany({
      where: {
        isActivated: true,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  findAllByAdmin() {
    return this.prismaService.question.findMany({
      include: {
        user: {
          select: {
            uuid: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  search(searchString: string) {
    return this.prismaService.question.findMany({
      where: {
        title: {
          contains: searchString,
          mode: 'insensitive',
        },
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        category: true,
      },
    });
  }

  async findOne(qId: number) {
    const q = await this.prismaService.question.findUnique({
      where: {
        id: Number(qId),
      },
      include: {
        user: {
          select: {
            name: true,
            uuid: true,
          },
        },
        category: true,
        tags: true,
      },
    });
    return q;
  }

  async update(qId: number, updateQuestionDto: UpdateQuestionDto) {
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
  }

  async remove(qId: number) {
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
  }
}
