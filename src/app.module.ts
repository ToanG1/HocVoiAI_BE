import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { MinioClientModule } from './modules/minio-client/minio-client.module';
import { ConfigModule } from '@nestjs/config';
import { RoadmapModule } from './modules/roadmap/roadmap.module';
import { QuestionModule } from './modules/question/question.module';
import { QuestionReplyModule } from './modules/question-reply/question-reply.module';
import { CategoryModule } from './modules/category/category.module';
import { AiApiModule } from './modules/ai-api/ai-api.module';
import { PrivilegeModule } from './modules/privilege/privilege.module';
import { NotificationModule } from './modules/notification/notification.module';

import configuration from './config/configuration';

@Module({
  imports: [
    AuthModule,
    MinioClientModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    RoadmapModule,
    QuestionModule,
    QuestionReplyModule,
    CategoryModule,
    AiApiModule,
    PrivilegeModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
