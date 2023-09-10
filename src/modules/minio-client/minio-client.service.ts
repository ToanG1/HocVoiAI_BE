import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';

@Injectable()
export class MinioClientService {
  private minioClient: Minio.Client;
  private bucketName: string;

  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT,
      port: Number(process.env.MINIO_PORT),
      useSSL: false,
      accessKey: process.env.MINIO_ACCESSKEY,
      secretKey: process.env.SECRETKEY,
    });
    this.bucketName = process.env.MINIO_BUCKET;
  }

  async createBucketIfNotExists() {
    const bucketExists = await this.minioClient.bucketExists(this.bucketName);
    if (!bucketExists) {
      await this.minioClient.makeBucket(this.bucketName, 'eu-west-1');
    }
  }

  async uploadFile(file: Express.Multer.File) {
    const fileName = `${process.env.IMAGE_PATH}${Date.now()}-${
      file.originalname
    }`;
    // const fileName = 'image/' + `${Date.now()}-${file.originalname}`;
    // console.log(fileName);
    await this.minioClient.putObject(
      this.bucketName,
      fileName,
      file.buffer,
      file.size,
    );
    return fileName;
  }

  async getFileUrl(fileName: string) {
    return await this.minioClient.presignedUrl(
      'GET',
      this.bucketName,
      process.env.IMAGE_PATH + fileName,
    );
  }

  async deleteFile(fileName: string) {
    await this.minioClient.removeObject(
      this.bucketName,
      process.env.IMAGE_PATH + fileName,
    );
  }
}
