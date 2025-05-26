import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Cache } from 'cache-manager';
import { UploadProducer } from '../queue/processors/upload.producer';

@Injectable()
export class UploadService {
  private readonly allowedFileTypes = ['jpg', 'jpeg', 'png', 'gif'];
  private readonly maxFileSize = 5 * 1024 * 1024;

  constructor(
    private readonly uploadProducer: UploadProducer,
    @Inject('CACHE_MANAGER') private readonly cacheManager: Cache,
  ) {}

  async handleUpload(file: Express.Multer.File) {
    const fileExtension = file.originalname.split('.').pop();
    if (!fileExtension || !this.allowedFileTypes.includes(fileExtension)) {
      throw new BadRequestException(
        'Invalid file type. Only images are allowed',
      );
    }
    if (file.size > this.maxFileSize) {
      throw new BadRequestException('File size exceeds the limit of 5MB');
    }
    const fileName = `${uuidv4()}.${fileExtension}`;
    await Promise.all([
      this.cacheManager.set(fileName, file.buffer, 60_000),
      this.uploadProducer.queue({
        fileName,
        buffer: file.buffer.toString('base64'),
      }),
    ]);
    return { fileName };
  }
}
