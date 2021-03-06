import { SavePurchases } from '@/domain/usecases';
import { CacheStore } from '@/data/protocols/cache/cache-store';

export class CacheStoreSpy implements CacheStore {
  actions: Array<CacheStoreSpy.Action> = [];
  deleteKey: string;
  insertKey: string;
  insertValues: Array<SavePurchases.Params> = [];

  delete(key: string): void {
    this.actions.push(CacheStoreSpy.Action.delete);
    this.deleteKey = key;
  }

  insert(key: string, value: any): void {
    this.actions.push(CacheStoreSpy.Action.insert);
    this.insertKey = key;
    this.insertValues = value;
  }

  replace(key: string, value: any): void {
    this.delete(key);
    this.insert(key, value);
  }

  simulateInsertError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => {
      this.actions.push(CacheStoreSpy.Action.insert);
      throw new Error();
    });
  }

  simulateDeleteError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => {
      this.actions.push(CacheStoreSpy.Action.delete);
      throw new Error();
    });
  }
}

export namespace CacheStoreSpy {
  export enum Action {
    insert,
    delete,
  }
}
