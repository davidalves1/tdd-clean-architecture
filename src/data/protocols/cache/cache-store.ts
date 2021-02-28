// TODO: separar em mais de uma interface caso tenha casos de uso onde apenas
// um dos métodos seja utilizado
export interface CacheStore {
  delete: (key: string) => void;
  insert: (key: string) => void;
}
