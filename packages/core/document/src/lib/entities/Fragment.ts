import type { IFragment } from './IFragment';
import type { INode } from './INode';

export class Fragment implements IFragment {
  private readonly content: readonly INode[];

  private constructor(content: readonly INode[]) {
    this.content = content;
  }

  static empty(): Fragment {
    return new Fragment([]);
  }

  static from(nodes: readonly INode[]): Fragment {
    return new Fragment([...nodes]); // Defensive copy
  }

  get childCount(): number {
    return this.content.length;
  }

  get firstChild(): INode | undefined {
    return this.content[0];
  }

  get lastChild(): INode | undefined {
    return this.content[this.content.length - 1];
  }

  get size(): number {
    return this.content.reduce((sum, node) => (sum += node.nodeSize), 0);
  }

  addToEnd(node: INode): Fragment {
    return Fragment.from([...this.content, node]);
  }

  addToStart(node: INode): Fragment {
    return Fragment.from([node, ...this.content]);
  }

  append(other: Fragment): Fragment {
    if (!other.size) return this;
    if (!this.size) return other;

    const last = this.lastChild;
    const first = other.firstChild;
    if (!last || !first)
      return Fragment.from([...this.content, ...other.content]);
    const content = this.content.slice() as INode[];

    let i = 0;
    if (last.isText && first.isText && last.sameMarkup(first)) {
      const lastText = last as unknown as {
        text: string;
        withText: (t: string) => INode;
      };
      const firstText = first as unknown as { text: string };
      content[content.length - 1] = lastText.withText(
        lastText.text + firstText.text
      );
      i = 1;
    }

    for (; i < other.content.length; i++) content.push(other.content[i]);
    return Fragment.from(content);
  }

  child(index: number): INode {
    if (index < 0 || index >= this.content.length) {
      throw new Error(
        `Index out of bounds: ${index} (size: ${this.content.length})`
      );
    }
    return this.content[index];
  }

  cut(from: number, to: number = this.size): Fragment {
    if (from === 0 && to === this.size) return this;
    if (from === to) return Fragment.empty();

    const result: INode[] = [];

    if (to > from) {
      for (let i = 0, pos = 0; pos < to; i++) {
        let child = this.content[i];
        const end = pos + child.nodeSize;
        if (end > from) {
          if (pos < from || end > to) {
            if (child.isText) {
              child = child.cut(
                Math.max(0, from - pos),
                Math.min(
                  (child as unknown as { text: string }).text.length,
                  to - pos
                )
              ) as INode;
            } else {
              child = child.cut(
                Math.max(0, from - pos - 1),
                Math.min(child.content.size, to - pos - 1)
              ) as INode;
            }
          }
          result.push(child);
        }
        pos = end;
      }
    }

    return Fragment.from(result);
  }

  descendants(
    callback: (
      node: INode,
      pos: number,
      parent: INode | null,
      index: number
    ) => boolean | void
  ): void {
    this.nodesBetween(0, this.size, callback as never);
  }

  equals(other: IFragment): boolean {
    if (other === null)
      throw new Error('Fragment equals parameter cannot be null');

    if (other === undefined)
      throw new Error('Fragment equals parameter cannot be undefined');

    if (this.content.length !== other.childCount) return false;

    return this.content.every((node, index) => node.equals(other.child(index)));
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

  forEach(
    callback: (node: INode, offset: number, index: number) => void
  ): void {
    let offset = 0;
    for (let i = 0; i < this.content.length; i++) {
      const node = this.content[i];
      callback(node, offset, i);
      offset += node.nodeSize;
    }
  }

  maybeChild(index: number): INode | null {
    if (index < 0 || index >= this.content.length) return null;

    return this.content[index];
  }

  nodesBetween(
    from: number,
    to: number,
    callback: (
      node: INode,
      start: number,
      parent: INode | null,
      index: number
    ) => boolean | void,
    nodeStart = 0,
    parent?: INode
  ): void {
    this.forEach((child, offset, index) => {
      const end = offset + child.nodeSize;
      if (end > from && offset < to) {
        const start = nodeStart + offset;
        if (
          callback(child, start, parent ?? null, index) !== false &&
          child.content.size
        ) {
          child.content.nodesBetween(
            Math.max(0, from - offset - 1),
            Math.min(child.content.size, to - offset - 1),
            callback as never,
            nodeStart + offset + 1,
            child as INode
          );
        }
      }
    });
  }

  replaceChild(index: number, node: INode): Fragment {
    const current = this.content[index];
    if (current === node) return this;
    const copy = this.content.slice() as INode[];
    copy[index] = node;
    return Fragment.from(copy);
  }

  slice(from: number, to: number): Fragment {
    if (from < 0 || to > this.content.length || from > to) {
      throw new Error(
        `Invalid slice range: [${from}, ${to}) (size: ${this.content.length})`
      );
    }

    return new Fragment(this.content.slice(from, to));
  }

  textBetween(
    from: number,
    to: number,
    blockSeparator?: string | null,
    leafText?: string | null | ((leafNode: INode) => string)
  ): string {
    let text = '',
      first = true;
    this.nodesBetween(from, to, (node, pos) => {
      if (node.isText) {
        text += (node as unknown as { text: string }).text.slice(
          Math.max(from, pos) - pos,
          to - pos
        );
      } else if (node.isLeaf && leafText) {
        text += typeof leafText === 'function' ? leafText(node) : leafText;
      }
      if (node.isBlock && blockSeparator) {
        if (first) first = false;
        else text += blockSeparator;
      }
    });
    return text;
  }

  toString(): string {
    return `<${this.content.join(',')}>`;
  }
}
