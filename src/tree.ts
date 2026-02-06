import { type Ordered } from "./ordered";

export type Tree<T> =
  | { readonly type: "E" }
  | { readonly type: "T"; value: T; left: Tree<T>; right: Tree<T> };

export function empty(): Tree<never> {
  return { type: "E" };
}

export function member<T extends Ordered<T>>(x: T, node: Tree<T>): boolean {
  if (node.type === "E") return false;
  if (x.lt(node.value)) return member(x, node.left);
  if (node.value.lt(x)) return member(x, node.right);
  return true;
}

/**
 * Exercise 2.2 (Andersson [And91]) In the worst case, member performs
 * approximately 2d comparisons, where d is the depth of the tree. Rewrite member
 * to take no more than d + 1 comparisons by keeping track of a candidate
 * element that might be equal to the query element (say, the last element
 * for which < returned false or < returned true) and checking for equality
 * only when you hit the bottom of the tree.
 * IMPORTANT: Check benchmark for real world performance.
 */
export function member_optimized<T extends Ordered<T>>(
  x: T,
  node: Tree<T>,
  candidate: Tree<T> | null = null,
): boolean {
  if (node.type === "E") {
    return (
      candidate !== null && candidate.type === "T" && x.eq(candidate.value)
    );
  }

  if (x.lt(node.value)) {
    return member_optimized(x, node.left, candidate);
  } else return member_optimized(x, node.right, node);
}

export function insert<T extends Ordered<T>>(x: T, node: Tree<T>): Tree<T> {
  if (node.type === "E")
    return { type: "T", value: x, left: empty(), right: empty() };

  const { left, value, right } = node;

  if (x.lt(value)) return { type: "T", value, left: insert(x, left), right };
  if (value.lt(x)) return { type: "T", value, left, right: insert(x, right) };

  return node;
}

/**
 * Exercise 23 Inserting an existing element into a binary search tree copies the
 * entire search path even though the copied nodes are indistinguishable from the
 * originals. Rewrite insert using exceptions to avoid this copying. Establish only
 * one handler per insertion rather than one handler per iteration.
 */
