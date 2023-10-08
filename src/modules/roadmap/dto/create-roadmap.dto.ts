import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRoadmapDto {
  @ApiProperty({
    description: 'title of the roadmap',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'avatar url of the roadmap',
    type: String,
  })
  @IsString()
  @IsOptional()
  avatar: string;

  @ApiProperty({
    description: 'description to know about the roadmap',
    type: String,
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'difficulty level of the roadmap',
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
  })
  @IsString()
  @IsNotEmpty()
  level: string;

  @ApiProperty({
    description: 'duration of the roadmap',
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  duration: number;

  @ApiProperty({
    description: 'the number of topics in this the roadmap',
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  topics: number;

  @ApiProperty({
    description: 'tags id of the roadmap',
  })
  @IsOptional()
  tagId: number[];

  @ApiProperty({
    description: 'language of the roadmap',
    type: String,
  })
  @IsString()
  language: string;

  @ApiProperty({
    description: 'is this roadmap public or not',
    type: Boolean,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isPublic: boolean;

  @ApiProperty({
    description: 'category id of the roadmap',
    type: Number,
    default: 1, // stand for general
  })
  @IsNumber()
  @IsOptional()
  categoryId: number;

  @ApiProperty({
    description: 'type of the roadmap',
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  type: number;
}
