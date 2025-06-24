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
    if (!nodeData || typeof nodeData !== 'object' || Array.isArray(nodeData)) {
      return node;
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
    return { [nodeType]: result };
  }

  protected transformArray(items: any[], context?: TransformerContext): any[] {
    if (!Array.isArray(items)) return items;
    return items.map(item => this.transform(item, context));
  }
}
