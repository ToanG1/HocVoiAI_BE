import { Module } from '@nestjs/common';
import { NoteService } from './user/note.service';
import { NoteController } from './user/note.controller';
import { PrismaService } from '../prisma/prisma.service';
import { GoalBranchService } from '../goal-branch/user/goal-branch.service';

@Module({
  controllers: [NoteController],
  providers: [NoteService, PrismaService, GoalBranchService],
})
export class NoteModule {}
