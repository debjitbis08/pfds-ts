import { describe, it, expect } from "vitest";
import { Stack } from "./stack";

describe("Persistent Stack (Okasaki Chapter 2)", () => {
  it("should identify an empty stack", () => {
    const s = Stack.empty<number>();
    expect(s.isEmpty()).toBe(true);
  });

  it("should not be empty after a cons", () => {
    const s = Stack.empty<number>().cons(1);
    expect(s.isEmpty()).toBe(false);
    expect(s.head()).toBe(1);
  });

  it("should throw when calling head/tail on empty stack", () => {
    const s = Stack.empty<number>();
    expect(() => s.head()).toThrow("EMPTY");
    expect(() => s.tail()).toThrow("EMPTY");
  });

  it("should maintain LIFO order", () => {
    const s = Stack.empty<number>().cons(1).cons(2).cons(3);
    expect(s.head()).toBe(3);
    expect(s.tail().head()).toBe(2);
    expect(s.tail().tail().head()).toBe(1);
  });

  it("should remain immutable after operations", () => {
    const s1 = Stack.empty<number>().cons(1);
    const s2 = s1.cons(2);

    // s1 should still be [1], s2 is [2, 1]
    expect(s1.head()).toBe(1);
    expect(s1.tail().isEmpty()).toBe(true);

    expect(s2.head()).toBe(2);
    expect(s2.tail().head()).toBe(1);
  });

  it("should concatenate two stacks correctly", () => {
    const s1 = Stack.empty<number>().cons(2).cons(1); // [1, 2]
    const s2 = Stack.empty<number>().cons(4).cons(3); // [3, 4]

    const combined = s1.concat(s2); // Result: [1, 2, 3, 4]

    expect(combined.head()).toBe(1);
    const t1 = combined.tail();
    expect(t1.head()).toBe(2);
    const t2 = t1.tail();
    expect(t2.head()).toBe(3);
    const t3 = t2.tail();
    expect(t3.head()).toBe(4);
    expect(t3.tail().isEmpty()).toBe(true);
  });

  it("should update an element at a specific index", () => {
    const s = Stack.empty<string>().cons("c").cons("b").cons("a"); // [a, b, c]

    // Update index 1 ('b') with 'z'
    const updated = s.update(1, "z"); // Result: [a, z, c]

    expect(updated.head()).toBe("a");
    expect(updated.tail().head()).toBe("z");
    expect(updated.tail().tail().head()).toBe("c");

    // Verify original is unchanged (Persistence)
    expect(s.tail().head()).toBe("b");
  });
});
