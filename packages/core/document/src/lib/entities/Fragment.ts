export class Fragment<TNode> {
  private readonly content: readonly TNode[];

  private constructor(content: readonly TNode[]) {
    this.content = content;
  }

  static empty<TNode>(): Fragment<TNode> {
    return new Fragment<TNode>([]);
  }

  get size(): number {
    return this.content.length;
  }
}
