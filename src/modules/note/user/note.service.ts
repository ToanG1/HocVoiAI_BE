import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from '../dto/create-note.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NoteService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createNoteDto: CreateNoteDto) {
    return this.prismaService.note.create({
      data: {
        name: createNoteDto.name,
        content: createNoteDto.content,
        goalBranchId: createNoteDto.goalBranchId,
        createdAt: new Date(),
        updateAt: new Date(),
      },
    });
  }

  findAllByGoalBranchId(id: number) {
    return this.prismaService.note.findMany({
      where: {
        goalBranchId: id,
      },
    });
  }

  findOne(id: number) {
    return this.prismaService.note.findUnique({
      where: {
        id,
      },
      include: {
        goalBranch: {
          include: {
            goal: {
              select: {
                userId: true,
              },
            },
          },
        },
      },
    });
  }

  update(id: number, updateNoteDto: UpdateNoteDto) {
    return this.prismaService.note.update({
      where: {
        id,
      },
      data: {
        name: updateNoteDto.name,
        content: updateNoteDto.content,
        updateAt: new Date(),
      },
    });
  }

  remove(id: number) {
    return this.prismaService.note.delete({
      where: {
        id,
      },
    });
  }
}
