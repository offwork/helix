import { NodeJSON } from "./NodeJSON";

export type SliceJSON = {
  content: NodeJSON[] | null;
  openStart?: number;
  openEnd?: number;
};