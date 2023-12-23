import { Module } from '@nestjs/common';
import { AiApiService } from './ai-api.service';
import { HttpModule } from '@nestjs/axios';
import { RoadmapService } from '../roadmap/user/roadmap.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrivilegeService } from '../privilege/privilege.service';

@Module({
  imports: [HttpModule],
  providers: [AiApiService, RoadmapService, PrismaService, PrivilegeService],
})
export class AiApiModule {}
