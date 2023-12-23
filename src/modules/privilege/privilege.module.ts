import { Module } from '@nestjs/common';
import { PrivilegeController } from './user/privilege.controller';
import { PrivilegeService } from './user/privilege.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [PrivilegeController],
  providers: [PrivilegeService, PrismaService],
})
export class PrivilegeModule {}
