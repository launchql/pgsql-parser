import { BaseTransformer, TransformerContext } from '../visitors/base';
import { Node as PG14Node } from '../14/types';
import { Node as PG15Node } from '../15/types';

export class V14ToV15Transformer extends BaseTransformer {
  transform(node: any, context?: TransformerContext): any {
    if (node && typeof node === 'object' && 'version' in node && 'stmts' in node) {
      return {
        version: 150004, // PG15 version
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

  A_Const(nodeData: any, context?: TransformerContext): any {
    const transformedData: any = { ...nodeData };
    
    if (nodeData.val) {
      if (nodeData.val.String) {
        transformedData.sval = { sval: nodeData.val.String.str };
        delete transformedData.val;
      } else if (nodeData.val.Float) {
        transformedData.fval = { fval: nodeData.val.Float.str };
        delete transformedData.val;
      } else if (nodeData.val.BitString) {
        transformedData.bsval = { bsval: nodeData.val.BitString.str };
        delete transformedData.val;
      } else if (nodeData.val.Integer) {
        const intVal = nodeData.val.Integer.ival;
        if (intVal === 0 || intVal === undefined) {
          transformedData.ival = {};
        } else {
          transformedData.ival = { ival: intVal };
        }
        delete transformedData.val;
      } else if (nodeData.val.Boolean) {
        transformedData.boolval = nodeData.val.Boolean.boolval;
        delete transformedData.val;
      }
    }
    
    if (nodeData.ival && typeof nodeData.ival === 'object') {
      if ('ival' in nodeData.ival) {
        transformedData.ival = nodeData.ival;
      } else {
        transformedData.ival = {};
      }
    }
    
    return transformedData;
  }

  String(node: any, context?: TransformerContext): any {
    if ('str' in node) {
      return { sval: node.str };
    }
    
    return node;
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
    
    return transformedData;
  }

  CreatePublicationStmt(node: any, context?: TransformerContext): any {
    const transformedData = { ...node };
    
    if ('tables' in transformedData && Array.isArray(transformedData.tables)) {
      transformedData.pubobjects = transformedData.tables.map((table: any) => {
        if (table.RangeVar) {
          return {
            PublicationObjSpec: {
              pubobjtype: "PUBLICATIONOBJ_TABLE",
              pubtable: {
                relation: table.RangeVar
              }
            }
          };
        }
        return {
          PublicationObjSpec: {
            pubobjtype: "PUBLICATIONOBJ_TABLE",
            pubtable: {
              relation: table
            }
          }
        };
      });
      delete transformedData.tables;
    }
    
    return transformedData;
  }

  FuncCall(node: any, context?: TransformerContext): any {
    const transformedData = { ...node };
    
    if (!('funcformat' in transformedData)) {
      transformedData.funcformat = "COERCE_EXPLICIT_CALL";
    }
    
    if (transformedData.funcname && Array.isArray(transformedData.funcname)) {
      transformedData.funcname = transformedData.funcname.map((item: any) => this.transform(item, context));
    }
    
    if (transformedData.args && Array.isArray(transformedData.args)) {
      transformedData.args = transformedData.args.map((item: any) => this.transform(item, context));
    }
    
    if (transformedData.over && typeof transformedData.over === 'object') {
      const originalOver = { ...transformedData.over };
      const transformedOver: any = {};
      
      transformedOver.frameOptions = 1058;
      transformedOver.location = undefined;
      
      for (const [key, value] of Object.entries(originalOver)) {
        if (key === 'orderClause' && Array.isArray(value)) {
          transformedOver[key] = value.map((item: any) => this.transform(item, context));
        } else if (key === 'partitionClause' && Array.isArray(value)) {
          transformedOver[key] = value.map((item: any) => this.transform(item, context));
        } else {
          transformedOver[key] = value;
        }
      }
      
      transformedData.over = transformedOver;
    }
    
    return transformedData;
  }

  ColumnRef(node: any, context?: TransformerContext): any {
    const transformedData = { ...node };
    
    if (transformedData.fields && Array.isArray(transformedData.fields)) {
      transformedData.fields = transformedData.fields.map((field: any) => this.transform(field, context));
    }
    
    return transformedData;
  }

  WindowDef(node: any, context?: TransformerContext): any {
    const transformedData = { ...node };
    
    if (!('frameOptions' in transformedData)) {
      transformedData.frameOptions = 1058; // Default frame options for PG17
    }
    if (!('location' in transformedData)) {
      transformedData.location = undefined;
    }
    
    if (transformedData.orderClause && Array.isArray(transformedData.orderClause)) {
      transformedData.orderClause = transformedData.orderClause.map((item: any) => this.transform(item, context));
    }
    
    if (transformedData.partitionClause && Array.isArray(transformedData.partitionClause)) {
      transformedData.partitionClause = transformedData.partitionClause.map((item: any) => this.transform(item, context));
    }
    
    return transformedData;
  }

  SelectStmt(nodeData: any, context?: TransformerContext): any {
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



  RangeVar(node: any, context?: TransformerContext): any {
    return node;
  }
}
