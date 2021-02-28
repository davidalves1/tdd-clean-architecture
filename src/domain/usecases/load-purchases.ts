/**
 * Nesta camada não existe nenhuma classe contreta
 * apenas interfaces e modelos
 */

import { PurchaseModel } from '@/domain/models';

export interface LoadPurchases {
  loadAll: () => Promise<Array<LoadPurchases.Result>>;
}

export namespace LoadPurchases {
  export type Result = PurchaseModel;
}
