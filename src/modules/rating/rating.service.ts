import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { PrismaService } from '../prisma/prisma.service';
import { RatingType } from 'src/utils/enums/rating-type';

@Injectable()
export class RatingService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userId: string, createRatingDto: CreateRatingDto) {
    const rating = await this.prismaService.rating
      .create({
        data: {
          userId: userId,
          rmId: createRatingDto.rmId,
          star: createRatingDto.star,
          content: createRatingDto.content,
          type: RatingType[RatingType.ROADMAP],
          createdAt: new Date(),
          updateAt: new Date(),
        },
      })
      .catch(() => {
        throw new ForbiddenException('You have already rated this roadmap');
      });
    if (rating) {
      this.changeRoadmapRating(createRatingDto.rmId, createRatingDto.star);
      return rating;
    }
  }

  findAllByRmId(rmId: string) {
    return this.prismaService.rating.findMany({
      where: {
        rmId: rmId,
        type: RatingType[RatingType.ROADMAP],
      },
      include: {
        user: {
          select: {
            name: true,
            userInfo: {
              select: {
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findOne(id: number) {
    return this.prismaService.rating.findUnique({ where: { id } });
  }

  async update(id: number, updateRatingDto: UpdateRatingDto) {
    const rating = await this.prismaService.rating.update({
      where: { id },
      data: {
        star: updateRatingDto.star,
        content: updateRatingDto.content,
        updateAt: new Date(),
      },
    });

    await this.changeRoadmapRating(rating.rmId, rating.star);

    return await rating;
  }

  remove(id: number) {
    return this.prismaService.rating.delete({
      where: {
        id,
      },
    });
  }

  private async changeRoadmapRating(rmId: string, star: number) {
    const ratings = await this.prismaService.rating.findMany({
      where: {
        rmId: rmId,
        type: RatingType[RatingType.ROADMAP],
      },
    });

    const totalStar =
      ratings.reduce((sum, rating) => sum + rating.star, 0) + star;

    console.log(totalStar + ' ' + ratings.length);
    const rating = totalStar / (ratings.length + 1);
    console.log(rating);

    await this.prismaService.roadmapDetails.update({
      where: {
        id: rmId,
      },
      data: {
        rating: rating,
      },
    });
  }
}
