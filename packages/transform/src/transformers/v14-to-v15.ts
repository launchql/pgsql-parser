import * as PG14 from '../14/types';
import { TransformerContext } from './context';

/**
 * V14 to V15 AST Transformer
 * Transforms PostgreSQL v14 AST nodes to v15 format
 */
export class V14ToV15Transformer {
  
  transform(node: PG14.Node, context: TransformerContext = { parentNodeTypes: [] }): any {
    if (node == null) {
      return null;
    }

    if (typeof node === 'number' || node instanceof Number) {
      return node;
    }

    if (typeof node === 'string') {
      return node;
    }

    try {
      return this.visit(node, context);
    } catch (error) {
      const nodeType = Object.keys(node)[0];
      throw new Error(`Error transforming ${nodeType}: ${(error as Error).message}`);
    }
  }

  visit(node: PG14.Node, context: TransformerContext = { parentNodeTypes: [] }): any {
    const nodeType = this.getNodeType(node);
    
    // Handle empty objects
    if (!nodeType) {
      return {};
    }
    
    const nodeData = this.getNodeData(node);

    const methodName = nodeType as keyof this;
    if (typeof this[methodName] === 'function') {
      const childContext: TransformerContext = {
        ...context,
        parentNodeTypes: [...context.parentNodeTypes, nodeType]
      };
      const result = (this[methodName] as any)(nodeData, childContext);
      
      return result;
    }
    
    // If no specific method, use transformGenericNode to handle nested transformations
    return this.transformGenericNode(node, context);
  }

  getNodeType(node: PG14.Node): any {
    return Object.keys(node)[0];
  }

  getNodeData(node: PG14.Node): any {
    const keys = Object.keys(node);
    if (keys.length === 1 && typeof (node as any)[keys[0]] === 'object') {
      return (node as any)[keys[0]];
    }
    return node;
  }

  private transformGenericNode(node: any, context: TransformerContext): any {
    if (typeof node !== 'object' || node === null) return node;
    if (Array.isArray(node)) return node.map(item => this.transform(item, context));

    const keys = Object.keys(node);
    if (keys.length === 1 && typeof node[keys[0]] === 'object' && node[keys[0]] !== null && !Array.isArray(node[keys[0]])) {
      const nodeType = keys[0];
      const nodeData = node[keys[0]];

      const transformedData: any = {};
      for (const [key, value] of Object.entries(nodeData)) {
        if (Array.isArray(value)) {
          if (key === 'arrayBounds') {
            transformedData[key] = value.map(item => {
              // In PG15, -1 values in arrayBounds are represented as empty Integer objects
              if (item && typeof item === 'object' && 'Integer' in item && 
                  item.Integer && item.Integer.ival === -1) {
                return { Integer: {} };
              }
              return this.transform(item as any, context);
            });
          } else {
            transformedData[key] = value.map(item => this.transform(item as any, context));
          }
        }else if (typeof value === 'object' && value !== null) {
          const keys = Object.keys(value);
          const isNumericKeysObject = keys.every(k => /^\d+$/.test(k));
          
          if (isNumericKeysObject && keys.length > 0) {
            const sortedKeys = keys.sort((a, b) => parseInt(a) - parseInt(b));
            transformedData[key] = sortedKeys.map(k => this.transform((value as any)[k], context));
          } else {
            // Regular object transformation
            transformedData[key] = this.transform(value as any, context);
          }
        } else {
          transformedData[key] = value;
        }
      }

      return { [nodeType]: transformedData };
    }

    const result: any = {};
    for (const [key, value] of Object.entries(node)) {
      if (Array.isArray(value)) {
        if (key === 'arrayBounds') {
          result[key] = value.map(item => {
            // In PG15, -1 values in arrayBounds are represented as empty Integer objects
            if (item && typeof item === 'object' && 'Integer' in item && 
                item.Integer && item.Integer.ival === -1) {
              return { Integer: {} };
            }
            return this.transform(item as any, context);
          });
        } else {
          result[key] = value.map(item => this.transform(item as any, context));
        }
      }else if (typeof value === 'object' && value !== null) {
        const keys = Object.keys(value);
        const isNumericKeysObject = keys.every(k => /^\d+$/.test(k));
        
        if (isNumericKeysObject && keys.length > 0) {
          const sortedKeys = keys.sort((a, b) => parseInt(a) - parseInt(b));
          result[key] = sortedKeys.map(k => this.transform((value as any)[k], context));
        } else {
          // Regular object transformation
          result[key] = this.transform(value as any, context);
        }
      } else {
        result[key] = value;
      }
    }
    return result;
  }

  ParseResult(node: PG14.ParseResult, context: TransformerContext): any {
    
    if (node && typeof node === 'object' && 'version' in node && 'stmts' in node) {
      return {
        version: 150000, // PG15 version
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

    return node;
  }

  RawStmt(node: PG14.RawStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { RawStmt: result };
  }

  SelectStmt(node: PG14.SelectStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { SelectStmt: result };
  }

  A_Expr(node: PG14.A_Expr, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { A_Expr: result };
  }

  InsertStmt(node: PG14.InsertStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { InsertStmt: result };
  }

  UpdateStmt(node: PG14.UpdateStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { UpdateStmt: result };
  }

  DeleteStmt(node: PG14.DeleteStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { DeleteStmt: result };
  }

  WithClause(node: PG14.WithClause, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { WithClause: result };
  }

  ResTarget(node: PG14.ResTarget, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { ResTarget: result };
  }

  BoolExpr(node: PG14.BoolExpr, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { BoolExpr: result };
  }

  FuncCall(node: PG14.FuncCall, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { FuncCall: result };
  }

  FuncExpr(node: PG14.FuncExpr, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { FuncExpr: result };
  }

  A_Const(node: PG14.A_Const, context: TransformerContext): any {
    const result: any = {};
    
    for (const [key, value] of Object.entries(node)) {
      result[key] = value;
    }
    
    if (result.val) {
      const val: any = result.val;
      if (val.String && val.String.str !== undefined) {
        result.sval = { sval: val.String.str };
        delete result.val;
      } else if (val.Integer !== undefined) {
        if (val.Integer.ival !== undefined) {
          // In PG15, certain integer values in A_Const are converted to empty objects
          if (val.Integer.ival <= 0) {
            result.ival = {};
          } else {
            result.ival = { ival: val.Integer.ival };
          }
        } else {
          result.ival = {};
        }
        delete result.val;
      } else if (val.Float && val.Float.str !== undefined) {
        result.fval = { fval: val.Float.str };
        delete result.val;
      } else if (val.BitString && val.BitString.str !== undefined) {
        result.bsval = { bsval: val.BitString.str };
        delete result.val;
      } else if (val.Null !== undefined) {
        result.isnull = true;
        delete result.val;
      }
    }
    
    
    // Handle ival field directly (not nested in val) - removed overly broad conversion
    
    return { A_Const: result };
  }

  ColumnRef(node: PG14.ColumnRef, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { ColumnRef: result };
  }

  TypeName(node: PG14.TypeName, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { TypeName: result };
  }

  Alias(node: PG14.Alias, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { Alias: result };
  }

  RangeVar(node: PG14.RangeVar, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { RangeVar: result };
  }

  A_ArrayExpr(node: PG14.A_ArrayExpr, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { A_ArrayExpr: result };
  }

  A_Indices(node: PG14.A_Indices, context: TransformerContext): any {
    const result: any = {};
    
    if (node.is_slice !== undefined) {
      result.is_slice = node.is_slice;
    }
    
    if (node.lidx !== undefined) {
      result.lidx = this.transform(node.lidx as any, context);
    }
    
    if (node.uidx !== undefined) {
      const childContext = {
        ...context,
        parentNodeTypes: [...(context.parentNodeTypes || []), 'A_Indices']
      };
      result.uidx = this.transform(node.uidx as any, childContext);
    }
    
    return { A_Indices: result };
  }

  A_Indirection(node: PG14.A_Indirection, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { A_Indirection: result };
  }

  A_Star(node: PG14.A_Star, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { A_Star: result };
  }

  CaseExpr(node: PG14.CaseExpr, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { CaseExpr: result };
  }

  CoalesceExpr(node: PG14.CoalesceExpr, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { CoalesceExpr: result };
  }

  TypeCast(node: PG14.TypeCast, context: TransformerContext): any {
    if (node.location === -1 && node.typeName && node.typeName.names) {
      
      const typeNames = node.typeName.names.map(name => {
        if (name && typeof name === 'object' && 'String' in name) {
          const stringVal = name.String;
          return (stringVal as any).sval || (stringVal as any).str;
        }
        return null;
      }).filter(Boolean);
      
      const hasPgCatalog = typeNames.includes('pg_catalog');
      const hasBool = typeNames.includes('bool');
      
      if (hasPgCatalog && hasBool && node.arg) {
        const arg = node.arg as any;
        if (arg.A_Const) {
          let stringValue = null;
          
          // Handle both sval and val.String formats
          if (arg.A_Const.sval && arg.A_Const.sval.sval) {
            stringValue = arg.A_Const.sval.sval;
          } else if (arg.A_Const.val && arg.A_Const.val.String) {
            if (arg.A_Const.val.String.sval) {
              stringValue = arg.A_Const.val.String.sval;
            } else if (arg.A_Const.val.String.str) {
              stringValue = arg.A_Const.val.String.str;
            }
          }
          
          if (stringValue === 't' || stringValue === 'true') {
            return {
              A_Const: {
                boolval: { boolval: true },
                location: arg.A_Const.location
              }
            };
          } else if (stringValue === 'f' || stringValue === 'false') {
            return {
              A_Const: {
                boolval: {},
                location: arg.A_Const.location
              }
            };
          }
        }
      }
    }

    const result = this.transformGenericNode(node, context);
    return { TypeCast: result };
  }

  CollateClause(node: PG14.CollateClause, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { CollateClause: result };
  }

  BooleanTest(node: PG14.BooleanTest, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { BooleanTest: result };
  }

  NullTest(node: PG14.NullTest, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { NullTest: result };
  }

  String(node: PG14.String, context: TransformerContext): any {
    const result: any = { ...node };
    
    if (result.str !== undefined) {
      result.sval = result.str;
      delete result.str;
    }
    
    return { String: result };
  }
  
  Integer(node: PG14.Integer, context: TransformerContext): any {
    const isInDefElemContext = context.parentNodeTypes?.includes('DefElem');
    if (isInDefElemContext && node.ival !== undefined) {
      const defElemName = (context as any).defElemName;
      
      // CreateRoleStmt: specific role attributes should become Boolean
      if (defElemName && ['createrole', 'superuser', 'canlogin', 'createdb', 'inherit', 'bypassrls', 'isreplication'].includes(defElemName) && 
          (node.ival === 0 || node.ival === 1)) {
        return {
          Boolean: {
            boolval: node.ival === 1
          }
        };
      }
      
      // CreateExtensionStmt: cascade should become Boolean
      if (context.parentNodeTypes?.includes('CreateExtensionStmt') && defElemName) {
        if (defElemName === 'cascade' && (node.ival === 0 || node.ival === 1)) {
          return {
            Boolean: {
              boolval: node.ival === 1
            }
          };
        }
      }
      
      
      // CreateFunctionStmt: window should become Boolean
      if (context.parentNodeTypes?.includes('CreateFunctionStmt') && defElemName) {
        if (defElemName === 'window' && (node.ival === 0 || node.ival === 1)) {
          return {
            Boolean: {
              boolval: node.ival === 1
            }
          };
        }
      }
      
      if (['strict', 'security', 'leakproof', 'cycle'].includes(defElemName) && (node.ival === 0 || node.ival === 1)) {
        return {
          Boolean: {
            boolval: node.ival === 1
          }
        };
      }
      
    }
    
    // AlterTableCmd context: SET STATISTICS with ival 0 or -1 -> empty Integer
    if (context.parentNodeTypes?.includes('AlterTableCmd') && (node.ival === 0 || node.ival === -1)) {
      return { Integer: {} };
    }
    
    // DefineStmt context: specific cases where ival should become empty Integer
    if (context.parentNodeTypes?.includes('DefineStmt')) {
      const defElemName = (context as any).defElemName;
      
      if (defElemName === 'initcond' && (node.ival === 0 || node.ival === -100)) {
        return { Integer: {} };
      }
      
      if (defElemName === 'sspace' && node.ival === 0) {
        return { Integer: {} };
      }
      
      if (node.ival === -1 && !defElemName) {
        return { Integer: {} };
      }
      
      // DefineStmt args context: ival 0 should become empty Integer for aggregates
      if (!defElemName && node.ival === 0) {
        return { Integer: {} };
      }
    }
    
    // CreateSeqStmt context: specific cases where ival should become empty Integer
    if (context.parentNodeTypes?.includes('CreateSeqStmt')) {
      const defElemName = (context as any).defElemName;
      
      if (defElemName === 'start' && node.ival === 0) {
        return { Integer: {} };
      }
      
      if (defElemName === 'minvalue' && node.ival === 0) {
        return { Integer: {} };
      }
      
      if (defElemName === 'increment' && node.ival === -1) {
        return { Integer: {} };
      }
    }
    
    const result: any = { ...node };
    return { Integer: result };
  }
  
  Float(node: PG14.Float, context: TransformerContext): any {
    const result: any = { ...node };
    
    if (result.str !== undefined) {
      result.fval = result.str;
      delete result.str;
    }
    
    return { Float: result };
  }
    
  BitString(node: PG14.BitString, context: TransformerContext): any {
    const result: any = { ...node };
    
    if (result.str !== undefined) {
      result.bsval = result.str;
      delete result.str;
    }
    
    return { BitString: result };
  }
  
  Null(node: PG14.Node, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { Null: result };
  }

  List(node: PG14.List, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { List: result };
  }

  CreateStmt(node: PG14.CreateStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { CreateStmt: result };
  }

  ColumnDef(node: PG14.ColumnDef, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { ColumnDef: result };
  }

  Constraint(node: PG14.Constraint, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { Constraint: result };
  }

  SubLink(node: PG14.SubLink, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { SubLink: result };
  }

  CaseWhen(node: PG14.CaseWhen, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { CaseWhen: result };
  }

  WindowDef(node: PG14.WindowDef, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { WindowDef: result };
  }

  SortBy(node: PG14.SortBy, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { SortBy: result };
  }

  GroupingSet(node: PG14.GroupingSet, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { GroupingSet: result };
  }

  CommonTableExpr(node: PG14.CommonTableExpr, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { CommonTableExpr: result };
  }

  ParamRef(node: PG14.ParamRef, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { ParamRef: result };
  }

  LockingClause(node: any, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { LockingClause: result };
  }

  MinMaxExpr(node: PG14.MinMaxExpr, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { MinMaxExpr: result };
  }

  RowExpr(node: PG14.RowExpr, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { RowExpr: result };
  }

  OpExpr(node: PG14.OpExpr, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { OpExpr: result };
  }

  DistinctExpr(node: PG14.DistinctExpr, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { DistinctExpr: result };
  }

  NullIfExpr(node: PG14.NullIfExpr, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { NullIfExpr: result };
  }

  ScalarArrayOpExpr(node: PG14.ScalarArrayOpExpr, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { ScalarArrayOpExpr: result };
  }

  Aggref(node: PG14.Aggref, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { Aggref: result };
  }

  WindowFunc(node: PG14.WindowFunc, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { WindowFunc: result };
  }

  FieldSelect(node: PG14.FieldSelect, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { FieldSelect: result };
  }

  RelabelType(node: PG14.RelabelType, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { RelabelType: result };
  }

  CoerceViaIO(node: PG14.CoerceViaIO, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { CoerceViaIO: result };
  }

  ArrayCoerceExpr(node: PG14.ArrayCoerceExpr, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { ArrayCoerceExpr: result };
  }

  ConvertRowtypeExpr(node: PG14.ConvertRowtypeExpr, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { ConvertRowtypeExpr: result };
  }

  NamedArgExpr(node: PG14.NamedArgExpr, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { NamedArgExpr: result };
  }

  ViewStmt(node: PG14.ViewStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { ViewStmt: result };
  }

  IndexStmt(node: PG14.IndexStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { IndexStmt: result };
  }

  IndexElem(node: PG14.IndexElem, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { IndexElem: result };
  }

  PartitionElem(node: PG14.PartitionElem, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { PartitionElem: result };
  }

  PartitionCmd(node: PG14.PartitionCmd, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { PartitionCmd: result };
  }

  JoinExpr(node: PG14.JoinExpr, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { JoinExpr: result };
  }

  FromExpr(node: PG14.FromExpr, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { FromExpr: result };
  }

  TransactionStmt(node: PG14.TransactionStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { TransactionStmt: result };
  }

  VariableSetStmt(node: PG14.VariableSetStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { VariableSetStmt: result };
  }

  VariableShowStmt(node: PG14.VariableShowStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { VariableShowStmt: result };
  }

  CreateSchemaStmt(node: PG14.CreateSchemaStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { CreateSchemaStmt: result };
  }

  RoleSpec(node: PG14.RoleSpec, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { RoleSpec: result };
  }

  DropStmt(node: PG14.DropStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { DropStmt: result };
  }

  TruncateStmt(node: PG14.TruncateStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { TruncateStmt: result };
  }

  ReturnStmt(node: PG14.ReturnStmt, context: TransformerContext): any {
    const result: any = {};

    if (node.returnval !== undefined) {
      result.returnval = this.transform(node.returnval as any, context);
    }

    return { ReturnStmt: result };
  }

  PLAssignStmt(node: PG14.PLAssignStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { PLAssignStmt: result };
  }

  CopyStmt(node: PG14.CopyStmt, context: TransformerContext): any {
    const result: any = {};

    if (node.relation !== undefined) {
      result.relation = this.transform(node.relation as any, context);
    }

    if (node.query !== undefined) {
      result.query = this.transform(node.query as any, context);
    }

    if (node.attlist !== undefined) {
      result.attlist = Array.isArray(node.attlist)
        ? node.attlist.map(item => this.transform(item as any, context))
        : this.transform(node.attlist as any, context);
    }

    if (node.is_from !== undefined) {
      result.is_from = node.is_from;
    }

    if (node.is_program !== undefined) {
      result.is_program = node.is_program;
    }

    if (node.filename !== undefined) {
      result.filename = node.filename;
    }

    if (node.options !== undefined) {
      result.options = Array.isArray(node.options)
        ? node.options.map(item => this.transform(item as any, context))
        : this.transform(node.options as any, context);
    }

    if (node.whereClause !== undefined) {
      result.whereClause = this.transform(node.whereClause as any, context);
    }

    return { CopyStmt: result };
  }

  AlterTableStmt(node: PG14.AlterTableStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { AlterTableStmt: result };
  }

  AlterTableCmd(node: PG14.AlterTableCmd, context: TransformerContext): any {
    const result: any = {};

    if (node.subtype !== undefined) {
      result.subtype = node.subtype;
    }

    if (node.name !== undefined) {
      result.name = node.name;
    }

    if (node.newowner !== undefined) {
      result.newowner = this.transform(node.newowner as any, context);
    }

    if (node.def !== undefined) {
      result.def = this.transform(node.def as any, context);
    }

    if (node.behavior !== undefined) {
      result.behavior = node.behavior;
    }

    if (node.missing_ok !== undefined) {
      result.missing_ok = node.missing_ok;
    }

    return { AlterTableCmd: result };
  }

  CreateFunctionStmt(node: PG14.CreateFunctionStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { CreateFunctionStmt: result };
  }

  FunctionParameter(node: PG14.FunctionParameter, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { FunctionParameter: result };
  }

  CompositeTypeStmt(node: PG14.CompositeTypeStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { CompositeTypeStmt: result };
  }

  CreateEnumStmt(node: PG14.CreateEnumStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { CreateEnumStmt: result };
  }

  CreateDomainStmt(node: PG14.CreateDomainStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { CreateDomainStmt: result };
  }

  CreateRoleStmt(node: PG14.CreateRoleStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { CreateRoleStmt: result };
  }

  DefElem(node: PG14.DefElem, context: TransformerContext): any {
    const result: any = {};

    if (node.defnamespace !== undefined) {
      result.defnamespace = node.defnamespace;
    }

    if (node.defname !== undefined) {
      result.defname = node.defname;
    }

    if (node.arg !== undefined) {
      const argContext = {
        ...context,
        defElemName: node.defname,
        parentNodeTypes: [...(context.parentNodeTypes || []), 'DefElem']
      };
      result.arg = this.transform(node.arg as any, argContext);
    }

    if (node.defaction !== undefined) {
      result.defaction = node.defaction;
    }

    if (node.location !== undefined) {
      result.location = node.location;
    }

    return { DefElem: result };
  }


  CreateTableSpaceStmt(node: PG14.CreateTableSpaceStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { CreateTableSpaceStmt: result };
  }

  DropTableSpaceStmt(node: PG14.DropTableSpaceStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { DropTableSpaceStmt: result };
  }

  AlterTableSpaceOptionsStmt(node: PG14.AlterTableSpaceOptionsStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { AlterTableSpaceOptionsStmt: result };
  }

  CreateExtensionStmt(node: PG14.CreateExtensionStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { CreateExtensionStmt: result };
  }

  AlterExtensionStmt(node: PG14.AlterExtensionStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { AlterExtensionStmt: result };
  }

  CreateFdwStmt(node: PG14.CreateFdwStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { CreateFdwStmt: result };
  }

  SetOperationStmt(node: PG14.SetOperationStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { SetOperationStmt: result };
  }

  ReplicaIdentityStmt(node: PG14.ReplicaIdentityStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { ReplicaIdentityStmt: result };
  }

  AlterCollationStmt(node: PG14.AlterCollationStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { AlterCollationStmt: result };
  }

  AlterDomainStmt(node: PG14.AlterDomainStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { AlterDomainStmt: result };
  }

  PrepareStmt(node: PG14.PrepareStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { PrepareStmt: result };
  }

  ExecuteStmt(node: PG14.ExecuteStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { ExecuteStmt: result };
  }

  DeallocateStmt(node: PG14.DeallocateStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { DeallocateStmt: result };
  }

  NotifyStmt(node: PG14.NotifyStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { NotifyStmt: result };
  }

  ListenStmt(node: PG14.ListenStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { ListenStmt: result };
  }

  UnlistenStmt(node: PG14.UnlistenStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { UnlistenStmt: result };
  }

  CheckPointStmt(node: PG14.CheckPointStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { CheckPointStmt: result };
  }

  LoadStmt(node: PG14.LoadStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { LoadStmt: result };
  }

  DiscardStmt(node: PG14.DiscardStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { DiscardStmt: result };
  }

  CommentStmt(node: PG14.CommentStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { CommentStmt: result };
  }

  LockStmt(node: PG14.LockStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { LockStmt: result };
  }

  CreatePolicyStmt(node: PG14.CreatePolicyStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { CreatePolicyStmt: result };
  }

  AlterPolicyStmt(node: PG14.AlterPolicyStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { AlterPolicyStmt: result };
  }

  CreateUserMappingStmt(node: PG14.CreateUserMappingStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { CreateUserMappingStmt: result };
  }

  CreateStatsStmt(node: PG14.CreateStatsStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { CreateStatsStmt: result };
  }

  StatsElem(node: PG14.StatsElem, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { StatsElem: result };
  }

  CreatePublicationStmt(node: PG14.CreatePublicationStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { CreatePublicationStmt: result };
  }

  CreateSubscriptionStmt(node: PG14.CreateSubscriptionStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { CreateSubscriptionStmt: result };
  }

  AlterPublicationStmt(node: PG14.AlterPublicationStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { AlterPublicationStmt: result };
  }

  AlterSubscriptionStmt(node: PG14.AlterSubscriptionStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { AlterSubscriptionStmt: result };
  }

  DropSubscriptionStmt(node: PG14.DropSubscriptionStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { DropSubscriptionStmt: result };
  }

  DoStmt(node: PG14.DoStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { DoStmt: result };
  }

  InlineCodeBlock(node: PG14.InlineCodeBlock, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { InlineCodeBlock: result };
  }

  CallContext(node: PG14.CallContext, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { CallContext: result };
  }

  ConstraintsSetStmt(node: PG14.ConstraintsSetStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { ConstraintsSetStmt: result };
  }

  AlterSystemStmt(node: PG14.AlterSystemStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { AlterSystemStmt: result };
  }

  VacuumRelation(node: PG14.VacuumRelation, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { VacuumRelation: result };
  }

  DropOwnedStmt(node: PG14.DropOwnedStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { DropOwnedStmt: result };
  }

  ReassignOwnedStmt(node: PG14.ReassignOwnedStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { ReassignOwnedStmt: result };
  }

  AlterTSDictionaryStmt(node: PG14.AlterTSDictionaryStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { AlterTSDictionaryStmt: result };
  }

  AlterTSConfigurationStmt(node: PG14.AlterTSConfigurationStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { AlterTSConfigurationStmt: result };
  }

  ClosePortalStmt(node: PG14.ClosePortalStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { ClosePortalStmt: result };
  }

  FetchStmt(node: PG14.FetchStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { FetchStmt: result };
  }

  AlterStatsStmt(node: PG14.AlterStatsStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { AlterStatsStmt: result };
  }

  ObjectWithArgs(node: PG14.ObjectWithArgs, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { ObjectWithArgs: result };
  }

  AlterOperatorStmt(node: PG14.AlterOperatorStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { AlterOperatorStmt: result };
  }

  AlterFdwStmt(node: PG14.AlterFdwStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { AlterFdwStmt: result };
  }

  CreateForeignServerStmt(node: PG14.CreateForeignServerStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { CreateForeignServerStmt: result };
  }

  AlterForeignServerStmt(node: PG14.AlterForeignServerStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { AlterForeignServerStmt: result };
  }

  AlterUserMappingStmt(node: PG14.AlterUserMappingStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { AlterUserMappingStmt: result };
  }

  DropUserMappingStmt(node: PG14.DropUserMappingStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { DropUserMappingStmt: result };
  }

  ImportForeignSchemaStmt(node: PG14.ImportForeignSchemaStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { ImportForeignSchemaStmt: result };
  }

  ClusterStmt(node: PG14.ClusterStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { ClusterStmt: result };
  }

  VacuumStmt(node: PG14.VacuumStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { VacuumStmt: result };
  }

  ExplainStmt(node: PG14.ExplainStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { ExplainStmt: result };
  }

  ReindexStmt(node: PG14.ReindexStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { ReindexStmt: result };
  }

  CallStmt(node: PG14.CallStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { CallStmt: result };
  }

  CreatedbStmt(node: PG14.CreatedbStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { CreatedbStmt: result };
  }

  DropdbStmt(node: PG14.DropdbStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { DropdbStmt: result };
  }

  RenameStmt(node: PG14.RenameStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { RenameStmt: result };
  }

  AlterOwnerStmt(node: PG14.AlterOwnerStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { AlterOwnerStmt: result };
  }

  GrantStmt(node: PG14.GrantStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { GrantStmt: result };
  }

  GrantRoleStmt(node: PG14.GrantRoleStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { GrantRoleStmt: result };
  }

  SecLabelStmt(node: PG14.SecLabelStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { SecLabelStmt: result };
  }

  AlterDefaultPrivilegesStmt(node: PG14.AlterDefaultPrivilegesStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { AlterDefaultPrivilegesStmt: result };
  }

  CreateConversionStmt(node: PG14.CreateConversionStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { CreateConversionStmt: result };
  }

  CreateCastStmt(node: PG14.CreateCastStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { CreateCastStmt: result };
  }

  CreatePLangStmt(node: PG14.CreatePLangStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { CreatePLangStmt: result };
  }

  CreateTransformStmt(node: PG14.CreateTransformStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { CreateTransformStmt: result };
  }

  CreateTrigStmt(node: PG14.CreateTrigStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { CreateTrigStmt: result };
  }

  TriggerTransition(node: PG14.TriggerTransition, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { TriggerTransition: result };
  }

  CreateEventTrigStmt(node: PG14.CreateEventTrigStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { CreateEventTrigStmt: result };
  }

  AlterEventTrigStmt(node: PG14.AlterEventTrigStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { AlterEventTrigStmt: result };
  }

  CreateOpClassStmt(node: PG14.CreateOpClassStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { CreateOpClassStmt: result };
  }

  CreateOpFamilyStmt(node: PG14.CreateOpFamilyStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { CreateOpFamilyStmt: result };
  }

  AlterOpFamilyStmt(node: PG14.AlterOpFamilyStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { AlterOpFamilyStmt: result };
  }

  AlterTableMoveAllStmt(node: PG14.AlterTableMoveAllStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { AlterTableMoveAllStmt: result };
  }

  CreateSeqStmt(node: PG14.CreateSeqStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { CreateSeqStmt: result };
  }

  AlterSeqStmt(node: PG14.AlterSeqStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { AlterSeqStmt: result };
  }


  CreateRangeStmt(node: PG14.CreateRangeStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { CreateRangeStmt: result };
  }

  AlterEnumStmt(node: PG14.AlterEnumStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { AlterEnumStmt: result };
  }

  AlterTypeStmt(node: PG14.AlterTypeStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { AlterTypeStmt: result };
  }

  AlterRoleStmt(node: PG14.AlterRoleStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { AlterRoleStmt: result };
  }

  DropRoleStmt(node: PG14.DropRoleStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { DropRoleStmt: result };
  }

  CreateAggregateStmt(node: PG14.DefineStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { DefineStmt: result };
  }

  CreateTableAsStmt(node: PG14.CreateTableAsStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { CreateTableAsStmt: result };
  }

  RefreshMatViewStmt(node: PG14.RefreshMatViewStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { RefreshMatViewStmt: result };
  }

  AccessPriv(node: PG14.AccessPriv, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { AccessPriv: result };
  }

  DefineStmt(node: PG14.DefineStmt, context: TransformerContext): any {
    const result: any = {};

    if (node.kind !== undefined) {
      result.kind = node.kind;
    }

    if (node.oldstyle !== undefined) {
      result.oldstyle = node.oldstyle;
    }

    if (node.defnames !== undefined) {
      result.defnames = Array.isArray(node.defnames)
        ? node.defnames.map(item => this.transform(item as any, context))
        : this.transform(node.defnames as any, context);
    }

    if (node.args !== undefined) {
      result.args = Array.isArray(node.args)
        ? node.args.map(item => {
            if (item && typeof item === 'object' && 'Integer' in item && item.Integer.ival === -1) {
              return { Integer: {} };
            }
            return this.transform(item as any, context);
          })
        : this.transform(node.args as any, context);
    }

    if (node.definition !== undefined) {
      result.definition = Array.isArray(node.definition)
        ? node.definition.map(item => this.transform(item as any, context))
        : this.transform(node.definition as any, context);
    }

    if (node.if_not_exists !== undefined) {
      result.if_not_exists = node.if_not_exists;
    }

    if (node.replace !== undefined) {
      result.replace = node.replace;
    }

    return { DefineStmt: result };
  }

  AlterDatabaseStmt(node: PG14.AlterDatabaseStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { AlterDatabaseStmt: result };
  }

  AlterDatabaseSetStmt(node: PG14.AlterDatabaseSetStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { AlterDatabaseSetStmt: result };
  }

  DeclareCursorStmt(node: PG14.DeclareCursorStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { DeclareCursorStmt: result };
  }

  CreateAmStmt(node: PG14.CreateAmStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { CreateAmStmt: result };
  }

  IntoClause(node: PG14.IntoClause, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { IntoClause: result };
  }

  OnConflictExpr(node: PG14.OnConflictExpr, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { OnConflictExpr: result };
  }

  ScanToken(node: PG14.ScanToken, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { ScanToken: result };
  }

  CreateOpClassItem(node: PG14.CreateOpClassItem, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { CreateOpClassItem: result };
  }

  Var(node: PG14.Var, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { Var: result };
  }

  TableFunc(node: PG14.TableFunc, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { TableFunc: result };
  }

  RangeTableFunc(node: PG14.RangeTableFunc, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { RangeTableFunc: result };
  }

  RangeTableFuncCol(node: PG14.RangeTableFuncCol, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { RangeTableFuncCol: result };
  }

  RangeFunction(node: PG14.RangeFunction, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { RangeFunction: result };
  }

  XmlExpr(node: PG14.XmlExpr, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { XmlExpr: result };
  }

  RangeTableSample(node: PG14.RangeTableSample, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { RangeTableSample: result };
  }

  XmlSerialize(node: PG14.XmlSerialize, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { XmlSerialize: result };
  }

  RuleStmt(node: PG14.RuleStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { RuleStmt: result };
  }

  RangeSubselect(node: PG14.RangeSubselect, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { RangeSubselect: result };
  }

  SQLValueFunction(node: PG14.SQLValueFunction, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { SQLValueFunction: result };
  }

  GroupingFunc(node: PG14.GroupingFunc, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { GroupingFunc: result };
  }

  MultiAssignRef(node: PG14.MultiAssignRef, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { MultiAssignRef: result };
  }

  SetToDefault(node: PG14.SetToDefault, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { SetToDefault: result };
  }

  CurrentOfExpr(node: PG14.CurrentOfExpr, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { CurrentOfExpr: result };
  }

  TableLikeClause(node: PG14.TableLikeClause, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { TableLikeClause: result };
  }

  AlterFunctionStmt(node: PG14.AlterFunctionStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { AlterFunctionStmt: result };
  }

  AlterObjectSchemaStmt(node: PG14.AlterObjectSchemaStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { AlterObjectSchemaStmt: result };
  }

  AlterRoleSetStmt(node: PG14.AlterRoleSetStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { AlterRoleSetStmt: result };
  }

  CreateForeignTableStmt(node: PG14.CreateForeignTableStmt, context: TransformerContext): any {
    const result = this.transformGenericNode(node, context);
    return { CreateForeignTableStmt: result };
  }
}
