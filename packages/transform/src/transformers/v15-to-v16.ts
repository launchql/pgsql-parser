import { BaseTransformer, TransformerContext } from '../visitors/base';
import * as PG15 from '../15/types';
import * as PG16 from '../16/types';

// Note: We use 'any' for some node types because the generated types don't accurately
// reflect the actual parser output structure, particularly for fields that exist in
// the parser output but not in the generated types.

export class V15ToV16Transformer extends BaseTransformer {
  transform(node: any, context?: TransformerContext): any {
    if (node && typeof node === 'object' && 'version' in node && 'stmts' in node) {
      return {
        version: 160004, // PG16 version
        stmts: node.stmts.map((stmt: any) => {
          if (stmt && typeof stmt === 'object' && 'stmt' in stmt) {
            return {
              ...stmt,
              stmt: this.transform(stmt.stmt, context)
            };
          }
          return this.transform(stmt, context);
        })
      };
    }
    
    return super.transform(node, context);
  }



  SelectStmt(nodeData: any, context?: TransformerContext): any {
    // SelectStmt: handle limitOption and op defaults
    const transformedData: any = {};
    
    for (const [key, value] of Object.entries(nodeData)) {
      transformedData[key] = value;
    }
    
    const hasContent = (nodeData.targetList && nodeData.targetList.length > 0) || 
                      nodeData.fromClause || nodeData.whereClause || 
                      nodeData.groupClause || nodeData.havingClause || nodeData.orderClause ||
                      nodeData.limitClause || nodeData.withClause || nodeData.larg || nodeData.rarg;
    
    if (hasContent) {
      if (!('limitOption' in transformedData)) {
        transformedData.limitOption = "LIMIT_OPTION_DEFAULT";
      }
      if (!('op' in transformedData)) {
        transformedData.op = "SETOP_NONE";
      }
    }
    
    if (transformedData.withClause && typeof transformedData.withClause === 'object') {
      transformedData.withClause = { ...transformedData.withClause };
      if (transformedData.withClause.ctes && Array.isArray(transformedData.withClause.ctes)) {
        transformedData.withClause.ctes = transformedData.withClause.ctes.map((cte: any) => this.transform(cte, context));
      }
    }
    
    if (transformedData.larg && typeof transformedData.larg === 'object') {
      transformedData.larg = this.SelectStmt(transformedData.larg, context);
    }
    
    if (transformedData.rarg && typeof transformedData.rarg === 'object') {
      transformedData.rarg = this.SelectStmt(transformedData.rarg, context);
    }
    
    if (transformedData.targetList && Array.isArray(transformedData.targetList)) {
      transformedData.targetList = transformedData.targetList.map((item: any) => this.transform(item, context));
    }
    
    if (transformedData.fromClause && Array.isArray(transformedData.fromClause)) {
      transformedData.fromClause = transformedData.fromClause.map((item: any) => this.transform(item, context));
    }
    
    if (transformedData.whereClause && typeof transformedData.whereClause === 'object') {
      transformedData.whereClause = this.transform(transformedData.whereClause, context);
    }
    
    if (transformedData.groupClause && Array.isArray(transformedData.groupClause)) {
      transformedData.groupClause = transformedData.groupClause.map((item: any) => this.transform(item, context));
    }
    
    if (transformedData.havingClause && typeof transformedData.havingClause === 'object') {
      transformedData.havingClause = this.transform(transformedData.havingClause, context);
    }
    
    if (transformedData.orderClause && Array.isArray(transformedData.orderClause)) {
      transformedData.orderClause = transformedData.orderClause.map((item: any) => this.transform(item, context));
    }
    
    if (transformedData.limitClause && typeof transformedData.limitClause === 'object') {
      transformedData.limitClause = this.transform(transformedData.limitClause, context);
    }
    
    return transformedData;
  }



  Var(node: PG15.Var, context?: TransformerContext): any {
    return node;
  }

  Aggref(node: PG15.Aggref, context?: TransformerContext): any {
    return node;
  }

  Integer(node: PG15.Integer, context?: TransformerContext): any {
    const transformedData = { ...node };
    
    if (!('ival' in transformedData)) {
      transformedData.ival = -1;
    }
    
    return transformedData;
  }
}
