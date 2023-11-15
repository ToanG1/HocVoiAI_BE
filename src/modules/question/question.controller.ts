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
  UseInterceptors,
  HttpStatus,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { AuthGuard } from 'src/guard/auth.guard';

import { ResponseModel } from 'src/interface/responseModel.interface';
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
    try {
      const res: ResponseModel = {
        data: await this.questionService.create(
          createQuestionDto,
          req.user.sub,
        ),
        message: 'Create Question successfully',
        code: HttpStatus.CREATED,
      };
      return res;
    } catch (err) {
      const res: ResponseModel = {
        data: {},
        message: 'Something wrong',
        code: HttpStatus.INTERNAL_SERVER_ERROR,
      };
      return res;
    }
  }

  @Get()
  @UseInterceptors(PaginationInterceptor)
  async findAll() {
    try {
      const res: ResponseModel = {
        data: await this.questionService.findAll(),
        code: HttpStatus.OK,
        message: 'Get Question successfully',
      };
      return res;
    } catch (err) {
      const res: ResponseModel = {
        data: [],
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something wrong',
      };
      return res;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    let res: ResponseModel = {
      data: {},
      message: 'Get Question successfully',
      code: HttpStatus.OK,
    };
    try {
      return (res = {
        ...res,
        data: await this.questionService.findOne(id),
      });
    } catch (err) {
      return (res = {
        ...res,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something wrong',
      });
    }
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
