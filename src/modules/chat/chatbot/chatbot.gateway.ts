import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatAiApiService } from 'src/modules/ai-api/chat/chat-ai-api.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatBotGateway {
  constructor(private readonly aiService: ChatAiApiService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('chatbot-message')
  async chatWithBot(
    @MessageBody() objectData: any,
  ): Promise<WsResponse<string>> {
    try {
      const res = await this.aiService.chat(objectData);
      return {
        event: 'chatbot-message',
        data: res,
      };
    } catch (err) {
      console.log(err);
      return {
        event: 'chatbot-message',
        data: "There's some problem with server, please try again later",
      };
    }
  }

  @SubscribeMessage('chatbot-init')
  async initChat(): Promise<WsResponse<string>> {
    try {
      const res = await this.aiService.initChat();
      return {
        event: 'chatbot-init',
        data: res,
      };
    } catch (err) {
      console.log(err);
      return {
        event: 'chatbot-init',
        data: "There's some problem with server, please try again later",
      };
    }
  }
}
