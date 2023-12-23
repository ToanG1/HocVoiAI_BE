import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { AI_URL } from './ai-url.constant';
import { RoadmapService } from '../roadmap/user/roadmap.service';
import { CreateRoadmapDto } from './dto/create-roadmap.dto';
@Injectable()
export class AiApiService {
  constructor(
    private readonly httpService: HttpService,
    private readonly roadmapService: RoadmapService,
  ) {}

  async generateRoadmap(
    userId: string,
    topic: string,
    level: string,
    language: string,
  ) {
    try {
      const roadmap = await this.callAIToGen(topic, level, language);
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
    } catch (err) {
      console.log(err);
    }
  }

  async callAIToGen(topic: string, level: string, language: string) {
    const { data } = await this.httpService.axiosRef.post(`${AI_URL}/gen`, {
      topic,
      level,
      language,
    });

    const regex = /\,(?!\s*?[\{\[\"\'\w])/g;
    const object = data.response.replace(regex, '');
    return JSON.parse(object);
  }

  async callAIToSuggest(topic: string, level: string, language: string) {
    const { data } = await this.httpService.axiosRef.post(`${AI_URL}/suggest`, {
      topic,
      level,
      language,
    });

    const regex = /\,(?!\s*?[\{\[\"\'\w])/g;
    const object = data.response.replace(regex, '');
    return JSON.parse(object);
  }
}
