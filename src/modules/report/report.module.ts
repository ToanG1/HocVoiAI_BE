import { Module } from '@nestjs/common';
import { ReportService } from './user/report.service';
import { ReportAdminService } from './admin/report.admin.service';
import { ReportController } from './user/report.controller';
import { ReportAdminController } from './admin/report.admin.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ReportController, ReportAdminController],
  providers: [ReportService, ReportAdminService, PrismaService],
})
export class ReportModule {}
