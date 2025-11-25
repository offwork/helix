import { Node } from './Node';

export class Fragment<TNode extends Node> {
  private readonly content: readonly TNode[];

  private constructor(content: readonly TNode[]) {
    this.content = content;
  }

  static empty<TNode extends Node>(): Fragment<TNode> {
    return new Fragment<TNode>([]);
  }

  static from<TNode extends Node>(nodes: readonly TNode[]): Fragment<TNode> {
    return new Fragment<TNode>([...nodes]); // Defensive copy
  }

  get size(): number {
    return this.content.length;
  }

  child(index: number): TNode {
    if (index < 0 || index >= this.content.length) {
      throw new Error('Index out of bounds');
    }
    return this.content[index];
  }
}
