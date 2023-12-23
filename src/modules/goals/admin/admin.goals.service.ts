import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { PrivilegeService } from '../../privilege/user/privilege.service';

@Injectable()
export class GoalsAdminService {
  constructor(
    private prismaService: PrismaService,
    private readonly privilegeService: PrivilegeService,
  ) {}
}