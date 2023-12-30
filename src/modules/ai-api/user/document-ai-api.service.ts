import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { AI_URL } from '../ai-url.constant';
@Injectable()
export class DocumentAiApiService {
  constructor(private readonly httpService: HttpService) {}

  async getYoutubeSubsitles(videoId: string) {
    const { data } = await this.httpService.axiosRef.get(
      `${AI_URL}/subtitle?videoId=${videoId}`,
    );

    return data.subtitles;
  }

  async summarizeDocument(text: string) {
    const { data } = await this.httpService.axiosRef.post(
      `${AI_URL}/summarize`,
      {
        document: text,
      },
    );

    if (data.code === 200) return data.response;
    return "There's some problem with server, please try again later";
  }
}
