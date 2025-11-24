export class NodeType {
  readonly name: string;

  constructor(name: string) {
    if (!name || name.trim() === '') {
      throw new Error('NodeType name cannot be empty');
    }
    this.name = name;
  }

  equals(other: NodeType): boolean {
    return this.name === other.name;
  }
}
