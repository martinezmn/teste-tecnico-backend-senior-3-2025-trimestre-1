import { Injectable, Logger } from '@nestjs/common';
import { FileUpload } from '../../contracts/file-upload.abstract';
import { Cache } from '../../contracts/cache.abstract';

@Injectable()
export class StaticService {
  private readonly logger = new Logger(StaticService.name);

  constructor(
    private readonly cache: Cache,
    private readonly fileUpload: FileUpload,
  ) {}

  async getFile(fileName: string): Promise<Buffer | null> {
    const cached = await this.cache.get<Buffer>(fileName);
    if (cached) return cached;
    try {
      const buffer = await this.fileUpload.getFile('images', fileName);
      this.logger.log(`File ${fileName} fetched and cached successfully.`);
      await this.cache.set(fileName, buffer, 60_000);
      return buffer;
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }
}
