import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { S3Service } from './s3.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import 'multer';

@Controller('api/s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('image')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return { url: await this.s3Service.uploadFileToPublicBucket(file) };
  }
}
