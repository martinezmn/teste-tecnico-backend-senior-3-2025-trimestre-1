import { Inject, Injectable } from '@nestjs/common';
import { Cache } from '../contracts/cache.abstract';

@Injectable()
export class MemoryCacheService implements Cache {
  @Inject('CACHE_MANAGER') private readonly cacheManager: Cache;

  async set(key: string, value: any, ttl?: number): Promise<any> {
    return this.cacheManager.set(key, value, ttl);
  }

  async get(key: string): Promise<any> {
    return this.cacheManager.get(key);
  }
}
