class LocalSavePurchases {
  constructor(private readonly cacheStore: CacheStore) {}

  async save(): Promise<void> {
    this.cacheStore.delete();
  }
}

interface CacheStore {
  delete: () => void;
}

class CacheStoreSpy implements CacheStore {
  deleteCallsCount = 0;

  delete(): void {
    this.deleteCallsCount += 1;
  }
}

// sut  = system under test (a classe que está sendo testada atualmente)

describe('LocalSavePurchases', () => {
  it('should not delete cache on sut.init', () => {
    const cacheStore = new CacheStoreSpy();
    new LocalSavePurchases(cacheStore);
    expect(cacheStore.deleteCallsCount).toBe(0);
  });

  it('should delete cache on init', async () => {
    const cacheStore = new CacheStoreSpy();
    const sut = new LocalSavePurchases(cacheStore);
    await sut.save();
    expect(cacheStore.deleteCallsCount).toBe(1);
  });
});
