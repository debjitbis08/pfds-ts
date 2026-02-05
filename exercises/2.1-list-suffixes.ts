import { Stack } from "../src/stack.ts";

/**
 * Exercise 2.1 Write a function suffixes of type a list -» a list list that takes a
 * list xs and returns a list of all the suffixes of xs in decreasing order of length.
 * For example,
 * suffixes [1,2,3,4] = [[1,2,3,4], [2,3,4], [3,4], [4], []]
 */
const suffixes = <T>(xs: Stack<T>): Stack<Stack<T>> => {
  function loop(ys: Stack<T>) {
    if (ys.isEmpty()) {
      return Stack.empty().cons(ys);
    } else {
      return loop(ys.tail()).cons(ys);
    }
  }

  return loop(xs);
};

console.log(suffixes(Stack.empty().cons(4).cons(3).cons(2).cons(1)).toString());
