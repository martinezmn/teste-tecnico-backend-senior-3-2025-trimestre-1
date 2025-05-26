import { Injectable, NotFoundException } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { FileUpload } from '../contracts/file-upload.abstract';
import { Readable } from 'stream';

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

  async getFile(bucket: string, fileName: string): Promise<Buffer> {
    const res = await this.s3.send(
      new GetObjectCommand({ Bucket: bucket, Key: fileName }),
    );
    if (!res.Body) {
      throw new NotFoundException('File not found');
    }
    const stream = res.Body as Readable;
    const chunks: Uint8Array[] = [];
    for await (const chunk of stream) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
  }
}
