import { IsNotEmpty } from 'class-validator';

class topic {
  @IsNotEmpty()
  topic: string;

  level: string = 'beginner';

  language: string = 'english';

  type: number = 1;

  categoryId: number = 1;
}

export class GenRoadmap {
  @IsNotEmpty()
  topics: topic[];

  @IsNotEmpty()
  userId: string;
}
