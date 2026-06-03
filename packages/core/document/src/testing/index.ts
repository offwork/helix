import { Node } from '../lib/entities/Node';
import { Fragment } from '../lib/entities/Fragment';
import { ContentMatch } from '../lib/value-objects/ContentMatch';
import { NodeType } from '../lib/value-objects/NodeType';
import { MarkType } from '../lib/value-objects/MarkType';
import { Mark } from '../lib/value-objects/Mark';
import { MarkSpec, NodeSpec } from '../lib/interfaces/SchemaSpec';
import { Edge } from '../lib/interfaces/Edge';
import { ResolvedPos } from '../lib/value-objects/ResolvedPos';
import { empty, from } from '../lib/entities/FragmentFactory';

// — Defaults
export const defaultMockSchema = {} as never;
export const defaultNodeSpec: NodeSpec = { attrs: {} };
export const defaultMarkSpec: MarkSpec = { attrs: {} };

// — NodeType instances
export const paragraphType = new NodeType(
  'paragraph',
  defaultMockSchema,
  defaultNodeSpec
);
export const textType = new NodeType(
  'text',
  defaultMockSchema,
  defaultNodeSpec
);
export const imageType = new NodeType(
  'image',
  defaultMockSchema,
  defaultNodeSpec
);
export const headingType = new NodeType(
  'heading',
  defaultMockSchema,
  defaultNodeSpec
);
export const spanType = new NodeType('span', defaultMockSchema, {
  attrs: {},
  inline: true,
});
export const mentionType = new NodeType('span', defaultMockSchema, {
  attrs: {},
  atom: true,
});

// — MarkType instances
export const boldMarkType = new MarkType(
  'bold',
  defaultMockSchema,
  defaultMarkSpec
);
export const italicMarkType = new MarkType(
  'italic',
  defaultMockSchema,
  defaultMarkSpec
);
export const linkMarkType = new MarkType(
  'link',
  defaultMockSchema,
  defaultMarkSpec
);

// — Shared Node setup
export const mockChildNode = new Node(paragraphType, { attrs: {} });
export const mockContent = from([mockChildNode]);

// — Fragment helpers
export const emptyContent = empty();
export const nonEmptyContent = { size: 3 } as Fragment;

// — Spec factories
export const createNodeSpec = (attrs = { attrs: {} } as NodeSpec): NodeSpec =>
  attrs as unknown as NodeSpec;

export function createSchemaSpec(
  extra?: Record<string, NodeSpec>
): Record<string, NodeSpec> {
  return {
    doc: { content: 'paragraph+' },
    text: {},
    paragraph: { attrs: {} },
    heading: { attrs: {} },
    ...extra,
  };
}

export function createMarkSpec(
  extra?: Record<string, MarkSpec>
): Record<string, MarkSpec> {
  return {
    strong: { attrs: {} },
    em: { attrs: {} },
    ...extra,
  };
}

// — ResolvedPos factory
export function createResolvedPos(
  pos: number,
  path: (Node | number)[] = [createMockNode(), 0, 0],
  parentOffset = 0
): ResolvedPos {
  return new ResolvedPos(pos, path, parentOffset);
}

// — Mark factories
export const createMarkType = (name: string, schema: unknown, spec: MarkSpec) =>
  new MarkType(name, schema, spec);

export const createMark = (type: MarkType, attrs: Record<string, unknown>) =>
  new Mark(type, attrs);

export function createMarks(...types: string[]): Mark[] {
  return types.map((t) => new Mark(new MarkType(t, {}, {}), {}));
}

// — Mock factories
export function createMockNodeType(
  name = 'paragraph',
  schema: unknown = {},
  spec: NodeSpec = { attrs: { content: { default: 'text*' } } }
): NodeType {
  return new NodeType(name, schema, spec);
}

export function createMockContentMatch(
  validEnd = true,
  edges: Edge[] = []
): ContentMatch {
  return new ContentMatch(validEnd, edges);
}

export function createMockNode(
  nameOrType: string | NodeType = 'paragraph'
): Node {
  const nodeType =
    typeof nameOrType === 'string'
      ? new NodeType(nameOrType, {}, { attrs: {} })
      : nameOrType;
  return new Node(nodeType, {});
}

export function createMockFragment(nodes: Node[] = []): Fragment {
  return nodes.length === 0 ? empty() : from(nodes);
}

export function createSelfRefNodeType(name: string): NodeType {
  const type = new NodeType(name, defaultMockSchema, {});
  type.contentMatch = ContentMatch.parse(`${name}*`, { [name]: type });
  return type;
}
