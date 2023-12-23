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
  UseInterceptors,
  ForbiddenException,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { UpdateQuestionDto } from '../dto/update-question.dto';
import { AuthGuard } from 'src/guard/auth.guard';

import { PaginationInterceptor } from 'src/interceptors/pagination.interceptors';

@Controller('api/question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() createQuestionDto: CreateQuestionDto,
    @Request() req: any,
  ) {
    return await this.questionService.create(createQuestionDto, req.user.sub);
  }

  @Get()
  @UseInterceptors(PaginationInterceptor)
  async findAll() {
    return await this.questionService.findAll();
  }

  @Get('search')
  @UseInterceptors(PaginationInterceptor)
  async search(@Query('keyword') title: string) {
    return await this.questionService.search(title);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.questionService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: number,
    @Body() updateQuestionDto: UpdateQuestionDto,
    @Request() req: any,
  ) {
    //Check if the user is the owner
    const question = await this.questionService.findOne(id);
    if (question.user.uuid !== req.user.sub) {
      throw new ForbiddenException();
    }
    return this.questionService.update(+id, updateQuestionDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: number, @Request() req: any) {
    //Check if the user is the owner
    const question = await this.questionService.findOne(id);
    if (question.user.uuid !== req.user.sub) {
      throw new ForbiddenException();
    }
    return this.questionService.remove(id);
  }
}
