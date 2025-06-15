import { Type, Field, Enum, Namespace, ReflectionObject } from '@launchql/protobufjs';
import { NodeSpec, FieldSpec } from './types';

export class RuntimeSchemaGenerator {
  private root: Namespace;
  private wrappedTypes: Set<string> = new Set();

  constructor(root: Namespace) {
    this.root = root;
    this.extractWrappedTypes();
  }

  private extractWrappedTypes(): void {
    const nodeType = this.root.lookupType('Node');
    if (nodeType && nodeType.oneofs && nodeType.oneofs.node) {
      const oneof = nodeType.oneofs.node;
      for (const fieldName of oneof.fieldsArray.map(f => f.name)) {
        const field = nodeType.fields[fieldName];
        if (field && field.type) {
          this.wrappedTypes.add(field.type);
        }
      }
    }
  }

  public generateNodeSpecs(): NodeSpec[] {
    const nodeSpecs: NodeSpec[] = [];
    
    this.root.nestedArray.forEach((nested) => {
      if (nested instanceof Type && nested.name !== 'Node') {
        const nodeSpec = this.createNodeSpec(nested);
        if (nodeSpec) {
          nodeSpecs.push(nodeSpec);
        }
      }
    });

    return nodeSpecs.sort((a, b) => a.name.localeCompare(b.name));
  }

  private createNodeSpec(type: Type): NodeSpec | null {
    const fields: FieldSpec[] = [];
    
    Object.values(type.fields).forEach((field) => {
      const fieldSpec = this.createFieldSpec(field);
      if (fieldSpec) {
        fields.push(fieldSpec);
      }
    });

    return {
      name: type.name,
      wrapped: this.wrappedTypes.has(type.name),
      fields: fields.sort((a, b) => a.name.localeCompare(b.name))
    };
  }

  private createFieldSpec(field: Field): FieldSpec | null {
    const fieldName = field.name;
    const isArray = field.repeated || false;
    const optional = !field.required;
    const fieldType = field.type;
    const isNode = fieldType === 'Node' || this.wrappedTypes.has(fieldType);

    return {
      name: fieldName,
      type: fieldType,
      isNode,
      isArray,
      optional
    };
  }

  public getWrappedTypes(): string[] {
    return Array.from(this.wrappedTypes).sort();
  }

  public getWrappedTypesCount(): number {
    return this.wrappedTypes.size;
  }
}
