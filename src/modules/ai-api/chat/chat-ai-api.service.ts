import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { AI_URL } from '../ai-url.constant';
@Injectable()
export class ChatAiApiService {
  constructor(private readonly httpService: HttpService) {}

  async initChat() {
    const { data } = await this.httpService.axiosRef.get(`${AI_URL}/init`);
    return data;
  }

  async chat(dataObject: any) {
    const { data } = await this.httpService.axiosRef.post(
      `${AI_URL}/chat`,
      dataObject,
    );
    return data;
  }
}
