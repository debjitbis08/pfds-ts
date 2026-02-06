import { type Ordered } from "./ordered";
import { type Set } from "./set";
import {
  type Tree,
  member as isMemberOfTree,
  empty as emptyTree,
  insert as insertInTree,
} from "./tree";

export class UnbalancedSet<T extends Ordered<T>> implements Set<T> {
  private constructor(private readonly root: Tree<T>) {}

  empty(): UnbalancedSet<T> {
    return new UnbalancedSet(emptyTree());
  }

  member(x: T): boolean {
    return isMemberOfTree(x, this.root);
  }

  insert(x: T): Set<T> {
    return new UnbalancedSet(insertInTree(x, this.root));
  }
}
