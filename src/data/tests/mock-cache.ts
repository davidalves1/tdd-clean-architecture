import { SavePurchases } from '@/domain/usecases';
import { CacheStore } from '@/data/protocols/cache/cache-store';

export class CacheStoreSpy implements CacheStore {
  deleteCallsCount = 0;
  insertCallsCount = 0;
  deleteKey: string;
  insertKey: string;
  insertValues: Array<SavePurchases.Params> = [];

  delete(key: string): void {
    this.deleteCallsCount += 1;
    this.deleteKey = key;
  }

  insert(key: string, value: any): void {
    this.insertCallsCount += 1;
    this.insertKey = key;
    this.insertValues = value;
  }

  simulateInsertError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => {
      throw new Error();
    });
  }

  simulateDeleteError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => {
      throw new Error();
    });
  }
}
