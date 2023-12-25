import { Module } from '@nestjs/common';
import { ReportService } from './user/report.service';
import { ReportController } from './user/report.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ReportController],
  providers: [ReportService, PrismaService],
})
export class ReportModule {}
