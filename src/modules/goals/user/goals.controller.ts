import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from '../dto/create-goal.dto';
import { UpdateGoalDto } from '../dto/update-goal.dto';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('api/goal')
export class GoalsController {
  constructor(private readonly goalService: GoalsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createGoalDto: CreateGoalDto, @Request() req: any) {
    createGoalDto.userId = req.user.sub;
    return this.goalService.create(createGoalDto);
  }

  @Get()
  findAllByUserId(@Query('userId') userId: string) {
    return this.goalService.findAllByUserId(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.goalService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateGoalDto: UpdateGoalDto,
    @Request() req: any,
  ) {
    const goal = await this.goalService.findOne(Number(id));
    if (goal.userId === req.user.sub)
      return this.goalService.update(+id, updateGoalDto);
    else throw new ForbiddenException('You dont have access to udpate!');
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string, @Request() req: any) {
    const goal = await this.goalService.findOne(Number(id));
    if (goal.userId === req.user.sub) return this.goalService.remove(+id);
    else throw new ForbiddenException('You dont have access to delete!');
  }
}
