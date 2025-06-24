import { BaseTransformer, TransformerContext } from '../visitors/base';
import { Node as PG13Node } from '../13/types';
import { Node as PG14Node } from '../14/types';

export class V13ToV14Transformer extends BaseTransformer {
  transform(node: any, context?: TransformerContext): any {
    if (node && typeof node === 'object' && 'version' in node && 'stmts' in node) {
      return {
        version: 140004, // PG14 version
        stmts: node.stmts.map((stmt: any) => super.transform(stmt, context))
      };
    }
    
    return super.transform(node, context);
  }
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
        if (intVal === 0) {
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
    
    return transformedData;
  }

  SelectStmt(node: any, context?: TransformerContext): any {
    const transformedData: any = { ...node };
    
    if (!('limitOption' in transformedData)) {
      transformedData.limitOption = "LIMIT_OPTION_DEFAULT";
    }
    if (!('op' in transformedData)) {
      transformedData.op = "SETOP_NONE";
    }
    
    for (const [key, value] of Object.entries(node)) {
      if (key === 'limitOption' || key === 'op') {
        continue;
      } else if (key === 'withClause' && value && typeof value === 'object') {
        transformedData[key] = { ...value };
        if (transformedData[key].ctes && Array.isArray(transformedData[key].ctes)) {
          transformedData[key].ctes = transformedData[key].ctes.map((cte: any) => this.transform(cte, context));
        }
      } else if (key === 'larg' || key === 'rarg') {
        if (value && typeof value === 'object') {
          transformedData[key] = this.SelectStmt(value, context);
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

  TypeName(node: any, context?: TransformerContext): any {
    const transformedData: any = { ...node };
    
    if (!('location' in transformedData)) {
      transformedData.location = undefined;
    }
    if (!('typemod' in transformedData)) {
      transformedData.typemod = -1;
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
    
    if (transformedData && typeof transformedData === 'object') {
      this.ensureTypeNameFields(transformedData);
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
