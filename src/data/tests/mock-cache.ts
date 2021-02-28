import { SavePurchases } from '@/domain/usecases';
import { CacheStore } from '@/data/protocols/cache/cache-store';

export class CacheStoreSpy implements CacheStore {
  messages: Array<CacheStoreSpy.Message> = [];
  deleteKey: string;
  insertKey: string;
  insertValues: Array<SavePurchases.Params> = [];

  delete(key: string): void {
    this.messages.push(CacheStoreSpy.Message.delete);
    this.deleteCallsCount += 1;
    this.deleteKey = key;
  }

  insert(key: string, value: any): void {
    this.messages.push(CacheStoreSpy.Message.insert);
    this.insertCallsCount += 1;
    this.insertKey = key;
    this.insertValues = value;
  }

  simulateInsertError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => {
      this.messages.push(CacheStoreSpy.Message.insert);
      throw new Error();
    });
  }

  simulateDeleteError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => {
      this.messages.push(CacheStoreSpy.Message.delete);
      throw new Error();
    });
  }
}

export namespace CacheStoreSpy {
  export enum Message {
    insert,
    delete,
  }
}
