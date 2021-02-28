/**
 * Nesta camada não existe nenhuma classe contreta
 * apenas interfaces e modelos
 */

export interface SavePurchases {
  save: (purchases: Array<SavePurchases.Params>) => void;
}

export namespace SavePurchases {
  export type Params = {
    id: string;
    date: Date;
    value: number;
  };
}
