import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
  Delete,
  Patch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GoalBranchService } from './goal-branch.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { CreateGoalBranchDto } from '../dto/create-goal-branch.dto';
import { GoalsService } from '../../goals/user/goals.service';
import { UpdateGoalBranchDto } from '../dto/update-goal-branch.dto';

@Controller('api/goal-branch')
export class GoalBranchController {
  constructor(
    private readonly goalBranchService: GoalBranchService,
    private readonly goalService: GoalsService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async createGoalBranch(@Body() createGoalBranchDto: CreateGoalBranchDto) {
    //Check if goal exist
    const goal = this.goalService.findOne(createGoalBranchDto.goalId);
    if (goal) return this.goalBranchService.create(createGoalBranchDto);
    else
      throw new HttpException('This goal is not exist', HttpStatus.NOT_FOUND);
  }

  @Get(':goalId')
  findAllByGoalId(@Param('goalId') goalId: string) {
    return this.goalBranchService.findAllByGoalId(goalId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async updateGoalBranch(
    @Param('id') branchId: string,
    @Body() updateGoalBranchDto: UpdateGoalBranchDto,
    @Request() req: any,
  ) {
    const id = parseInt(branchId, 10);
    const goal = await this.goalService.findOne(updateGoalBranchDto.goalId);
    if (goal.userId === req.user.sub) {
      return this.goalBranchService.update(id, updateGoalBranchDto);
    } else throw new ForbiddenException();
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteGoalBranch(@Param('id') branchId: string, @Request() req: any) {
    const id = parseInt(branchId, 10);
    const branch = await this.goalBranchService.findById(id);
    if (branch.goal.userId === req.user.sub)
      return this.goalBranchService.remove(id);
    else throw new ForbiddenException();
  }
}
