import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import 'multer';

@Injectable()
export class S3Service {
  private s3_client: S3Client;
  constructor() {
    this.s3_client = new S3Client({
      region: process.env.AWS_S3_REGION,
      credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
      },
    });
  }
  async uploadFileToPublicBucket(file: Express.Multer.File) {
    const fileName = `${process.env.S3_IMAGE_PATH}${Date.now()}-${
      file.originalname
    }`;

    const bucket_name = process.env.AWS_S3_PUBLIC_BUCKET;
    await this.s3_client.send(
      new PutObjectCommand({
        Bucket: bucket_name,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
        ContentLength: file.size,
      }),
    );

    return fileName;
  }
}
