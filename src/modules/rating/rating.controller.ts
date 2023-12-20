import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('api/rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createRatingDto: CreateRatingDto, @Request() req: any) {
    return this.ratingService.create(req.user.sub, createRatingDto);
  }

  @Get()
  findAll(@Query('rmId') rmId: string) {
    return this.ratingService.findAllByRmId(rmId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ratingService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateRatingDto: UpdateRatingDto,
    @Request() req: any,
  ) {
    const rating = await this.ratingService.findOne(+id);
    if (rating.userId !== req.user.sub) {
      throw new ForbiddenException();
    }
    return this.ratingService.update(+id, updateRatingDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string, @Request() req: any) {
    const rating = await this.ratingService.findOne(+id);
    if (rating.userId !== req.user.sub) {
      throw new ForbiddenException();
    }
    return this.ratingService.remove(+id);
  }
}
