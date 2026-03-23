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
    return this.content.reduce((sum, node) => (sum += node.nodeSize), 0);
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

  equals(other: Fragment<TNode>): boolean {
    if (other === null)
      throw new Error('Fragment equals parameter cannot be null');

    if (other === undefined)
      throw new Error('Fragment equals parameter cannot be undefined');

    if (this.content.length !== other.content.length) return false;

    return this.content.every((node, index) =>
      node.equals(other.content[index])
    );
  }

  findIndex(pos: number): { index: number; offset: number } {
    if (pos < 0 || pos > this.size) {
      throw new RangeError(`Invalid position: ${pos} (size: ${this.size})`);
    }

    if (pos == 0) {
      return { index: 0, offset: 0 };
    }

    if (pos == this.size) {
      return { index: this.childCount, offset: this.size };
    }

    let i = 0,
      curPos = 0;
    while (i < this.content.length) {
      const end = curPos + this.content[i].nodeSize;
      if (end > pos) return { index: i, offset: curPos };
      curPos = end;
      i++;
    }

    return { index: i, offset: curPos };
  }

  cut(from: number, to: number = this.size): Fragment<TNode> {
    if (from === 0 && to === this.size) return this;
    if (from === to) return Fragment.empty<TNode>();

    const result: TNode[] = [];

    if (to > from) {
      for (let i = 0, pos = 0; pos < to; i++) {
        let child = this.content[i];
        const end = pos + child.nodeSize;
        if (end > from) {
          if (pos < from || end > to) {
            if (child.type.isText) {
              child = child.cut(
                Math.max(0, from - pos),
                Math.min(child.text?.length ?? 0, to - pos)
              ) as TNode;
            } else {
              child = child.cut(
                Math.max(0, from - pos - 1),
                Math.min(child.content.size, to - pos - 1)
              ) as TNode;
            }
          }
          result.push(child);
        }
        pos = end;
      }
    }

    return Fragment.from(result);
  }
}
