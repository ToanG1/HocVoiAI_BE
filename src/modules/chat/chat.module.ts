import { Module } from '@nestjs/common';
import { ChatBotGateway } from './chatbot/chatbot.gateway';
import { HttpModule } from '@nestjs/axios';
import { ChatAiApiService } from '../ai-api/chat/chat-ai-api.service';

@Module({
  providers: [ChatBotGateway, ChatAiApiService],
  imports: [HttpModule],
})
export class ChatModule {}
