import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { MinioClientModule } from './modules/minio-client/minio-client.module';
import { ConfigModule } from '@nestjs/config';
import { RoadmapModule } from './modules/roadmap/roadmap.module';

@Module({
  imports: [
    AuthModule,
    MinioClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RoadmapModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
