/**
 * Nesta camada não existe nenhuma classe contreta
 * apenas interfaces e modelos
 */
import { PurchaseModel } from '@/domain/models';

export interface SavePurchases {
  save: (purchases: Array<SavePurchases.Params>) => void;
}

export namespace SavePurchases {
  export type Params = PurchaseModel;
}
