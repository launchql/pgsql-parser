import { BaseTransformer, TransformerContext } from '../visitors/base';
import { Node as PG13Node } from '../13/types';
import { Node as PG14Node } from '../14/types';
import * as PG13 from '../13/types';
import * as PG14 from '../14/types';
import * as pg13RuntimeSchema from '../13/runtime-schema';
import * as pg14RuntimeSchema from '../14/runtime-schema';

export class V13ToV14Transformer extends BaseTransformer {
  transform(node: any, context?: TransformerContext): any {
    if (node && typeof node === 'object' && 'version' in node && 'stmts' in node) {
      return {
        version: 140004, // PG14 version
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



  SelectStmt(nodeData: PG13.SelectStmt, context?: TransformerContext): any {
    const transformedData: any = {};
    
    for (const [key, value] of Object.entries(nodeData)) {
      transformedData[key] = value;
    }
    
    const hasContent = (nodeData.targetList && nodeData.targetList.length > 0) || 
                      nodeData.fromClause || nodeData.whereClause || 
                      nodeData.groupClause || nodeData.havingClause || nodeData.sortClause ||
                      nodeData.limitOffset || nodeData.limitCount || nodeData.withClause || nodeData.larg || nodeData.rarg;
    
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
    
    if (transformedData.sortClause && Array.isArray(transformedData.sortClause)) {
      transformedData.sortClause = transformedData.sortClause.map((item: any) => this.transform(item, context));
    }
    
    if (transformedData.limitOffset && typeof transformedData.limitOffset === 'object') {
      transformedData.limitOffset = this.transform(transformedData.limitOffset, context);
    }
    
    if (transformedData.limitCount && typeof transformedData.limitCount === 'object') {
      transformedData.limitCount = this.transform(transformedData.limitCount, context);
    }
    
    if (transformedData.valuesLists && Array.isArray(transformedData.valuesLists)) {
      transformedData.valuesLists = transformedData.valuesLists.map((item: any) => this.transform(item, context));
    }
    
    return transformedData;
  }



  CallStmt(nodeData: PG13.CallStmt, context?: TransformerContext): any {
    const transformedData: any = {};
    
    for (const [key, value] of Object.entries(nodeData)) {
      if (key === 'funccall' && value && typeof value === 'object') {
        transformedData[key] = this.FuncCall(value, context);
      } else if (Array.isArray(value)) {
        transformedData[key] = value.map(item => this.transform(item, context));
      } else if (value && typeof value === 'object') {
        transformedData[key] = this.transform(value, context);
      } else {
        transformedData[key] = value;
      }
    }
    
    return transformedData;
  }

  FuncCall(nodeData: PG13.FuncCall, context?: TransformerContext): any {
    const transformedData: any = { ...nodeData };
    
    if (!('funcformat' in transformedData)) {
      transformedData.funcformat = "COERCE_EXPLICIT_CALL";
    }
    
    if (transformedData.funcname && Array.isArray(transformedData.funcname)) {
      transformedData.funcname = transformedData.funcname.map((item: any) => this.transform(item, context));
    }
    
    if (transformedData.args && Array.isArray(transformedData.args)) {
      transformedData.args = transformedData.args.map((item: any) => this.transform(item, context));
    }
    
    return transformedData;
  }

  TypeName(nodeData: PG13.TypeName, context?: TransformerContext): any {
    const transformedData: any = {};
    
    for (const [key, value] of Object.entries(nodeData)) {
      if (Array.isArray(value)) {
        transformedData[key] = value.map(item => this.transform(item, context));
      } else if (value && typeof value === 'object') {
        transformedData[key] = this.transform(value, context);
      } else {
        transformedData[key] = value;
      }
    }
    
    if (!('location' in transformedData)) {
      transformedData.location = undefined;
    }
    if (!('typemod' in transformedData)) {
      transformedData.typemod = -1;
    }
    
    return transformedData;
  }

  Alias(nodeData: PG13.Alias, context?: TransformerContext): any {
    const transformedData: any = {};
    
    for (const [key, value] of Object.entries(nodeData)) {
      if (Array.isArray(value)) {
        transformedData[key] = value.map(item => this.transform(item, context));
      } else if (value && typeof value === 'object') {
        transformedData[key] = this.transform(value, context);
      } else {
        transformedData[key] = value;
      }
    }
    
    return transformedData;
  }

  FunctionParameter(nodeData: PG13.FunctionParameter, context?: TransformerContext): any {
    const transformedData: any = {};
    
    for (const [key, value] of Object.entries(nodeData)) {
      if (Array.isArray(value)) {
        transformedData[key] = value.map(item => this.transform(item, context));
      } else if (value && typeof value === 'object') {
        transformedData[key] = this.transform(value, context);
      } else {
        transformedData[key] = value;
      }
    }
    
    if ('mode' in nodeData && nodeData.mode === 'FUNC_PARAM_IN') {
      transformedData.mode = 'FUNC_PARAM_DEFAULT';
    }
    
    return transformedData;
  }

  DeclareCursorStmt(nodeData: PG13.DeclareCursorStmt, context?: TransformerContext): any {
    const transformedData: any = {};
    
    for (const [key, value] of Object.entries(nodeData)) {
      if (key === 'options') {
        if (value === 32) {
          transformedData[key] = 256;
        } else {
          transformedData[key] = value;
        }
      } else if (Array.isArray(value)) {
        transformedData[key] = value.map(item => this.transform(item, context));
      } else if (value && typeof value === 'object') {
        transformedData[key] = this.transform(value, context);
      } else {
        transformedData[key] = value;
      }
    }
    
    return transformedData;
  }

  ObjectWithArgs(nodeData: PG13.ObjectWithArgs, context?: TransformerContext): any {
    const transformedData: any = {};
    
    for (const [key, value] of Object.entries(nodeData)) {
      if (Array.isArray(value)) {
        transformedData[key] = value.map(item => this.transform(item, context));
      } else if (value && typeof value === 'object') {
        transformedData[key] = this.transform(value, context);
      } else {
        transformedData[key] = value;
      }
    }
    
    if (transformedData.objargs && Array.isArray(transformedData.objargs) && transformedData.objname) {
      const hasTypeNameArgs = transformedData.objargs.some((arg: any) => 
        arg && typeof arg === 'object' && arg.TypeName
      );
      
      if (hasTypeNameArgs) {
        const isFunction = context?.removeType === 'OBJECT_FUNCTION' || 
                          context?.removeType === 'OBJECT_PROCEDURE' ||
                          context?.removeType === 'OBJECT_AGGREGATE' ||
                          context?.statementType === 'AlterFunctionStmt' ||
                          context?.statementType === 'CreateCastStmt' ||
                          context?.isFunction ||
                          (context?.objtype && context.objtype !== 'OBJECT_OPERATOR');
        
        if (isFunction) {
          transformedData.objfuncargs = transformedData.objargs.map((arg: any) => {
            if (arg && typeof arg === 'object' && arg.TypeName) {
              return {
                FunctionParameter: {
                  argType: arg.TypeName,
                  mode: "FUNC_PARAM_DEFAULT"
                }
              };
            }
            return arg;
          });
        }
      }
    }
    
    return transformedData;
  }

  AlterFunctionStmt(nodeData: PG13.AlterFunctionStmt, context?: TransformerContext): any {
    const transformedData: any = {};
    
    for (const [key, value] of Object.entries(nodeData)) {
      if (Array.isArray(value)) {
        transformedData[key] = value.map(item => this.transform(item, context));
      } else if (value && typeof value === 'object') {
        transformedData[key] = this.transform(value, context);
      } else {
        transformedData[key] = value;
      }
    }
    
    return transformedData;
  }

  DropStmt(nodeData: PG13.DropStmt, context?: TransformerContext): any {
    const transformedData: any = {};
    
    for (const [key, value] of Object.entries(nodeData)) {
      if (key === 'objects' && Array.isArray(value)) {
        const dropContext = { ...context, removeType: nodeData.removeType };
        transformedData[key] = value.map(item => this.transform(item, dropContext));
      } else if (Array.isArray(value)) {
        transformedData[key] = value.map(item => this.transform(item, context));
      } else if (value && typeof value === 'object') {
        transformedData[key] = this.transform(value, context);
      } else {
        transformedData[key] = value;
      }
    }
    
    return transformedData;
  }

  CommentStmt(nodeData: PG13.CommentStmt, context?: TransformerContext): any {
    const transformedData: any = {};
    
    for (const [key, value] of Object.entries(nodeData)) {
      if (key === 'object' && value && typeof value === 'object') {
        const commentContext = { ...context, objtype: nodeData.objtype };
        transformedData[key] = this.transform(value, commentContext);
      } else if (Array.isArray(value)) {
        transformedData[key] = value.map(item => this.transform(item, context));
      } else if (value && typeof value === 'object') {
        transformedData[key] = this.transform(value, context);
      } else {
        transformedData[key] = value;
      }
    }
    
    return transformedData;
  }

  CreateCastStmt(nodeData: PG13.CreateCastStmt, context?: TransformerContext): any {
    const transformedData: any = {};
    
    for (const [key, value] of Object.entries(nodeData)) {
      if (key === 'func' && value && typeof value === 'object') {
        const funcContext = { ...context, statementType: 'CreateCastStmt', isFunction: true };
        transformedData[key] = this.ObjectWithArgs(value, funcContext);
      } else if (Array.isArray(value)) {
        transformedData[key] = value.map(item => this.transform(item, context));
      } else if (value && typeof value === 'object') {
        transformedData[key] = this.transform(value, context);
      } else {
        transformedData[key] = value;
      }
    }
    
    return transformedData;
  }

  GrantStmt(nodeData: PG13.GrantStmt, context?: TransformerContext): any {
    const transformedData: any = {};
    
    for (const [key, value] of Object.entries(nodeData)) {
      if (key === 'objects' && Array.isArray(value)) {
        const grantContext = { ...context, statementType: 'GrantStmt', objtype: nodeData.objtype };
        transformedData[key] = value.map(item => this.transform(item, grantContext));
      } else if (Array.isArray(value)) {
        transformedData[key] = value.map(item => this.transform(item, context));
      } else if (value && typeof value === 'object') {
        transformedData[key] = this.transform(value, context);
      } else {
        transformedData[key] = value;
      }
    }
    
    return transformedData;
  }



  protected transformDefault(node: any, nodeType: string, nodeData: any, context?: TransformerContext): any {
    const result = super.transformDefault(node, nodeType, nodeData, context);
    const transformedData = result[nodeType];
    
    if (nodeType === 'AlterTableStmt' && transformedData && 'relkind' in transformedData) {
      transformedData.objtype = transformedData.relkind;
      delete transformedData.relkind;
    }
    
    if (nodeType === 'CreateTableAsStmt' && transformedData && 'relkind' in transformedData) {
      transformedData.objtype = transformedData.relkind;
      delete transformedData.relkind;
    }
    
    return { [nodeType]: transformedData };
  }



  private ensureTypeNameFields(obj: any): void {
    if (!obj || typeof obj !== 'object') return;
    
    if (obj.typeName && typeof obj.typeName === 'object') {
      if (!('location' in obj.typeName)) {
        obj.typeName.location = undefined;
      }
      if (!('typemod' in obj.typeName)) {
        obj.typeName.typemod = -1;
      }
    }
    
    if (Array.isArray(obj)) {
      obj.forEach(item => this.ensureTypeNameFields(item));
    } else {
      Object.values(obj).forEach(value => {
        if (value && typeof value === 'object') {
          this.ensureTypeNameFields(value);
        }
      });
    }
  }
}
