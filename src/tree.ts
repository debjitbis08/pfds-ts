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
 * Exercise 2.3 Inserting an existing element into a binary search tree copies the
 * entire search path even though the copied nodes are indistinguishable from the
 * originals. Rewrite insert using exceptions to avoid this copying. Establish only
 * one handler per insertion rather than one handler per iteration.
 */
type InsertResult<T> =
  | { readonly changed: true; readonly tree: Tree<T> }
  | { readonly changed: false };

const UNCHANGED: InsertResult<any> = { changed: false };

export function insert_exercise_2_3<T extends Ordered<T>>(
  x: T,
  root: Tree<T>,
): Tree<T> {
  const result = insert_exercise_2_3_recursive(x, root);
  return result.changed ? result.tree : root;
}

function insert_exercise_2_3_recursive<T extends Ordered<T>>(
  x: T,
  node: Tree<T>,
): InsertResult<T> {
  if (node.type === "E")
    return {
      changed: true,
      tree: { type: "T", value: x, left: empty(), right: empty() },
    };

  const { left, value, right } = node;

  if (x.lt(value)) {
    const result = insert_exercise_2_3_recursive(x, left);
    if (!result.changed) return UNCHANGED;
    return {
      changed: true,
      tree: { type: "T", value, left: result.tree, right },
    };
  }

  if (value.lt(x)) {
    const result = insert_exercise_2_3_recursive(x, right);
    if (!result.changed) return UNCHANGED;
    return {
      changed: true,
      tree: { type: "T", value, left, right: result.tree },
    };
  }

  return UNCHANGED;
}

/**
 * Exercise 2.4 Combine the ideas of the previous two exercises to obtain a version
 * of insert that performs no unnecessary copying and uses no more than
 * d + 1 comparisons.
 */
export function insert_exercise_2_4<T extends Ordered<T>>(
  x: T,
  root: Tree<T>,
): Tree<T> {
  const result = insert_exercise_2_4_recursive(x, root);
  return result.changed ? result.tree : root;
}

function insert_exercise_2_4_recursive<T extends Ordered<T>>(
  x: T,
  node: Tree<T>,
  candidate: Tree<T> | null = null,
): InsertResult<T> {
  if (node.type === "E") {
    if (candidate != null && candidate.type === "T" && x.eq(candidate.value)) {
      return UNCHANGED;
    }
    return {
      changed: true,
      tree: { type: "T", value: x, left: empty(), right: empty() },
    };
  }

  const { left, value, right } = node;

  if (x.lt(value)) {
    const result = insert_exercise_2_4_recursive(x, left, candidate);
    if (!result.changed) return UNCHANGED;
    return {
      changed: true,
      tree: { type: "T", value, left: result.tree, right },
    };
  } else {
    const result = insert_exercise_2_4_recursive(x, right, node);
    if (!result.changed) return UNCHANGED;
    return {
      changed: true,
      tree: { type: "T", value, left, right: result.tree },
    };
  }
}

/**
 * Exercise 2.5 Sharing can also be useful within a single object, not just between
 * objects. For example, if the two subtrees of a given node are identical,
 * then they can be represented by the same tree.
 */

/**
 * (a) Using this idea, write a function complete of type Elem x int -> Tree
 * where complete (x, d) creates a complete binary tree of depth d with x
 * stored in every node. (Of course, this function makes no sense for the set
 * abstraction, but it can be useful as an auxiliary function for other
 * abstractions, such as bags.) This function should run in O(d) time.
 */

/**
 * (b) Extend this function to create balanced trees of arbitrary size. These trees
 * will not always be complete binary trees, but should be as balanced as
 * possible: for any given node, the two subtrees should differ in size by at
 * most one. This function should run in 0(log n) time. (Hint: use a helper
 * function create2 that, given a size m, creates a pair of trees, one of size m
 * and one of size m+1.)
 */
