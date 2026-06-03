import { Fragment } from "./Fragment";
import { INode } from "./INode";

export function empty(): Fragment {
  return Fragment.empty();
}

export function from(nodes: readonly INode[]): Fragment {
  return Fragment.from(nodes);
}
