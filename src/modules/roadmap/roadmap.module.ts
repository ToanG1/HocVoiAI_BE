import { Module } from '@nestjs/common';
import { RoadmapService } from './user/roadmap.service';
import { RoadmapAdminService } from './admin/roadmap.admin.service';
import { RoadmapController } from './user/roadmap.controller';
import { RoadmapAdminController } from './admin/roadmap.admin.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrivilegeService } from '../privilege/privilege.service';
import { AiApiService } from '../ai-api/ai-api.service';
import { HttpModule } from '@nestjs/axios';
import { RoadmapGateway } from './user/roadmap.gateway';
@Module({
  controllers: [RoadmapController, RoadmapAdminController],
  providers: [
    RoadmapService,
    RoadmapAdminService,
    PrivilegeService,
    AiApiService,
    RoadmapGateway,
  ],
  imports: [PrismaModule, HttpModule],
})
export class RoadmapModule {}
