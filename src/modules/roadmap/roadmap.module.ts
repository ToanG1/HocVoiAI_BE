import { Module } from '@nestjs/common';
import { RoadmapService } from './roadmap.service';
import { RoadmapController } from './roadmap.controller';
import { RoadmapAdminController } from './roadmap.admin.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrivilegeService } from '../privilege/privilege.service';
import { AiApiService } from '../ai-api/ai-api.service';
import { HttpModule } from '@nestjs/axios';
import { RoadmapGateway } from './roadmap.gateway';
@Module({
  controllers: [RoadmapController, RoadmapAdminController],
  providers: [RoadmapService, PrivilegeService, AiApiService, RoadmapGateway],
  imports: [PrismaModule, HttpModule],
})
export class RoadmapModule {}
