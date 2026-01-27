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

  get childCount(): number {
    return this.content.length;
  }

  get size(): number {
    // TODO: EPIC 2'de Node.nodeSize implementasyonundan sonra güncelle
    // Şimdilik childCount ile aynı (tree traversal için yeterli)
    return this.content.length;
  }

  get firstChild(): TNode | undefined {
    return this.content[0];
  }

  get lastChild(): TNode | undefined {
    return this.content[this.content.length - 1];
  }

  child(index: number): TNode {
    if (index < 0 || index >= this.content.length) {
      throw new Error(
        `Index out of bounds: ${index} (size: ${this.content.length})`
      );
    }
    return this.content[index];
  }

  forEach(callback: (node: TNode, index: number) => void): void {
    this.content.forEach(callback);
  }

  slice(from: number, to: number): Fragment<TNode> {
    if (from < 0 || to > this.content.length || from > to) {
      throw new Error(
        `Invalid slice range: [${from}, ${to}) (size: ${this.content.length})`
      );
    }

    return new Fragment<TNode>(this.content.slice(from, to));
  }
}
