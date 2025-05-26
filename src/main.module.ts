import { Module } from '@nestjs/common';
import { QueueModule } from './modules/queue/queue.module';
import { UploadModule } from './modules/upload/upload.module';
import { StaticModule } from './modules/static/static.module';

@Module({
  imports: [QueueModule, UploadModule, StaticModule],
})
export class MainModule {}
