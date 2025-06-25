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

    const keys = Object.keys(node);
    if (keys.length === 0) return node;

    if (keys.length === 1) {
      const nodeType = keys[0];
      const nodeData = node[nodeType];
      
      if (nodeData && typeof nodeData === 'object' && !Array.isArray(nodeData)) {
        const methodName = nodeType;

        if (typeof (this as any)[methodName] === 'function') {
          const transformedData = (this as any)[methodName](nodeData, context);
          return { [nodeType]: transformedData };
        }

        return this.transformDefault(node, nodeType, nodeData, context);
      }
    }

    const result: any = {};
    for (const [key, value] of Object.entries(node)) {
      if (Array.isArray(value)) {
        result[key] = value.map(item => this.transform(item, context));
      } else if (value && typeof value === 'object') {
        result[key] = this.transform(value, context);
      } else {
        result[key] = value;
      }
    }
    
    return result;
  }

  protected transformDefault(node: any, nodeType: string, nodeData: any, context?: TransformerContext): any {
    if (!nodeData || typeof nodeData !== 'object') {
      return node;
    }

    if (Array.isArray(nodeData)) {
      return { [nodeType]: nodeData.map(item => this.transform(item, context)) };
    }

    const result: any = { ...nodeData };
    
    for (const [key, value] of Object.entries(nodeData)) {
      if (Array.isArray(value)) {
        result[key] = value.map(item => this.transform(item, context));
      } else if (value && typeof value === 'object') {
        if (key === 'typeName') {
          const wrappedTypeName = { TypeName: value };
          const transformedTypeName = this.transform(wrappedTypeName, context);
          result[key] = transformedTypeName.TypeName;
        } else {
          result[key] = this.transform(value, context);
        }
      }
    }
    
    this.ensureCriticalFields(result, nodeType);
    
    return { [nodeType]: result };
  }

  protected ensureCriticalFields(nodeData: any, nodeType: string): void {
    if (!nodeData || typeof nodeData !== 'object') return;

    if (nodeType === 'RangeVar') {
      if (!('relpersistence' in nodeData)) {
        nodeData.relpersistence = 'p';
      }
      if (!('inh' in nodeData)) {
        nodeData.inh = true;
      }
    }

    if (nodeType === 'TypeName') {
      if (!('typemod' in nodeData)) {
        nodeData.typemod = -1;
      }
    }

    if (nodeData.relation && typeof nodeData.relation === 'object') {
      if (!('relpersistence' in nodeData.relation)) {
        nodeData.relation.relpersistence = 'p';
      }
      if (!('inh' in nodeData.relation)) {
        nodeData.relation.inh = true;
      }
    }

    if (nodeData.typeName && typeof nodeData.typeName === 'object') {
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
