import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { QueueEvent } from 'src/enums/queue-event.enum';
import { FileUpload } from 'src/contracts/file-upload.abstract';

@Processor(QueueEvent.UPLOAD_IMAGE)
export class UploadProcessor {
  private readonly logger = new Logger(UploadProcessor.name);
  private readonly bucket = 'images';

  constructor(private readonly fileUpload: FileUpload) {}

  @Process(QueueEvent.UPLOAD_IMAGE)
  async handleUpload(job: Job<{ fileName: string; buffer: string }>) {
    try {
      const { fileName, buffer } = job.data;
      const fileBuffer = Buffer.from(buffer, 'base64');
      await this.fileUpload.uploadFile(this.bucket, fileName, fileBuffer);
      this.logger.log(
        `File ${fileName} uploaded successfully to bucket ${this.bucket}.`,
      );
      return await job.moveToCompleted(job.id.toString(), true);
    } catch (error) {
      this.logger.error(error);
      return await job.moveToFailed(error, true);
    }
  }
}
