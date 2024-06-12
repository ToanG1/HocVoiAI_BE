import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { AI_URL } from '../ai-url.constant';

@Injectable()
export class ImageAiApiService {
  constructor(private readonly httpService: HttpService) {}

  async generateImage(decription) {
    const { data } = await this.httpService.axiosRef.post(
      `${AI_URL}/generateImage?description=${decription}`,
    );

    return data;
  }
}
