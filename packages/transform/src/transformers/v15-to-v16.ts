import * as PG15 from '../15/types';
import { TransformerContext } from './context';

/**
 * V15 to V16 AST Transformer
 * Transforms PostgreSQL v15 AST nodes to v16 format
 */
export class V15ToV16Transformer {
  
  transform(node: PG15.Node, context: TransformerContext = { parentNodeTypes: [] }): any {
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

  visit(node: PG15.Node, context: TransformerContext = { parentNodeTypes: [] }): any {
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

  getNodeType(node: PG15.Node): any {
    return Object.keys(node)[0];
  }

  getNodeData(node: PG15.Node): any {
    const keys = Object.keys(node);
    if (keys.length === 1 && typeof (node as any)[keys[0]] === 'object') {
      return (node as any)[keys[0]];
    }
    return node;
  }

  ParseResult(node: PG15.ParseResult, context: TransformerContext): any {
    
    if (node && typeof node === 'object' && 'version' in node && 'stmts' in node) {
      return {
        version: 160000, // PG16 version
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

  RawStmt(node: PG15.RawStmt, context: TransformerContext): any {
    return node;
  }

  SelectStmt(node: PG15.SelectStmt, context: TransformerContext): any {
    const result: any = {};

    if (node.distinctClause !== undefined) {
      result.distinctClause = Array.isArray(node.distinctClause)
        ? node.distinctClause.map((item: any) => this.transform(item as any, context))
        : this.transform(node.distinctClause as any, context);
    }

    if (node.intoClause !== undefined) {
      result.intoClause = this.transform(node.intoClause as any, context);
    }

    if (node.targetList !== undefined) {
      result.targetList = Array.isArray(node.targetList)
        ? node.targetList.map((item: any) => this.transform(item as any, context))
        : this.transform(node.targetList as any, context);
    }

    if (node.fromClause !== undefined) {
      result.fromClause = Array.isArray(node.fromClause)
        ? node.fromClause.map((item: any) => this.transform(item as any, context))
        : this.transform(node.fromClause as any, context);
    }

    if (node.whereClause !== undefined) {
      result.whereClause = this.transform(node.whereClause as any, context);
    }

    if (node.groupClause !== undefined) {
      result.groupClause = Array.isArray(node.groupClause)
        ? node.groupClause.map((item: any) => this.transform(item as any, context))
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
        ? node.windowClause.map((item: any) => this.transform(item as any, context))
        : this.transform(node.windowClause as any, context);
    }

    if (node.valuesLists !== undefined) {
      result.valuesLists = Array.isArray(node.valuesLists)
        ? node.valuesLists.map((item: any) => this.transform(item as any, context))
        : this.transform(node.valuesLists as any, context);
    }

    if (node.sortClause !== undefined) {
      result.sortClause = Array.isArray(node.sortClause)
        ? node.sortClause.map((item: any) => this.transform(item as any, context))
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
        ? node.lockingClause.map((item: any) => this.transform(item as any, context))
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

  A_Expr(node: PG15.A_Expr, context: TransformerContext): any {
    const result: any = {};

    if (node.kind !== undefined) {
      result.kind = node.kind;
    }

    if (node.name !== undefined) {
      result.name = Array.isArray(node.name)
        ? node.name.map((item: any) => this.transform(item as any, context))
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

  InsertStmt(node: PG15.InsertStmt, context: TransformerContext): any {
    const result: any = {};

    if (node.relation !== undefined) {
      result.relation = this.transform(node.relation as any, context);
    }

    if (node.cols !== undefined) {
      result.cols = Array.isArray(node.cols)
        ? node.cols.map((item: any) => this.transform(item as any, context))
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
        ? node.returningList.map((item: any) => this.transform(item as any, context))
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

  UpdateStmt(node: PG15.UpdateStmt, context: TransformerContext): any {
    const result: any = {};

    if (node.relation !== undefined) {
      result.relation = this.transform(node.relation as any, context);
    }

    if (node.targetList !== undefined) {
      result.targetList = Array.isArray(node.targetList)
        ? node.targetList.map((item: any) => this.transform(item as any, context))
        : this.transform(node.targetList as any, context);
    }

    if (node.whereClause !== undefined) {
      result.whereClause = this.transform(node.whereClause as any, context);
    }

    if (node.fromClause !== undefined) {
      result.fromClause = Array.isArray(node.fromClause)
        ? node.fromClause.map((item: any) => this.transform(item as any, context))
        : this.transform(node.fromClause as any, context);
    }

    if (node.returningList !== undefined) {
      result.returningList = Array.isArray(node.returningList)
        ? node.returningList.map((item: any) => this.transform(item as any, context))
        : this.transform(node.returningList as any, context);
    }

    if (node.withClause !== undefined) {
      result.withClause = this.transform(node.withClause as any, context);
    }

    return { UpdateStmt: result };
  }

  DeleteStmt(node: PG15.DeleteStmt, context: TransformerContext): any {
    const result: any = {};

    if (node.relation !== undefined) {
      result.relation = this.transform(node.relation as any, context);
    }

    if (node.usingClause !== undefined) {
      result.usingClause = Array.isArray(node.usingClause)
        ? node.usingClause.map((item: any) => this.transform(item as any, context))
        : this.transform(node.usingClause as any, context);
    }

    if (node.whereClause !== undefined) {
      result.whereClause = this.transform(node.whereClause as any, context);
    }

    if (node.returningList !== undefined) {
      result.returningList = Array.isArray(node.returningList)
        ? node.returningList.map((item: any) => this.transform(item as any, context))
        : this.transform(node.returningList as any, context);
    }

    if (node.withClause !== undefined) {
      result.withClause = this.transform(node.withClause as any, context);
    }

    return { DeleteStmt: result };
  }

  WithClause(node: PG15.WithClause, context: TransformerContext): any {
    return node;
  }

  ResTarget(node: PG15.ResTarget, context: TransformerContext): any {
    const result: any = {};

    if (node.name !== undefined) {
      result.name = node.name;
    }

    if (node.indirection !== undefined) {
      result.indirection = Array.isArray(node.indirection)
        ? node.indirection.map((item: any) => this.transform(item as any, context))
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

  BoolExpr(node: PG15.BoolExpr, context: TransformerContext): any {
    const result: any = {};

    if (node.boolop !== undefined) {
      result.boolop = node.boolop;
    }

    if (node.args !== undefined) {
      result.args = Array.isArray(node.args)
        ? node.args.map((item: any) => this.transform(item as any, context))
        : this.transform(node.args as any, context);
    }

    if (node.location !== undefined) {
      result.location = node.location;
    }

    return { BoolExpr: result };
  }

  FuncCall(node: PG15.FuncCall, context: TransformerContext): any {
    const result: any = {};

    if (node.funcname !== undefined) {
      result.funcname = Array.isArray(node.funcname)
        ? node.funcname.map((item: any) => this.transform(item as any, context))
        : this.transform(node.funcname as any, context);
    }

    if (node.args !== undefined) {
      result.args = Array.isArray(node.args)
        ? node.args.map((item: any) => this.transform(item as any, context))
        : this.transform(node.args as any, context);
    }

    if (node.agg_order !== undefined) {
      result.agg_order = Array.isArray(node.agg_order)
        ? node.agg_order.map((item: any) => this.transform(item as any, context))
        : this.transform(node.agg_order as any, context);
    }

    if (node.agg_filter !== undefined) {
      result.agg_filter = this.transform(node.agg_filter as any, context);
    }

    if (node.over !== undefined) {
      result.over = this.transform(node.over as any, context);
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

    if (node.funcformat !== undefined) {
      result.funcformat = node.funcformat;
    }

    if (node.location !== undefined) {
      result.location = node.location;
    }

    return { FuncCall: result };
  }

  FuncExpr(node: PG15.FuncExpr, context: TransformerContext): any {
    return node;
  }

  A_Const(node: PG15.A_Const, context: TransformerContext): any {
    const result: any = {};

    if (node.sval !== undefined) {
      result.sval = node.sval;
    }

    if (node.ival !== undefined) {
      result.ival = node.ival;
    }

    if (node.fval !== undefined) {
      result.fval = node.fval;
    }

    if (node.bsval !== undefined) {
      result.bsval = node.bsval;
    }

    if (node.location !== undefined) {
      result.location = node.location;
    }

    return { A_Const: result };
  }

  ColumnRef(node: PG15.ColumnRef, context: TransformerContext): any {
    const result: any = {};

    if (node.fields !== undefined) {
      result.fields = Array.isArray(node.fields)
        ? node.fields.map((item: any) => this.transform(item as any, context))
        : this.transform(node.fields as any, context);
    }

    if (node.location !== undefined) {
      result.location = node.location;
    }

    return { ColumnRef: result };
  }

  TypeName(node: PG15.TypeName, context: TransformerContext): any {
    const result: any = {};

    if (node.names !== undefined) {
      result.names = Array.isArray(node.names)
        ? node.names.map((item: any) => this.transform(item as any, context))
        : this.transform(node.names as any, context);
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
        ? node.typmods.map((item: any) => this.transform(item as any, context))
        : this.transform(node.typmods as any, context);
    }

    if (node.typemod !== undefined) {
      result.typemod = node.typemod;
    }

    if (node.arrayBounds !== undefined) {
      result.arrayBounds = Array.isArray(node.arrayBounds)
        ? node.arrayBounds.map((item: any) => this.transform(item as any, context))
        : this.transform(node.arrayBounds as any, context);
    }

    if (node.location !== undefined) {
      result.location = node.location;
    }

    return { TypeName: result };
  }

  Alias(node: PG15.Alias, context: TransformerContext): any {
    const result: any = {};

    if (node.aliasname !== undefined) {
      result.aliasname = node.aliasname;
    }

    if (node.colnames !== undefined) {
      result.colnames = Array.isArray(node.colnames)
        ? node.colnames.map((item: any) => this.transform(item as any, context))
        : this.transform(node.colnames as any, context);
    }

    return { Alias: result };
  }

  RangeVar(node: PG15.RangeVar, context: TransformerContext): any {
    const result: any = {};

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

  A_ArrayExpr(node: PG15.A_ArrayExpr, context: TransformerContext): any {
    const result: any = {};

    if (node.elements !== undefined) {
      result.elements = Array.isArray(node.elements)
        ? node.elements.map((item: any) => this.transform(item as any, context))
        : this.transform(node.elements as any, context);
    }

    if (node.location !== undefined) {
      result.location = node.location;
    }

    return { A_ArrayExpr: result };
  }

  A_Indices(node: PG15.A_Indices, context: TransformerContext): any {
    const result: any = {};

    if (node.is_slice !== undefined) {
      result.is_slice = node.is_slice;
    }

    if (node.lidx !== undefined) {
      result.lidx = this.transform(node.lidx as any, context);
    }

    if (node.uidx !== undefined) {
      result.uidx = this.transform(node.uidx as any, context);
    }

    return { A_Indices: result };
  }

  A_Indirection(node: PG15.A_Indirection, context: TransformerContext): any {
    const result: any = {};

    if (node.arg !== undefined) {
      result.arg = this.transform(node.arg as any, context);
    }

    if (node.indirection !== undefined) {
      result.indirection = Array.isArray(node.indirection)
        ? node.indirection.map((item: any) => this.transform(item as any, context))
        : this.transform(node.indirection as any, context);
    }

    return { A_Indirection: result };
  }

  A_Star(node: PG15.A_Star, context: TransformerContext): any {
    const result: any = {};

    return { A_Star: result };
  }

  CaseExpr(node: PG15.CaseExpr, context: TransformerContext): any {
    return node;
  }

  CoalesceExpr(node: PG15.CoalesceExpr, context: TransformerContext): any {
    return node;
  }

  TypeCast(node: PG15.TypeCast, context: TransformerContext): any {
    const result: any = {};

    if (node.arg !== undefined) {
      result.arg = this.transform(node.arg as any, context);
    }

    if (node.typeName !== undefined) {
      result.typeName = this.transform(node.typeName as any, context);
    }

    if (node.location !== undefined) {
      result.location = node.location;
    }

    return { TypeCast: result };
  }

  CollateClause(node: PG15.CollateClause, context: TransformerContext): any {
    return node;
  }

  BooleanTest(node: PG15.BooleanTest, context: TransformerContext): any {
    return node;
  }

  NullTest(node: PG15.NullTest, context: TransformerContext): any {
    return node;
  }

  String(node: PG15.String, context: TransformerContext): any {
    const result: any = {};

    if (node.sval !== undefined) {
      result.sval = node.sval;
    }

    return { String: result };
  }
  
  Integer(node: PG15.Integer, context: TransformerContext): any {
    const result: any = {};

    if (node.ival !== undefined) {
      result.ival = node.ival;
    }

    return { Integer: result };
  }
  
  Float(node: PG15.Float, context: TransformerContext): any {
    const result: any = {};

    if (node.fval !== undefined) {
      result.fval = node.fval;
    }

    return { Float: result };
  }
  
  Boolean(node: PG15.Boolean, context: TransformerContext): any {
    const result: any = {};

    if (node.boolval !== undefined) {
      result.boolval = node.boolval;
    }

    return { Boolean: result };
  }
  
  BitString(node: PG15.BitString, context: TransformerContext): any {
    const result: any = {};

    if (node.bsval !== undefined) {
      result.bsval = node.bsval;
    }

    return { BitString: result };
  }
  
  Null(node: PG15.Node, context: TransformerContext): any {
    return node;
  }

  List(node: PG15.List, context: TransformerContext): any {
    const result: any = {};

    if (node.items !== undefined) {
      result.items = Array.isArray(node.items)
        ? node.items.map((item: any) => this.transform(item as any, context))
        : this.transform(node.items as any, context);
    }

    return { List: result };
  }

  CreateStmt(node: PG15.CreateStmt, context: TransformerContext): any {
    const result: any = {};

    if (node.relation !== undefined) {
      result.relation = this.transform(node.relation as any, context);
    }

    if (node.tableElts !== undefined) {
      result.tableElts = Array.isArray(node.tableElts)
        ? node.tableElts.map((item: any) => this.transform(item as any, context))
        : this.transform(node.tableElts as any, context);
    }

    if (node.inhRelations !== undefined) {
      result.inhRelations = Array.isArray(node.inhRelations)
        ? node.inhRelations.map((item: any) => this.transform(item as any, context))
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
        ? node.constraints.map((item: any) => this.transform(item as any, context))
        : this.transform(node.constraints as any, context);
    }

    if (node.options !== undefined) {
      result.options = Array.isArray(node.options)
        ? node.options.map((item: any) => this.transform(item as any, context))
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

  ColumnDef(node: PG15.ColumnDef, context: TransformerContext): any {
    const result: any = {};

    if (node.colname !== undefined) {
      result.colname = node.colname;
    }

    if (node.typeName !== undefined) {
      result.typeName = this.transform(node.typeName as any, context);
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
        ? node.constraints.map((item: any) => this.transform(item as any, context))
        : this.transform(node.constraints as any, context);
    }

    if (node.fdwoptions !== undefined) {
      result.fdwoptions = Array.isArray(node.fdwoptions)
        ? node.fdwoptions.map((item: any) => this.transform(item as any, context))
        : this.transform(node.fdwoptions as any, context);
    }

    if (node.location !== undefined) {
      result.location = node.location;
    }

    return { ColumnDef: result };
  }

  Constraint(node: PG15.Constraint, context: TransformerContext): any {
    return node;
  }

  SubLink(node: PG15.SubLink, context: TransformerContext): any {
    return node;
  }

  CaseWhen(node: PG15.CaseWhen, context: TransformerContext): any {
    return node;
  }

  WindowDef(node: PG15.WindowDef, context: TransformerContext): any {
    return node;
  }

  SortBy(node: PG15.SortBy, context: TransformerContext): any {
    return node;
  }

  GroupingSet(node: PG15.GroupingSet, context: TransformerContext): any {
    return node;
  }

  CommonTableExpr(node: PG15.CommonTableExpr, context: TransformerContext): any {
    return node;
  }

  ParamRef(node: PG15.ParamRef, context: TransformerContext): any {
    return node;
  }

  LockingClause(node: any, context: TransformerContext): any {
    return node;
  }

  MinMaxExpr(node: PG15.MinMaxExpr, context: TransformerContext): any {
    return node;
  }

  RowExpr(node: PG15.RowExpr, context: TransformerContext): any {
    return node;
  }

  OpExpr(node: PG15.OpExpr, context: TransformerContext): any {
    return node;
  }

  DistinctExpr(node: PG15.DistinctExpr, context: TransformerContext): any {
    return node;
  }

  NullIfExpr(node: PG15.NullIfExpr, context: TransformerContext): any {
    return node;
  }

  ScalarArrayOpExpr(node: PG15.ScalarArrayOpExpr, context: TransformerContext): any {
    return node;
  }

  Aggref(node: PG15.Aggref, context: TransformerContext): any {
    return node;
  }

  WindowFunc(node: PG15.WindowFunc, context: TransformerContext): any {
    return node;
  }

  FieldSelect(node: PG15.FieldSelect, context: TransformerContext): any {
    return node;
  }

  RelabelType(node: PG15.RelabelType, context: TransformerContext): any {
    return node;
  }

  CoerceViaIO(node: PG15.CoerceViaIO, context: TransformerContext): any {
    return node;
  }

  ArrayCoerceExpr(node: PG15.ArrayCoerceExpr, context: TransformerContext): any {
    return node;
  }

  ConvertRowtypeExpr(node: PG15.ConvertRowtypeExpr, context: TransformerContext): any {
    return node;
  }

  NamedArgExpr(node: PG15.NamedArgExpr, context: TransformerContext): any {
    return node;
  }

  ViewStmt(node: PG15.ViewStmt, context: TransformerContext): any {
    return node;
  }

  IndexStmt(node: PG15.IndexStmt, context: TransformerContext): any {
    return node;
  }

  IndexElem(node: PG15.IndexElem, context: TransformerContext): any {
    return node;
  }

  PartitionElem(node: PG15.PartitionElem, context: TransformerContext): any {
    return node;
  }

  PartitionCmd(node: PG15.PartitionCmd, context: TransformerContext): any {
    return node;
  }

  JoinExpr(node: PG15.JoinExpr, context: TransformerContext): any {
    return node;
  }

  FromExpr(node: PG15.FromExpr, context: TransformerContext): any {
    return node;
  }

  TransactionStmt(node: PG15.TransactionStmt, context: TransformerContext): any {
    return node;
  }

  VariableSetStmt(node: PG15.VariableSetStmt, context: TransformerContext): any {
    return node;
  }

  VariableShowStmt(node: PG15.VariableShowStmt, context: TransformerContext): any {
    return node;
  }

  CreateSchemaStmt(node: PG15.CreateSchemaStmt, context: TransformerContext): any {
    return node;
  }

  RoleSpec(node: PG15.RoleSpec, context: TransformerContext): any {
    return node;
  }

  DropStmt(node: PG15.DropStmt, context: TransformerContext): any {
    const result: any = {};

    if (node.objects !== undefined) {
      result.objects = Array.isArray(node.objects)
        ? node.objects.map((item: any) => this.transform(item as any, context))
        : this.transform(node.objects as any, context);
    }

    if (node.removeType !== undefined) {
      result.removeType = node.removeType;
    }

    if (node.behavior !== undefined) {
      result.behavior = node.behavior;
    }

    if (node.missing_ok !== undefined) {
      result.missing_ok = node.missing_ok;
    }

    if (node.concurrent !== undefined) {
      result.concurrent = node.concurrent;
    }

    return { DropStmt: result };
  }

  TruncateStmt(node: PG15.TruncateStmt, context: TransformerContext): any {
    return node;
  }

  ReturnStmt(node: PG15.ReturnStmt, context: TransformerContext): any {
    return node;
  }

  PLAssignStmt(node: PG15.PLAssignStmt, context: TransformerContext): any {
    return node;
  }

  CopyStmt(node: PG15.CopyStmt, context: TransformerContext): any {
    return node;
  }

  AlterTableStmt(node: PG15.AlterTableStmt, context: TransformerContext): any {
    const result: any = {};

    if (node.relation !== undefined) {
      result.relation = this.transform(node.relation as any, context);
    }

    if (node.cmds !== undefined) {
      result.cmds = Array.isArray(node.cmds)
        ? node.cmds.map((item: any) => this.transform(item as any, context))
        : this.transform(node.cmds as any, context);
    }

    if (node.missing_ok !== undefined) {
      result.missing_ok = node.missing_ok;
    }

    return { AlterTableStmt: result };
  }

  AlterTableCmd(node: PG15.AlterTableCmd, context: TransformerContext): any {
    const result: any = {};

    if (node.subtype !== undefined) {
      result.subtype = node.subtype;
    }

    if (node.name !== undefined) {
      result.name = node.name;
    }

    if (node.num !== undefined) {
      result.num = node.num;
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

  CreateFunctionStmt(node: PG15.CreateFunctionStmt, context: TransformerContext): any {
    return node;
  }

  FunctionParameter(node: PG15.FunctionParameter, context: TransformerContext): any {
    return node;
  }

  CreateEnumStmt(node: PG15.CreateEnumStmt, context: TransformerContext): any {
    return node;
  }

  CreateDomainStmt(node: PG15.CreateDomainStmt, context: TransformerContext): any {
    return node;
  }

  CreateRoleStmt(node: PG15.CreateRoleStmt, context: TransformerContext): any {
    return node;
  }

  DefElem(node: PG15.DefElem, context: TransformerContext): any {
    return node;
  }

  CreateTableSpaceStmt(node: PG15.CreateTableSpaceStmt, context: TransformerContext): any {
    return node;
  }

  DropTableSpaceStmt(node: PG15.DropTableSpaceStmt, context: TransformerContext): any {
    return node;
  }

  AlterTableSpaceOptionsStmt(node: PG15.AlterTableSpaceOptionsStmt, context: TransformerContext): any {
    return node;
  }

  CreateExtensionStmt(node: PG15.CreateExtensionStmt, context: TransformerContext): any {
    return node;
  }

  AlterExtensionStmt(node: PG15.AlterExtensionStmt, context: TransformerContext): any {
    return node;
  }

  CreateFdwStmt(node: PG15.CreateFdwStmt, context: TransformerContext): any {
    return node;
  }

  SetOperationStmt(node: PG15.SetOperationStmt, context: TransformerContext): any {
    return node;
  }

  ReplicaIdentityStmt(node: PG15.ReplicaIdentityStmt, context: TransformerContext): any {
    return node;
  }

  AlterCollationStmt(node: PG15.AlterCollationStmt, context: TransformerContext): any {
    return node;
  }

  AlterDomainStmt(node: PG15.AlterDomainStmt, context: TransformerContext): any {
    return node;
  }

  PrepareStmt(node: PG15.PrepareStmt, context: TransformerContext): any {
    return node;
  }

  ExecuteStmt(node: PG15.ExecuteStmt, context: TransformerContext): any {
    return node;
  }

  DeallocateStmt(node: PG15.DeallocateStmt, context: TransformerContext): any {
    return node;
  }

  NotifyStmt(node: PG15.NotifyStmt, context: TransformerContext): any {
    return node;
  }

  ListenStmt(node: PG15.ListenStmt, context: TransformerContext): any {
    return node;
  }

  UnlistenStmt(node: PG15.UnlistenStmt, context: TransformerContext): any {
    return node;
  }

  CheckPointStmt(node: PG15.CheckPointStmt, context: TransformerContext): any {
    return node;
  }

  LoadStmt(node: PG15.LoadStmt, context: TransformerContext): any {
    return node;
  }

  DiscardStmt(node: PG15.DiscardStmt, context: TransformerContext): any {
    return node;
  }

  CommentStmt(node: PG15.CommentStmt, context: TransformerContext): any {
    const result: any = {};

    if (node.objtype !== undefined) {
      result.objtype = node.objtype;
    }

    if (node.object !== undefined) {
      result.object = this.transform(node.object as any, context);
    }

    if (node.comment !== undefined) {
      result.comment = node.comment;
    }

    return { CommentStmt: result };
  }

  LockStmt(node: PG15.LockStmt, context: TransformerContext): any {
    return node;
  }

  CreatePolicyStmt(node: PG15.CreatePolicyStmt, context: TransformerContext): any {
    return node;
  }

  AlterPolicyStmt(node: PG15.AlterPolicyStmt, context: TransformerContext): any {
    return node;
  }

  CreateUserMappingStmt(node: PG15.CreateUserMappingStmt, context: TransformerContext): any {
    return node;
  }

  CreateStatsStmt(node: PG15.CreateStatsStmt, context: TransformerContext): any {
    return node;
  }

  StatsElem(node: PG15.StatsElem, context: TransformerContext): any {
    return node;
  }

  CreatePublicationStmt(node: PG15.CreatePublicationStmt, context: TransformerContext): any {
    return node;
  }

  CreateSubscriptionStmt(node: PG15.CreateSubscriptionStmt, context: TransformerContext): any {
    return node;
  }

  AlterPublicationStmt(node: PG15.AlterPublicationStmt, context: TransformerContext): any {
    return node;
  }

  AlterSubscriptionStmt(node: PG15.AlterSubscriptionStmt, context: TransformerContext): any {
    return node;
  }

  DropSubscriptionStmt(node: PG15.DropSubscriptionStmt, context: TransformerContext): any {
    return node;
  }

  DoStmt(node: PG15.DoStmt, context: TransformerContext): any {
    return node;
  }

  InlineCodeBlock(node: PG15.InlineCodeBlock, context: TransformerContext): any {
    return node;
  }

  CallContext(node: PG15.CallContext, context: TransformerContext): any {
    return node;
  }

  ConstraintsSetStmt(node: PG15.ConstraintsSetStmt, context: TransformerContext): any {
    return node;
  }

  AlterSystemStmt(node: PG15.AlterSystemStmt, context: TransformerContext): any {
    return node;
  }

  VacuumRelation(node: PG15.VacuumRelation, context: TransformerContext): any {
    return node;
  }

  DropOwnedStmt(node: PG15.DropOwnedStmt, context: TransformerContext): any {
    return node;
  }

  ReassignOwnedStmt(node: PG15.ReassignOwnedStmt, context: TransformerContext): any {
    return node;
  }

  AlterTSDictionaryStmt(node: PG15.AlterTSDictionaryStmt, context: TransformerContext): any {
    return node;
  }

  AlterTSConfigurationStmt(node: PG15.AlterTSConfigurationStmt, context: TransformerContext): any {
    return node;
  }

  ClosePortalStmt(node: PG15.ClosePortalStmt, context: TransformerContext): any {
    return node;
  }

  FetchStmt(node: PG15.FetchStmt, context: TransformerContext): any {
    return node;
  }

  AlterStatsStmt(node: PG15.AlterStatsStmt, context: TransformerContext): any {
    return node;
  }

  ObjectWithArgs(node: PG15.ObjectWithArgs, context: TransformerContext): any {
    return node;
  }

  AlterOperatorStmt(node: PG15.AlterOperatorStmt, context: TransformerContext): any {
    return node;
  }

  AlterFdwStmt(node: PG15.AlterFdwStmt, context: TransformerContext): any {
    return node;
  }

  CreateForeignServerStmt(node: PG15.CreateForeignServerStmt, context: TransformerContext): any {
    return node;
  }

  AlterForeignServerStmt(node: PG15.AlterForeignServerStmt, context: TransformerContext): any {
    return node;
  }

  AlterUserMappingStmt(node: PG15.AlterUserMappingStmt, context: TransformerContext): any {
    return node;
  }

  DropUserMappingStmt(node: PG15.DropUserMappingStmt, context: TransformerContext): any {
    return node;
  }

  ImportForeignSchemaStmt(node: PG15.ImportForeignSchemaStmt, context: TransformerContext): any {
    return node;
  }

  ClusterStmt(node: PG15.ClusterStmt, context: TransformerContext): any {
    return node;
  }

  VacuumStmt(node: PG15.VacuumStmt, context: TransformerContext): any {
    return node;
  }

  ExplainStmt(node: PG15.ExplainStmt, context: TransformerContext): any {
    return node;
  }

  ReindexStmt(node: PG15.ReindexStmt, context: TransformerContext): any {
    return node;
  }

  CallStmt(node: PG15.CallStmt, context: TransformerContext): any {
    return node;
  }

  CreatedbStmt(node: PG15.CreatedbStmt, context: TransformerContext): any {
    return node;
  }

  DropdbStmt(node: PG15.DropdbStmt, context: TransformerContext): any {
    return node;
  }

  RenameStmt(node: PG15.RenameStmt, context: TransformerContext): any {
    return node;
  }

  AlterOwnerStmt(node: PG15.AlterOwnerStmt, context: TransformerContext): any {
    return node;
  }

  GrantStmt(node: PG15.GrantStmt, context: TransformerContext): any {
    return node;
  }

  GrantRoleStmt(node: PG15.GrantRoleStmt, context: TransformerContext): any {
    return node;
  }

  SecLabelStmt(node: PG15.SecLabelStmt, context: TransformerContext): any {
    return node;
  }

  AlterDefaultPrivilegesStmt(node: PG15.AlterDefaultPrivilegesStmt, context: TransformerContext): any {
    return node;
  }

  CreateConversionStmt(node: PG15.CreateConversionStmt, context: TransformerContext): any {
    return node;
  }

  CreateCastStmt(node: PG15.CreateCastStmt, context: TransformerContext): any {
    return node;
  }

  CreatePLangStmt(node: PG15.CreatePLangStmt, context: TransformerContext): any {
    return node;
  }

  CreateTransformStmt(node: PG15.CreateTransformStmt, context: TransformerContext): any {
    return node;
  }

  CreateTrigStmt(node: PG15.CreateTrigStmt, context: TransformerContext): any {
    return node;
  }

  TriggerTransition(node: PG15.TriggerTransition, context: TransformerContext): any {
    return node;
  }

  CreateEventTrigStmt(node: PG15.CreateEventTrigStmt, context: TransformerContext): any {
    return node;
  }

  AlterEventTrigStmt(node: PG15.AlterEventTrigStmt, context: TransformerContext): any {
    return node;
  }

  CreateOpClassStmt(node: PG15.CreateOpClassStmt, context: TransformerContext): any {
    return node;
  }

  CreateOpFamilyStmt(node: PG15.CreateOpFamilyStmt, context: TransformerContext): any {
    return node;
  }

  AlterOpFamilyStmt(node: PG15.AlterOpFamilyStmt, context: TransformerContext): any {
    return node;
  }

  MergeStmt(node: PG15.MergeStmt, context: TransformerContext): any {
    return node;
  }

  AlterTableMoveAllStmt(node: PG15.AlterTableMoveAllStmt, context: TransformerContext): any {
    return node;
  }

  CreateSeqStmt(node: PG15.CreateSeqStmt, context: TransformerContext): any {
    return node;
  }

  AlterSeqStmt(node: PG15.AlterSeqStmt, context: TransformerContext): any {
    return node;
  }

  CompositeTypeStmt(node: PG15.CompositeTypeStmt, context: TransformerContext): any {
    return node;
  }

  CreateRangeStmt(node: PG15.CreateRangeStmt, context: TransformerContext): any {
    return node;
  }

  AlterEnumStmt(node: PG15.AlterEnumStmt, context: TransformerContext): any {
    return node;
  }

  AlterTypeStmt(node: PG15.AlterTypeStmt, context: TransformerContext): any {
    return node;
  }

  AlterRoleStmt(node: PG15.AlterRoleStmt, context: TransformerContext): any {
    return node;
  }

  DropRoleStmt(node: PG15.DropRoleStmt, context: TransformerContext): any {
    return node;
  }

  CreateAggregateStmt(node: PG15.DefineStmt, context: TransformerContext): any {
    return node;
  }

  CreateTableAsStmt(node: PG15.CreateTableAsStmt, context: TransformerContext): any {
    return node;
  }

  RefreshMatViewStmt(node: PG15.RefreshMatViewStmt, context: TransformerContext): any {
    return node;
  }

  AccessPriv(node: PG15.AccessPriv, context: TransformerContext): any {
    return node;
  }

  DefineStmt(node: PG15.DefineStmt, context: TransformerContext): any {
    return node;
  }

  AlterDatabaseStmt(node: PG15.AlterDatabaseStmt, context: TransformerContext): any {
    return node;
  }

  AlterDatabaseRefreshCollStmt(node: PG15.AlterDatabaseRefreshCollStmt, context: TransformerContext): any {
    return node;
  }

  AlterDatabaseSetStmt(node: PG15.AlterDatabaseSetStmt, context: TransformerContext): any {
    return node;
  }

  DeclareCursorStmt(node: PG15.DeclareCursorStmt, context: TransformerContext): any {
    return node;
  }

  PublicationObjSpec(node: PG15.PublicationObjSpec, context: TransformerContext): any {
    return node;
  }

  PublicationTable(node: PG15.PublicationTable, context: TransformerContext): any {
    return node;
  }

  CreateAmStmt(node: PG15.CreateAmStmt, context: TransformerContext): any {
    return node;
  }

  IntoClause(node: PG15.IntoClause, context: TransformerContext): any {
    return node;
  }

  OnConflictExpr(node: PG15.OnConflictExpr, context: TransformerContext): any {
    return node;
  }

  ScanToken(node: PG15.ScanToken, context: TransformerContext): any {
    return node;
  }

  CreateOpClassItem(node: PG15.CreateOpClassItem, context: TransformerContext): any {
    return node;
  }

  Var(node: PG15.Var, context: TransformerContext): any {
    return node;
  }

  TableFunc(node: PG15.TableFunc, context: TransformerContext): any {
    return node;
  }

  RangeTableFunc(node: PG15.RangeTableFunc, context: TransformerContext): any {
    return node;
  }

  RangeTableFuncCol(node: PG15.RangeTableFuncCol, context: TransformerContext): any {
    return node;
  }

  RangeFunction(node: PG15.RangeFunction, context: TransformerContext): any {
    return node;
  }

  XmlExpr(node: PG15.XmlExpr, context: TransformerContext): any {
    return node;
  }

  RangeTableSample(node: PG15.RangeTableSample, context: TransformerContext): any {
    return node;
  }

  XmlSerialize(node: PG15.XmlSerialize, context: TransformerContext): any {
    return node;
  }

  RuleStmt(node: PG15.RuleStmt, context: TransformerContext): any {
    return node;
  }

  RangeSubselect(node: PG15.RangeSubselect, context: TransformerContext): any {
    return node;
  }

  SQLValueFunction(node: PG15.SQLValueFunction, context: TransformerContext): any {
    return node;
  }

  GroupingFunc(node: PG15.GroupingFunc, context: TransformerContext): any {
    return node;
  }

  MultiAssignRef(node: PG15.MultiAssignRef, context: TransformerContext): any {
    return node;
  }

  SetToDefault(node: PG15.SetToDefault, context: TransformerContext): any {
    return node;
  }

  CurrentOfExpr(node: PG15.CurrentOfExpr, context: TransformerContext): any {
    return node;
  }

  TableLikeClause(node: PG15.TableLikeClause, context: TransformerContext): any {
    return node;
  }

  AlterFunctionStmt(node: PG15.AlterFunctionStmt, context: TransformerContext): any {
    return node;
  }

  AlterObjectSchemaStmt(node: PG15.AlterObjectSchemaStmt, context: TransformerContext): any {
    return node;
  }

  AlterRoleSetStmt(node: PG15.AlterRoleSetStmt, context: TransformerContext): any {
    return node;
  }

  CreateForeignTableStmt(node: PG15.CreateForeignTableStmt, context: TransformerContext): any {
    return node;
  }
}
