import { LocalSavePurchases } from '@/data/usecases';
import { mockPurchases, CacheStoreSpy } from '@/data/tests';

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
  it('should not delete or insert cache on sut.init', () => {
    const { cacheStore } = makeSut();
    expect(cacheStore.messages).toEqual([]);
  });

  it('should delete old cache on sut.save', async () => {
    const { sut, cacheStore } = makeSut();

    await sut.save(mockPurchases());

    // Garante que os métodos delete e insert foram chamados na ordem correta
    expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete, CacheStoreSpy.Message.insert]);
    expect(cacheStore.deleteKey).toBe('purchases');
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
    const { sut, cacheStore } = makeSut();
    const purchases = mockPurchases();

    await sut.save(purchases);

    expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete, CacheStoreSpy.Message.insert]);
    expect(cacheStore.insertKey).toBe('purchases');
    expect(cacheStore.insertValues).toEqual(purchases);
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
