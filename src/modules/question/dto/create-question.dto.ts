import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty({
    description: 'question title',
    example: 'question title',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'question content in html',
    example: '<p>question content</p>',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'list of tag ids',
    example: [1, 2, 3],
    required: false,
  })
  @IsOptional()
  tagIds: number[];

  @ApiProperty({
    description: 'question title',
    example: 'question title',
    required: true,
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  categoryId: number;
}
