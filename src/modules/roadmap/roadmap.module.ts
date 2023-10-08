import { Module } from '@nestjs/common';
import { RoadmapService } from './roadmap.service';
import { RoadmapController } from './roadmap.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrivilegeService } from './privilege.service';

@Module({
  controllers: [RoadmapController],
  providers: [RoadmapService, PrivilegeService],
  imports: [PrismaModule],
})
export class RoadmapModule {}
