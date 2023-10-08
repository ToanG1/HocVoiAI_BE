import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRoadmapDto } from './create-roadmap.dto';
import { IsOptional } from 'class-validator';

class Roadmap {
  @ApiProperty({
    description: 'title of roadmap',
    type: String,
  })
  @IsOptional()
  title: string;

  @ApiProperty({
    description: 'content of roadmap which if stringtify from json',
    type: String,
  })
  @IsOptional()
  topics: string;
}

export class UpdateRoadmapDto extends PartialType(CreateRoadmapDto) {
  @ApiProperty({
    description: 'object roadmap which contain contents',
  })
  @IsOptional()
  roadmap: Roadmap;
}
