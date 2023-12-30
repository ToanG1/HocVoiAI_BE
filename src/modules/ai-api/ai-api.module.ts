import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RoadmapService } from '../roadmap/user/roadmap.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrivilegeService } from '../privilege/user/privilege.service';
import { RoadmapAiApiService } from './roadmap/roadmap-ai-api.service';
import { ChatAiApiService } from './chat/chat-ai-api.service';
import { DocumentController } from './user/document.controller';
import { DocumentAiApiService } from './user/document-ai-api.service';

@Module({
  controllers: [DocumentController],
  imports: [HttpModule],
  providers: [
    RoadmapService,
    PrismaService,
    PrivilegeService,
    RoadmapAiApiService,
    ChatAiApiService,
    DocumentAiApiService,
  ],
})
export class AiApiModule {}
