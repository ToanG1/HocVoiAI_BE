import { Injectable } from '@nestjs/common';
import { CreateGoalBranchDto } from '../dto/create-goal-branch.dto';
import { UpdateGoalBranchDto } from '../dto/update-goal-branch.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GoalBranchService {
  constructor(private readonly prismaService: PrismaService) {}
  create(createGoalBranchDto: CreateGoalBranchDto) {
    return this.prismaService.goalBranch.create({
      data: {
        roamapDetails: {
          connect: {
            id: createGoalBranchDto.rmId,
          },
        },
        goal: {
          connect: {
            id: createGoalBranchDto.goalId,
          },
        },
        startDate: new Date(createGoalBranchDto.startDate) || new Date(),
        endDate: new Date(createGoalBranchDto.endDate) || new Date(),
      },
    });
  }

  findById(id: number) {
    return this.prismaService.goalBranch.findUnique({
      where: {
        id,
      },
      include: {
        goal: {
          select: {
            userId: true,
          },
        },
      },
    });
  }

  findAllByGoalId(goalId: string) {
    const id = parseInt(goalId, 10);
    return this.prismaService.goalBranch.findMany({
      where: {
        goalId: id,
      },
    });
  }

  update(id: number, updateGoalBranchDto: UpdateGoalBranchDto) {
    return this.prismaService.goalBranch.update({
      where: {
        id: id,
      },
      data: {
        startDate: new Date(updateGoalBranchDto.startDate) || new Date(),
        endDate: new Date(updateGoalBranchDto.endDate) || new Date(),
        rmId: updateGoalBranchDto.rmId,
      },
    });
  }

  remove(id: number) {
    return this.prismaService.goalBranch.delete({
      where: {
        id: id,
      },
    });
  }
}
