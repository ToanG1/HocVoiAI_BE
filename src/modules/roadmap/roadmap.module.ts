import { Module } from '@nestjs/common';
import { RoadmapService } from './user/roadmap.service';
import { MailSenderService } from '../mail-sender/mail-sender.service';
import { RoadmapAdminService } from './admin/roadmap.admin.service';
import { RoadmapController } from './user/roadmap.controller';
import { RoadmapAdminController } from './admin/roadmap.admin.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrivilegeService } from '../privilege/user/privilege.service';
import { PrivilegeAdminService } from '../privilege/admin/admin.privilege.service';
import { RoadmapAiApiService } from '../ai-api/roadmap/roadmap-ai-api.service';
import { HttpModule } from '@nestjs/axios';
import { RoadmapGateway } from './user/roadmap.gateway';

@Module({
  controllers: [RoadmapController, RoadmapAdminController],
  providers: [
    RoadmapService,
    RoadmapAdminService,
    PrivilegeService,
    PrivilegeAdminService,
    RoadmapAiApiService,
    MailSenderService,
    RoadmapGateway,
  ],
  imports: [PrismaModule, HttpModule],
})
export class RoadmapModule {}
