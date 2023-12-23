import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserAdminController } from './admin/user.admin.controller';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [UserController, UserAdminController],
  providers: [UserService],
  imports: [PrismaModule],
  exports: [UserService],
})
export class UserModule {}
