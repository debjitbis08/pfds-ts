import { describe, it, bench } from "vitest";
import { member, member_optimized, insert, empty, type Tree } from "./tree";
import { type Ordered } from "./ordered";

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

class ExpensiveNum implements Ordered<ExpensiveNum> {
  constructor(public readonly val: number) {}

  private wasteTime() {
    // Artificial latency to simulate a complex comparison
    // (e.g., comparing huge strings or complex objects)
    let sum = 0;
    for (let i = 0; i < 100; i++) {
      sum += i;
    }
    return sum;
  }

  lt(other: ExpensiveNum): boolean {
    this.wasteTime(); // The "Tax" on comparisons
    return this.val < other.val;
  }

  eq(other: ExpensiveNum): boolean {
    this.wasteTime();
    return this.val === other.val;
  }

  lte(other: Num): boolean {
    this.wasteTime();
    return this.val <= other.val;
  }
}

// Helper to build a balanced tree from a sorted array in O(n)
function buildBalanced(arr: Num[]): Tree<Num> {
  if (arr.length === 0) return { type: "E" };
  const mid = Math.floor(arr.length / 2);
  return {
    type: "T",
    value: arr[mid],
    left: buildBalanced(arr.slice(0, mid)),
    right: buildBalanced(arr.slice(mid + 1)),
  };
}

/*
describe("BST Performance: Standard vs Optimized", () => {
  const SIZE = 1_000_000;
  const LOOKUPS = 100_000;

  console.log(`Generating balanced tree of ${SIZE} nodes...`);
  const data = Array.from({ length: SIZE }, (_, i) => new Num(i));
  const tree = buildBalanced(data);

  const queryValues = Array.from(
    { length: LOOKUPS },
    () => new Num(Math.floor(Math.random() * SIZE)),
  );

  it("Benchmark: Standard Member (2 comparisons/node)", () => {
    const start = performance.now();
    for (const val of queryValues) {
      member(val, tree);
    }
    const end = performance.now();
    console.log(`Standard member: ${(end - start).toFixed(2)}ms`);
  });

  it("Benchmark: Optimized Member (1 comparison/node)", () => {
    const start = performance.now();
    for (const val of queryValues) {
      member_optimized(val, tree);
    }
    const end = performance.now();
    console.log(`Optimized member: ${(end - start).toFixed(2)}ms`);
  });
});
*/

describe("BST Performance: Average vs Worst Case", () => {
  // Use a tree of 1M nodes
  const data = Array.from({ length: 1_000_000 }, (_, i) => new Num(i * 2)); // Only even numbers
  const tree = buildBalanced(data);

  describe("Average Case: Searching for elements that EXIST", () => {
    const queries = Array.from(
      { length: 100_000 },
      () => new Num(Math.floor(Math.random() * 1_000_000) * 2),
    );

    // Standard will benefit from "early exit" here
    bench("Standard", () => queries.forEach((q) => member(q, tree)));
    bench("Optimized", () => queries.forEach((q) => member_optimized(q, tree)));
  });

  describe("Worst Case: Searching for elements that DO NOT exist", () => {
    // Search for ODD numbers in a tree of EVEN numbers
    const queries = Array.from(
      { length: 100_000 },
      () => new Num(Math.floor(Math.random() * 1_000_000) * 2 + 1),
    );

    // Both MUST travel to the leaf. Optimized should (theoretically) win.
    bench("Standard", () => queries.forEach((q) => member(q, tree)));
    bench("Optimized", () => queries.forEach((q) => member_optimized(q, tree)));
  });
});

describe("BST Performance with ExpensiveNum: Average vs Worst Case", () => {
  // Use a tree of 1M nodes
  const data = Array.from(
    { length: 1_000_000 },
    (_, i) => new ExpensiveNum(i * 2),
  ); // Only even numbers
  const tree = buildBalanced(data);

  describe("Average Case: Searching for elements that EXIST", () => {
    const queries = Array.from(
      { length: 100_000 },
      () => new Num(Math.floor(Math.random() * 1_000_000) * 2),
    );

    // Standard will benefit from "early exit" here
    bench("Standard", () => queries.forEach((q) => member(q, tree)));
    bench("Optimized", () => queries.forEach((q) => member_optimized(q, tree)));
  });

  describe("Worst Case: Searching for elements that DO NOT exist", () => {
    // Search for ODD numbers in a tree of EVEN numbers
    const queries = Array.from(
      { length: 100_000 },
      () => new Num(Math.floor(Math.random() * 1_000_000) * 2 + 1),
    );

    // Both MUST travel to the leaf. Optimized should (theoretically) win.
    bench("Standard", () => queries.forEach((q) => member(q, tree)));
    bench("Optimized", () => queries.forEach((q) => member_optimized(q, tree)));
  });
});
