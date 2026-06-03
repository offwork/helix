export function isInSet<T>(
  set: readonly T[],
  predicate: (item: T) => boolean
): T | undefined {
  return set.find(predicate);
}

export function removeFromSet<T>(
  set: readonly T[],
  predicate: (item: T) => boolean
): readonly T[] {
  const index = set.findIndex(predicate);
  if (index === -1) return set;
  return set.slice(0, index).concat(set.slice(index + 1));
}
