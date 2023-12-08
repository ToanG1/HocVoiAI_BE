import { Module } from '@nestjs/common';
import { PrivilegeController } from './privilege.controller';
import { PrivilegeService } from './privilege.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [PrivilegeController],
  providers: [PrivilegeService, PrismaService],
})
export class PrivilegeModule {}
