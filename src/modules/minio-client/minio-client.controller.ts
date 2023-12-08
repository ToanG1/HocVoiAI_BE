import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioClientService } from './minio-client.service';
import { Express } from 'express';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('api/minio')
export class MinioClientController {
  constructor(private readonly minioService: MinioClientService) {}

  @Post('image')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    await this.minioService.createBucketIfNotExists();
    return { url: await this.minioService.uploadFile(file) };
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
