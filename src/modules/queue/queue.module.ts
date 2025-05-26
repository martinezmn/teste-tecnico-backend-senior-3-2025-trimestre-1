import { Global, Module } from '@nestjs/common';
import { UploadProcessor } from './processors/upload.processor';
import { BullModule } from '@nestjs/bull';
import { UploadProducer } from './processors/upload.producer';
import { QueueEvent } from '../../enums/queue-event.enum';
import { FileUpload } from '../../contracts/file-upload.abstract';
import { S3Service } from '../../services/s3.service';

@Global()
@Module({
  imports: [
    BullModule.forRoot({ redis: { host: 'redis', port: 6379 } }),
    BullModule.registerQueue({ name: QueueEvent.UPLOAD_IMAGE }),
  ],
  providers: [
    { provide: FileUpload, useClass: S3Service },
    UploadProducer,
    UploadProcessor,
  ],
  exports: [UploadProducer],
})
export class QueueModule {}
