import { Node } from './Node';
import { Mark } from '../value-objects/Mark';
import type { INodeType } from '../value-objects/INodeType';

export class TextNode extends Node {
  readonly text: string;

  constructor(
    type: INodeType,
    attrs: Record<string, unknown>,
    text: string,
    marks?: Mark[]
  ) {
    super(type, attrs, undefined, marks);

    if (!text) {
      throw new RangeError('Node text cannot be empty');
    }

    this.text = text;
  }

  override equals(other: Node): boolean {
    return this.text === (other as TextNode).text;
  }

  override get nodeSize(): number {
    return this.text.length;
  }

  override cut(from: number, to = this.text.length): TextNode {
    if (from === 0 && to === this.text.length) {
      return this;
    }

    return new TextNode(
      this.type,
      this.attrs,
      this.textBetween(from, to),
      this.marks
    );
  }

  get textContent(): string {
    return this.text;
  }

  override toString(): string {
    return `"${this.text}"`;
  }

  override mark(marks: Mark[]): TextNode {
    if (this.marks === marks) {
      return this;
    }

    return new TextNode(this.type, this.attrs, this.text, marks);
  }

  textBetween(from: number, to: number): string {
    return this.text.slice(from, to);
  }

  withText(text: string): TextNode {
    if (text === this.text) {
      return this;
    }

    return new TextNode(this.type, this.attrs, text, this.marks);
  }
}
