import { CacheStore } from '@/data/protocols/cache/cache-store';
import { LocalSavePurchases } from '@/data/usecases';
import { SavePurchases } from '@/domain';

class CacheStoreSpy implements CacheStore {
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
}

const mockPurchases = (): Array<SavePurchases.Params> => [
  {
    id: '1',
    date: new Date(),
    value: 50,
  },
  {
    id: '2',
    date: new Date(),
    value: 120,
  },
];

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

    await sut.save(mockPurchases());

    expect(cacheStore.deleteCallsCount).toBe(1);
    expect(cacheStore.deleteKey).toBe('purchases');
  });

  it('should not insert Cache if delete fails', () => {
    const { sut, cacheStore } = makeSut();
    jest.spyOn(cacheStore, 'delete').mockImplementationOnce(() => {
      throw new Error();
    });

    // não é utilizado o await nesse caso, pois é preciso que o código seja executado para validar
    const promise = sut.save(mockPurchases());

    expect(cacheStore.insertCallsCount).toBe(0);
    expect(promise).rejects.toThrow();
  });

  it('should insert Cache if delete succeeds', async () => {
    const { sut, cacheStore } = makeSut();
    const purchases = mockPurchases();

    await sut.save(purchases);

    expect(cacheStore.deleteCallsCount).toBe(1);
    expect(cacheStore.insertCallsCount).toBe(1);
    expect(cacheStore.insertKey).toBe('purchases');
    expect(cacheStore.insertValues).toEqual(purchases);
  });
});
