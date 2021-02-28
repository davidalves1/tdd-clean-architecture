import { CacheStore } from '@/data/protocols/cache/cache-store';
import { LocalSavePurchases } from '@/data/usecases';

class CacheStoreSpy implements CacheStore {
  deleteCallsCount = 0;
  insertCallsCount = 0;
  deleteKey: string;
  insertKey: string;

  delete(key: string): void {
    this.deleteCallsCount += 1;
    this.deleteKey = key;
  }

  insert(key: string): void {
    this.insertCallsCount += 1;
    this.insertKey = key;
  }
}

type SutTypes = {
  sut: LocalSavePurchases;
  cacheStore: CacheStoreSpy;
};

// sut  = system under test (a classe que está sendo testada atualmente)
const makeSut = (): SutTypes => {
  const cacheStore = new CacheStoreSpy();
  const sut = new LocalSavePurchases(cacheStore);

  return { sut, cacheStore };
};

describe('LocalSavePurchases', () => {
  it('should not delete cache on sut.init', () => {
    const { cacheStore } = makeSut();

    new LocalSavePurchases(cacheStore);

    expect(cacheStore.deleteCallsCount).toBe(0);
  });

  it('should delete old cache on sut.save', async () => {
    const { sut, cacheStore } = makeSut();

    await sut.save();

    expect(cacheStore.deleteCallsCount).toBe(1);
    expect(cacheStore.deleteKey).toBe('purchases');
  });

  it('should not insert Cache if delete fails', () => {
    const { sut, cacheStore } = makeSut();
    jest.spyOn(cacheStore, 'delete').mockImplementationOnce(() => {
      throw new Error();
    });

    // não é utilizado o await nesse caso, pois é preciso que o código seja executado para validar
    const promise = sut.save();

    expect(cacheStore.insertCallsCount).toBe(0);
    expect(promise).rejects.toThrow();
  });

  it('should insert Cache if delete succeeds', async () => {
    const { sut, cacheStore } = makeSut();

    await sut.save();

    expect(cacheStore.deleteCallsCount).toBe(1);
    expect(cacheStore.insertCallsCount).toBe(1);
    expect(cacheStore.insertKey).toBe('purchases');
  });
});
