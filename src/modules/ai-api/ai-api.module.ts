import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RoadmapService } from '../roadmap/user/roadmap.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrivilegeService } from '../privilege/user/privilege.service';
import { RoadmapAiApiService } from './roadmap/roadmap-ai-api.service';
import { ChatAiApiService } from './chat/chat-ai-api.service';

@Module({
  imports: [HttpModule],
  providers: [
    RoadmapService,
    PrismaService,
    PrivilegeService,
    RoadmapAiApiService,
    ChatAiApiService,
  ],
})
export class AiApiModule {}
