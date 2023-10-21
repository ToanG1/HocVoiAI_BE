import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { MinioClientModule } from './modules/minio-client/minio-client.module';
import { ConfigModule } from '@nestjs/config';
import { RoadmapModule } from './modules/roadmap/roadmap.module';
import { QuestionModule } from './modules/question/question.module';
import { QuestionReplyModule } from './modules/question-reply/question-reply.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
