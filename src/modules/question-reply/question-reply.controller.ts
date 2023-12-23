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
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { QuestionReplyService } from './question-reply.service';
import { CreateQuestionReplyDto } from './dto/create-question-reply.dto';
import { UpdateQuestionReplyDto } from './dto/update-question-reply.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { QuestionService } from '../question/user/question.service';

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
    // Check if the question is legal
    const question = await this.questionService.findOne(
      createQuestionReplyDto.questionId,
    );
    if (!question) {
      throw new NotFoundException();
    }

    // Create the question reply
    return this.questionReplyService.create(
      createQuestionReplyDto,
      req.user.sub,
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findAllRepliesInQuestion(@Param('id') id: number) {
    return this.questionReplyService.findAll(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: number,
    @Body() updateQuestionReplyDto: UpdateQuestionReplyDto,
    @Request() req: any,
  ) {
    //Check if the user is the owner
    const reply = await this.questionReplyService.findOne(id);
    if (!reply) {
      throw new NotFoundException();
    }
    if (reply.user.uuid !== req.user.sub) {
      throw new NotFoundException();
    }
    return this.questionReplyService.update(+id, updateQuestionReplyDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: number, @Request() req: any) {
    //Check if the user is the owner
    const reply = await this.questionReplyService.findOne(id);
    if (!reply) {
      throw new NotFoundException();
    }
    if (reply.user.uuid !== req.user.sub) {
      throw new ForbiddenException();
    }
    console.log(reply);
    return this.questionReplyService.remove(+id);
  }
}
