import { ContentMatch } from '../value-objects/ContentMatch';
import { NodeType } from '../value-objects/NodeType';

export interface Edge {
  type: NodeType;
  next: ContentMatch;
}
