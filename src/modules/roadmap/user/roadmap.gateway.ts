import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AiApiService } from '../../ai-api/ai-api.service';
import { GenRoadmap } from '../dto/gen-roadmap.dto';
import { JwtService } from '@nestjs/jwt';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RoadmapGateway {
  constructor(
    private readonly aiService: AiApiService,
    private jwtService: JwtService,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('generate')
  findAll(@MessageBody() genRoadmapDto: GenRoadmap): WsResponse<string> {
    try {
      if (genRoadmapDto.topics && genRoadmapDto.topics.length > 0) {
        genRoadmapDto.topics.forEach(async (item) => {
          await this.aiService
            .generateRoadmap(
              genRoadmapDto.userId,
              item.topic,
              item.level,
              item.language,
            )
            .then((res) => {
              console.log(res);
              this.server.emit('generated', res);
            });
        });
        return { event: 'generate', data: 'Generating' };
      } else return { event: 'generate', data: 'There are no topic provided' };
    } catch (err) {
      console.log(err);
      return {
        event: 'generate',
        data: "There's some problem with server, please try again later",
      };
    }
  }
}
