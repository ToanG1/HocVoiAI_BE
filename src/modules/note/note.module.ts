import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { PrismaService } from '../prisma/prisma.service';
import { GoalBranchService } from '../goal-branch/goal-branch.service';

@Module({
  controllers: [NoteController],
  providers: [NoteService, PrismaService, GoalBranchService],
})
export class NoteModule {}
