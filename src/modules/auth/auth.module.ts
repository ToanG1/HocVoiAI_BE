import { Module } from '@nestjs/common';
import { AuthService } from './user/auth.service';
import { AuthController } from './user/auth.controller';
import { AuthAdminController } from './admin/auth.admin.controller';
import { UserModule } from 'src/modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { MailSenderService } from '../mail-sender/mail-sender.service';
@Module({
  providers: [AuthService, PrismaService, MailSenderService],
  controllers: [AuthController, AuthAdminController],
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30m' },
    }),
  ],
})
export class AuthModule {}
