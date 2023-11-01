import { Module } from '@nestjs/common';
import { RoadmapService } from './roadmap.service';
import { RoadmapController } from './roadmap.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrivilegeService } from '../privilege/privilege.service';
import { AiApiService } from '../ai-api/ai-api.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [RoadmapController],
  providers: [RoadmapService, PrivilegeService, AiApiService],
  imports: [PrismaModule, HttpModule],
})
export class RoadmapModule {}
