import { describe, it, expect } from "vitest";
import { type Ordered } from "./ordered";
import { empty, member, member_optimized, insert, type Tree } from "./tree";

// A small class to test referential identity
class Num implements Ordered<Num> {
  constructor(public readonly val: number) {}
  eq(other: Num): boolean {
    return this.val === other.val;
  }
  lt(other: Num): boolean {
    return this.val < other.val;
  }
  lte(other: Num): boolean {
    return this.val <= other.val;
  }
}

describe("Persistent Binary Search Tree", () => {
  const n = (v: number) => new Num(v);

  describe("Basic Operations", () => {
    it("should find elements that exist", () => {
      let t: Tree<Num> = empty();
      t = insert(n(20), t);
      t = insert(n(10), t);
      t = insert(n(30), t);

      expect(member(n(20), t)).toBe(true);
      expect(member(n(10), t)).toBe(true);
      expect(member(n(30), t)).toBe(true);
      expect(member(n(5), t)).toBe(false);
    });

    it("should find elements that exist using optimized search", () => {
      let t: Tree<Num> = empty();
      t = insert(n(20), t);
      t = insert(n(10), t);
      t = insert(n(30), t);

      expect(member_optimized(n(20), t)).toBe(true);
      expect(member_optimized(n(10), t)).toBe(true);
      expect(member_optimized(n(30), t)).toBe(true);
      expect(member_optimized(n(5), t)).toBe(false);
    });

    it("should not insert duplicate values (Identity sharing)", () => {
      const t1 = insert(n(10), empty());
      const t2 = insert(n(10), t1);

      // In your implementation, it returns the original node if x === value
      expect(t1).toBe(t2);
    });
  });

  describe("Structural Sharing Proof", () => {
    it("should share the unmodified branch during insert", () => {
      // Build a tree:
      //      20
      //     /  \
      //    10   30
      const root = insert(n(20), empty());
      const withLeft = insert(n(10), root);
      const full = insert(n(30), withLeft);

      // Now insert 5, which goes into the LEFT subtree of 20
      const updated = insert(n(5), full);

      if (full.type === "T" && updated.type === "T") {
        // The LEFT branch should be new because it contains the new '5'
        expect(updated.left).not.toBe(full.left);

        // PROOF: The RIGHT branch (the node containing 30)
        // should be the EXACT same reference.
        expect(updated.right).toBe(full.right);

        console.log("Sharing Proof: Right branch identity matches!");
      }
    });
  });
});
