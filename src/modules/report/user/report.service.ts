import { Injectable } from '@nestjs/common';
import { CreateReportDto } from '../dto/create-report.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ReportType } from 'src/utils/enums/report-type.enum';
import { Report } from '@prisma/client';

@Injectable()
export class ReportService {
  constructor(private readonly prismaService: PrismaService) {}

  create(userId: string, createReportDto: CreateReportDto) {
    return this.prismaService.report.create({
      data: {
        userId,
        type: ReportType[createReportDto.type],
        objectId: createReportDto.objectId,
        reason: createReportDto.reason,
        content: createReportDto.content,
        createdAt: new Date(),
      },
    });
  }
  findOne(id: number) {
    return this.prismaService.report.findUnique({
      where: {
        id,
      },
    });
  }

  remove(report: Report) {
    return this.prismaService.report.delete({
      where: report,
    });
  }
}
