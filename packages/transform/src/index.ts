import { Node as PG13Node } from './13/types';
import { Node as PG14Node } from './14/types';
import { Node as PG15Node } from './15/types';
import { Node as PG16Node } from './16/types';
import { Node as PG17Node } from './17/types';
import * as PG13Types from './13/types';
import * as PG14Types from './14/types';
import * as PG14Enums from './14/enums';
import * as PG15Types from './15/types';
import * as PG16Types from './16/types';
import * as PG17Types from './17/types';


export function transform13To14(node: PG13Node): PG14Node {
  if ('ParseResult' in node) {
    return { ParseResult: transform13To14ParseResult(node.ParseResult) };
  }
  if ('ScanResult' in node) {
    return { ScanResult: transform13To14ScanResult(node.ScanResult) };
  }
  if ('Integer' in node) {
    return { Integer: node.Integer };
  }
  if ('Float' in node) {
    return { Float: { str: node.Float.fval } };
  }
  if ('String' in node) {
    return { String: { str: node.String.sval } };
  }
  if ('BitString' in node) {
    return { BitString: { str: node.BitString.bsval } };
  }
  if ('Boolean' in node) {
    return { A_Const: { val: { String: { str: node.Boolean.boolval ? 't' : 'f' } } } };
  }
  if ('List' in node) {
    return { List: transform13To14List(node.List) };
  }
  if ('OidList' in node) {
    return { OidList: transform13To14OidList(node.OidList) };
  }
  if ('IntList' in node) {
    return { IntList: transform13To14IntList(node.IntList) };
  }
  if ('A_Const' in node) {
    return { A_Const: transform13To14A_Const(node.A_Const) };
  }
  if ('Alias' in node) {
    return { Alias: transform13To14Alias(node.Alias) };
  }
  if ('RangeVar' in node) {
    return { RangeVar: transform13To14RangeVar(node.RangeVar) };
  }
  if ('TableFunc' in node) {
    return { TableFunc: transform13To14TableFunc(node.TableFunc) };
  }
  if ('Var' in node) {
    return { Var: transform13To14Var(node.Var) };
  }
  if ('Param' in node) {
    return { Param: transform13To14Param(node.Param) };
  }
  if ('Aggref' in node) {
    return { Aggref: transform13To14Aggref(node.Aggref) };
  }
  if ('Query' in node) {
    return { Query: transform13To14Query(node.Query) };
  }
  if ('SelectStmt' in node) {
    return { SelectStmt: transform13To14SelectStmt(node.SelectStmt) };
  }
  if ('A_Expr' in node) {
    return { A_Expr: transform13To14A_Expr(node.A_Expr) };
  }
  if ('ResTarget' in node) {
    return { ResTarget: transform13To14ResTarget(node.ResTarget) };
  }
  if ('ColumnRef' in node) {
    return { ColumnRef: transform13To14ColumnRef(node.ColumnRef) };
  }
  if ('RawStmt' in node) {
    return { RawStmt: transform13To14RawStmt(node.RawStmt) };
  }
  
  throw new Error(`Unsupported node type: ${JSON.stringify(Object.keys(node))}`);
}

export function transform14To15(node: PG14Node): PG15Node {
  return node as any;
}

export function transform15To16(node: PG15Node): PG16Node {
  return node as any;
}

export function transform16To17(node: PG16Node): PG17Node {
  return node as any;
}

export function transformToLatest(node: PG13Node): PG17Node {
  const pg14 = transform13To14(node);
  const pg15 = transform14To15(pg14);
  const pg16 = transform15To16(pg15);
  const pg17 = transform16To17(pg16);
  return pg17;
}

function transform13To14NodeArray(nodes: PG13Node[] | undefined): PG14Node[] | undefined {
  return nodes?.map(transform13To14);
}

function transform13To14RawStmtArray(stmts: PG13Types.RawStmt[] | undefined): PG14Types.RawStmt[] | undefined {
  return stmts?.map(stmt => transform13To14RawStmt(stmt));
}

function transform13To14OptionalNode(node: PG13Node | undefined): PG14Node | undefined {
  return node ? transform13To14(node) : undefined;
}

function transform13To14FromExpr(fromExpr: PG13Types.FromExpr): PG14Types.FromExpr {
  return {
    fromlist: transform13To14NodeArray(fromExpr.fromlist),
    quals: transform13To14OptionalNode(fromExpr.quals)
  };
}

function transform13To14OnConflictExpr(onConflictExpr: PG13Types.OnConflictExpr): PG14Types.OnConflictExpr {
  return {
    action: onConflictExpr.action,
    arbiterElems: transform13To14NodeArray(onConflictExpr.arbiterElems),
    arbiterWhere: transform13To14OptionalNode(onConflictExpr.arbiterWhere),
    constraint: onConflictExpr.constraint,
    onConflictSet: transform13To14NodeArray(onConflictExpr.onConflictSet),
    onConflictWhere: transform13To14OptionalNode(onConflictExpr.onConflictWhere),
    exclRelIndex: onConflictExpr.exclRelIndex,
    exclRelTlist: transform13To14NodeArray(onConflictExpr.exclRelTlist)
  };
}

function transform13To14IntoClause(intoClause: PG13Types.IntoClause): PG14Types.IntoClause {
  return {
    rel: intoClause.rel ? transform13To14RangeVar(intoClause.rel) : undefined,
    colNames: transform13To14NodeArray(intoClause.colNames),
    accessMethod: intoClause.accessMethod,
    options: transform13To14NodeArray(intoClause.options),
    onCommit: intoClause.onCommit,
    tableSpaceName: intoClause.tableSpaceName,
    viewQuery: transform13To14OptionalNode(intoClause.viewQuery),
    skipData: intoClause.skipData
  };
}

function transform13To14WithClause(withClause: PG13Types.WithClause): PG14Types.WithClause {
  return {
    ctes: transform13To14NodeArray(withClause.ctes),
    recursive: withClause.recursive,
    location: withClause.location
  };
}

function transform13To14SelectStmtNode(selectStmt: PG13Types.SelectStmt): PG14Types.SelectStmt {
  return transform13To14SelectStmt(selectStmt);
}

function transform13To14ParseResult(parseResult: PG13Types.ParseResult): PG14Types.ParseResult {
  return {
    version: parseResult.version,
    stmts: transform13To14RawStmtArray(parseResult.stmts)
  };
}

function transform13To14ScanResult(scanResult: PG13Types.ScanResult): PG14Types.ScanResult {
  return {
    version: scanResult.version,
    tokens: scanResult.tokens as PG14Types.ScanToken[]
  };
}

function transform13To14List(list: PG13Types.List): PG14Types.List {
  return {
    items: transform13To14NodeArray(list.items)
  };
}

function transform13To14OidList(oidList: PG13Types.OidList): PG14Types.OidList {
  return oidList as PG14Types.OidList;
}

function transform13To14IntList(intList: PG13Types.IntList): PG14Types.IntList {
  return intList as PG14Types.IntList;
}

function transform13To14A_Const(aConst: PG13Types.A_Const): PG14Types.A_Const {
  const result: PG14Types.A_Const = {
    location: aConst.location
  };
  
  if (aConst.ival !== undefined) {
    result.val = { Integer: aConst.ival };
  } else if (aConst.sval !== undefined) {
    result.val = { String: { str: aConst.sval.sval } };
  } else if (aConst.fval !== undefined) {
    result.val = { Float: { str: aConst.fval.fval } };
  } else if (aConst.bsval !== undefined) {
    result.val = { BitString: { str: aConst.bsval.bsval } };
  } else if (aConst.boolval !== undefined) {
    result.val = { String: { str: aConst.boolval ? 't' : 'f' } };
  } else if (aConst.isnull) {
    result.val = { Null: {} };
  }
  
  return result;
}

function transform13To14Alias(alias: PG13Types.Alias): PG14Types.Alias {
  return {
    aliasname: alias.aliasname,
    colnames: transform13To14NodeArray(alias.colnames)
  };
}

function transform13To14RangeVar(rangeVar: PG13Types.RangeVar): PG14Types.RangeVar {
  return {
    catalogname: rangeVar.catalogname,
    schemaname: rangeVar.schemaname,
    relname: rangeVar.relname,
    inh: rangeVar.inh,
    relpersistence: rangeVar.relpersistence,
    alias: rangeVar.alias ? transform13To14Alias(rangeVar.alias) : undefined,
    location: rangeVar.location
  };
}

function transform13To14TableFunc(tableFunc: PG13Types.TableFunc): PG14Types.TableFunc {
  return {
    ns_uris: transform13To14NodeArray(tableFunc.ns_uris),
    ns_names: transform13To14NodeArray(tableFunc.ns_names),
    docexpr: transform13To14OptionalNode(tableFunc.docexpr),
    rowexpr: transform13To14OptionalNode(tableFunc.rowexpr),
    colnames: transform13To14NodeArray(tableFunc.colnames),
    coltypes: transform13To14NodeArray(tableFunc.coltypes),
    coltypmods: transform13To14NodeArray(tableFunc.coltypmods),
    colcollations: transform13To14NodeArray(tableFunc.colcollations),
    colexprs: transform13To14NodeArray(tableFunc.colexprs),
    coldefexprs: transform13To14NodeArray(tableFunc.coldefexprs),
    notnulls: tableFunc.notnulls,
    ordinalitycol: tableFunc.ordinalitycol,
    location: tableFunc.location
  };
}

function transform13To14Var(varNode: PG13Types.Var): PG14Types.Var {
  return {
    xpr: transform13To14OptionalNode(varNode.xpr),
    varno: varNode.varno,
    varattno: varNode.varattno,
    vartype: varNode.vartype,
    vartypmod: varNode.vartypmod,
    varcollid: varNode.varcollid,
    varlevelsup: varNode.varlevelsup,

    location: varNode.location
  };
}

function transform13To14Param(param: PG13Types.Param): PG14Types.Param {
  return {
    xpr: transform13To14OptionalNode(param.xpr),
    paramkind: param.paramkind,
    paramid: param.paramid,
    paramtype: param.paramtype,
    paramtypmod: param.paramtypmod,
    paramcollid: param.paramcollid,
    location: param.location
  };
}

function transform13To14Aggref(aggref: PG13Types.Aggref): PG14Types.Aggref {
  return {
    xpr: transform13To14OptionalNode(aggref.xpr),
    aggfnoid: aggref.aggfnoid,
    aggtype: aggref.aggtype,
    aggcollid: aggref.aggcollid,
    inputcollid: aggref.inputcollid,

    aggargtypes: transform13To14NodeArray(aggref.aggargtypes),
    aggdirectargs: transform13To14NodeArray(aggref.aggdirectargs),
    args: transform13To14NodeArray(aggref.args),
    aggorder: transform13To14NodeArray(aggref.aggorder),
    aggdistinct: transform13To14NodeArray(aggref.aggdistinct),
    aggfilter: transform13To14OptionalNode(aggref.aggfilter),
    aggstar: aggref.aggstar,
    aggvariadic: aggref.aggvariadic,
    aggkind: aggref.aggkind,
    agglevelsup: aggref.agglevelsup,
    aggsplit: aggref.aggsplit,
    location: aggref.location
  };
}

function transform13To14Query(query: PG13Types.Query): PG14Types.Query {
  return {
    commandType: query.commandType as PG14Enums.CmdType,
    querySource: query.querySource,
    canSetTag: query.canSetTag,
    utilityStmt: transform13To14OptionalNode(query.utilityStmt),
    resultRelation: query.resultRelation,
    hasAggs: query.hasAggs,
    hasWindowFuncs: query.hasWindowFuncs,
    hasTargetSRFs: query.hasTargetSRFs,
    hasSubLinks: query.hasSubLinks,
    hasDistinctOn: query.hasDistinctOn,
    hasRecursive: query.hasRecursive,
    hasModifyingCTE: query.hasModifyingCTE,
    hasForUpdate: query.hasForUpdate,
    hasRowSecurity: query.hasRowSecurity,
    cteList: transform13To14NodeArray(query.cteList),
    rtable: transform13To14NodeArray(query.rtable),
    jointree: query.jointree ? transform13To14FromExpr(query.jointree) : undefined,
    targetList: transform13To14NodeArray(query.targetList),
    override: query.override,
    onConflict: query.onConflict ? transform13To14OnConflictExpr(query.onConflict) : undefined,
    returningList: transform13To14NodeArray(query.returningList),
    groupClause: transform13To14NodeArray(query.groupClause),
    groupingSets: transform13To14NodeArray(query.groupingSets),
    havingQual: transform13To14OptionalNode(query.havingQual),
    windowClause: transform13To14NodeArray(query.windowClause),
    distinctClause: transform13To14NodeArray(query.distinctClause),
    sortClause: transform13To14NodeArray(query.sortClause),
    limitOffset: transform13To14OptionalNode(query.limitOffset),
    limitCount: transform13To14OptionalNode(query.limitCount),
    limitOption: query.limitOption,
    rowMarks: transform13To14NodeArray(query.rowMarks),
    setOperations: transform13To14OptionalNode(query.setOperations),
    constraintDeps: transform13To14NodeArray(query.constraintDeps),
    withCheckOptions: transform13To14NodeArray(query.withCheckOptions),
    stmt_location: query.stmt_location,
    stmt_len: query.stmt_len
  };
}

function transform13To14SelectStmt(selectStmt: PG13Types.SelectStmt): PG14Types.SelectStmt {
  return {
    distinctClause: transform13To14NodeArray(selectStmt.distinctClause),
    intoClause: selectStmt.intoClause ? transform13To14IntoClause(selectStmt.intoClause) : undefined,
    targetList: transform13To14NodeArray(selectStmt.targetList),
    fromClause: transform13To14NodeArray(selectStmt.fromClause),
    whereClause: transform13To14OptionalNode(selectStmt.whereClause),
    groupClause: transform13To14NodeArray(selectStmt.groupClause),
    havingClause: transform13To14OptionalNode(selectStmt.havingClause),
    windowClause: transform13To14NodeArray(selectStmt.windowClause),
    valuesLists: transform13To14NodeArray(selectStmt.valuesLists),
    sortClause: transform13To14NodeArray(selectStmt.sortClause),
    limitOffset: transform13To14OptionalNode(selectStmt.limitOffset),
    limitCount: transform13To14OptionalNode(selectStmt.limitCount),
    limitOption: selectStmt.limitOption,
    lockingClause: transform13To14NodeArray(selectStmt.lockingClause),
    withClause: selectStmt.withClause ? transform13To14WithClause(selectStmt.withClause) : undefined,
    op: selectStmt.op,
    all: selectStmt.all,
    larg: selectStmt.larg ? transform13To14SelectStmtNode(selectStmt.larg) : undefined,
    rarg: selectStmt.rarg ? transform13To14SelectStmtNode(selectStmt.rarg) : undefined
  };
}

function transform13To14A_Expr(aExpr: PG13Types.A_Expr): PG14Types.A_Expr {
  return {
    kind: aExpr.kind,
    name: transform13To14NodeArray(aExpr.name),
    lexpr: transform13To14OptionalNode(aExpr.lexpr),
    rexpr: transform13To14OptionalNode(aExpr.rexpr),
    location: aExpr.location
  };
}

function transform13To14ResTarget(resTarget: PG13Types.ResTarget): PG14Types.ResTarget {
  return {
    name: resTarget.name,
    indirection: transform13To14NodeArray(resTarget.indirection),
    val: transform13To14OptionalNode(resTarget.val),
    location: resTarget.location
  };
}

function transform13To14ColumnRef(columnRef: PG13Types.ColumnRef): PG14Types.ColumnRef {
  return {
    fields: transform13To14NodeArray(columnRef.fields),
    location: columnRef.location
  };
}

function transform13To14RawStmt(rawStmt: PG13Types.RawStmt): PG14Types.RawStmt {
  return {
    stmt: transform13To14OptionalNode(rawStmt.stmt),
    stmt_location: rawStmt.stmt_location,
    stmt_len: rawStmt.stmt_len
  };
}

export { Node as PG13Node } from './13/types';
export { Node as PG14Node } from './14/types';
export { Node as PG15Node } from './15/types';
export { Node as PG16Node } from './16/types';
export { Node as PG17Node } from './17/types';
export * as PG13Types from './13/types';
export * as PG14Types from './14/types';
export * as PG15Types from './15/types';
export * as PG16Types from './16/types';
export * as PG17Types from './17/types';
