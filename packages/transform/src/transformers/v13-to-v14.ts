import { BaseTransformer, TransformerContext } from '../visitors/base';
import { Node as PG13Node } from '../13/types';
import { Node as PG14Node } from '../14/types';
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
    
    const result = super.transform(node, context);
    
    return this.cleanTypeNameFields(result);
  }

  private cleanTypeNameFields(node: any): any {
    if (!node || typeof node !== 'object') {
      return node;
    }

    if (Array.isArray(node)) {
      return node.map(item => this.cleanTypeNameFields(item));
    }

    if (node.TypeName && typeof node.TypeName === 'object') {
      const cleanedTypeName = { ...node.TypeName };
      delete cleanedTypeName.location;
      delete cleanedTypeName.typemod;
      return { TypeName: this.cleanTypeNameFields(cleanedTypeName) };
    }

    const result: any = {};
    for (const [key, value] of Object.entries(node)) {
      result[key] = this.cleanTypeNameFields(value);
    }
    
    return result;
  }

  A_Const(nodeData: any, context?: TransformerContext): any {
    const transformedData: any = { ...nodeData };
    
    if (nodeData.ival !== undefined) {
      if (typeof nodeData.ival === 'object' && nodeData.ival.ival !== undefined) {
        transformedData.val = { Integer: { ival: nodeData.ival.ival } };
      } else if (nodeData.ival === 0 || (typeof nodeData.ival === 'object' && Object.keys(nodeData.ival).length === 0)) {
        transformedData.val = { Integer: { ival: -1 } };
      } else {
        transformedData.val = { Integer: { ival: nodeData.ival } };
      }
      delete transformedData.ival;
    } else if (nodeData.fval !== undefined) {
      const fvalStr = typeof nodeData.fval === 'object' ? nodeData.fval.fval : nodeData.fval;
      transformedData.val = { Float: { str: fvalStr } };
      delete transformedData.fval;
    } else if (nodeData.sval !== undefined) {
      const svalStr = typeof nodeData.sval === 'object' ? nodeData.sval.sval : nodeData.sval;
      transformedData.val = { String: { str: svalStr } };
      delete transformedData.sval;
    } else if (nodeData.bsval !== undefined) {
      const bsvalStr = typeof nodeData.bsval === 'object' ? nodeData.bsval.bsval : nodeData.bsval;
      transformedData.val = { BitString: { str: bsvalStr } };
      delete transformedData.bsval;
    } else if (nodeData.boolval !== undefined) {
      transformedData.val = { Boolean: { boolval: nodeData.boolval } };
      delete transformedData.boolval;
    }
    
    if (nodeData.val && nodeData.val.Integer && Object.keys(nodeData.val.Integer).length === 0) {
      transformedData.val = { Integer: { ival: -1 } };
    }
    
    return transformedData;
  }

  FuncCall(nodeData: any, context?: TransformerContext): any {
    const transformedData: any = { ...nodeData };
    
    if (transformedData.funcname && Array.isArray(transformedData.funcname)) {
      transformedData.funcname = transformedData.funcname.map((item: any) => this.transform(item, context));
    }
    
    if (transformedData.args && Array.isArray(transformedData.args)) {
      transformedData.args = transformedData.args.map((item: any) => this.transform(item, context));
    }
    
    if (transformedData.over && typeof transformedData.over === 'object') {
      transformedData.over = this.transform(transformedData.over, context);
    }
    
    if (!('funcformat' in transformedData)) {
      transformedData.funcformat = "COERCE_EXPLICIT_CALL";
    }
    
    return transformedData;
  }

  FunctionParameter(nodeData: any, context?: TransformerContext): any {
    const transformedData: any = { ...nodeData };
    
    if (transformedData.mode === "FUNC_PARAM_IN") {
      transformedData.mode = "FUNC_PARAM_DEFAULT";
    }
    
    if (transformedData.argType && typeof transformedData.argType === 'object') {
      transformedData.argType = this.transform(transformedData.argType, context);
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
    
    if (transformedData.sortClause && Array.isArray(transformedData.sortClause)) {
      transformedData.sortClause = transformedData.sortClause.map((item: any) => this.transform(item, context));
    }
    
    if (transformedData.limitClause && typeof transformedData.limitClause === 'object') {
      transformedData.limitClause = this.transform(transformedData.limitClause, context);
    }
    
    if (transformedData.valuesLists && Array.isArray(transformedData.valuesLists)) {
      transformedData.valuesLists = transformedData.valuesLists.map((item: any) => this.transform(item, context));
    }
    
    return transformedData;
  }



  TypeCast(nodeData: any, context?: TransformerContext): any {
    const transformedData: any = { ...nodeData };
    
    if (transformedData.typeName && typeof transformedData.typeName === 'object') {
      transformedData.typeName = this.transform(transformedData.typeName, context);
    }
    
    if (transformedData.arg && typeof transformedData.arg === 'object') {
      transformedData.arg = this.transform(transformedData.arg, context);
    }
    
    return transformedData;
  }

  ColumnDef(nodeData: any, context?: TransformerContext): any {
    const transformedData: any = { ...nodeData };
    
    if (transformedData.typeName && typeof transformedData.typeName === 'object') {
      transformedData.typeName = this.transform(transformedData.typeName, context);
    }
    
    if (transformedData.constraints && Array.isArray(transformedData.constraints)) {
      transformedData.constraints = transformedData.constraints.map((constraint: any) => this.transform(constraint, context));
    }
    
    return transformedData;
  }

  Constraint(nodeData: any, context?: TransformerContext): any {
    const transformedData: any = { ...nodeData };
    
    if (transformedData.pktable && typeof transformedData.pktable === 'object') {
      transformedData.pktable = this.transform(transformedData.pktable, context);
      if (!('inh' in transformedData.pktable)) {
        transformedData.pktable.inh = true;
      }
    }
    
    return transformedData;
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
    
    
    if (nodeType === 'RangeVar') {
      if (!('location' in result)) {
        result.location = undefined;
      }
      if (!('relpersistence' in result)) {
        result.relpersistence = 'p';
      }
      if (!('inh' in result)) {
        result.inh = true;
      }
    }

    if (result.relation && typeof result.relation === 'object') {
      if (!('location' in result.relation)) {
        result.relation.location = undefined;
      }
      if (!('relpersistence' in result.relation)) {
        result.relation.relpersistence = 'p';
      }
      if (!('inh' in result.relation)) {
        result.relation.inh = true;
      }
    }
    
    if ((nodeType === 'AlterTableStmt' || nodeType === 'CreateTableAsStmt') && result && 'relkind' in result) {
      result.objtype = result.relkind;
      delete result.relkind;
    }
    
    if (nodeType === 'CreateTableAsStmt' && result && result.into && !('onCommit' in result.into)) {
      result.into.onCommit = "ONCOMMIT_NOOP";
    }
    
    if (result && typeof result === 'object') {
      this.applyRuntimeSchemaDefaults(nodeType, result);
    }
    
    return { [nodeType]: result };
  }



  private ensureTypeNameFields(obj: any): void {
    return;
  }

  protected ensureTypeNameFieldsRecursively(obj: any): void {
    return;
  }

  private isFieldWrapped(nodeType: string, fieldName: string, version: 13 | 14): boolean {
    const schema = version === 13 ? pg13RuntimeSchema.runtimeSchema : pg14RuntimeSchema.runtimeSchema;
    const nodeSpec = schema.find(spec => spec.name === nodeType);
    if (!nodeSpec) return false;
    
    const fieldSpec = nodeSpec.fields.find(field => field.name === fieldName);
    if (!fieldSpec) return false;
    
    return fieldSpec.type === 'Node';
  }

  private getFieldType(nodeType: string, fieldName: string, version: 13 | 14): string | null {
    const schema = version === 13 ? pg13RuntimeSchema.runtimeSchema : pg14RuntimeSchema.runtimeSchema;
    const nodeSpec = schema.find(spec => spec.name === nodeType);
    if (!nodeSpec) return null;
    
    const fieldSpec = nodeSpec.fields.find(field => field.name === fieldName);
    return fieldSpec ? fieldSpec.type : null;
  }

  CreateFunctionStmt(nodeData: any, context?: TransformerContext): any {
    const transformedData: any = { ...nodeData };
    
    if (transformedData.returnType && typeof transformedData.returnType === 'object') {
      transformedData.returnType = this.transform(transformedData.returnType, context);
    }
    
    if (transformedData.parameters && Array.isArray(transformedData.parameters)) {
      transformedData.parameters = transformedData.parameters.map((param: any) => this.transform(param, context));
    }
    
    return transformedData;
  }

  DefElem(nodeData: any, context?: TransformerContext): any {
    const transformedData: any = { ...nodeData };
    
    if (transformedData.arg && typeof transformedData.arg === 'object') {
      transformedData.arg = this.transform(transformedData.arg, context);
    }
    
    return transformedData;
  }

  TypeName(nodeData: any, context?: TransformerContext): any {
    const transformedData: any = { ...nodeData };
    
    if (transformedData.names && Array.isArray(transformedData.names)) {
      transformedData.names = transformedData.names.map((name: any) => this.transform(name, context));
    }
    
    delete transformedData.location;
    delete transformedData.typemod;
    
    return transformedData;
  }

  private applyRuntimeSchemaDefaults(nodeType: string, nodeData: any): void {
  }

  protected ensureCriticalFields(nodeData: any, nodeType: string): void {
    if (!nodeData || typeof nodeData !== 'object') return;

    if (nodeType === 'TypeName') {
      return;
    }
    
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

  }
}
