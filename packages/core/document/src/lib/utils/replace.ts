import { Fragment } from '../entities/Fragment';
import { Node } from '../entities/Node';

export function removeRange(
  content: Fragment<Node>,
  from: number,
  to: number
): Fragment<Node> {
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
  content: Fragment<Node>,
  dist: number,
  insert: Fragment<Node>,
  parent?: Node | null
): Fragment<Node> | null {
  const { index, offset } = content.findIndex(dist);
  const child = content.maybeChild(index);

  if (child === null) return null;

  if (offset === dist || child.isText) {
    if (parent && !parent.canReplace(index, index, insert)) return null;
    return content.cut(0, dist).append(insert).append(content.cut(dist));
  }

  const inner = insertInto(child.content, dist - offset - 1, insert, child);
  return inner && content.replaceChild(index, child.copy(inner));
}
