import { NodeSpec } from '../interfaces/SchemaSpec';
import { MarkType } from './MarkType';

export class NodeType {
  readonly name: string;
  readonly schema: unknown;
  readonly spec: NodeSpec;

  constructor(name: string, schema: unknown, spec: NodeSpec) {
    this.validateParameter('name', name);
    this.validateParameter('schema', schema);
    this.validateParameter('spec', spec);

    this.name = name;
    this.schema = schema;
    this.spec = spec;
  }

  equals(other: NodeType): boolean {
    if (other === null) {
      throw new Error('NodeType equals parameter cannot be null');
    }

    return this.name === other.name;
  }

  allowsMarkType(markType: MarkType): boolean {
    if (markType === null) {
      throw new Error('NodeType allowsMarkType parameter cannot be null');
    }

    if (!(markType instanceof MarkType)) {
      throw new Error('NodeType allowsMarkType parameter must be MarkType');
    }

    const marks = this.spec.marks;

    // marks tanımsız → inline ise tümüne izin, değilse hiçbirine
    if (marks === undefined) {
      return this.spec.inline === true;
    }

    // "_" → tüm marklara izin
    if (marks === '_') {
      return true;
    }

    // "" → hiçbir marka izin yok
    if (marks === '') {
      return false;
    }

    // "bold italic link" → listedekilere izin
    const allowedMarks = marks.split(' ');
    return allowedMarks.includes(markType.name);
  }

  private validateParameter(paramName: string, paramValue: unknown): void {
    if (paramName === 'name') {
      if (
        !paramValue ||
        (typeof paramValue === 'string' && paramValue.trim() === '')
      ) {
        throw new Error(`NodeType ${paramName} cannot be empty`);
      }

      return;
    }

    if (paramValue === null) {
      throw new Error(`NodeType ${paramName} cannot be null`);
    }

    if (paramValue === undefined) {
      throw new Error(`NodeType ${paramName} cannot be undefined`);
    }
  }
}
