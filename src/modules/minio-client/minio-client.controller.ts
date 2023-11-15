import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioClientService } from './minio-client.service';
import { Express } from 'express';
import { AuthGuard } from 'src/guard/auth.guard';
import { ResponseModel } from 'src/interface/responseModel.interface';

@Controller('api/minio')
export class MinioClientController {
  constructor(private readonly minioService: MinioClientService) {}

  @Post('image')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const res: ResponseModel = {
      data: {},
      message: 'Upload image successfully',
      code: HttpStatus.OK,
    };
    try {
      await this.minioService.createBucketIfNotExists();
      res.data = { url: await this.minioService.uploadFile(file) };
    } catch (err) {
      res.message = 'Something wrong';
      res.code = HttpStatus.INTERNAL_SERVER_ERROR;
    } finally {
      return res;
    }
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
