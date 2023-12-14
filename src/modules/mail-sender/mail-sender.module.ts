import { Module } from '@nestjs/common';
import { MailSenderService } from './mail-sender.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // upgrade later with STARTTLS
        auth: {
          user: process.env.EMAIL_HOST_USER,
          pass: process.env.EMAIL_HOST_PWD,
        },
      },
      defaults: {
        from: `"nest-modules" <${process.env.EMAIL_DEFAULT_FROM}>`,
      },
      template: {
        dir: process.cwd() + '/templates/',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailSenderService],
})
export class MailSenderModule {
  constructor() {
    new HandlebarsAdapter(/* helpers */ undefined, {
      inlineCssEnabled: true,
      /** See https://www.npmjs.com/package/inline-css#api */
      inlineCssOptions: {
        url: ' ',
        preserveMediaQueries: true,
      },
    });
  }
}
