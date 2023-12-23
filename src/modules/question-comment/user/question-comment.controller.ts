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
} from '@nestjs/common';
import { QuestionCommentService } from './question-comment.service';
import { CreateQuestionCommentDto } from '../dto/create-question-comment.dto';
import { UpdateQuestionCommentDto } from '../dto/update-question-comment.dto';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('api/question-comment')
export class QuestionCommentController {
  constructor(
    private readonly questionCommentService: QuestionCommentService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() createQuestionCommentDto: CreateQuestionCommentDto,
    @Request() req: any,
  ) {
    createQuestionCommentDto.userId = req.user.sub;
    return this.questionCommentService.create(createQuestionCommentDto);
  }

  @Get(':id')
  findAll(@Param('id') id: string) {
    const questionId = parseInt(id, 10);
    return this.questionCommentService.findAllById(questionId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuestionCommentDto: UpdateQuestionCommentDto,
  ) {
    return this.questionCommentService.update(+id, updateQuestionCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionCommentService.remove(+id);
  }
}
