import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailSenderService {
  constructor(private readonly mailerService: MailerService) {}

  public sendResetPasswordSecret(email: string, secret: number): void {
    this.mailerService
      .sendMail({
        to: email,
        from: 'toandinh01675@gmail.com',
        subject: 'THIS IS YOUR SECRET CODE FROM HOC VOI AI',
        template: 'reset-code',
        context: {
          secret: secret,
        },
      })
      .catch((err) => {
        console.log(err);
      });
  }

  public sendActiationEmail(email: string, code: string): void {
    this.mailerService
      .sendMail({
        to: email,
        from: 'toandinh01675@gmail.com',
        subject: 'THIS IS YOUR ACTIVATION EMAIL FROM HOC VOI AI',
        template: 'activation-code',
        context: {
          code: code,
        },
      })
      .catch((err) => {
        console.log(err);
      });
  }

  public sendNotificationEmail(email: string, subject, title, content): void {
    this.mailerService
      .sendMail({
        to: email,
        from: 'toandinh01675@gmail.com',
        subject: subject,
        template: 'notification-from-admin',
        context: {
          title: title,
          content: content,
        },
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
