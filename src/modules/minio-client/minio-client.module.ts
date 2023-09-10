import { Module } from '@nestjs/common';
import { MinioClientController } from './minio-client.controller';
import { MinioClientService } from './minio-client.service';

@Module({
  controllers: [MinioClientController],
  providers: [MinioClientService],
})
export class MinioClientModule {}
