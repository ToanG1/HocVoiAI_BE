import { Module } from '@nestjs/common';
import { GoalBranchService } from './user/goal-branch.service';
import { PrismaService } from '../prisma/prisma.service';
import { GoalBranchController } from './user/goal-branch.controller';
import { GoalsService } from '../goals/user/goals.service';

@Module({
  providers: [GoalBranchService, PrismaService, GoalsService],
  controllers: [GoalBranchController],
})
export class GoalBranchModule {}
