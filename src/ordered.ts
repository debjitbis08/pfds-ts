export interface Ordered<T> {
  eq(other: T): boolean;
  lt(other: T): boolean;
  lte(other: T): boolean;
}
