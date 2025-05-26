import { Module } from '@nestjs/common';
import { StaticController } from './static.controller';
import { StaticService } from './static.service';
import { FileUpload } from '../../contracts/file-upload.abstract';
import { S3Service } from '../../services/s3.service';
import { Cache } from '../../contracts/cache.abstract';
import { MemoryCacheService } from '../../services/cache.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register()],
  controllers: [StaticController],
  providers: [
    StaticService,
    { provide: FileUpload, useClass: S3Service },
    { provide: Cache, useClass: MemoryCacheService },
  ],
})
export class StaticModule {}
