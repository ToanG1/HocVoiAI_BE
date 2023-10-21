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
  HttpException,
} from '@nestjs/common';
import { QuestionReplyService } from './question-reply.service';
import { CreateQuestionReplyDto } from './dto/create-question-reply.dto';
import { UpdateQuestionReplyDto } from './dto/update-question-reply.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { QuestionService } from '../question/question.service';

@Controller('api/question-reply')
export class QuestionReplyController {
  constructor(
    private readonly questionReplyService: QuestionReplyService,
    private readonly questionService: QuestionService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() createQuestionReplyDto: CreateQuestionReplyDto,
    @Request() req: any,
  ) {
    try {
      // Check if the question is legal
      const question = await this.questionService.findOne(
        createQuestionReplyDto.questionId,
      );
      if (!question) {
        throw new HttpException('There was no question found', 404);
      }

      // Create the question reply
      return this.questionReplyService.create(
        createQuestionReplyDto,
        req.user.sub,
      );
    } catch (error) {
      return error;
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findAllRepliesInQuestion(@Param('id') id: number) {
    try {
      return this.questionReplyService.findAll(id);
    } catch (error) {
      return error.message;
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: number,
    @Body() updateQuestionReplyDto: UpdateQuestionReplyDto,
    @Request() req: any,
  ) {
    try {
      //Check if the user is the owner
      const reply = await this.questionReplyService.findOne(id);
      if (!reply) {
        throw new HttpException('There was no question reply found', 404);
      }
      if (reply.user.uuid !== req.user.sub) {
        throw new HttpException('You dont have access', 403);
      }
      return this.questionReplyService.update(+id, updateQuestionReplyDto);
    } catch (error) {
      return error.message;
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: number, @Request() req: any) {
    try {
      //Check if the user is the owner
      const reply = await this.questionReplyService.findOne(id);
      if (!reply) {
        throw new HttpException('There was no question reply found', 404);
      }
      if (reply.user.uuid !== req.user.sub) {
        throw new HttpException('You dont have access', 403);
      }
      return this.questionReplyService.remove(+id);
    } catch (error) {
      return error.message;
    }
  }
}
