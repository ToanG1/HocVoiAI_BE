import { IsNotEmpty } from 'class-validator';

class topic {
  @IsNotEmpty()
  topic: string;

  @IsNotEmpty()
  level: string = 'beginner';

  @IsNotEmpty()
  language: string = 'english';

  type: number = 1;
}

export class GenRoadmap {
  @IsNotEmpty()
  topics: topic[];

  @IsNotEmpty()
  userId: string;
}
