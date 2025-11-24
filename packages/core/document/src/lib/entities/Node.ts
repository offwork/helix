import { NodeType } from '../value-objects/NodeType';

export class Node<TAttrs = Record<string, unknown>> {
  readonly type: NodeType;
  readonly attrs: TAttrs;

  constructor(type: NodeType, attrs: TAttrs) {
    this.type = type;
    this.attrs = attrs;
  }
}
