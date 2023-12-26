import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class ReportAdminService {
  constructor(private readonly prismaService: PrismaService) {}
  findAll() {
    return this.prismaService.report.findMany();
  }

  remove(id: number) {
    return this.prismaService.report.delete({
      where: {
        id,
      },
    });
  }
}
