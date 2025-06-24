import { BaseTransformer, TransformerContext } from '../visitors/base';
import { Node as PG15Node } from '../15/types';
import { Node as PG16Node } from '../16/types';

export class V15ToV16Transformer extends BaseTransformer {
  Var(node: any, context?: TransformerContext): any {
    return this.transformNodeData(node, context);
  }

  Aggref(node: any, context?: TransformerContext): any {
    return this.transformNodeData(node, context);
  }

  private transformNodeData(nodeData: any, context?: TransformerContext): any {
    if (!nodeData || typeof nodeData !== 'object' || Array.isArray(nodeData)) {
      return nodeData;
    }

    const result: any = {};
    for (const [key, value] of Object.entries(nodeData)) {
      if (Array.isArray(value)) {
        result[key] = this.transformArray(value, context);
      } else if (value && typeof value === 'object') {
        result[key] = this.transform(value, context);
      } else {
        result[key] = value;
      }
    }
    return result;
  }
}
