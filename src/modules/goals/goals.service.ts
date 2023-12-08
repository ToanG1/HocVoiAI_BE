import { Injectable } from '@nestjs/common';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GoalsService {
  constructor(private readonly prismaService: PrismaService) {}
  create(createGoalDto: CreateGoalDto) {
    return this.prismaService.goal.create({
      data: {
        name: createGoalDto.name,
        userId: createGoalDto.userId,
        createAt: new Date(),
        updateAt: new Date(),
      },
    });
  }

  findAllByUserId(userId: string) {
    return this.prismaService.goal.findMany({
      where: {
        userId,
      },
    });
  }

  findOne(id: number) {
    return this.prismaService.goal.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            uuid: true,
            name: true,
          },
        },
      },
    });
  }

  update(id: number, updateGoalDto: UpdateGoalDto) {
    return this.prismaService.goal.update({
      where: {
        id,
      },
      data: {
        name: updateGoalDto.name,
        updateAt: new Date(),
      },
    });
  }

  remove(id: number) {
    return this.prismaService.goal.delete({
      where: {
        id,
      },
    });
  }
}
