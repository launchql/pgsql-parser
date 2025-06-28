import * as PG16 from '../16/types';
import { TransformerContext } from './context';

/**
 * V16 to V17 AST Transformer
 * Transforms PostgreSQL v16 AST nodes to v17 format
 */
export class V16ToV17Transformer {
  
  transform(node: PG16.Node, context: TransformerContext = { parentNodeTypes: [] }): any {
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

  visit(node: PG16.Node, context: TransformerContext = { parentNodeTypes: [] }): any {
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
    
    // If no specific method, return the node as-is
    return node;
  }

  getNodeType(node: PG16.Node): any {
    return Object.keys(node)[0];
  }

  getNodeData(node: PG16.Node): any {
    const keys = Object.keys(node);
    if (keys.length === 1 && typeof (node as any)[keys[0]] === 'object') {
      return (node as any)[keys[0]];
    }
    return node;
  }

  ParseResult(node: PG16.ParseResult, context: TransformerContext): any {
    
    if (node && typeof node === 'object' && 'version' in node && 'stmts' in node) {
      return {
        version: 170004, // PG17 version
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

  RawStmt(node: PG16.RawStmt, context: TransformerContext): any {
    const result: any = {};
    
    if (node.stmt !== undefined) {
      result.stmt = this.transform(node.stmt as any, context);
    }
    if (node.stmt_location !== undefined) {
      result.stmt_location = node.stmt_location;
    }
    if (node.stmt_len !== undefined) {
      result.stmt_len = node.stmt_len;
    }
    
    return { RawStmt: result };
  }

  SelectStmt(node: PG16.SelectStmt, context: TransformerContext): any {
    const result: any = {};
    
    if (node.distinctClause !== undefined) {
      result.distinctClause = Array.isArray(node.distinctClause)
        ? node.distinctClause.map(item => this.transform(item as any, context))
        : this.transform(node.distinctClause as any, context);
    }
    if (node.intoClause !== undefined) {
      result.intoClause = this.transform(node.intoClause as any, context);
    }
    if (node.targetList !== undefined) {
      result.targetList = Array.isArray(node.targetList)
        ? node.targetList.map(item => this.transform(item as any, context))
        : this.transform(node.targetList as any, context);
    }
    if (node.fromClause !== undefined) {
      result.fromClause = Array.isArray(node.fromClause)
        ? node.fromClause.map(item => this.transform(item as any, context))
        : this.transform(node.fromClause as any, context);
    }
    if (node.whereClause !== undefined) {
      result.whereClause = this.transform(node.whereClause as any, context);
    }
    if (node.groupClause !== undefined) {
      result.groupClause = Array.isArray(node.groupClause)
        ? node.groupClause.map(item => this.transform(item as any, context))
        : this.transform(node.groupClause as any, context);
    }
    if (node.groupDistinct !== undefined) {
      result.groupDistinct = node.groupDistinct;
    }
    if (node.havingClause !== undefined) {
      result.havingClause = this.transform(node.havingClause as any, context);
    }
    if (node.windowClause !== undefined) {
      result.windowClause = Array.isArray(node.windowClause)
        ? node.windowClause.map(item => this.transform(item as any, context))
        : this.transform(node.windowClause as any, context);
    }
    if (node.valuesLists !== undefined) {
      const valuesContext: TransformerContext = {
        ...context,
        inValuesClause: true
      };
      result.valuesLists = Array.isArray(node.valuesLists)
        ? node.valuesLists.map(item => Array.isArray(item) 
            ? item.map(subItem => this.transform(subItem as any, valuesContext))
            : this.transform(item as any, valuesContext))
        : this.transform(node.valuesLists as any, valuesContext);
    }
    if (node.sortClause !== undefined) {
      result.sortClause = Array.isArray(node.sortClause)
        ? node.sortClause.map(item => this.transform(item as any, context))
        : this.transform(node.sortClause as any, context);
    }
    if (node.limitOffset !== undefined) {
      result.limitOffset = this.transform(node.limitOffset as any, context);
    }
    if (node.limitCount !== undefined) {
      result.limitCount = this.transform(node.limitCount as any, context);
    }
    if (node.limitOption !== undefined) {
      result.limitOption = node.limitOption;
    }
    if (node.lockingClause !== undefined) {
      result.lockingClause = Array.isArray(node.lockingClause)
        ? node.lockingClause.map(item => this.transform(item as any, context))
        : this.transform(node.lockingClause as any, context);
    }
    if (node.withClause !== undefined) {
      result.withClause = this.transform(node.withClause as any, context);
    }
    if (node.op !== undefined) {
      result.op = node.op;
    }
    if (node.all !== undefined) {
      result.all = node.all;
    }
    if (node.larg !== undefined) {
      result.larg = this.transform(node.larg as any, context);
    }
    if (node.rarg !== undefined) {
      result.rarg = this.transform(node.rarg as any, context);
    }
    
    return { SelectStmt: result };
  }

  A_Expr(node: PG16.A_Expr, context: TransformerContext): any {
    const result: any = {};
    
    if (node.kind !== undefined) {
      result.kind = node.kind;
    }
    if (node.name !== undefined) {
      result.name = Array.isArray(node.name)
        ? node.name.map(item => this.transform(item as any, context))
        : this.transform(node.name as any, context);
    }
    if (node.lexpr !== undefined) {
      result.lexpr = this.transform(node.lexpr as any, context);
    }
    if (node.rexpr !== undefined) {
      result.rexpr = this.transform(node.rexpr as any, context);
    }
    if (node.location !== undefined) {
      result.location = node.location;
    }
    
    return { A_Expr: result };
  }

  InsertStmt(node: PG16.InsertStmt, context: TransformerContext): any {
    const result: any = {};
    
    if (node.relation !== undefined) {
      result.relation = this.transform(node.relation as any, context);
    }
    if (node.cols !== undefined) {
      result.cols = Array.isArray(node.cols)
        ? node.cols.map(item => this.transform(item as any, context))
        : this.transform(node.cols as any, context);
    }
    if (node.selectStmt !== undefined) {
      result.selectStmt = this.transform(node.selectStmt as any, context);
    }
    if (node.onConflictClause !== undefined) {
      result.onConflictClause = this.transform(node.onConflictClause as any, context);
    }
    if (node.returningList !== undefined) {
      result.returningList = Array.isArray(node.returningList)
        ? node.returningList.map(item => this.transform(item as any, context))
        : this.transform(node.returningList as any, context);
    }
    if (node.withClause !== undefined) {
      result.withClause = this.transform(node.withClause as any, context);
    }
    if (node.override !== undefined) {
      result.override = node.override;
    }
    
    return { InsertStmt: result };
  }

  UpdateStmt(node: PG16.UpdateStmt, context: TransformerContext): any {
    const result: any = {};
    
    if (node.relation !== undefined) {
      result.relation = this.transform(node.relation as any, context);
    }
    if (node.targetList !== undefined) {
      result.targetList = Array.isArray(node.targetList)
        ? node.targetList.map(item => this.transform(item as any, context))
        : this.transform(node.targetList as any, context);
    }
    if (node.whereClause !== undefined) {
      result.whereClause = this.transform(node.whereClause as any, context);
    }
    if (node.fromClause !== undefined) {
      result.fromClause = Array.isArray(node.fromClause)
        ? node.fromClause.map(item => this.transform(item as any, context))
        : this.transform(node.fromClause as any, context);
    }
    if (node.returningList !== undefined) {
      result.returningList = Array.isArray(node.returningList)
        ? node.returningList.map(item => this.transform(item as any, context))
        : this.transform(node.returningList as any, context);
    }
    if (node.withClause !== undefined) {
      result.withClause = this.transform(node.withClause as any, context);
    }
    
    return { UpdateStmt: result };
  }

  DeleteStmt(node: PG16.DeleteStmt, context: TransformerContext): any {
    const result: any = {};
    
    if (node.relation !== undefined) {
      result.relation = this.transform(node.relation as any, context);
    }
    if (node.usingClause !== undefined) {
      result.usingClause = Array.isArray(node.usingClause)
        ? node.usingClause.map(item => this.transform(item as any, context))
        : this.transform(node.usingClause as any, context);
    }
    if (node.whereClause !== undefined) {
      result.whereClause = this.transform(node.whereClause as any, context);
    }
    if (node.returningList !== undefined) {
      result.returningList = Array.isArray(node.returningList)
        ? node.returningList.map(item => this.transform(item as any, context))
        : this.transform(node.returningList as any, context);
    }
    if (node.withClause !== undefined) {
      result.withClause = this.transform(node.withClause as any, context);
    }
    
    return { DeleteStmt: result };
  }

  WithClause(node: PG16.WithClause, context: TransformerContext): any {
    const result: any = {};
    
    if (node.ctes !== undefined) {
      result.ctes = Array.isArray(node.ctes)
        ? node.ctes.map(item => this.transform(item as any, context))
        : this.transform(node.ctes as any, context);
    }
    if (node.recursive !== undefined) {
      result.recursive = node.recursive;
    }
    if (node.location !== undefined) {
      result.location = node.location;
    }
    
    return { WithClause: result };
  }

  ResTarget(node: PG16.ResTarget, context: TransformerContext): any {
    const result: any = {};
    
    if (node.name !== undefined) {
      result.name = node.name;
    }
    if (node.indirection !== undefined) {
      result.indirection = Array.isArray(node.indirection)
        ? node.indirection.map(item => this.transform(item as any, context))
        : this.transform(node.indirection as any, context);
    }
    if (node.val !== undefined) {
      result.val = this.transform(node.val as any, context);
    }
    if (node.location !== undefined) {
      result.location = node.location;
    }
    
    return { ResTarget: result };
  }

  BoolExpr(node: PG16.BoolExpr, context: TransformerContext): any {
    const result: any = {};
    
    if (node.boolop !== undefined) {
      result.boolop = node.boolop;
    }
    if (node.args !== undefined) {
      result.args = Array.isArray(node.args)
        ? node.args.map(item => this.transform(item as any, context))
        : this.transform(node.args as any, context);
    }
    if (node.location !== undefined) {
      result.location = node.location;
    }
    
    return { BoolExpr: result };
  }

  FuncCall(node: PG16.FuncCall, context: TransformerContext): any {
    const result: any = {};
    
    if (node.funcname !== undefined) {
      result.funcname = Array.isArray(node.funcname)
        ? node.funcname.map(item => this.transform(item as any, context))
        : this.transform(node.funcname as any, context);
    }
    if (node.args !== undefined) {
      result.args = Array.isArray(node.args)
        ? node.args.map(item => this.transform(item as any, context))
        : this.transform(node.args as any, context);
    }
    if (node.agg_order !== undefined) {
      result.agg_order = Array.isArray(node.agg_order)
        ? node.agg_order.map(item => this.transform(item as any, context))
        : this.transform(node.agg_order as any, context);
    }
    if (node.agg_filter !== undefined) {
      result.agg_filter = this.transform(node.agg_filter as any, context);
    }
    if (node.agg_within_group !== undefined) {
      result.agg_within_group = node.agg_within_group;
    }
    if (node.agg_star !== undefined) {
      result.agg_star = node.agg_star;
    }
    if (node.agg_distinct !== undefined) {
      result.agg_distinct = node.agg_distinct;
    }
    if (node.func_variadic !== undefined) {
      result.func_variadic = node.func_variadic;
    }
    if (node.over !== undefined) {
      result.over = this.transform(node.over as any, context);
    }
    if (node.location !== undefined) {
      result.location = node.location;
    }
    
    const funcformatValue = this.getFuncformatValue(node, result.funcname, context);
    result.funcformat = funcformatValue;
    
    return { FuncCall: result };
  }

  FuncExpr(node: PG16.FuncExpr, context: TransformerContext): any {
    return { FuncExpr: node };
  }

  A_Const(node: PG16.A_Const, context: TransformerContext): any {
    return { A_Const: node };
  }

  ColumnRef(node: PG16.ColumnRef, context: TransformerContext): any {
    return { ColumnRef: node };
  }

  private isInCreateDomainContext(context: TransformerContext): boolean {
    return context.parentNodeTypes.includes('CreateDomainStmt');
  }

  private isInTypeCastContext(context: TransformerContext): boolean {
    return context.parentNodeTypes.includes('TypeCast');
  }

  private isInCreateTableContext(context: TransformerContext): boolean {
    return context.parentNodeTypes.includes('ColumnDef');
  }

  private isInValuesContext(context: TransformerContext): boolean {
    return context.inValuesClause === true;
  }

  private isInSimpleSelectTypeCastContext(context: TransformerContext): boolean {
    return context.parentNodeTypes.includes('TypeCast') && 
           context.parentNodeTypes.includes('ResTarget') &&
           !this.isInValuesContext(context);
  }

  TypeName(node: PG16.TypeName, context: TransformerContext): any {
    const result: any = {};

    if (node.names !== undefined) {
      let names = Array.isArray(node.names)
        ? node.names.map(item => this.transform(item as any, context))
        : this.transform(node.names as any, context);

      if (Array.isArray(names) && names.length === 2) {
        const firstElement = names[0];
        const secondElement = names[1];
        if (firstElement && typeof firstElement === 'object' && 'String' in firstElement &&
            secondElement && typeof secondElement === 'object' && 'String' in secondElement) {
          const firstTypeName = firstElement.String.str || firstElement.String.sval;
          const secondTypeName = secondElement.String.str || secondElement.String.sval;
          if (firstTypeName === 'pg_catalog' && secondTypeName === 'json') {
            names = [secondElement];
          }
        }
      }

      result.names = names;
    }

    if (node.typeOid !== undefined) {
      result.typeOid = node.typeOid;
    }

    if (node.setof !== undefined) {
      result.setof = node.setof;
    }

    if (node.pct_type !== undefined) {
      result.pct_type = node.pct_type;
    }

    if (node.typmods !== undefined) {
      result.typmods = Array.isArray(node.typmods)
        ? node.typmods.map(item => this.transform(item as any, context))
        : this.transform(node.typmods as any, context);
    }

    if (node.typemod !== undefined) {
      result.typemod = node.typemod;
    }

    if (node.arrayBounds !== undefined) {
      result.arrayBounds = Array.isArray(node.arrayBounds)
        ? node.arrayBounds.map(item => this.transform(item as any, context))
        : this.transform(node.arrayBounds as any, context);
    }

    if (node.location !== undefined) {
      result.location = node.location;
    }

    return { TypeName: result };
  }

  Alias(node: PG16.Alias, context: TransformerContext): any {
    return { Alias: node };
  }

  RangeVar(node: PG16.RangeVar, context: TransformerContext): any {
    const result: any = {};
    
    if (node.catalogname !== undefined) {
      result.catalogname = node.catalogname;
    }
    if (node.schemaname !== undefined) {
      result.schemaname = node.schemaname;
    }
    if (node.relname !== undefined) {
      result.relname = node.relname;
    }
    if (node.inh !== undefined) {
      result.inh = node.inh;
    }
    if (node.relpersistence !== undefined) {
      result.relpersistence = node.relpersistence;
    }
    if (node.alias !== undefined) {
      result.alias = this.transform(node.alias as any, context);
    }
    if (node.location !== undefined) {
      result.location = node.location;
    }
    
    return { RangeVar: result };
  }

  A_ArrayExpr(node: PG16.A_ArrayExpr, context: TransformerContext): any {
    return { A_ArrayExpr: node };
  }

  A_Indices(node: PG16.A_Indices, context: TransformerContext): any {
    return { A_Indices: node };
  }

  A_Indirection(node: PG16.A_Indirection, context: TransformerContext): any {
    return { A_Indirection: node };
  }

  A_Star(node: PG16.A_Star, context: TransformerContext): any {
    return { A_Star: node };
  }

  CaseExpr(node: PG16.CaseExpr, context: TransformerContext): any {
    return { CaseExpr: node };
  }

  CoalesceExpr(node: PG16.CoalesceExpr, context: TransformerContext): any {
    return { CoalesceExpr: node };
  }

  TypeCast(node: PG16.TypeCast, context: TransformerContext): any {
    const result: any = {};
    
    if (node.arg !== undefined) {
      result.arg = this.transform(node.arg as any, context);
    }
    if (node.typeName !== undefined) {
      // Handle unwrapped TypeName data directly since PG16 provides it unwrapped
      const typeName = node.typeName as any;
      
      if (typeName && typeof typeName === 'object' && 'names' in typeName) {
        const transformedTypeName: any = {};
        
        if (typeName.names !== undefined) {
          let names = Array.isArray(typeName.names)
            ? typeName.names.map((item: any) => this.transform(item as any, context))
            : this.transform(typeName.names as any, context);

          if (Array.isArray(names) && names.length === 2) {
            const firstElement = names[0];
            const secondElement = names[1];
            if (firstElement && typeof firstElement === 'object' && 'String' in firstElement &&
                secondElement && typeof secondElement === 'object' && 'String' in secondElement) {
              const firstTypeName = firstElement.String.str || firstElement.String.sval;
              const secondTypeName = secondElement.String.str || secondElement.String.sval;
              if (firstTypeName === 'pg_catalog' && secondTypeName === 'json') {
                names = [secondElement];
              }
            }
          }

          transformedTypeName.names = names;
        }

        if (typeName.typeOid !== undefined) {
          transformedTypeName.typeOid = typeName.typeOid;
        }
        if (typeName.setof !== undefined) {
          transformedTypeName.setof = typeName.setof;
        }
        if (typeName.pct_type !== undefined) {
          transformedTypeName.pct_type = typeName.pct_type;
        }
        if (typeName.typmods !== undefined) {
          transformedTypeName.typmods = Array.isArray(typeName.typmods)
            ? typeName.typmods.map((item: any) => this.transform(item as any, context))
            : this.transform(typeName.typmods as any, context);
        }
        if (typeName.typemod !== undefined) {
          transformedTypeName.typemod = typeName.typemod;
        }
        if (typeName.arrayBounds !== undefined) {
          transformedTypeName.arrayBounds = Array.isArray(typeName.arrayBounds)
            ? typeName.arrayBounds.map((item: any) => this.transform(item as any, context))
            : this.transform(typeName.arrayBounds as any, context);
        }
        if (typeName.location !== undefined) {
          transformedTypeName.location = typeName.location;
        }

        result.typeName = transformedTypeName;
      } else {
        result.typeName = this.transform(typeName, context);
      }
    }
    if (node.location !== undefined) {
      result.location = node.location;
    }
    
    return { TypeCast: result };
  }

  CollateClause(node: PG16.CollateClause, context: TransformerContext): any {
    return { CollateClause: node };
  }

  BooleanTest(node: PG16.BooleanTest, context: TransformerContext): any {
    return { BooleanTest: node };
  }

  NullTest(node: PG16.NullTest, context: TransformerContext): any {
    return { NullTest: node };
  }

  String(node: PG16.String, context: TransformerContext): any {
    return { String: node };
  }
  
  Integer(node: PG16.Integer, context: TransformerContext): any {
    return { Integer: node };
  }
  
  Float(node: PG16.Float, context: TransformerContext): any {
    return { Float: node };
  }
  
  Boolean(node: PG16.Boolean, context: TransformerContext): any {
    return { Boolean: node };
  }
  
  BitString(node: PG16.BitString, context: TransformerContext): any {
    return { BitString: node };
  }
  
  Null(node: PG16.Node, context: TransformerContext): any {
    return { Null: node };
  }

  List(node: PG16.List, context: TransformerContext): any {
    const result: any = {};
    
    if (node.items !== undefined) {
      result.items = Array.isArray(node.items)
        ? node.items.map(item => this.transform(item as any, context))
        : this.transform(node.items as any, context);
    }
    
    return { List: result };
  }

  CreateStmt(node: PG16.CreateStmt, context: TransformerContext): any {
    const result: any = {};
    
    if (node.relation !== undefined) {
      result.relation = this.transform(node.relation as any, context);
    }
    if (node.tableElts !== undefined) {
      result.tableElts = Array.isArray(node.tableElts)
        ? node.tableElts.map(item => this.transform(item as any, context))
        : this.transform(node.tableElts as any, context);
    }
    if (node.inhRelations !== undefined) {
      result.inhRelations = Array.isArray(node.inhRelations)
        ? node.inhRelations.map(item => this.transform(item as any, context))
        : this.transform(node.inhRelations as any, context);
    }
    if (node.partbound !== undefined) {
      result.partbound = this.transform(node.partbound as any, context);
    }
    if (node.partspec !== undefined) {
      result.partspec = this.transform(node.partspec as any, context);
    }
    if (node.ofTypename !== undefined) {
      result.ofTypename = this.transform(node.ofTypename as any, context);
    }
    if (node.constraints !== undefined) {
      result.constraints = Array.isArray(node.constraints)
        ? node.constraints.map(item => this.transform(item as any, context))
        : this.transform(node.constraints as any, context);
    }
    if (node.options !== undefined) {
      result.options = Array.isArray(node.options)
        ? node.options.map(item => this.transform(item as any, context))
        : this.transform(node.options as any, context);
    }
    if (node.oncommit !== undefined) {
      result.oncommit = node.oncommit;
    }
    if (node.tablespacename !== undefined) {
      result.tablespacename = node.tablespacename;
    }
    if (node.accessMethod !== undefined) {
      result.accessMethod = node.accessMethod;
    }
    if (node.if_not_exists !== undefined) {
      result.if_not_exists = node.if_not_exists;
    }
    
    return { CreateStmt: result };
  }

  ColumnDef(node: PG16.ColumnDef, context: TransformerContext): any {
    const result: any = {};
    
    if (node.colname !== undefined) {
      result.colname = node.colname;
    }
    if (node.typeName !== undefined) {
      const transformedTypeName = this.TypeName(node.typeName as any, context);
      result.typeName = transformedTypeName.TypeName;
    }
    if (node.inhcount !== undefined) {
      result.inhcount = node.inhcount;
    }
    if (node.is_local !== undefined) {
      result.is_local = node.is_local;
    }
    if (node.is_not_null !== undefined) {
      result.is_not_null = node.is_not_null;
    }
    if (node.is_from_type !== undefined) {
      result.is_from_type = node.is_from_type;
    }
    if (node.storage !== undefined) {
      result.storage = node.storage;
    }
    if (node.raw_default !== undefined) {
      result.raw_default = this.transform(node.raw_default as any, context);
    }
    if (node.cooked_default !== undefined) {
      result.cooked_default = this.transform(node.cooked_default as any, context);
    }
    if (node.identity !== undefined) {
      result.identity = node.identity;
    }
    if (node.identitySequence !== undefined) {
      result.identitySequence = this.transform(node.identitySequence as any, context);
    }
    if (node.generated !== undefined) {
      result.generated = node.generated;
    }
    if (node.collClause !== undefined) {
      result.collClause = this.transform(node.collClause as any, context);
    }
    if (node.collOid !== undefined) {
      result.collOid = node.collOid;
    }
    if (node.constraints !== undefined) {
      result.constraints = Array.isArray(node.constraints)
        ? node.constraints.map(item => this.transform(item as any, context))
        : this.transform(node.constraints as any, context);
    }
    if (node.fdwoptions !== undefined) {
      result.fdwoptions = Array.isArray(node.fdwoptions)
        ? node.fdwoptions.map(item => this.transform(item as any, context))
        : this.transform(node.fdwoptions as any, context);
    }
    if (node.location !== undefined) {
      result.location = node.location;
    }
    
    return { ColumnDef: result };
  }

  Constraint(node: PG16.Constraint, context: TransformerContext): any {
    return { Constraint: node };
  }

  SubLink(node: PG16.SubLink, context: TransformerContext): any {
    return { SubLink: node };
  }

  CaseWhen(node: PG16.CaseWhen, context: TransformerContext): any {
    return { CaseWhen: node };
  }

  WindowDef(node: PG16.WindowDef, context: TransformerContext): any {
    return { WindowDef: node };
  }

  SortBy(node: PG16.SortBy, context: TransformerContext): any {
    return { SortBy: node };
  }

  GroupingSet(node: PG16.GroupingSet, context: TransformerContext): any {
    return { GroupingSet: node };
  }

  CommonTableExpr(node: PG16.CommonTableExpr, context: TransformerContext): any {
    return { CommonTableExpr: node };
  }

  ParamRef(node: PG16.ParamRef, context: TransformerContext): any {
    return { ParamRef: node };
  }

  LockingClause(node: any, context: TransformerContext): any {
    return { LockingClause: node };
  }

  MinMaxExpr(node: PG16.MinMaxExpr, context: TransformerContext): any {
    return { MinMaxExpr: node };
  }

  RowExpr(node: PG16.RowExpr, context: TransformerContext): any {
    return { RowExpr: node };
  }

  OpExpr(node: PG16.OpExpr, context: TransformerContext): any {
    return { OpExpr: node };
  }

  DistinctExpr(node: PG16.DistinctExpr, context: TransformerContext): any {
    return { DistinctExpr: node };
  }

  NullIfExpr(node: PG16.NullIfExpr, context: TransformerContext): any {
    return { NullIfExpr: node };
  }

  ScalarArrayOpExpr(node: PG16.ScalarArrayOpExpr, context: TransformerContext): any {
    return { ScalarArrayOpExpr: node };
  }

  Aggref(node: PG16.Aggref, context: TransformerContext): any {
    return { Aggref: node };
  }

  WindowFunc(node: PG16.WindowFunc, context: TransformerContext): any {
    return { WindowFunc: node };
  }

  FieldSelect(node: PG16.FieldSelect, context: TransformerContext): any {
    return { FieldSelect: node };
  }

  RelabelType(node: PG16.RelabelType, context: TransformerContext): any {
    return { RelabelType: node };
  }

  CoerceViaIO(node: PG16.CoerceViaIO, context: TransformerContext): any {
    return { CoerceViaIO: node };
  }

  ArrayCoerceExpr(node: PG16.ArrayCoerceExpr, context: TransformerContext): any {
    return { ArrayCoerceExpr: node };
  }

  ConvertRowtypeExpr(node: PG16.ConvertRowtypeExpr, context: TransformerContext): any {
    return { ConvertRowtypeExpr: node };
  }

  NamedArgExpr(node: PG16.NamedArgExpr, context: TransformerContext): any {
    return { NamedArgExpr: node };
  }

  ViewStmt(node: PG16.ViewStmt, context: TransformerContext): any {
    return { ViewStmt: node };
  }

  IndexStmt(node: PG16.IndexStmt, context: TransformerContext): any {
    return { IndexStmt: node };
  }

  IndexElem(node: PG16.IndexElem, context: TransformerContext): any {
    return { IndexElem: node };
  }

  PartitionElem(node: PG16.PartitionElem, context: TransformerContext): any {
    return { PartitionElem: node };
  }

  PartitionCmd(node: PG16.PartitionCmd, context: TransformerContext): any {
    return { PartitionCmd: node };
  }

  JoinExpr(node: PG16.JoinExpr, context: TransformerContext): any {
    return { JoinExpr: node };
  }

  FromExpr(node: PG16.FromExpr, context: TransformerContext): any {
    return { FromExpr: node };
  }

  TransactionStmt(node: PG16.TransactionStmt, context: TransformerContext): any {
    return { TransactionStmt: node };
  }

  VariableSetStmt(node: PG16.VariableSetStmt, context: TransformerContext): any {
    return { VariableSetStmt: node };
  }

  VariableShowStmt(node: PG16.VariableShowStmt, context: TransformerContext): any {
    return { VariableShowStmt: node };
  }

  CreateSchemaStmt(node: PG16.CreateSchemaStmt, context: TransformerContext): any {
    return { CreateSchemaStmt: node };
  }

  RoleSpec(node: PG16.RoleSpec, context: TransformerContext): any {
    return { RoleSpec: node };
  }

  DropStmt(node: PG16.DropStmt, context: TransformerContext): any {
    return { DropStmt: node };
  }

  TruncateStmt(node: PG16.TruncateStmt, context: TransformerContext): any {
    return { TruncateStmt: node };
  }

  ReturnStmt(node: PG16.ReturnStmt, context: TransformerContext): any {
    return { ReturnStmt: node };
  }

  PLAssignStmt(node: PG16.PLAssignStmt, context: TransformerContext): any {
    return { PLAssignStmt: node };
  }

  CopyStmt(node: PG16.CopyStmt, context: TransformerContext): any {
    return { CopyStmt: node };
  }

  AlterTableStmt(node: PG16.AlterTableStmt, context: TransformerContext): any {
    return { AlterTableStmt: node };
  }

  AlterTableCmd(node: PG16.AlterTableCmd, context: TransformerContext): any {
    return { AlterTableCmd: node };
  }

  CreateFunctionStmt(node: PG16.CreateFunctionStmt, context: TransformerContext): any {
    return { CreateFunctionStmt: node };
  }

  FunctionParameter(node: PG16.FunctionParameter, context: TransformerContext): any {
    return { FunctionParameter: node };
  }

  CreateEnumStmt(node: PG16.CreateEnumStmt, context: TransformerContext): any {
    return { CreateEnumStmt: node };
  }

  CreateDomainStmt(node: PG16.CreateDomainStmt, context: TransformerContext): any {
    const result: any = {};
    
    if (node.domainname !== undefined) {
      result.domainname = Array.isArray(node.domainname)
        ? node.domainname.map(item => this.transform(item as any, context))
        : this.transform(node.domainname as any, context);
    }
    if (node.typeName !== undefined) {
      const transformedTypeName = this.TypeName(node.typeName as any, context);
      result.typeName = transformedTypeName.TypeName;
    }
    if (node.collClause !== undefined) {
      result.collClause = this.transform(node.collClause as any, context);
    }
    if (node.constraints !== undefined) {
      result.constraints = Array.isArray(node.constraints)
        ? node.constraints.map(item => this.transform(item as any, context))
        : this.transform(node.constraints as any, context);
    }

    return { CreateDomainStmt: result };
  }

  CreateRoleStmt(node: PG16.CreateRoleStmt, context: TransformerContext): any {
    return { CreateRoleStmt: node };
  }

  DefElem(node: PG16.DefElem, context: TransformerContext): any {
    return { DefElem: node };
  }

  CreateTableSpaceStmt(node: PG16.CreateTableSpaceStmt, context: TransformerContext): any {
    return { CreateTableSpaceStmt: node };
  }

  DropTableSpaceStmt(node: PG16.DropTableSpaceStmt, context: TransformerContext): any {
    return { DropTableSpaceStmt: node };
  }

  AlterTableSpaceOptionsStmt(node: PG16.AlterTableSpaceOptionsStmt, context: TransformerContext): any {
    return { AlterTableSpaceOptionsStmt: node };
  }

  CreateExtensionStmt(node: PG16.CreateExtensionStmt, context: TransformerContext): any {
    return { CreateExtensionStmt: node };
  }

  AlterExtensionStmt(node: PG16.AlterExtensionStmt, context: TransformerContext): any {
    return { AlterExtensionStmt: node };
  }

  CreateFdwStmt(node: PG16.CreateFdwStmt, context: TransformerContext): any {
    return { CreateFdwStmt: node };
  }

  SetOperationStmt(node: PG16.SetOperationStmt, context: TransformerContext): any {
    return { SetOperationStmt: node };
  }

  ReplicaIdentityStmt(node: PG16.ReplicaIdentityStmt, context: TransformerContext): any {
    return { ReplicaIdentityStmt: node };
  }

  AlterCollationStmt(node: PG16.AlterCollationStmt, context: TransformerContext): any {
    return { AlterCollationStmt: node };
  }

  AlterDomainStmt(node: PG16.AlterDomainStmt, context: TransformerContext): any {
    return { AlterDomainStmt: node };
  }

  PrepareStmt(node: PG16.PrepareStmt, context: TransformerContext): any {
    return { PrepareStmt: node };
  }

  ExecuteStmt(node: PG16.ExecuteStmt, context: TransformerContext): any {
    return { ExecuteStmt: node };
  }

  DeallocateStmt(node: PG16.DeallocateStmt, context: TransformerContext): any {
    const result: any = {};
    
    if (node.name !== undefined) {
      result.name = node.name;
    }
    
    if (node.name === undefined || node.name === null) {
      result.isall = true;
    }
    
    return { DeallocateStmt: result };
  }

  NotifyStmt(node: PG16.NotifyStmt, context: TransformerContext): any {
    return { NotifyStmt: node };
  }

  ListenStmt(node: PG16.ListenStmt, context: TransformerContext): any {
    return { ListenStmt: node };
  }

  UnlistenStmt(node: PG16.UnlistenStmt, context: TransformerContext): any {
    return { UnlistenStmt: node };
  }

  CheckPointStmt(node: PG16.CheckPointStmt, context: TransformerContext): any {
    return { CheckPointStmt: node };
  }

  LoadStmt(node: PG16.LoadStmt, context: TransformerContext): any {
    return { LoadStmt: node };
  }

  DiscardStmt(node: PG16.DiscardStmt, context: TransformerContext): any {
    return { DiscardStmt: node };
  }

  CommentStmt(node: PG16.CommentStmt, context: TransformerContext): any {
    return { CommentStmt: node };
  }

  LockStmt(node: PG16.LockStmt, context: TransformerContext): any {
    return { LockStmt: node };
  }

  CreatePolicyStmt(node: PG16.CreatePolicyStmt, context: TransformerContext): any {
    return { CreatePolicyStmt: node };
  }

  AlterPolicyStmt(node: PG16.AlterPolicyStmt, context: TransformerContext): any {
    return { AlterPolicyStmt: node };
  }

  CreateUserMappingStmt(node: PG16.CreateUserMappingStmt, context: TransformerContext): any {
    return { CreateUserMappingStmt: node };
  }

  CreateStatsStmt(node: PG16.CreateStatsStmt, context: TransformerContext): any {
    return { CreateStatsStmt: node };
  }

  StatsElem(node: PG16.StatsElem, context: TransformerContext): any {
    return { StatsElem: node };
  }

  CreatePublicationStmt(node: PG16.CreatePublicationStmt, context: TransformerContext): any {
    return { CreatePublicationStmt: node };
  }

  CreateSubscriptionStmt(node: PG16.CreateSubscriptionStmt, context: TransformerContext): any {
    return { CreateSubscriptionStmt: node };
  }

  AlterPublicationStmt(node: PG16.AlterPublicationStmt, context: TransformerContext): any {
    return { AlterPublicationStmt: node };
  }

  AlterSubscriptionStmt(node: PG16.AlterSubscriptionStmt, context: TransformerContext): any {
    return { AlterSubscriptionStmt: node };
  }

  DropSubscriptionStmt(node: PG16.DropSubscriptionStmt, context: TransformerContext): any {
    return { DropSubscriptionStmt: node };
  }

  DoStmt(node: PG16.DoStmt, context: TransformerContext): any {
    return { DoStmt: node };
  }

  InlineCodeBlock(node: PG16.InlineCodeBlock, context: TransformerContext): any {
    return { InlineCodeBlock: node };
  }

  CallContext(node: PG16.CallContext, context: TransformerContext): any {
    return { CallContext: node };
  }

  ConstraintsSetStmt(node: PG16.ConstraintsSetStmt, context: TransformerContext): any {
    return { ConstraintsSetStmt: node };
  }

  AlterSystemStmt(node: PG16.AlterSystemStmt, context: TransformerContext): any {
    return { AlterSystemStmt: node };
  }

  VacuumRelation(node: PG16.VacuumRelation, context: TransformerContext): any {
    return { VacuumRelation: node };
  }

  DropOwnedStmt(node: PG16.DropOwnedStmt, context: TransformerContext): any {
    return { DropOwnedStmt: node };
  }

  ReassignOwnedStmt(node: PG16.ReassignOwnedStmt, context: TransformerContext): any {
    return { ReassignOwnedStmt: node };
  }

  AlterTSDictionaryStmt(node: PG16.AlterTSDictionaryStmt, context: TransformerContext): any {
    return { AlterTSDictionaryStmt: node };
  }

  AlterTSConfigurationStmt(node: PG16.AlterTSConfigurationStmt, context: TransformerContext): any {
    return { AlterTSConfigurationStmt: node };
  }

  ClosePortalStmt(node: PG16.ClosePortalStmt, context: TransformerContext): any {
    return { ClosePortalStmt: node };
  }

  FetchStmt(node: PG16.FetchStmt, context: TransformerContext): any {
    return { FetchStmt: node };
  }

  AlterStatsStmt(node: PG16.AlterStatsStmt, context: TransformerContext): any {
    return { AlterStatsStmt: node };
  }

  ObjectWithArgs(node: PG16.ObjectWithArgs, context: TransformerContext): any {
    return { ObjectWithArgs: node };
  }

  AlterOperatorStmt(node: PG16.AlterOperatorStmt, context: TransformerContext): any {
    return { AlterOperatorStmt: node };
  }

  AlterFdwStmt(node: PG16.AlterFdwStmt, context: TransformerContext): any {
    return { AlterFdwStmt: node };
  }

  CreateForeignServerStmt(node: PG16.CreateForeignServerStmt, context: TransformerContext): any {
    return { CreateForeignServerStmt: node };
  }

  AlterForeignServerStmt(node: PG16.AlterForeignServerStmt, context: TransformerContext): any {
    return { AlterForeignServerStmt: node };
  }

  AlterUserMappingStmt(node: PG16.AlterUserMappingStmt, context: TransformerContext): any {
    return { AlterUserMappingStmt: node };
  }

  DropUserMappingStmt(node: PG16.DropUserMappingStmt, context: TransformerContext): any {
    return { DropUserMappingStmt: node };
  }

  ImportForeignSchemaStmt(node: PG16.ImportForeignSchemaStmt, context: TransformerContext): any {
    return { ImportForeignSchemaStmt: node };
  }

  ClusterStmt(node: PG16.ClusterStmt, context: TransformerContext): any {
    return { ClusterStmt: node };
  }

  VacuumStmt(node: PG16.VacuumStmt, context: TransformerContext): any {
    return { VacuumStmt: node };
  }

  ExplainStmt(node: PG16.ExplainStmt, context: TransformerContext): any {
    return { ExplainStmt: node };
  }

  ReindexStmt(node: PG16.ReindexStmt, context: TransformerContext): any {
    return { ReindexStmt: node };
  }

  CallStmt(node: PG16.CallStmt, context: TransformerContext): any {
    return { CallStmt: node };
  }

  CreatedbStmt(node: PG16.CreatedbStmt, context: TransformerContext): any {
    return { CreatedbStmt: node };
  }

  DropdbStmt(node: PG16.DropdbStmt, context: TransformerContext): any {
    return { DropdbStmt: node };
  }

  RenameStmt(node: PG16.RenameStmt, context: TransformerContext): any {
    return { RenameStmt: node };
  }

  AlterOwnerStmt(node: PG16.AlterOwnerStmt, context: TransformerContext): any {
    return { AlterOwnerStmt: node };
  }

  GrantStmt(node: PG16.GrantStmt, context: TransformerContext): any {
    return { GrantStmt: node };
  }

  GrantRoleStmt(node: PG16.GrantRoleStmt, context: TransformerContext): any {
    return { GrantRoleStmt: node };
  }

  SecLabelStmt(node: PG16.SecLabelStmt, context: TransformerContext): any {
    return { SecLabelStmt: node };
  }

  AlterDefaultPrivilegesStmt(node: PG16.AlterDefaultPrivilegesStmt, context: TransformerContext): any {
    return { AlterDefaultPrivilegesStmt: node };
  }

  CreateConversionStmt(node: PG16.CreateConversionStmt, context: TransformerContext): any {
    return { CreateConversionStmt: node };
  }

  CreateCastStmt(node: PG16.CreateCastStmt, context: TransformerContext): any {
    return { CreateCastStmt: node };
  }

  CreatePLangStmt(node: PG16.CreatePLangStmt, context: TransformerContext): any {
    return { CreatePLangStmt: node };
  }

  CreateTransformStmt(node: PG16.CreateTransformStmt, context: TransformerContext): any {
    return { CreateTransformStmt: node };
  }

  CreateTrigStmt(node: PG16.CreateTrigStmt, context: TransformerContext): any {
    return { CreateTrigStmt: node };
  }

  TriggerTransition(node: PG16.TriggerTransition, context: TransformerContext): any {
    return { TriggerTransition: node };
  }

  CreateEventTrigStmt(node: PG16.CreateEventTrigStmt, context: TransformerContext): any {
    return { CreateEventTrigStmt: node };
  }

  AlterEventTrigStmt(node: PG16.AlterEventTrigStmt, context: TransformerContext): any {
    return { AlterEventTrigStmt: node };
  }

  CreateOpClassStmt(node: PG16.CreateOpClassStmt, context: TransformerContext): any {
    return { CreateOpClassStmt: node };
  }

  CreateOpFamilyStmt(node: PG16.CreateOpFamilyStmt, context: TransformerContext): any {
    return { CreateOpFamilyStmt: node };
  }

  AlterOpFamilyStmt(node: PG16.AlterOpFamilyStmt, context: TransformerContext): any {
    return { AlterOpFamilyStmt: node };
  }

  MergeStmt(node: PG16.MergeStmt, context: TransformerContext): any {
    return { MergeStmt: node };
  }

  AlterTableMoveAllStmt(node: PG16.AlterTableMoveAllStmt, context: TransformerContext): any {
    return { AlterTableMoveAllStmt: node };
  }

  CreateSeqStmt(node: PG16.CreateSeqStmt, context: TransformerContext): any {
    return { CreateSeqStmt: node };
  }

  AlterSeqStmt(node: PG16.AlterSeqStmt, context: TransformerContext): any {
    return { AlterSeqStmt: node };
  }

  CompositeTypeStmt(node: PG16.CompositeTypeStmt, context: TransformerContext): any {
    const result: any = {};
    
    if (node.typevar !== undefined) {
      result.typevar = this.transform(node.typevar as any, context);
    }
    if (node.coldeflist !== undefined) {
      result.coldeflist = Array.isArray(node.coldeflist)
        ? node.coldeflist.map(item => this.transform(item as any, context))
        : this.transform(node.coldeflist as any, context);
    }
    
    return { CompositeTypeStmt: result };
  }

  CreateRangeStmt(node: PG16.CreateRangeStmt, context: TransformerContext): any {
    return { CreateRangeStmt: node };
  }

  AlterEnumStmt(node: PG16.AlterEnumStmt, context: TransformerContext): any {
    return { AlterEnumStmt: node };
  }

  AlterTypeStmt(node: PG16.AlterTypeStmt, context: TransformerContext): any {
    return { AlterTypeStmt: node };
  }

  AlterRoleStmt(node: PG16.AlterRoleStmt, context: TransformerContext): any {
    return { AlterRoleStmt: node };
  }

  DropRoleStmt(node: PG16.DropRoleStmt, context: TransformerContext): any {
    return { DropRoleStmt: node };
  }

  CreateAggregateStmt(node: PG16.DefineStmt, context: TransformerContext): any {
    return { CreateAggregateStmt: node };
  }

  CreateTableAsStmt(node: PG16.CreateTableAsStmt, context: TransformerContext): any {
    return { CreateTableAsStmt: node };
  }

  RefreshMatViewStmt(node: PG16.RefreshMatViewStmt, context: TransformerContext): any {
    return { RefreshMatViewStmt: node };
  }

  AccessPriv(node: PG16.AccessPriv, context: TransformerContext): any {
    return node;
  }

  DefineStmt(node: PG16.DefineStmt, context: TransformerContext): any {
    return { DefineStmt: node };
  }

  AlterDatabaseStmt(node: PG16.AlterDatabaseStmt, context: TransformerContext): any {
    return node;
  }

  AlterDatabaseRefreshCollStmt(node: PG16.AlterDatabaseRefreshCollStmt, context: TransformerContext): any {
    return node;
  }

  AlterDatabaseSetStmt(node: PG16.AlterDatabaseSetStmt, context: TransformerContext): any {
    return node;
  }

  DeclareCursorStmt(node: PG16.DeclareCursorStmt, context: TransformerContext): any {
    return { DeclareCursorStmt: node };
  }

  PublicationObjSpec(node: PG16.PublicationObjSpec, context: TransformerContext): any {
    return node;
  }

  PublicationTable(node: PG16.PublicationTable, context: TransformerContext): any {
    return node;
  }

  CreateAmStmt(node: PG16.CreateAmStmt, context: TransformerContext): any {
    return { CreateAmStmt: node };
  }

  IntoClause(node: PG16.IntoClause, context: TransformerContext): any {
    return node;
  }

  OnConflictExpr(node: PG16.OnConflictExpr, context: TransformerContext): any {
    return node;
  }

  ScanToken(node: PG16.ScanToken, context: TransformerContext): any {
    return node;
  }

  CreateOpClassItem(node: PG16.CreateOpClassItem, context: TransformerContext): any {
    return node;
  }

  Var(node: PG16.Var, context: TransformerContext): any {
    return node;
  }

  TableFunc(node: PG16.TableFunc, context: TransformerContext): any {
    return node;
  }

  RangeTableFunc(node: PG16.RangeTableFunc, context: TransformerContext): any {
    return node;
  }

  RangeTableFuncCol(node: PG16.RangeTableFuncCol, context: TransformerContext): any {
    return node;
  }

  JsonArrayQueryConstructor(node: PG16.JsonArrayQueryConstructor, context: TransformerContext): any {
    return node;
  }

  RangeFunction(node: PG16.RangeFunction, context: TransformerContext): any {
    const result: any = {};
    
    if (node.lateral !== undefined) {
      result.lateral = node.lateral;
    }
    if (node.ordinality !== undefined) {
      result.ordinality = node.ordinality;
    }
    if (node.is_rowsfrom !== undefined) {
      result.is_rowsfrom = node.is_rowsfrom;
    }
    if (node.functions !== undefined) {
      result.functions = Array.isArray(node.functions)
        ? node.functions.map(item => this.transform(item as any, context))
        : this.transform(node.functions as any, context);
    }
    if (node.alias !== undefined) {
      result.alias = this.transform(node.alias as any, context);
    }
    if (node.coldeflist !== undefined) {
      result.coldeflist = Array.isArray(node.coldeflist)
        ? node.coldeflist.map(item => this.transform(item as any, context))
        : this.transform(node.coldeflist as any, context);
    }
    
    return { RangeFunction: result };
  }

  XmlSerialize(node: PG16.XmlSerialize, context: TransformerContext): any {
    const result: any = {};
    
    if (node.xmloption !== undefined) {
      result.xmloption = node.xmloption;
    }
    if (node.expr !== undefined) {
      result.expr = this.transform(node.expr as any, context);
    }
    if (node.typeName !== undefined) {
      result.typeName = this.transform(node.typeName as any, context);
    }
    if (node.location !== undefined) {
      result.location = node.location;
    }
    
    return { XmlSerialize: result };
  }

  RuleStmt(node: PG16.RuleStmt, context: TransformerContext): any {
    return { RuleStmt: node };
  }

  GroupingFunc(node: PG16.GroupingFunc, context: TransformerContext): any {
    const result: any = {};
    
    if (node.args !== undefined) {
      result.args = Array.isArray(node.args)
        ? node.args.map((item: any) => this.transform(item as any, context))
        : this.transform(node.args as any, context);
    }
    if (node.refs !== undefined) {
      result.refs = Array.isArray(node.refs)
        ? node.refs.map((item: any) => this.transform(item as any, context))
        : this.transform(node.refs as any, context);
    }
    if (node.agglevelsup !== undefined) {
      result.agglevelsup = node.agglevelsup;
    }
    if (node.location !== undefined) {
      result.location = node.location;
    }
    
    return { GroupingFunc: result };
  }

  MultiAssignRef(node: PG16.MultiAssignRef, context: TransformerContext): any {
    const result: any = {};
    
    if (node.source !== undefined) {
      result.source = this.transform(node.source as any, context);
    }
    if (node.colno !== undefined) {
      result.colno = node.colno;
    }
    if (node.ncolumns !== undefined) {
      result.ncolumns = node.ncolumns;
    }
    
    return { MultiAssignRef: result };
  }

  CurrentOfExpr(node: PG16.CurrentOfExpr, context: TransformerContext): any {
    const result: any = {};
    
    if (node.cursor_name !== undefined) {
      result.cursor_name = node.cursor_name;
    }
    if (node.cursor_param !== undefined) {
      result.cursor_param = node.cursor_param;
    }
    
    return { CurrentOfExpr: result };
  }

  TableLikeClause(node: PG16.TableLikeClause, context: TransformerContext): any {
    return { TableLikeClause: node };
  }

  AlterFunctionStmt(node: PG16.AlterFunctionStmt, context: TransformerContext): any {
    return { AlterFunctionStmt: node };
  }

  AlterObjectSchemaStmt(node: PG16.AlterObjectSchemaStmt, context: TransformerContext): any {
    return { AlterObjectSchemaStmt: node };
  }

  AlterRoleSetStmt(node: PG16.AlterRoleSetStmt, context: TransformerContext): any {
    const result: any = {};
    
    if (node.role !== undefined) {
      result.role = this.transform(node.role as any, context);
    }
    if (node.database !== undefined) {
      result.database = node.database;
    }
    if (node.setstmt !== undefined) {
      result.setstmt = this.transform(node.setstmt as any, context);
    }
    
    return { AlterRoleSetStmt: result };
  }

  CreateForeignTableStmt(node: PG16.CreateForeignTableStmt, context: TransformerContext): any {
    return { CreateForeignTableStmt: node };
  }

  private getFuncformatValue(node: any, funcname: any, context: TransformerContext): string {
    const functionName = this.getFunctionName(node, funcname);
    
    if (!functionName) {
      return 'COERCE_EXPLICIT_CALL';
    }

    const hasPgCatalogPrefix = this.hasPgCatalogPrefix(funcname);
    
    const sqlSyntaxFunctions = [
      'trim', 'ltrim', 'rtrim', 'btrim',
      'position', 'overlay', 'substring',
      'extract', 'timezone', 'xmlexists',
      'current_date', 'current_time', 'current_timestamp',
      'localtime', 'localtimestamp', 'overlaps'
    ];

    // Handle specific functions that depend on pg_catalog prefix
    if (functionName.toLowerCase() === 'substring') {
      if (hasPgCatalogPrefix) {
        return 'COERCE_SQL_SYNTAX';
      }
      return 'COERCE_EXPLICIT_CALL';
    }

    if (functionName.toLowerCase() === 'ltrim') {
      if (hasPgCatalogPrefix) {
        return 'COERCE_SQL_SYNTAX';
      }
      return 'COERCE_EXPLICIT_CALL';
    }

    if (functionName.toLowerCase() === 'btrim') {
      if (hasPgCatalogPrefix) {
        return 'COERCE_SQL_SYNTAX';
      }
      return 'COERCE_EXPLICIT_CALL';
    }

    if (functionName.toLowerCase() === 'pg_collation_for') {
      if (hasPgCatalogPrefix) {
        return 'COERCE_SQL_SYNTAX';
      }
      return 'COERCE_EXPLICIT_CALL';
    }

    if (sqlSyntaxFunctions.includes(functionName.toLowerCase())) {
      return 'COERCE_SQL_SYNTAX';
    }

    return 'COERCE_EXPLICIT_CALL';
  }

  private getFunctionName(node: any, funcname?: any): string | null {
    const names = funcname || node?.funcname;
    if (names && Array.isArray(names) && names.length > 0) {
      const lastName = names[names.length - 1];
      if (lastName && typeof lastName === 'object' && 'String' in lastName) {
        return lastName.String.str || lastName.String.sval;
      }
    }
    return null;
  }

  private hasPgCatalogPrefix(funcname: any): boolean {
    if (funcname && Array.isArray(funcname) && funcname.length >= 2) {
      const firstElement = funcname[0];
      if (firstElement && typeof firstElement === 'object' && 'String' in firstElement) {
        const prefix = firstElement.String.str || firstElement.String.sval;
        return prefix === 'pg_catalog';
      }
    }
    return false;
  }

  RangeTableSample(node: PG16.RangeTableSample, context: TransformerContext): any {
    const result: any = {};
    
    if (node.relation !== undefined) {
      result.relation = this.transform(node.relation as any, context);
    }
    if (node.method !== undefined) {
      result.method = Array.isArray(node.method)
        ? node.method.map(item => this.transform(item as any, context))
        : this.transform(node.method as any, context);
    }
    if (node.args !== undefined) {
      result.args = Array.isArray(node.args)
        ? node.args.map(item => this.transform(item as any, context))
        : this.transform(node.args as any, context);
    }
    if (node.repeatable !== undefined) {
      result.repeatable = this.transform(node.repeatable as any, context);
    }
    if (node.location !== undefined) {
      result.location = node.location;
    }
    
    return { RangeTableSample: result };
  }

  SQLValueFunction(node: PG16.SQLValueFunction, context: TransformerContext): any {
    const result: any = {};
    
    if (node.op !== undefined) {
      result.op = node.op;
    }
    if (node.type !== undefined) {
      result.type = node.type;
    }
    if (node.typmod !== undefined) {
      result.typmod = node.typmod;
    }
    if (node.location !== undefined) {
      result.location = node.location;
    }
    
    return { SQLValueFunction: result };
  }

  XmlExpr(node: PG16.XmlExpr, context: TransformerContext): any {
    const result: any = {};
    
    if (node.op !== undefined) {
      result.op = node.op;
    }
    if (node.name !== undefined) {
      result.name = node.name;
    }
    if (node.named_args !== undefined) {
      result.named_args = Array.isArray(node.named_args)
        ? node.named_args.map(item => this.transform(item as any, context))
        : this.transform(node.named_args as any, context);
    }
    if (node.arg_names !== undefined) {
      result.arg_names = Array.isArray(node.arg_names)
        ? node.arg_names.map(item => this.transform(item as any, context))
        : this.transform(node.arg_names as any, context);
    }
    if (node.args !== undefined) {
      result.args = Array.isArray(node.args)
        ? node.args.map(item => this.transform(item as any, context))
        : this.transform(node.args as any, context);
    }
    if (node.xmloption !== undefined) {
      result.xmloption = node.xmloption;
    }
    if (node.type !== undefined) {
      result.type = node.type;
    }
    if (node.typmod !== undefined) {
      result.typmod = node.typmod;
    }
    if (node.location !== undefined) {
      result.location = node.location;
    }
    
    return { XmlExpr: result };
  }

  RangeSubselect(node: PG16.RangeSubselect, context: TransformerContext): any {
    const result: any = {};
    
    if (node.lateral !== undefined) {
      result.lateral = node.lateral;
    }
    if (node.subquery !== undefined) {
      result.subquery = this.transform(node.subquery as any, context);
    }
    if (node.alias !== undefined) {
      result.alias = this.transform(node.alias as any, context);
    }
    
    return { RangeSubselect: result };
  }

  SetToDefault(node: PG16.SetToDefault, context: TransformerContext): any {
    const result: any = {};
    
    if (node.location !== undefined) {
      result.location = node.location;
    }
    
    return { SetToDefault: result };
  }
}
