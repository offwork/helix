export class OrderedMap<T> {
  private readonly content: readonly [string, T][];

  private constructor(content: readonly [string, T][]) {
    this.content = content;
  }

  static from<T>(map: Record<string, T> | OrderedMap<T>): OrderedMap<T> {
    if (map instanceof OrderedMap) return map;

    const content: [string, T][] = [];
    for (const key in map) {
      content.push([key, map[key]]);
    }

    return new OrderedMap<T>(content);
  }

  get(key: string): T | undefined {
    const entry = this.content.find(([entryKey]) => entryKey === key);
    return entry ? entry[1] : undefined;
  }

  forEach(fn: (key: string, value: T) => void): void {
    for (const [key, value] of this.content) {
      fn(key, value);
    }
  }
}