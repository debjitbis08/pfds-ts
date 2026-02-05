interface IStack<T> {
  isEmpty(): boolean;
  cons(t: T): IStack<T>;
  head(): T;
  tail(): IStack<T>;
}

type StackNode<T> =
  | { readonly type: "NIL" }
  | { readonly type: "CONS"; readonly head: T; readonly tail: StackNode<T> };

export class Stack<T> implements IStack<T> {
  private constructor(private readonly node: StackNode<T>) {}

  static empty<T>(): Stack<T> {
    return new Stack({ type: "NIL" });
  }

  isEmpty(): boolean {
    return this.node.type === "NIL";
  }

  cons(t: T) {
    return new Stack({
      type: "CONS",
      head: t,
      tail: this.node,
    });
  }

  head(): T {
    if (this.node.type === "NIL") throw new Error("EMPTY");
    return this.node.head;
  }

  tail(): Stack<T> {
    if (this.node.type === "NIL") throw new Error("EMPTY");
    return new Stack(this.node.tail);
  }

  // This is educational but inefficient in a language like TS/JS which does not have lazy evaluation.
  concat(other: Stack<T>): Stack<T> {
    if (this.isEmpty()) return other;
    else return this.tail().concat(other).cons(this.head());
  }

  update(i: number, y: T): Stack<T> {
    if (i === 0) return this.tail().cons(y);
    else
      return this.tail()
        .update(i - 1, y)
        .cons(this.head());
  }

  toString(isRoot = true): string {
    if (this.isEmpty()) return "[]";
    if (this.tail().isEmpty()) return `${isRoot ? "[" : ""}${this.head()}]`;
    else
      return `${isRoot ? "[" : ""}${this.head()}, ${this.tail().toString(false)}`;
  }
}
