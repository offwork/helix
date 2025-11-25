import { Node } from "./Node";

export class Fragment<TNode extends Node> {
  private readonly content: readonly TNode[];

  private constructor(content: readonly TNode[]) {
    this.content = content;
  }

  static empty<TNode extends Node>(): Fragment<TNode> {
    return new Fragment<TNode>([]);
  }

  static from<TNode extends Node>(nodes: readonly TNode[]): Fragment<TNode> {
    return new Fragment<TNode>(nodes);
  }

  get size(): number {
    return this.content.length;
  }
}
