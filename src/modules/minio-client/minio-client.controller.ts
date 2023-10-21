import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioClientService } from './minio-client.service';
import { Express } from 'express';

@Controller('api/minio')
export class MinioClientController {
  constructor(private readonly minioService: MinioClientService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    await this.minioService.createBucketIfNotExists();
    const fileName = await this.minioService.uploadFile(file);
    return { url: fileName };
  }

  @Get('image/:fileName')
  async getImage(@Param('fileName') fileName: string) {
    const fileUrl = await this.minioService.getFileUrl(fileName);
    return { url: fileUrl };
  }

  @Delete('image/:fileName')
  async deleteImage(@Param('fileName') fileName: string) {
    await this.minioService.deleteFile(fileName);
    return 'delete successfully';
  }
}
