export * from './lib/document';

// Errors
export { ReplaceError } from './lib/errors/ReplaceError';

// Entities
export type { IFragment } from './lib/entities/IFragment';
export { Fragment } from './lib/entities/Fragment';
export { empty, from } from './lib/entities/FragmentFactory';
export type { INode } from './lib/entities/INode';
export { Node } from './lib/entities/Node';
export { TextNode } from './lib/entities/TextNode';

// Interfaces
export type { Edge } from './lib/interfaces/Edge';
export type {
  AttributeSpec,
  NodeSpec,
  MarkSpec,
} from './lib/interfaces/SchemaSpec';

// Sevices
export { Schema } from './lib/services/Schema';

// Utils
export { checkAttrs } from './lib/utils/attrs';
export type { Attrs } from './lib/utils/attrs';

// Value Objects
export { Attribute } from './lib/value-objects/Attribute';
export { ContentMatch } from './lib/value-objects/ContentMatch';
export { NodeRange } from './lib/value-objects/NodeRange';
export { NodeType } from './lib/value-objects/NodeType';
export { Mark } from './lib/value-objects/Mark';
export { MarkSet } from './lib/value-objects/MarkSet';
export { MarkType } from './lib/value-objects/MarkType';
export { Position } from './lib/value-objects/Position';
export { ResolvedPos } from './lib/value-objects/ResolvedPos';
export { Slice } from './lib/value-objects/Slice';
