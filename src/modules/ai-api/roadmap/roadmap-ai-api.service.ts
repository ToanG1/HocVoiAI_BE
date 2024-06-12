import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { AI_URL } from '../ai-url.constant';
import { RoadmapService } from '../../roadmap/user/roadmap.service';
import { CreateRoadmapDto } from '../dto/create-roadmap.dto';
import { ImageAiApiService } from '../image/image-ai-api.service';

@Injectable()
export class RoadmapAiApiService {
  constructor(
    private readonly httpService: HttpService,
    private readonly roadmapService: RoadmapService,
    private readonly imageAiApiService: ImageAiApiService,
  ) {}

  async generateRoadmap(
    userId: string,
    topic: string,
    level: string,
    language: string,
  ) {
    try {
      const roadmap = await this.callAIToGen(topic, level, language);

      const generatedAvatar = await this.imageAiApiService.generateImage(
        roadmap.avatar,
      );

      //get suggestions
      const milestones = await Promise.all(
        roadmap.milestones.map(async (milestone) => {
          const content = await Promise.all(
            milestone.content.map(async (content) => {
              const suggestion = await this.callAIToSuggest(
                topic,
                content.name,
                language,
              );

              return {
                ...content,
                suggestion,
              };
            }),
          );

          return {
            ...milestone,
            content: content,
          };
        }),
      );

      const createRoadmapDto: CreateRoadmapDto = {
        title: roadmap.title,
        description: roadmap.description,
        level: level,
        duration: roadmap.duration,
        topics: roadmap.topics,
        language: language,
        isPublic: false,
        type: 1,
        milestones: JSON.stringify(milestones),
        avatar: generatedAvatar,
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

  async callAIToSuggest(topic: string, content: string, language: string) {
    const { data } = await this.httpService.axiosRef.post(`${AI_URL}/suggest`, {
      topic: topic,
      content: content,
      language: language,
    });

    return data.response;
  }
}
