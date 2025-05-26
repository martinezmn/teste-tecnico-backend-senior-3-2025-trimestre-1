import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { Cache } from '../../contracts/cache.abstract';
import { MemoryCacheService } from '../../services/cache.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register()],
  controllers: [UploadController],
  providers: [UploadService, { provide: Cache, useClass: MemoryCacheService }],
})
export class UploadModule {}
