import { IsNotEmpty } from 'class-validator';

class topic {
  @IsNotEmpty()
  topic: string;

  @IsNotEmpty()
  level: string = 'beginner';

  @IsNotEmpty()
  language: string = 'english';
}

export class GenRoadmap {
  @IsNotEmpty()
  topics: topic[];

  @IsNotEmpty()
  userId: string;
}
