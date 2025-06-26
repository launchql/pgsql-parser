import * as PG13 from '../13/types';
import { TransformerContext } from './context';

export class V13ToV14Transformer {
  
  transform(node: PG13.Node, context: TransformerContext = { parentNodeTypes: [] }): any {
    if (node == null) {
      return null;
    }

    if (typeof node === 'number' || node instanceof Number) {
      return node;
    }

    if (typeof node === 'string') {
      return node;
    }

    if (Array.isArray(node)) {
      return node.map(item => this.transform(item, context));
    }

    // Handle ParseResult objects specially
    if (typeof node === 'object' && node !== null && 'version' in node && 'stmts' in node) {
      return this.ParseResult(node as PG13.ParseResult, context);
    }

    try {
      return this.visit(node, context);
    } catch (error) {
      const nodeType = Object.keys(node)[0];
      throw new Error(`Error transforming ${nodeType}: ${(error as Error).message}`);
    }
  }

  visit(node: PG13.Node, context: TransformerContext = { parentNodeTypes: [] }): any {
    if (!context.parentNodeTypes || !Array.isArray(context.parentNodeTypes)) {
      context = { ...context, parentNodeTypes: [] };
    }
    
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

  private transformGenericNode(node: any, context: TransformerContext): any {
    if (typeof node !== 'object' || node === null) return node;
    if (Array.isArray(node)) return node.map(item => this.transform(item, context));

    const result: any = {};
    for (const [key, value] of Object.entries(node)) {
      if (Array.isArray(value)) {
        result[key] = value.map(item => this.transform(item as any, context));
      } else if (typeof value === 'object' && value !== null) {
        result[key] = this.transform(value as any, context);
      } else {
        result[key] = value;
      }
    }
    return result;
  }

  getNodeType(node: PG13.Node): any {
    return Object.keys(node)[0];
  }

  getNodeData(node: PG13.Node): any {
    const keys = Object.keys(node);
    if (keys.length === 1 && typeof (node as any)[keys[0]] === 'object') {
      return (node as any)[keys[0]];
    }
    return node;
  }

  ParseResult(node: PG13.ParseResult, context: TransformerContext): any {
    if (node && typeof node === 'object' && 'version' in node && 'stmts' in node) {
      return {
        version: 170004,
        stmts: node.stmts.map((stmt: any) => {
          if (stmt && typeof stmt === 'object' && 'stmt' in stmt) {
            return { ...stmt, stmt: this.transform(stmt.stmt, context) };
          }
          return this.transform(stmt, context);
        })
      };
    }
    return node;
  }

  FuncCall(node: PG13.FuncCall, context: TransformerContext): any {
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
    
    // Only add funcformat in specific contexts where it's expected in PG14
    if (this.shouldAddFuncformat(context)) {
      result.funcformat = "COERCE_EXPLICIT_CALL";
    }
    
    return { FuncCall: result };
  }

  private shouldAddFuncformat(context: TransformerContext): boolean {
    return true;
  }

  CallStmt(node: PG13.CallStmt, context: TransformerContext): any {
    const result: any = { ...node };
    
    if (node.funccall !== undefined) {
      const wrappedFuncCall = { FuncCall: node.funccall };
      const transformedFuncCall = this.transform(wrappedFuncCall as any, context);
      result.funccall = transformedFuncCall.FuncCall || transformedFuncCall;
    }
    
    return { CallStmt: result };
  }

  InsertStmt(node: PG13.InsertStmt, context: TransformerContext): any {
    const result: any = { ...node };
    
    if (result.relation !== undefined) {
      result.relation = this.transform(result.relation, context);
    }
    
    if (result.cols !== undefined) {
      result.cols = Array.isArray(result.cols)
        ? result.cols.map((item: any) => this.transform(item, context))
        : this.transform(result.cols, context);
    }
    
    if (result.selectStmt !== undefined) {
      result.selectStmt = this.transform(result.selectStmt, context);
    }
    
    if (result.onConflictClause !== undefined) {
      result.onConflictClause = this.transform(result.onConflictClause, context);
    }
    
    if (result.returningList !== undefined) {
      result.returningList = Array.isArray(result.returningList)
        ? result.returningList.map((item: any) => this.transform(item, context))
        : this.transform(result.returningList, context);
    }
    
    if (result.withClause !== undefined) {
      result.withClause = this.transform(result.withClause, context);
    }
    
    return { InsertStmt: result };
  }

  ResTarget(node: PG13.ResTarget, context: TransformerContext): any {
    const result: any = { ...node };
    
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

  private getFunctionName(funcCall: any): string | null {
    if (funcCall.funcname && Array.isArray(funcCall.funcname)) {
      const lastName = funcCall.funcname[funcCall.funcname.length - 1];
      if (lastName && typeof lastName === 'object' && 'String' in lastName) {
        return lastName.String.str || lastName.String.sval;
      }
    }
    return null;
  }

  FunctionParameter(node: PG13.FunctionParameter, context: TransformerContext): any {
    const result: any = {};
    
    if (node.name !== undefined) {
      result.name = node.name;
    }
    
    if (node.argType !== undefined) {
      result.argType = this.transform(node.argType as any, context);
    }
    
    if (node.defexpr !== undefined) {
      result.defexpr = this.transform(node.defexpr as any, context);
    }
    
    if (node.mode !== undefined) {
      result.mode = node.mode === "FUNC_PARAM_IN" ? "FUNC_PARAM_DEFAULT" : node.mode;
    }
    
    return { FunctionParameter: result };
  }



  AlterFunctionStmt(node: PG13.AlterFunctionStmt, context: TransformerContext): any {
    const result: any = {};
    
    if (node.objtype !== undefined) {
      result.objtype = node.objtype;
    }
    
    if (node.func !== undefined) {
      const funcResult = this.transform(node.func as any, context);
      
      if (funcResult && typeof funcResult === 'object') {
        let funcData = funcResult;
        if ('ObjectWithArgs' in funcResult) {
          funcData = funcResult.ObjectWithArgs;
        }
        

        
        result.func = 'ObjectWithArgs' in funcResult ? { ObjectWithArgs: funcData } : funcData;
      } else {
        result.func = funcResult;
      }
    }
    
    if (node.actions !== undefined) {
      result.actions = Array.isArray(node.actions)
        ? node.actions.map(item => this.transform(item as any, context))
        : this.transform(node.actions as any, context);
    }
    
    return { AlterFunctionStmt: result };
  }

  AlterOwnerStmt(node: PG13.AlterOwnerStmt, context: TransformerContext): any {
    const result: any = {};
    
    if (node.objectType !== undefined) {
      result.objectType = node.objectType;
    }
    
    if (node.object !== undefined) {
      const transformedObject = this.transform(node.object as any, context);
      
      if (node.objectType === 'OBJECT_FUNCTION' && transformedObject && 
          typeof transformedObject === 'object' && 'ObjectWithArgs' in transformedObject) {
        const objWithArgs = transformedObject.ObjectWithArgs;
        

      }
      
      result.object = transformedObject;
    }
    
    if (node.newowner !== undefined) {
      result.newowner = this.transform(node.newowner as any, context);
    }
    
    return { AlterOwnerStmt: result };
  }

  AlterTableStmt(node: PG13.AlterTableStmt, context: TransformerContext): any {
    const result: any = { ...node };
    
    if ('relkind' in result) {
      result.objtype = result.relkind;
      delete result.relkind;
    }
    
    if (result.relation !== undefined) {
      result.relation = this.transform(result.relation as any, context);
    }
    
    if (result.cmds !== undefined) {
      result.cmds = Array.isArray(result.cmds)
        ? result.cmds.map((item: any) => this.transform(item as any, context))
        : this.transform(result.cmds as any, context);
    }
    
    return { AlterTableStmt: result };
  }

  CreateTableAsStmt(node: PG13.CreateTableAsStmt, context: TransformerContext): any {
    const result: any = { ...node };
    
    if ('relkind' in result) {
      result.objtype = result.relkind;
      delete result.relkind;
    }
    
    if (result.query !== undefined) {
      result.query = this.transform(result.query as any, context);
    }
    
    if (result.into !== undefined) {
      result.into = this.transform(result.into as any, context);
    }
    
    return { CreateTableAsStmt: result };
  }

  RawStmt(node: PG13.RawStmt, context: TransformerContext): any {
    const result: any = {};
    
    if (node.stmt !== undefined) {
      result.stmt = this.transform(node.stmt, context);
    }
    
    if (node.stmt_location !== undefined) {
      result.stmt_location = node.stmt_location;
    }
    
    if (node.stmt_len !== undefined) {
      result.stmt_len = node.stmt_len;
    }
    
    return { RawStmt: result };
  }

  SelectStmt(node: PG13.SelectStmt, context: TransformerContext): any {
    const result: any = {};
    
    if (node.distinctClause !== undefined) {
      result.distinctClause = Array.isArray(node.distinctClause)
        ? node.distinctClause.map(item => this.transform(item, context))
        : this.transform(node.distinctClause, context);
    }
    
    if (node.intoClause !== undefined) {
      result.intoClause = this.transform(node.intoClause as any, context);
    }
    
    if (node.targetList !== undefined) {
      result.targetList = Array.isArray(node.targetList)
        ? node.targetList.map(item => this.transform(item, context))
        : this.transform(node.targetList, context);
    }
    
    if (node.fromClause !== undefined) {
      result.fromClause = Array.isArray(node.fromClause)
        ? node.fromClause.map(item => this.transform(item, context))
        : this.transform(node.fromClause, context);
    }
    
    if (node.whereClause !== undefined) {
      result.whereClause = this.transform(node.whereClause, context);
    }
    
    if (node.groupClause !== undefined) {
      result.groupClause = Array.isArray(node.groupClause)
        ? node.groupClause.map(item => this.transform(item, context))
        : this.transform(node.groupClause, context);
    }
    
    if (node.havingClause !== undefined) {
      result.havingClause = this.transform(node.havingClause, context);
    }
    
    if (node.windowClause !== undefined) {
      result.windowClause = Array.isArray(node.windowClause)
        ? node.windowClause.map(item => this.transform(item, context))
        : this.transform(node.windowClause, context);
    }
    
    if (node.valuesLists !== undefined) {
      result.valuesLists = Array.isArray(node.valuesLists)
        ? node.valuesLists.map(item => this.transform(item, context))
        : this.transform(node.valuesLists, context);
    }
    
    if (node.sortClause !== undefined) {
      result.sortClause = Array.isArray(node.sortClause)
        ? node.sortClause.map(item => this.transform(item, context))
        : this.transform(node.sortClause, context);
    }
    
    if (node.limitOffset !== undefined) {
      result.limitOffset = this.transform(node.limitOffset, context);
    }
    
    if (node.limitCount !== undefined) {
      result.limitCount = this.transform(node.limitCount, context);
    }
    
    if (node.limitOption !== undefined) {
      result.limitOption = node.limitOption;
    }
    
    if (node.lockingClause !== undefined) {
      result.lockingClause = Array.isArray(node.lockingClause)
        ? node.lockingClause.map(item => this.transform(item, context))
        : this.transform(node.lockingClause, context);
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

  RangeSubselect(node: PG13.RangeSubselect, context: TransformerContext): any {
    const result: any = {};
    
    if (node.lateral !== undefined) {
      result.lateral = node.lateral;
    }
    
    if (node.subquery !== undefined) {
      result.subquery = this.transform(node.subquery, context);
    }
    
    if (node.alias !== undefined) {
      result.alias = node.alias;
    }
    
    return { RangeSubselect: result };
  }

  CommonTableExpr(node: PG13.CommonTableExpr, context: TransformerContext): any {
    const result: any = { ...node };
    
    if (node.ctename !== undefined) {
      result.ctename = node.ctename;
    }
    
    if (node.aliascolnames !== undefined) {
      result.aliascolnames = Array.isArray(node.aliascolnames)
        ? node.aliascolnames.map(item => this.transform(item as any, context))
        : this.transform(node.aliascolnames as any, context);
    }
    
    if (node.ctematerialized !== undefined) {
      result.ctematerialized = node.ctematerialized;
    }
    
    if (node.ctequery !== undefined) {
      const nodeType = this.getNodeType(node.ctequery as any);
      const nodeData = this.getNodeData(node.ctequery as any);
      
      if (nodeType === 'SelectStmt' && typeof this.SelectStmt === 'function') {
        result.ctequery = this.SelectStmt(nodeData, context);
      } else {
        result.ctequery = this.transform(node.ctequery as any, context);
      }
    }
    
    if (node.location !== undefined) {
      result.location = node.location;
    }
    
    if (node.cterecursive !== undefined) {
      result.cterecursive = node.cterecursive;
    }
    
    if (node.cterefcount !== undefined) {
      result.cterefcount = node.cterefcount;
    }
    
    if (node.ctecolnames !== undefined) {
      result.ctecolnames = Array.isArray(node.ctecolnames)
        ? node.ctecolnames.map(item => this.transform(item as any, context))
        : this.transform(node.ctecolnames as any, context);
    }
    
    if (node.ctecoltypes !== undefined) {
      result.ctecoltypes = Array.isArray(node.ctecoltypes)
        ? node.ctecoltypes.map(item => this.transform(item as any, context))
        : this.transform(node.ctecoltypes as any, context);
    }
    
    if (node.ctecoltypmods !== undefined) {
      result.ctecoltypmods = Array.isArray(node.ctecoltypmods)
        ? node.ctecoltypmods.map(item => this.transform(item as any, context))
        : this.transform(node.ctecoltypmods as any, context);
    }
    
    if (node.ctecolcollations !== undefined) {
      result.ctecolcollations = Array.isArray(node.ctecolcollations)
        ? node.ctecolcollations.map(item => this.transform(item as any, context))
        : this.transform(node.ctecolcollations as any, context);
    }
    
    return { CommonTableExpr: result };
  }

  SubLink(node: PG13.SubLink, context: TransformerContext): any {
    const result: any = {};
    
    if (node.xpr !== undefined) {
      result.xpr = this.transform(node.xpr, context);
    }
    
    if (node.subLinkType !== undefined) {
      result.subLinkType = node.subLinkType;
    }
    
    if (node.subLinkId !== undefined) {
      result.subLinkId = node.subLinkId;
    }
    
    if (node.testexpr !== undefined) {
      result.testexpr = this.transform(node.testexpr, context);
    }
    
    if (node.operName !== undefined) {
      result.operName = node.operName.map(item => this.transform(item, context));
    }
    
    if (node.subselect !== undefined) {
      result.subselect = this.transform(node.subselect, context);
    }
    
    if (node.location !== undefined) {
      result.location = node.location;
    }
    
    return { SubLink: result };
  }

  CopyStmt(node: PG13.CopyStmt, context: TransformerContext): any {
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

  CreateEnumStmt(node: PG13.CreateEnumStmt, context: TransformerContext): any {
    const result: any = {};
    
    if (node.typeName !== undefined) {
      result.typeName = Array.isArray(node.typeName)
        ? node.typeName.map(item => this.transform(item as any, context))
        : this.transform(node.typeName as any, context);
    }
    
    if (node.vals !== undefined) {
      result.vals = Array.isArray(node.vals)
        ? node.vals.map(item => this.transform(item as any, context))
        : this.transform(node.vals as any, context);
    }
    
    return { CreateEnumStmt: result };
  }

  DefineStmt(node: PG13.DefineStmt, context: TransformerContext): any {
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
        ? node.args.map(item => this.transform(item as any, context))
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

  DoStmt(node: PG13.DoStmt, context: TransformerContext): any {
    const result: any = {};
    
    if (node.args !== undefined) {
      result.args = Array.isArray(node.args)
        ? node.args.map(item => this.transform(item as any, context))
        : this.transform(node.args as any, context);
    }
    
    return { DoStmt: result };
  }

  DeclareCursorStmt(node: PG13.DeclareCursorStmt, context: TransformerContext): any {
    const result: any = {};
    
    if (node.portalname !== undefined) {
      result.portalname = node.portalname;
    }
    
    if (node.options === undefined) {
      result.options = 0;
    } else {
      if (node.options === 48) {
        result.options = 288;
      } else {
        result.options = (node.options & ~32) | 256;
      }
    }
    
    if (node.query !== undefined) {
      result.query = this.transform(node.query as any, context);
    }
    
    return { DeclareCursorStmt: result };
  }

  VacuumStmt(node: PG13.VacuumStmt, context: TransformerContext): any {
    const result: any = {};
    
    if (node.options !== undefined) {
      result.options = Array.isArray(node.options)
        ? node.options.map(item => this.transform(item as any, context))
        : this.transform(node.options as any, context);
    }
    
    if (node.rels !== undefined) {
      result.rels = Array.isArray(node.rels)
        ? node.rels.map(item => this.transform(item as any, context))
        : this.transform(node.rels as any, context);
    }
    
    if (node.is_vacuumcmd !== undefined) {
      result.is_vacuumcmd = node.is_vacuumcmd;
    }
    
    return { VacuumStmt: result };
  }

  VacuumRelation(node: PG13.VacuumRelation, context: TransformerContext): any {
    const result: any = {};
    
    if (node.relation !== undefined) {
      result.relation = node.relation;
    }
    
    if (node.va_cols !== undefined) {
      result.va_cols = Array.isArray(node.va_cols)
        ? node.va_cols.map(item => this.transform(item as any, context))
        : this.transform(node.va_cols as any, context);
    }
    
    return { VacuumRelation: result };
  }

  RangeVar(node: PG13.RangeVar, context: TransformerContext): any {
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
    
    // Handle PG13->PG14 inh field transformation
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

  IntoClause(node: PG13.IntoClause, context: TransformerContext): any {
    const result: any = {};
    
    if (node.rel !== undefined) {
      result.rel = node.rel;
    }
    
    if (node.colNames !== undefined) {
      result.colNames = Array.isArray(node.colNames)
        ? node.colNames.map(item => this.transform(item as any, context))
        : this.transform(node.colNames as any, context);
    }
    
    if (node.options !== undefined) {
      result.options = Array.isArray(node.options)
        ? node.options.map(item => this.transform(item as any, context))
        : this.transform(node.options as any, context);
    }
    
    if (node.onCommit !== undefined) {
      result.onCommit = node.onCommit;
    }
    
    if (node.tableSpaceName !== undefined) {
      result.tableSpaceName = node.tableSpaceName;
    }
    
    if (node.viewQuery !== undefined) {
      result.viewQuery = this.transform(node.viewQuery as any, context);
    }
    
    if (node.skipData !== undefined) {
      result.skipData = node.skipData;
    }
    
    return { IntoClause: result };
  }

  CreateCastStmt(node: PG13.CreateCastStmt, context: TransformerContext): any {
    const result: any = {};
    
    if (node.sourcetype !== undefined) {
      result.sourcetype = this.transform(node.sourcetype as any, context);
    }
    
    if (node.targettype !== undefined) {
      result.targettype = this.transform(node.targettype as any, context);
    }
    
    if (node.func !== undefined) {
      const childContext: TransformerContext = {
        ...context,
        parentNodeTypes: [...(context.parentNodeTypes || []), 'CreateCastStmt']
      };
      const wrappedFunc = { ObjectWithArgs: node.func };
      const transformedFunc = this.transform(wrappedFunc as any, childContext);
      result.func = transformedFunc.ObjectWithArgs;
    }
    
    if (node.context !== undefined) {
      result.context = node.context;
    }
    
    if (node.inout !== undefined) {
      result.inout = node.inout;
    }
    
    return { CreateCastStmt: result };
  }

  CreateFunctionStmt(node: PG13.CreateFunctionStmt, context: TransformerContext): any {
    const result: any = { ...node };
    
    if (node.funcname !== undefined) {
      result.funcname = Array.isArray(node.funcname)
        ? node.funcname.map(item => this.transform(item as any, context))
        : this.transform(node.funcname as any, context);
    }
    
    if (node.parameters !== undefined) {
      result.parameters = Array.isArray(node.parameters)
        ? node.parameters.map(item => this.transform(item as any, context))
        : this.transform(node.parameters as any, context);
    }
    
    if (node.returnType !== undefined) {
      result.returnType = this.transform(node.returnType as any, context);
    }
    
    if (node.options !== undefined) {
      result.options = Array.isArray(node.options)
        ? node.options.map(item => this.transform(item as any, context))
        : this.transform(node.options as any, context);
    }
    
    return { CreateFunctionStmt: result };
  }

  TableLikeClause(node: PG13.TableLikeClause, context: TransformerContext): any {
    const result: any = {};
    
    if (node.relation !== undefined) {
      result.relation = this.transform(node.relation as any, context);
    }
    
    if (node.options !== undefined) {
      result.options = node.options >> 1;
    }
    
    return { TableLikeClause: result };
  }

  ObjectWithArgs(node: PG13.ObjectWithArgs, context: TransformerContext): any {
    const result: any = { ...node };

    if (result.objname !== undefined) {
      result.objname = Array.isArray(result.objname) 
        ? result.objname.map((item: any) => this.transform(item, context))
        : this.transform(result.objname, context);
    }
    
    if (result.objargs !== undefined) {
      result.objargs = Array.isArray(result.objargs)
        ? result.objargs.map((item: any) => this.transform(item, context))
        : [this.transform(result.objargs, context)];
    }
    
    // Handle objfuncargs based on context
    const shouldCreateObjfuncargs = this.shouldCreateObjfuncargs(context);
    const shouldPreserveObjfuncargs = this.shouldPreserveObjfuncargs(context);
    
    if (shouldCreateObjfuncargs) {
      // For CreateCastStmt contexts, always set empty objfuncargs
      result.objfuncargs = [];
    } else if (result.objfuncargs !== undefined) {
      if (shouldPreserveObjfuncargs) {
        result.objfuncargs = Array.isArray(result.objfuncargs)
          ? result.objfuncargs.map((item: any) => this.transform(item, context))
          : [this.transform(result.objfuncargs, context)];
      } else {
        delete result.objfuncargs;
      }
    }
    
    return { ObjectWithArgs: result };
  }

  private shouldCreateObjfuncargs(context: TransformerContext): boolean {
    if (!context.parentNodeTypes || context.parentNodeTypes.length === 0) {
      return false;
    }
    
    // CreateCastStmt contexts need empty objfuncargs added in PG14
    for (const parentType of context.parentNodeTypes) {
      if (parentType === 'CreateCastStmt') {
        return true;
      }
    }
    
    return false;
  }

  private shouldPreserveObjfuncargs(context: TransformerContext): boolean {
    if (!context.parentNodeTypes || context.parentNodeTypes.length === 0) {
      return true;
    }
    
    for (const parentType of context.parentNodeTypes) {
      if (parentType === 'AlterFunctionStmt') {
        return false;
      }
    }
    
    return true;
  }

  private isVariadicAggregateContext(context: TransformerContext): boolean {
    let parent = context.parent;
    while (parent) {
      if (parent.currentNode && typeof parent.currentNode === 'object') {
        if ('RenameStmt' in parent.currentNode) {
          const renameStmt = parent.currentNode.RenameStmt;
          return renameStmt?.renameType === 'OBJECT_AGGREGATE';
        }
        if ('CreateAggregateStmt' in parent.currentNode || 
            'AlterAggregateStmt' in parent.currentNode) {
          return true;
        }
      }
      parent = parent.parent;
    }
    return false;
  }

  private isVariadicParameterContext(context: TransformerContext): boolean {
    if (!context.parentNodeTypes || context.parentNodeTypes.length === 0) {
      return false;
    }
    
    for (const parentType of context.parentNodeTypes) {
      if (parentType === 'CreateAggregateStmt' || 
          parentType === 'AlterAggregateStmt') {
        return true;
      }
    }
    
    return false;
  }

  private isCreateFunctionContext(context: TransformerContext): boolean {
    if (!context.parentNodeTypes || context.parentNodeTypes.length === 0) {
      return false;
    }
    
    for (const parentType of context.parentNodeTypes) {
      if (parentType === 'CreateFunctionStmt') {
        return true;
      }
    }
    
    return false;
  }

  String(node: PG13.String, context: TransformerContext): any {
    const result: any = { ...node };
    return { String: result };
  }

  BitString(node: PG13.BitString, context: TransformerContext): any {
    const result: any = { ...node };
    
    return { BitString: result };
  }

  Float(node: PG13.Float, context: TransformerContext): any {
    const result: any = { ...node };
    
    return { Float: result };
  }

  Integer(node: PG13.Integer, context: TransformerContext): any {
    const result: any = { ...node };
    
    return { Integer: result };
  }

  Null(node: PG13.Null, context: TransformerContext): any {
    const result: any = { ...node };
    
    return { Null: result };
  }

  List(node: any, context: TransformerContext): any {
    const result: any = {};
    
    if (node.items !== undefined) {
      result.items = Array.isArray(node.items)
        ? node.items.map((item: any) => this.transform(item as any, context))
        : this.transform(node.items as any, context);
    }
    
    return { List: result };
  }

  A_Expr(node: any, context: TransformerContext): any {
    const result: any = {};
    
    if (node.kind !== undefined) {
      if (node.kind === "AEXPR_OF") {
        result.kind = "AEXPR_IN";
      } else if (node.kind === "AEXPR_PAREN") {
        result.kind = "AEXPR_OP";
      } else {
        result.kind = node.kind;
      }
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

  RoleSpec(node: any, context: TransformerContext): any {
    const result: any = {};
    
    if (node.roletype !== undefined) {
      result.roletype = this.transformRoleSpecType(node.roletype);
    }
    
    if (node.rolename !== undefined) {
      result.rolename = node.rolename;
    }
    
    if (node.location !== undefined) {
      result.location = node.location;
    }
    
    return { RoleSpec: result };
  }

  private transformRoleSpecType(pg13RoleType: any): any {
    // Handle both string and numeric enum values
    if (typeof pg13RoleType === 'string') {
      return pg13RoleType;
    }
    
    // Handle numeric enum values - map PG13 indices to PG14 indices
    if (typeof pg13RoleType === 'number') {
      switch (pg13RoleType) {
        case 0: return 'ROLESPEC_CSTRING'; // Stays at case 0
        case 1: return 'ROLESPEC_CURRENT_USER'; // Shifts from 1 to 2 in PG14
        case 2: return 'ROLESPEC_SESSION_USER'; // Shifts from 2 to 3 in PG14
        case 3: return 'ROLESPEC_PUBLIC'; // Shifts from 3 to 4 in PG14
        default: return 'ROLESPEC_CSTRING';
      }
    }
    
    return pg13RoleType;
  }

  AlterTableCmd(node: any, context: TransformerContext): any {
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

  TypeName(node: any, context: TransformerContext): any {
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

  ColumnRef(node: any, context: TransformerContext): any {
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

  A_Const(node: any, context: TransformerContext): any {
    const result: any = {};
    
    if (node.val !== undefined) {
      result.val = this.transform(node.val as any, context);
    }
    
    if (node.location !== undefined) {
      result.location = node.location;
    }
    
    return { A_Const: result };
  }

  A_Star(node: any, context: TransformerContext): any {
    const result: any = { ...node };
    return { A_Star: result };
  }

  SortBy(node: any, context: TransformerContext): any {
    const result: any = {};
    
    if (node.node !== undefined) {
      result.node = this.transform(node.node as any, context);
    }
    
    if (node.sortby_dir !== undefined) {
      result.sortby_dir = node.sortby_dir;
    }
    
    if (node.sortby_nulls !== undefined) {
      result.sortby_nulls = node.sortby_nulls;
    }
    
    if (node.useOp !== undefined) {
      result.useOp = Array.isArray(node.useOp)
        ? node.useOp.map((item: any) => this.transform(item as any, context))
        : this.transform(node.useOp as any, context);
    }
    
    if (node.location !== undefined) {
      result.location = node.location;
    }
    
    return { SortBy: result };
  }

  CreateDomainStmt(node: any, context: TransformerContext): any {
    const result: any = {};
    
    if (node.domainname !== undefined) {
      result.domainname = Array.isArray(node.domainname)
        ? node.domainname.map((item: any) => this.transform(item as any, context))
        : this.transform(node.domainname as any, context);
    }
    
    if (node.typeName !== undefined) {
      result.typeName = this.transform(node.typeName as any, context);
    }
    
    if (node.collClause !== undefined) {
      result.collClause = this.transform(node.collClause as any, context);
    }
    
    if (node.constraints !== undefined) {
      result.constraints = Array.isArray(node.constraints)
        ? node.constraints.map((item: any) => this.transform(item as any, context))
        : this.transform(node.constraints as any, context);
    }
    
    return { CreateDomainStmt: result };
  }

  CreateSeqStmt(node: any, context: TransformerContext): any {
    const result: any = {};
    
    if (node.sequence !== undefined) {
      result.sequence = this.transform(node.sequence as any, context);
    }
    
    if (node.options !== undefined) {
      result.options = Array.isArray(node.options)
        ? node.options.map((item: any) => this.transform(item as any, context))
        : this.transform(node.options as any, context);
    }
    
    if (node.ownerId !== undefined) {
      result.ownerId = node.ownerId;
    }
    
    if (node.for_identity !== undefined) {
      result.for_identity = node.for_identity;
    }
    
    if (node.if_not_exists !== undefined) {
      result.if_not_exists = node.if_not_exists;
    }
    
    return { CreateSeqStmt: result };
  }

  AlterSeqStmt(node: any, context: TransformerContext): any {
    const result: any = {};
    
    if (node.sequence !== undefined) {
      result.sequence = this.transform(node.sequence as any, context);
    }
    
    if (node.options !== undefined) {
      result.options = Array.isArray(node.options)
        ? node.options.map((item: any) => this.transform(item as any, context))
        : this.transform(node.options as any, context);
    }
    
    if (node.for_identity !== undefined) {
      result.for_identity = node.for_identity;
    }
    
    if (node.missing_ok !== undefined) {
      result.missing_ok = node.missing_ok;
    }
    
    return { AlterSeqStmt: result };
  }

}
