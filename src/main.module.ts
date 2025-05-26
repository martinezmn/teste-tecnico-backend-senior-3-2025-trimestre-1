import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { QueueModule } from './modules/queue/queue.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true }),
    QueueModule,
    UploadModule,
  ],
  controllers: [],
  providers: [],
})
export class MainModule {}
