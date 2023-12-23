import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from '../dto/create-note.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { GoalBranchService } from '../../goal-branch/user/goal-branch.service';

@Controller('api/note')
export class NoteController {
  constructor(
    private readonly noteService: NoteService,
    private readonly goalBranchService: GoalBranchService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createNoteDto: CreateNoteDto, @Request() req: any) {
    const goalBranch = await this.goalBranchService.findById(
      createNoteDto.goalBranchId,
    );
    if (goalBranch.goal.userId !== req.user.sub) {
      throw new ForbiddenException();
    }
    return this.noteService.create(createNoteDto);
  }

  @Get(':id')
  findAll(@Param('id') id: string) {
    return this.noteService.findAllByGoalBranchId(Number(id));
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @Request() req: any,
  ) {
    const note = await this.noteService.findOne(+id);
    if (note.goalBranch.goal.userId !== req.user.sub) {
      throw new ForbiddenException();
    }
    return this.noteService.update(+id, updateNoteDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string, @Request() req: any) {
    const note = await this.noteService.findOne(+id);
    if (note.goalBranch.goal.userId !== req.user.sub) {
      throw new ForbiddenException();
    }
    return this.noteService.remove(+id);
  }
}
