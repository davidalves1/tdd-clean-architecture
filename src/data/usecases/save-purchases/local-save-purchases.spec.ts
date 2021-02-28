import { LocalSavePurchases } from '@/data/usecases';
import { mockPurchases, CacheStoreSpy } from '@/data/tests';

type SutTypes = {
  sut: LocalSavePurchases;
  cacheStore: CacheStoreSpy;
};

// sut  = system under test (a classe que está sendo testada atualmente)
const makeSut = (timestamp = new Date()): SutTypes => {
  const cacheStore = new CacheStoreSpy();
  const sut = new LocalSavePurchases(cacheStore, timestamp);

  return { sut, cacheStore };
};

describe('LocalSavePurchases', () => {
  it('should not delete or insert cache on sut.init', () => {
    const { cacheStore } = makeSut();
    expect(cacheStore.messages).toEqual([]);
  });

  it('should not insert Cache if delete fails', async () => {
    const { sut, cacheStore } = makeSut();
    cacheStore.simulateDeleteError();

    // não é utilizado o await nesse caso, pois é preciso que o código seja executado para validar
    // este caso
    const promise = sut.save(mockPurchases());

    expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete]);
    await expect(promise).rejects.toThrow();
  });

  it('should insert Cache if delete succeeds', async () => {
    const timestamp = new Date();
    const { sut, cacheStore } = makeSut(timestamp);
    const purchases = mockPurchases();

    await sut.save(purchases);

    expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete, CacheStoreSpy.Message.insert]);
    expect(cacheStore.deleteKey).toBe('purchases');
    expect(cacheStore.insertKey).toBe('purchases');
    expect(cacheStore.insertValues).toEqual({
      timestamp,
      value: purchases,
    });
  });

  it('should throw if insert throws', async () => {
    const { sut, cacheStore } = makeSut();
    cacheStore.simulateInsertError();

    // não é utilizado o await nesse caso, pois é preciso que o código seja executado para validar
    // este caso
    const promise = sut.save(mockPurchases());

    expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete, CacheStoreSpy.Message.insert]);
    await expect(promise).rejects.toThrow();
  });
});
