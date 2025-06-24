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
        const intVal = node.val.Integer.ival;
        if (intVal === 0 || intVal === undefined) {
          transformedData.ival = {};
        } else {
          transformedData.ival = { ival: intVal };
        }
        delete transformedData.val;
      } else if (node.val.Boolean) {
        transformedData.boolval = node.val.Boolean.boolval;
        delete transformedData.val;
      }
    }
    
    if (node.ival && typeof node.ival === 'object') {
      if ('ival' in node.ival) {
        transformedData.ival = node.ival;
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
        return table;
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

  SelectStmt(node: any, context?: TransformerContext): any {
    const transformedData: any = {};
    
    transformedData.limitOption = "LIMIT_OPTION_DEFAULT";
    transformedData.op = "SETOP_NONE";
    
    for (const [key, value] of Object.entries(node)) {
      if (Array.isArray(value)) {
        transformedData[key] = value.map(item => this.transform(item, context));
      } else if (value && typeof value === 'object') {
        const transformed = this.transform(value, context);
        transformedData[key] = transformed;
      } else {
        transformedData[key] = value;
      }
    }
    
    if (transformedData.larg) {
      if (transformedData.larg.SelectStmt) {
        if (!('limitOption' in transformedData.larg.SelectStmt)) {
          transformedData.larg.SelectStmt.limitOption = "LIMIT_OPTION_DEFAULT";
        }
        if (!('op' in transformedData.larg.SelectStmt)) {
          transformedData.larg.SelectStmt.op = "SETOP_NONE";
        }
      } else if (transformedData.larg.targetList) {
        if (!('limitOption' in transformedData.larg)) {
          transformedData.larg.limitOption = "LIMIT_OPTION_DEFAULT";
        }
        if (!('op' in transformedData.larg)) {
          transformedData.larg.op = "SETOP_NONE";
        }
      }
    }
    
    if (transformedData.rarg) {
      if (transformedData.rarg.SelectStmt) {
        if (!('limitOption' in transformedData.rarg.SelectStmt)) {
          transformedData.rarg.SelectStmt.limitOption = "LIMIT_OPTION_DEFAULT";
        }
        if (!('op' in transformedData.rarg.SelectStmt)) {
          transformedData.rarg.SelectStmt.op = "SETOP_NONE";
        }
      } else if (transformedData.rarg.targetList) {
        if (!('limitOption' in transformedData.rarg)) {
          transformedData.rarg.limitOption = "LIMIT_OPTION_DEFAULT";
        }
        if (!('op' in transformedData.rarg)) {
          transformedData.rarg.op = "SETOP_NONE";
        }
      }
    }
    
    return transformedData;
  }

  RangeVar(node: any, context?: TransformerContext): any {
    return node;
  }
}
