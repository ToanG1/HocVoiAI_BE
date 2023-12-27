import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserAdminController } from './admin/user.admin.controller';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserAdminService } from './admin/user.admin.service';
import { MailSenderService } from '../mail-sender/mail-sender.service';

@Module({
  controllers: [UserController, UserAdminController],
  providers: [UserService,UserAdminService, MailSenderService],
  imports: [PrismaModule],
  exports: [UserService],
})
export class UserModule {}
