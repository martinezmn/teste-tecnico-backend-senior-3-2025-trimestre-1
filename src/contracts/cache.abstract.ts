export abstract class Cache {
  abstract set(key: string, value: any, ttl?: number): Promise<any>;
  abstract get<T = any>(key: string): Promise<T>;
}
