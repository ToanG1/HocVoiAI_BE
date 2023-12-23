import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { PrivilegeService } from '../user/privilege.service';

@Injectable()
export class PrivilegeAdminService {
  constructor(
    private prismaService: PrismaService,
    private readonly privilegeService: PrivilegeService,
  ) {}
}