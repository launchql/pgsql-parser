export interface TransformerContext {
  sourceVersion: number;
  targetVersion: number;
  [key: string]: any;
}

export interface TransformerVisitor {
  transform(node: any, context?: TransformerContext): any;
}

export abstract class BaseTransformer implements TransformerVisitor {
  transform(node: any, context?: TransformerContext): any {
    if (!node || typeof node !== 'object') {
      return node;
    }

    if (Array.isArray(node)) {
      return node.map(item => this.transform(item, context));
    }

    const nodeType = Object.keys(node)[0];
    if (!nodeType) return node;

    const nodeData = node[nodeType];
    const methodName = nodeType;

    if (typeof (this as any)[methodName] === 'function') {
      const transformedData = (this as any)[methodName](nodeData, context);
      return { [nodeType]: transformedData };
    }

    return this.transformDefault(node, nodeType, nodeData, context);
  }

  protected transformDefault(node: any, nodeType: string, nodeData: any, context?: TransformerContext): any {
    if (!nodeData || typeof nodeData !== 'object') {
      return node;
    }

    if (Array.isArray(nodeData)) {
      return { [nodeType]: nodeData.map(item => this.transform(item, context)) };
    }

    const result: any = {};
    
    for (const [key, value] of Object.entries(nodeData)) {
      if (Array.isArray(value)) {
        result[key] = value.map(item => this.transform(item, context));
      } else if (value && typeof value === 'object') {
        result[key] = this.transform(value, context);
      } else {
        result[key] = value;
      }
    }
    
    this.ensureCriticalFields(result, nodeType);
    
    return { [nodeType]: result };
  }

  protected ensureCriticalFields(nodeData: any, nodeType: string): void {
    if (!nodeData || typeof nodeData !== 'object') return;

    if (nodeType === 'RangeVar') {
      if (!('location' in nodeData)) {
        nodeData.location = undefined;
      }
      if (!('relpersistence' in nodeData)) {
        nodeData.relpersistence = 'p';
      }
      if (!('inh' in nodeData)) {
        nodeData.inh = true;
      }
    }

    if (nodeType === 'TypeName') {
      if (!('location' in nodeData)) {
        nodeData.location = undefined;
      }
      if (!('typemod' in nodeData)) {
        nodeData.typemod = -1;
      }
    }

    if (nodeData.relation && typeof nodeData.relation === 'object') {
      if (!('location' in nodeData.relation)) {
        nodeData.relation.location = undefined;
      }
      if (!('relpersistence' in nodeData.relation)) {
        nodeData.relation.relpersistence = 'p';
      }
      if (!('inh' in nodeData.relation)) {
        nodeData.relation.inh = true;
      }
    }

    if (nodeData.typeName && typeof nodeData.typeName === 'object') {
      if (!('location' in nodeData.typeName)) {
        nodeData.typeName.location = undefined;
      }
      if (!('typemod' in nodeData.typeName)) {
        nodeData.typeName.typemod = -1;
      }
    }

    this.ensureTypeNameFieldsRecursively(nodeData);
  }

  protected ensureTypeNameFieldsRecursively(obj: any): void {
    if (!obj || typeof obj !== 'object') return;

    if (Array.isArray(obj)) {
      obj.forEach(item => this.ensureTypeNameFieldsRecursively(item));
      return;
    }

    if (obj.typeName && typeof obj.typeName === 'object') {
      if (!('location' in obj.typeName)) {
        obj.typeName.location = undefined;
      }
      if (!('typemod' in obj.typeName)) {
        obj.typeName.typemod = -1;
      }
    }

    Object.values(obj).forEach(value => {
      if (value && typeof value === 'object') {
        this.ensureTypeNameFieldsRecursively(value);
      }
    });
  }

  protected transformArray(items: any[], context?: TransformerContext): any[] {
    if (!Array.isArray(items)) return items;
    return items.map(item => this.transform(item, context));
  }
}
