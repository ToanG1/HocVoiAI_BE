import { Module } from '@nestjs/common';
import { GoalBranchService } from './goal-branch.service';
import { PrismaService } from '../prisma/prisma.service';
import { GoalBranchController } from './goal-branch.controller';
import { GoalsService } from '../goals/goals.service';

@Module({
  providers: [GoalBranchService, PrismaService, GoalsService],
  controllers: [GoalBranchController],
})
export class GoalBranchModule {}
