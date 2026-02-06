export interface Set<T> {
  empty(): Set<T>;
  insert(t: T): Set<T>;
  member(t: T): boolean;
}
