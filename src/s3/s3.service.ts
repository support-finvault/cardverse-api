import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private s3: S3Client;
  private bucket: string;

  constructor(private configService: ConfigService) {
    this.s3 = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });

    this.bucket = this.configService.get<string>('S3_BUCKET_NAME');
  }

  async getUploadUrl(userId: string, fileName: string, contentType: string) {
    const key = `documents/${userId}/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });

    const signedUrl = await getSignedUrl(this.s3, command, {
      expiresIn: 300, // 5 minutes
    });

    return { key, signedUrl };
  }

  async getDownloadUrl(userId: string, fileName: string) {
    const key = `documents/${userId}/${fileName}`;

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    const signedUrl = await getSignedUrl(this.s3, command, {
      expiresIn: 300, // 5 minutes
    });

    return { key, signedUrl };
  }
}
