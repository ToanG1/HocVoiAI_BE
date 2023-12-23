import { Module } from '@nestjs/common';
import { GoalsService } from './user/goals.service';
import { GoalsController } from './user/goals.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [GoalsController],
  providers: [GoalsService, PrismaService],
})
export class GoalsModule {}
