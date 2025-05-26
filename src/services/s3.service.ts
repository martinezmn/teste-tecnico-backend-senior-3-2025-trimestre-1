import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { FileUpload } from '../contracts/file-upload.abstract';

@Injectable()
export class S3Service implements FileUpload {
  private readonly s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      region: 'us-east-1',
      endpoint: 'http://fakes3:4569',
      forcePathStyle: true,
      credentials: {
        accessKeyId: 'test',
        secretAccessKey: 'test',
      },
    });
  }

  async uploadFile(bucket: string, filename: string, buffer: Buffer) {
    await this.s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: filename,
        Body: buffer,
      }),
    );
  }
}
