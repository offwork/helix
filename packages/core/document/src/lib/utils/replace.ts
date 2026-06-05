import { from } from '../entities/FragmentFactory';
import type { IFragment } from '../contracts/IFragment';
import type { INode } from '../contracts/INode';
import type { IResolvedPos } from '../contracts/IResolvedPos';
import { TextNode } from '../entities/TextNode';
import { ReplaceError } from '../errors/ReplaceError';
import { Slice } from '../value-objects/Slice';

export function removeRange(
  content: IFragment,
  from: number,
  to: number
): IFragment {
  const { index, offset } = content.findIndex(from);
  const child = content.maybeChild(index);
  const { index: indexTo, offset: offsetTo } = content.findIndex(to);

  if (child === null) throw new RangeError('Removing non-flat range');

  if (offset === from || child.isText) {
    if (offsetTo !== to && !content.child(indexTo).isText) {
      throw new RangeError('Removing non-flat range');
    }
    return content.cut(0, from).append(content.cut(to));
  }

  if (index !== indexTo) throw new RangeError('Removing non-flat range');

  return content.replaceChild(
    index,
    child.copy(removeRange(child.content, from - offset - 1, to - offset - 1))
  );
}

export function insertInto(
  content: IFragment,
  dist: number,
  insert: IFragment,
  parent?: INode | null
): IFragment | null {
  const { index, offset } = content.findIndex(dist);
  const child = content.maybeChild(index);

  if (child === null) return null;

  if (offset === dist || child.isText) {
    if (parent && !parent.canReplace(index, index, insert)) return null;
    return content.cut(0, dist).append(insert).append(content.cut(dist));
  }

  const inner = insertInto(child.content, dist - offset - 1, insert, child as INode);
  return inner && content.replaceChild(index, child.copy(inner));
}

export function addNode(child: INode, target: INode[]): void {
  const last = target.length - 1;
  if (last >= 0 && child.isText && child.sameMarkup(target[last])) {
    target[last] = (child as TextNode).withText(
      (target[last] as TextNode).text + (child as TextNode).text
    );
  } else {
    target.push(child);
  }
}

export function checkJoin(main: INode, sub: INode): void {
  if (!sub.type.compatibleContent(main.type)) {
    throw new ReplaceError(
      `Cannot join ${sub.type.name} onto ${main.type.name}`
    );
  }
}

export function joinable(
  $before: IResolvedPos,
  $after: IResolvedPos,
  depth: number
): INode {
  const node = $before.node(depth);
  checkJoin(node, $after.node(depth));
  return node;
}

export function close(node: INode, content: IFragment): INode {
  node.type.checkContent(content);
  return node.copy(content);
}

export function addRange(
  $start: IResolvedPos | null,
  $end: IResolvedPos | null,
  depth: number,
  target: INode[]
): void {
  const resolvedNode = $end ?? $start;
  if (!resolvedNode) return;
  const node = resolvedNode.node(depth);
  let startIndex = 0;
  const endIndex = $end ? $end.index(depth) : node.childCount;

  if ($start) {
    startIndex = $start.index(depth);
    if ($start.depth > depth) {
      startIndex++;
    } else if ($start.textOffset) {
      if ($start.nodeAfter) addNode($start.nodeAfter, target);
      startIndex++;
    }
  }

  for (let i = startIndex; i < endIndex; i++) {
    addNode(node.child(i) as INode, target);
  }

  if ($end && $end.depth === depth && $end.textOffset) {
    if ($end.nodeBefore) addNode($end.nodeBefore, target);
  }
}

export function replaceTwoWay(
  $from: IResolvedPos,
  $to: IResolvedPos,
  depth: number
): IFragment {
  const content: INode[] = [];
  addRange(null, $from, depth, content);
  if ($from.depth > depth) {
    const type = joinable($from, $to, depth + 1);
    addNode(close(type, replaceTwoWay($from, $to, depth + 1)), content);
  }
  addRange($to, null, depth, content);
  return from(content);
}

export function replaceThreeWay(
  $from: IResolvedPos,
  $start: IResolvedPos,
  $end: IResolvedPos,
  $to: IResolvedPos,
  depth: number
): IFragment {
  const openStart = $from.depth > depth && joinable($from, $start, depth + 1);
  const openEnd = $to.depth > depth && joinable($end, $to, depth + 1);
  const content: INode[] = [];

  addRange(null, $from, depth, content);

  if (openStart && openEnd && $start.index(depth) === $end.index(depth)) {
    checkJoin(openStart, openEnd);
    addNode(
      close(openStart, replaceThreeWay($from, $start, $end, $to, depth + 1)),
      content
    );
  } else {
    if (openStart)
      addNode(
        close(openStart, replaceTwoWay($from, $start, depth + 1)),
        content
      );
    addRange($start, $end, depth, content);
    if (openEnd)
      addNode(close(openEnd, replaceTwoWay($end, $to, depth + 1)), content);
  }

  addRange($to, null, depth, content);
  return from(content);
}

export function prepareSliceForReplace(
  slice: Slice,
  $along: IResolvedPos
): { start: IResolvedPos; end: IResolvedPos } {
  const extra = $along.depth - slice.openStart;
  const parent = $along.node(extra);
  let node = parent.copy(slice.content);
  for (let i = extra - 1; i >= 0; i--) {
    node = $along.node(i).copy(from([node]));
  }
  return {
    start: node.resolveNoCache(slice.openStart + extra),
    end: node.resolveNoCache(node.content.size - slice.openEnd - extra),
  };
}

export function replaceOuter(
  $from: IResolvedPos,
  $to: IResolvedPos,
  slice: Slice,
  depth: number
): INode {
  const index = $from.index(depth);
  const node = $from.node(depth);

  if (index === $to.index(depth) && depth < $from.depth - slice.openStart) {
    const inner = replaceOuter($from, $to, slice, depth + 1);
    return node.copy(node.content.replaceChild(index, inner));
  } else if (!slice.content.size) {
    return close(node, replaceTwoWay($from, $to, depth));
  } else if (
    !slice.openStart &&
    !slice.openEnd &&
    $from.depth === depth &&
    $to.depth === depth
  ) {
    const parent = $from.parent;
    const content = parent.content;
    return close(
      parent,
      content
        .cut(0, $from.parentOffset)
        .append(slice.content)
        .append(content.cut($to.parentOffset))
    );
  } else {
    const { start, end } = prepareSliceForReplace(slice, $from);
    return close(node, replaceThreeWay($from, start, end, $to, depth));
  }
}

export function replace(
  $from: IResolvedPos,
  $to: IResolvedPos,
  slice: Slice
): INode {
  if (slice.openStart > $from.depth)
    throw new ReplaceError('Inserted content deeper than insertion position');
  if ($from.depth - slice.openStart !== $to.depth - slice.openEnd)
    throw new ReplaceError('Inconsistent open depths');
  return replaceOuter($from, $to, slice, 0);
}
