import type { IMarkType } from "../IMarkType";
import type { IMark } from "../IMark";
import type { INode } from "../INode";
import { NodeType } from "../../value-objects/NodeType";
import { TextNode } from "../../entities/TextNode";
import { NodeJSON } from "./NodeJSON";

export type SyntheticSchema = {
  nodes: Record<string, NodeType>;
  marks: Record<string, IMarkType>;
  text(text: string, marks?: readonly IMark[]): TextNode;
  nodeType(type: string): NodeType;
  markFromJSON(json: { type: string; attrs?: Record<string, unknown> }): IMark;
  nodeFromJSON(json: NodeJSON): INode;
}