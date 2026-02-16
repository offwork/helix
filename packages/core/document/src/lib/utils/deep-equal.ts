export const deepEqual = (a: unknown, b: unknown): boolean => {
  if (a === b) return true;

  const bothAreObjects =
    a &&
    b &&
    typeof a === 'object' &&
    typeof b === 'object' &&
    Array.isArray(a) === Array.isArray(b);

  if (!bothAreObjects) return false;

  const objA = a as Record<string, unknown>;
  const objB = b as Record<string, unknown>;

  return (
    Object.keys(objA).length === Object.keys(objB).length &&
    Object.entries(objA).every(([k, v]) => deepEqual(v, objB[k]))
  );
};
