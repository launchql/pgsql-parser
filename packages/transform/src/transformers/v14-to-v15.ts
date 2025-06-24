import { BaseTransformer, TransformerContext } from '../visitors/base';
import { Node as PG14Node } from '../14/types';
import { Node as PG15Node } from '../15/types';

export class V14ToV15Transformer extends BaseTransformer {
  A_Const(node: any, context?: TransformerContext): any {
    const transformedData: any = { ...node };
    
    if (node.val) {
      if (node.val.String) {
        transformedData.sval = { sval: node.val.String.str };
        delete transformedData.val;
      } else if (node.val.Float) {
        transformedData.fval = { fval: node.val.Float.str };
        delete transformedData.val;
      } else if (node.val.BitString) {
        transformedData.bsval = { bsval: node.val.BitString.str };
        delete transformedData.val;
      } else if (node.val.Integer) {
        transformedData.ival = node.val.Integer;
        delete transformedData.val;
      } else if (node.val.Boolean) {
        transformedData.boolval = node.val.Boolean;
        delete transformedData.val;
      }
    }
    
    return this.transformNodeData(transformedData, context);
  }

  String(node: any, context?: TransformerContext): any {
    const transformedData = { ...node };
    
    if ('str' in transformedData) {
      transformedData.sval = transformedData.str;
      delete transformedData.str;
    }
    
    return transformedData;
  }

  BitString(node: any, context?: TransformerContext): any {
    const transformedData = { ...node };
    
    if ('str' in transformedData) {
      transformedData.bsval = transformedData.str;
      delete transformedData.str;
    }
    
    return transformedData;
  }

  Float(node: any, context?: TransformerContext): any {
    const transformedData = { ...node };
    
    if ('str' in transformedData) {
      transformedData.fval = transformedData.str;
      delete transformedData.str;
    }
    
    return transformedData;
  }

  AlterPublicationStmt(node: any, context?: TransformerContext): any {
    const transformedData = { ...node };
    
    if ('tables' in transformedData) {
      transformedData.pubobjects = transformedData.tables;
      delete transformedData.tables;
    }
    if ('tableAction' in transformedData) {
      transformedData.action = transformedData.tableAction;
      delete transformedData.tableAction;
    }
    
    return this.transformNodeData(transformedData, context);
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
