import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { AI_URL } from './ai-url.constant';
import { RoadmapService } from '../roadmap/roadmap.service';
import { CreateRoadmapDto } from './dto/create-roadmap.dto';
@Injectable()
export class AiApiService {
  constructor(
    private readonly httpService: HttpService,
    private readonly roadmapService: RoadmapService,
  ) {}

  maxAttemps: number = 3;
  attemps: number = 0;

  async generateRoadmap(
    userId: string,
    topic: string,
    level: string,
    language: string,
  ) {
    try {
      const roadmap = await this.callAI(topic, level, language);
      console.log(roadmap);
      const createRoadmapDto: CreateRoadmapDto = {
        title: roadmap.title,
        description: roadmap.description,
        level: roadmap.level,
        duration: roadmap.duration,
        topics: roadmap.topics,
        language: roadmap.language,
        isPublic: false,
        type: 1,
        milestones: JSON.stringify(roadmap.milestones),
        avatar: '',
        tagId: [],
        categoryId: 1,
      };
      return this.roadmapService.createGeneratedRoadmap(
        userId,
        createRoadmapDto,
      );
    } catch (SyntaxError) {
      this.attemps++;
      if (this.attemps < this.maxAttemps - 1) {
        console.log('attemps: ' + this.attemps);
        this.generateRoadmap(userId, topic, level, language);
      } else {
        console.log("Can't generate roadmap");
      }
    }
  }

  async callAI(topic: string, level: string, language: string) {
    const { data } = await this.httpService.axiosRef.post(`${AI_URL}/gen`, {
      topic,
      level,
      language,
    });

    const regex = /\,(?!\s*?[\{\[\"\'\w])/g;
    const object = data.response.replace(regex, '');

    return JSON.parse(object);
  }
}
