import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Injectable } from '@nestjs/common';
import { QueueEvent } from 'src/enums/queue-event.enum';

@Injectable()
export class UploadProducer {
  constructor(
    @InjectQueue(QueueEvent.UPLOAD_IMAGE) private uploadQueue: Queue,
  ) {}

  async queue(data: { fileName: string; buffer: string }): Promise<void> {
    await this.uploadQueue.add(QueueEvent.UPLOAD_IMAGE, data, { attempts: 0 });
  }
}
