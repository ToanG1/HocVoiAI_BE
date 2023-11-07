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
  HttpException,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { AuthGuard } from 'src/guard/auth.guard';

import { SuccessResponse } from 'src/model/successResponse';

@Controller('api/question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createQuestionDto: CreateQuestionDto, @Request() req: any) {
    try {
      const res: SuccessResponse = {
        data: this.questionService.create(createQuestionDto, req.user.sub),
        message: 'Create Question successfully',
        code: 200,
      };
      return res;
    } catch (err) {
      const res: SuccessResponse = {
        data: {},
        message: 'Something wrong',
        code: 500,
      };
      return res;
    }
  }

  @Get()
  findAll() {
    return this.questionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.questionService.findOne(id);
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
      throw new HttpException('You dont have access', 403);
    }
    return this.questionService.update(+id, updateQuestionDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: number, @Request() req: any) {
    //Check if the user is the owner
    const question = await this.questionService.findOne(id);
    if (question.user.uuid !== req.user.sub) {
      throw new HttpException('You dont have access', 403);
    }
    return this.questionService.remove(id);
  }
}
