import { Node as PG13Node } from './13/types';
import { Node as PG17Node } from './17/types';
import * as PG13Types from './13/types';
import * as PG17Types from './17/types';

export function transformPG13ToPG17(node: PG13Node): PG17Node {
  if ('ParseResult' in node) {
    return { ParseResult: transformParseResult(node.ParseResult) };
  }
  if ('ScanResult' in node) {
    return { ScanResult: transformScanResult(node.ScanResult) };
  }
  if ('Integer' in node) {
    return { Integer: node.Integer };
  }
  if ('Float' in node) {
    return { Float: node.Float };
  }
  if ('Boolean' in node) {
    return { Boolean: node.Boolean };
  }
  if ('String' in node) {
    return { String: node.String };
  }
  if ('BitString' in node) {
    return { BitString: node.BitString };
  }
  if ('List' in node) {
    return { List: transformList(node.List) };
  }
  if ('OidList' in node) {
    return { OidList: transformOidList(node.OidList) };
  }
  if ('IntList' in node) {
    return { IntList: transformIntList(node.IntList) };
  }
  if ('A_Const' in node) {
    return { A_Const: transformA_Const(node.A_Const) };
  }
  if ('Alias' in node) {
    return { Alias: transformAlias(node.Alias) };
  }
  if ('RangeVar' in node) {
    return { RangeVar: transformRangeVar(node.RangeVar) };
  }
  if ('TableFunc' in node) {
    return { TableFunc: transformTableFunc(node.TableFunc) };
  }
  if ('IntoClause' in node) {
    return { IntoClause: transformIntoClause(node.IntoClause) };
  }
  if ('Var' in node) {
    return { Var: transformVar(node.Var) };
  }
  if ('Param' in node) {
    return { Param: transformParam(node.Param) };
  }
  if ('Aggref' in node) {
    return { Aggref: transformAggref(node.Aggref) };
  }
  if ('GroupingFunc' in node) {
    return { GroupingFunc: transformGroupingFunc(node.GroupingFunc) };
  }
  if ('WindowFunc' in node) {
    return { WindowFunc: transformWindowFunc(node.WindowFunc) };
  }
  if ('SubscriptingRef' in node) {
    return { SubscriptingRef: transformSubscriptingRef(node.SubscriptingRef) };
  }
  if ('FuncExpr' in node) {
    return { FuncExpr: transformFuncExpr(node.FuncExpr) };
  }
  if ('NamedArgExpr' in node) {
    return { NamedArgExpr: transformNamedArgExpr(node.NamedArgExpr) };
  }
  if ('OpExpr' in node) {
    return { OpExpr: transformOpExpr(node.OpExpr) };
  }
  if ('DistinctExpr' in node) {
    return { DistinctExpr: transformDistinctExpr(node.DistinctExpr) };
  }
  if ('NullIfExpr' in node) {
    return { NullIfExpr: transformNullIfExpr(node.NullIfExpr) };
  }
  if ('ScalarArrayOpExpr' in node) {
    return { ScalarArrayOpExpr: transformScalarArrayOpExpr(node.ScalarArrayOpExpr) };
  }
  if ('BoolExpr' in node) {
    return { BoolExpr: transformBoolExpr(node.BoolExpr) };
  }
  if ('SubLink' in node) {
    return { SubLink: transformSubLink(node.SubLink) };
  }
  if ('SubPlan' in node) {
    return { SubPlan: transformSubPlan(node.SubPlan) };
  }
  if ('AlternativeSubPlan' in node) {
    return { AlternativeSubPlan: transformAlternativeSubPlan(node.AlternativeSubPlan) };
  }
  if ('FieldSelect' in node) {
    return { FieldSelect: transformFieldSelect(node.FieldSelect) };
  }
  if ('FieldStore' in node) {
    return { FieldStore: transformFieldStore(node.FieldStore) };
  }
  if ('RelabelType' in node) {
    return { RelabelType: transformRelabelType(node.RelabelType) };
  }
  if ('CoerceViaIO' in node) {
    return { CoerceViaIO: transformCoerceViaIO(node.CoerceViaIO) };
  }
  if ('ArrayCoerceExpr' in node) {
    return { ArrayCoerceExpr: transformArrayCoerceExpr(node.ArrayCoerceExpr) };
  }
  if ('ConvertRowtypeExpr' in node) {
    return { ConvertRowtypeExpr: transformConvertRowtypeExpr(node.ConvertRowtypeExpr) };
  }
  if ('CollateExpr' in node) {
    return { CollateExpr: transformCollateExpr(node.CollateExpr) };
  }
  if ('CaseExpr' in node) {
    return { CaseExpr: transformCaseExpr(node.CaseExpr) };
  }
  if ('CaseWhen' in node) {
    return { CaseWhen: transformCaseWhen(node.CaseWhen) };
  }
  if ('CaseTestExpr' in node) {
    return { CaseTestExpr: transformCaseTestExpr(node.CaseTestExpr) };
  }
  if ('ArrayExpr' in node) {
    return { ArrayExpr: transformArrayExpr(node.ArrayExpr) };
  }
  if ('RowExpr' in node) {
    return { RowExpr: transformRowExpr(node.RowExpr) };
  }
  if ('RowCompareExpr' in node) {
    return { RowCompareExpr: transformRowCompareExpr(node.RowCompareExpr) };
  }
  if ('CoalesceExpr' in node) {
    return { CoalesceExpr: transformCoalesceExpr(node.CoalesceExpr) };
  }
  if ('MinMaxExpr' in node) {
    return { MinMaxExpr: transformMinMaxExpr(node.MinMaxExpr) };
  }
  if ('SQLValueFunction' in node) {
    return { SQLValueFunction: transformSQLValueFunction(node.SQLValueFunction) };
  }
  if ('XmlExpr' in node) {
    return { XmlExpr: transformXmlExpr(node.XmlExpr) };
  }
  if ('JsonFormat' in node) {
    return { JsonFormat: transformJsonFormat(node.JsonFormat) };
  }
  if ('JsonReturning' in node) {
    return { JsonReturning: transformJsonReturning(node.JsonReturning) };
  }
  if ('JsonValueExpr' in node) {
    return { JsonValueExpr: transformJsonValueExpr(node.JsonValueExpr) };
  }
  if ('JsonConstructorExpr' in node) {
    return { JsonConstructorExpr: transformJsonConstructorExpr(node.JsonConstructorExpr) };
  }
  if ('JsonIsPredicate' in node) {
    return { JsonIsPredicate: transformJsonIsPredicate(node.JsonIsPredicate) };
  }
  if ('NullTest' in node) {
    return { NullTest: transformNullTest(node.NullTest) };
  }
  if ('BooleanTest' in node) {
    return { BooleanTest: transformBooleanTest(node.BooleanTest) };
  }
  if ('CoerceToDomain' in node) {
    return { CoerceToDomain: transformCoerceToDomain(node.CoerceToDomain) };
  }
  if ('CoerceToDomainValue' in node) {
    return { CoerceToDomainValue: transformCoerceToDomainValue(node.CoerceToDomainValue) };
  }
  if ('SetToDefault' in node) {
    return { SetToDefault: transformSetToDefault(node.SetToDefault) };
  }
  if ('CurrentOfExpr' in node) {
    return { CurrentOfExpr: transformCurrentOfExpr(node.CurrentOfExpr) };
  }
  if ('NextValueExpr' in node) {
    return { NextValueExpr: transformNextValueExpr(node.NextValueExpr) };
  }
  if ('InferenceElem' in node) {
    return { InferenceElem: transformInferenceElem(node.InferenceElem) };
  }
  if ('TargetEntry' in node) {
    return { TargetEntry: transformTargetEntry(node.TargetEntry) };
  }
  if ('RangeTblRef' in node) {
    return { RangeTblRef: transformRangeTblRef(node.RangeTblRef) };
  }
  if ('JoinExpr' in node) {
    return { JoinExpr: transformJoinExpr(node.JoinExpr) };
  }
  if ('FromExpr' in node) {
    return { FromExpr: transformFromExpr(node.FromExpr) };
  }
  if ('OnConflictExpr' in node) {
    return { OnConflictExpr: transformOnConflictExpr(node.OnConflictExpr) };
  }
  if ('Query' in node) {
    return { Query: transformQuery(node.Query) };
  }
  if ('TypeName' in node) {
    return { TypeName: transformTypeName(node.TypeName) };
  }
  if ('ColumnRef' in node) {
    return { ColumnRef: transformColumnRef(node.ColumnRef) };
  }
  if ('ParamRef' in node) {
    return { ParamRef: transformParamRef(node.ParamRef) };
  }
  if ('A_Expr' in node) {
    return { A_Expr: transformA_Expr(node.A_Expr) };
  }
  if ('TypeCast' in node) {
    return { TypeCast: transformTypeCast(node.TypeCast) };
  }
  if ('CollateClause' in node) {
    return { CollateClause: transformCollateClause(node.CollateClause) };
  }
  if ('RoleSpec' in node) {
    return { RoleSpec: transformRoleSpec(node.RoleSpec) };
  }
  if ('FuncCall' in node) {
    return { FuncCall: transformFuncCall(node.FuncCall) };
  }
  if ('A_Star' in node) {
    return { A_Star: node.A_Star };
  }
  if ('A_Indices' in node) {
    return { A_Indices: transformA_Indices(node.A_Indices) };
  }
  if ('A_Indirection' in node) {
    return { A_Indirection: transformA_Indirection(node.A_Indirection) };
  }
  if ('A_ArrayExpr' in node) {
    return { A_ArrayExpr: transformA_ArrayExpr(node.A_ArrayExpr) };
  }
  if ('ResTarget' in node) {
    return { ResTarget: transformResTarget(node.ResTarget) };
  }
  if ('MultiAssignRef' in node) {
    return { MultiAssignRef: transformMultiAssignRef(node.MultiAssignRef) };
  }
  if ('SortBy' in node) {
    return { SortBy: transformSortBy(node.SortBy) };
  }
  if ('WindowDef' in node) {
    return { WindowDef: transformWindowDef(node.WindowDef) };
  }
  if ('RangeSubselect' in node) {
    return { RangeSubselect: transformRangeSubselect(node.RangeSubselect) };
  }
  if ('RangeFunction' in node) {
    return { RangeFunction: transformRangeFunction(node.RangeFunction) };
  }
  if ('RangeTableFunc' in node) {
    return { RangeTableFunc: transformRangeTableFunc(node.RangeTableFunc) };
  }
  if ('RangeTableFuncCol' in node) {
    return { RangeTableFuncCol: transformRangeTableFuncCol(node.RangeTableFuncCol) };
  }
  if ('RangeTableSample' in node) {
    return { RangeTableSample: transformRangeTableSample(node.RangeTableSample) };
  }
  if ('ColumnDef' in node) {
    return { ColumnDef: transformColumnDef(node.ColumnDef) };
  }
  if ('TableLikeClause' in node) {
    return { TableLikeClause: transformTableLikeClause(node.TableLikeClause) };
  }
  if ('IndexElem' in node) {
    return { IndexElem: transformIndexElem(node.IndexElem) };
  }
  if ('DefElem' in node) {
    return { DefElem: transformDefElem(node.DefElem) };
  }
  if ('LockingClause' in node) {
    return { LockingClause: transformLockingClause(node.LockingClause) };
  }
  if ('XmlSerialize' in node) {
    return { XmlSerialize: transformXmlSerialize(node.XmlSerialize) };
  }
  if ('PartitionElem' in node) {
    return { PartitionElem: transformPartitionElem(node.PartitionElem) };
  }
  if ('PartitionSpec' in node) {
    return { PartitionSpec: transformPartitionSpec(node.PartitionSpec) };
  }
  if ('PartitionBoundSpec' in node) {
    return { PartitionBoundSpec: transformPartitionBoundSpec(node.PartitionBoundSpec) };
  }
  if ('PartitionRangeDatum' in node) {
    return { PartitionRangeDatum: transformPartitionRangeDatum(node.PartitionRangeDatum) };
  }
  if ('PartitionCmd' in node) {
    return { PartitionCmd: transformPartitionCmd(node.PartitionCmd) };
  }
  if ('RangeTblEntry' in node) {
    return { RangeTblEntry: transformRangeTblEntry(node.RangeTblEntry) };
  }

  if ('WindowFuncRunCondition' in node) {
    return node;
  }
  if ('MergeSupportFunc' in node) {
    return node;
  }
  if ('JsonBehavior' in node) {
    return node;
  }
  if ('JsonExpr' in node) {
    return node;
  }
  if ('JsonTablePath' in node) {
    return node;
  }
  if ('JsonTablePathScan' in node) {
    return node;
  }
  if ('JsonTableSiblingJoin' in node) {
    return node;
  }
  if ('MergeAction' in node) {
    return { MergeAction: transformMergeAction(node.MergeAction) };
  }

  throw new Error(`Unknown node type: ${JSON.stringify(node)}`);
}

function transformNodeArray(nodes?: PG13Node[]): PG17Node[] | undefined {
  return nodes?.map(node => transformPG13ToPG17(node));
}

function transformOptionalNode(node?: PG13Node): PG17Node | undefined {
  return node ? transformPG13ToPG17(node) : undefined;
}

function transformParseResult(result: PG13Types.ParseResult): PG17Types.ParseResult {
  return {
    version: result.version,
    stmts: result.stmts?.map(stmt => transformRawStmt(stmt))
  };
}

function transformScanResult(result: PG13Types.ScanResult): PG17Types.ScanResult {
  return {
    version: result.version,
    tokens: result.tokens
  };
}

function transformList(list: PG13Types.List): PG17Types.List {
  return {
    items: transformNodeArray(list.items)
  };
}

function transformA_Const(aConst: PG13Types.A_Const): PG17Types.A_Const {
  return {
    ival: aConst.ival,
    fval: aConst.fval,
    boolval: aConst.boolval,
    sval: aConst.sval,
    bsval: aConst.bsval,
    isnull: aConst.isnull,
    location: aConst.location
  };
}

function transformAlias(alias: PG13Types.Alias): PG17Types.Alias {
  return {
    aliasname: alias.aliasname,
    colnames: transformNodeArray(alias.colnames)
  };
}

function transformRangeVar(rangeVar: PG13Types.RangeVar): PG17Types.RangeVar {
  return {
    catalogname: rangeVar.catalogname,
    schemaname: rangeVar.schemaname,
    relname: rangeVar.relname,
    inh: rangeVar.inh,
    relpersistence: rangeVar.relpersistence,
    alias: rangeVar.alias ? transformAlias(rangeVar.alias) : undefined,
    location: rangeVar.location
  };
}

function transformTableFunc(tableFunc: PG13Types.TableFunc): PG17Types.TableFunc {
  return {
    functype: undefined,
    ns_uris: transformNodeArray(tableFunc.ns_uris),
    ns_names: transformNodeArray(tableFunc.ns_names),
    docexpr: transformOptionalNode(tableFunc.docexpr),
    rowexpr: transformOptionalNode(tableFunc.rowexpr),
    colnames: transformNodeArray(tableFunc.colnames),
    coltypes: transformNodeArray(tableFunc.coltypes),
    coltypmods: transformNodeArray(tableFunc.coltypmods),
    colcollations: transformNodeArray(tableFunc.colcollations),
    colexprs: transformNodeArray(tableFunc.colexprs),
    coldefexprs: transformNodeArray(tableFunc.coldefexprs),
    colvalexprs: undefined,
    passingvalexprs: undefined,
    notnulls: tableFunc.notnulls,
    plan: undefined,
    ordinalitycol: tableFunc.ordinalitycol,
    location: tableFunc.location
  };
}

function transformIntoClause(intoClause: PG13Types.IntoClause): PG17Types.IntoClause {
  return {
    rel: intoClause.rel ? transformRangeVar(intoClause.rel) : undefined,
    colNames: transformNodeArray(intoClause.colNames),
    accessMethod: intoClause.accessMethod,
    options: transformNodeArray(intoClause.options),
    onCommit: intoClause.onCommit,
    tableSpaceName: intoClause.tableSpaceName,
    viewQuery: transformOptionalNode(intoClause.viewQuery),
    skipData: intoClause.skipData
  };
}

function transformVar(varNode: PG13Types.Var): PG17Types.Var {
  return {
    xpr: transformOptionalNode(varNode.xpr),
    varno: varNode.varno,
    varattno: varNode.varattno,
    vartype: varNode.vartype,
    vartypmod: varNode.vartypmod,
    varcollid: varNode.varcollid,
    varlevelsup: varNode.varlevelsup,
    location: varNode.location
  };
}

function transformParam(param: PG13Types.Param): PG17Types.Param {
  return {
    xpr: transformOptionalNode(param.xpr),
    paramkind: param.paramkind,
    paramid: param.paramid,
    paramtype: param.paramtype,
    paramtypmod: param.paramtypmod,
    paramcollid: param.paramcollid,
    location: param.location
  };
}

function transformAggref(aggref: PG13Types.Aggref): PG17Types.Aggref {
  return {
    xpr: transformOptionalNode(aggref.xpr),
    aggfnoid: aggref.aggfnoid,
    aggtype: aggref.aggtype,
    aggcollid: aggref.aggcollid,
    inputcollid: aggref.inputcollid,
    aggdirectargs: transformNodeArray(aggref.aggdirectargs),
    args: transformNodeArray(aggref.args),
    aggorder: transformNodeArray(aggref.aggorder),
    aggdistinct: transformNodeArray(aggref.aggdistinct),
    aggfilter: transformOptionalNode(aggref.aggfilter),
    aggstar: aggref.aggstar,
    aggvariadic: aggref.aggvariadic,
    aggkind: aggref.aggkind,
    agglevelsup: aggref.agglevelsup,
    aggsplit: aggref.aggsplit,
    aggno: aggref.aggno,
    aggtransno: aggref.aggtransno,
    location: aggref.location
  };
}

function transformGroupingFunc(groupingFunc: PG13Types.GroupingFunc): PG17Types.GroupingFunc {
  return {
    xpr: transformOptionalNode(groupingFunc.xpr),
    args: transformNodeArray(groupingFunc.args),
    refs: transformNodeArray(groupingFunc.refs),
    agglevelsup: groupingFunc.agglevelsup,
    location: groupingFunc.location
  };
}

function transformWindowFunc(windowFunc: PG13Types.WindowFunc): PG17Types.WindowFunc {
  return {
    xpr: transformOptionalNode(windowFunc.xpr),
    winfnoid: windowFunc.winfnoid,
    wintype: windowFunc.wintype,
    wincollid: windowFunc.wincollid,
    inputcollid: windowFunc.inputcollid,
    args: transformNodeArray(windowFunc.args),
    aggfilter: transformOptionalNode(windowFunc.aggfilter),
    winref: windowFunc.winref,
    winstar: windowFunc.winstar,
    winagg: windowFunc.winagg,
    location: windowFunc.location
  };
}

function transformSubscriptingRef(subscriptingRef: PG13Types.SubscriptingRef): PG17Types.SubscriptingRef {
  return {
    xpr: transformOptionalNode(subscriptingRef.xpr),
    refcontainertype: subscriptingRef.refcontainertype,
    refelemtype: subscriptingRef.refelemtype,
    refrestype: subscriptingRef.refrestype,
    reftypmod: subscriptingRef.reftypmod,
    refcollid: subscriptingRef.refcollid,
    refupperindexpr: transformNodeArray(subscriptingRef.refupperindexpr),
    reflowerindexpr: transformNodeArray(subscriptingRef.reflowerindexpr),
    refexpr: transformOptionalNode(subscriptingRef.refexpr),
    refassgnexpr: transformOptionalNode(subscriptingRef.refassgnexpr)
  };
}

function transformFuncExpr(funcExpr: PG13Types.FuncExpr): PG17Types.FuncExpr {
  return {
    xpr: transformOptionalNode(funcExpr.xpr),
    funcid: funcExpr.funcid,
    funcresulttype: funcExpr.funcresulttype,
    funcretset: funcExpr.funcretset,
    funcvariadic: funcExpr.funcvariadic,
    funcformat: funcExpr.funcformat,
    funccollid: funcExpr.funccollid,
    inputcollid: funcExpr.inputcollid,
    args: transformNodeArray(funcExpr.args),
    location: funcExpr.location
  };
}

function transformNamedArgExpr(namedArgExpr: PG13Types.NamedArgExpr): PG17Types.NamedArgExpr {
  return {
    xpr: transformOptionalNode(namedArgExpr.xpr),
    arg: transformOptionalNode(namedArgExpr.arg),
    name: namedArgExpr.name,
    argnumber: namedArgExpr.argnumber,
    location: namedArgExpr.location
  };
}

function transformOpExpr(opExpr: PG13Types.OpExpr): PG17Types.OpExpr {
  return {
    xpr: transformOptionalNode(opExpr.xpr),
    opno: opExpr.opno,
    opresulttype: opExpr.opresulttype,
    opretset: opExpr.opretset,
    opcollid: opExpr.opcollid,
    inputcollid: opExpr.inputcollid,
    args: transformNodeArray(opExpr.args),
    location: opExpr.location
  };
}

function transformDistinctExpr(distinctExpr: PG13Types.DistinctExpr): PG17Types.DistinctExpr {
  return {
    xpr: transformOptionalNode(distinctExpr.xpr),
    opno: distinctExpr.opno,
    opresulttype: distinctExpr.opresulttype,
    opretset: distinctExpr.opretset,
    opcollid: distinctExpr.opcollid,
    inputcollid: distinctExpr.inputcollid,
    args: transformNodeArray(distinctExpr.args),
    location: distinctExpr.location
  };
}

function transformNullIfExpr(nullIfExpr: PG13Types.NullIfExpr): PG17Types.NullIfExpr {
  return {
    xpr: transformOptionalNode(nullIfExpr.xpr),
    opno: nullIfExpr.opno,
    opresulttype: nullIfExpr.opresulttype,
    opretset: nullIfExpr.opretset,
    opcollid: nullIfExpr.opcollid,
    inputcollid: nullIfExpr.inputcollid,
    args: transformNodeArray(nullIfExpr.args),
    location: nullIfExpr.location
  };
}

function transformScalarArrayOpExpr(scalarArrayOpExpr: PG13Types.ScalarArrayOpExpr): PG17Types.ScalarArrayOpExpr {
  return {
    xpr: transformOptionalNode(scalarArrayOpExpr.xpr),
    opno: scalarArrayOpExpr.opno,
    useOr: scalarArrayOpExpr.useOr,
    inputcollid: scalarArrayOpExpr.inputcollid,
    args: transformNodeArray(scalarArrayOpExpr.args),
    location: scalarArrayOpExpr.location
  };
}

function transformBoolExpr(boolExpr: PG13Types.BoolExpr): PG17Types.BoolExpr {
  return {
    xpr: transformOptionalNode(boolExpr.xpr),
    boolop: boolExpr.boolop,
    args: transformNodeArray(boolExpr.args),
    location: boolExpr.location
  };
}

function transformSubLink(subLink: PG13Types.SubLink): PG17Types.SubLink {
  return {
    xpr: transformOptionalNode(subLink.xpr),
    subLinkType: subLink.subLinkType,
    subLinkId: subLink.subLinkId,
    testexpr: transformOptionalNode(subLink.testexpr),
    operName: transformNodeArray(subLink.operName),
    subselect: transformOptionalNode(subLink.subselect),
    location: subLink.location
  };
}

function transformSubPlan(subPlan: PG13Types.SubPlan): PG17Types.SubPlan {
  return {
    xpr: transformOptionalNode(subPlan.xpr),
    subLinkType: subPlan.subLinkType,
    testexpr: transformOptionalNode(subPlan.testexpr),
    plan_id: subPlan.plan_id,
    plan_name: subPlan.plan_name,
    firstColType: subPlan.firstColType,
    firstColTypmod: subPlan.firstColTypmod,
    firstColCollation: subPlan.firstColCollation,
    useHashTable: subPlan.useHashTable,
    unknownEqFalse: subPlan.unknownEqFalse,
    parallel_safe: subPlan.parallel_safe,
    args: transformNodeArray(subPlan.args),
    startup_cost: subPlan.startup_cost,
    per_call_cost: subPlan.per_call_cost
  };
}

function transformAlternativeSubPlan(altSubPlan: PG13Types.AlternativeSubPlan): PG17Types.AlternativeSubPlan {
  return {
    xpr: transformOptionalNode(altSubPlan.xpr),
    subplans: transformNodeArray(altSubPlan.subplans)
  };
}

function transformFieldSelect(fieldSelect: PG13Types.FieldSelect): PG17Types.FieldSelect {
  return {
    xpr: transformOptionalNode(fieldSelect.xpr),
    arg: transformOptionalNode(fieldSelect.arg),
    fieldnum: fieldSelect.fieldnum,
    resulttype: fieldSelect.resulttype,
    resulttypmod: fieldSelect.resulttypmod,
    resultcollid: fieldSelect.resultcollid
  };
}

function transformFieldStore(fieldStore: PG13Types.FieldStore): PG17Types.FieldStore {
  return {
    xpr: transformOptionalNode(fieldStore.xpr),
    arg: transformOptionalNode(fieldStore.arg),
    newvals: transformNodeArray(fieldStore.newvals),
    resulttype: fieldStore.resulttype
  };
}

function transformRelabelType(relabelType: PG13Types.RelabelType): PG17Types.RelabelType {
  return {
    xpr: transformOptionalNode(relabelType.xpr),
    arg: transformOptionalNode(relabelType.arg),
    resulttype: relabelType.resulttype,
    resulttypmod: relabelType.resulttypmod,
    resultcollid: relabelType.resultcollid,
    relabelformat: relabelType.relabelformat,
    location: relabelType.location
  };
}

function transformCoerceViaIO(coerceViaIO: PG13Types.CoerceViaIO): PG17Types.CoerceViaIO {
  return {
    xpr: transformOptionalNode(coerceViaIO.xpr),
    arg: transformOptionalNode(coerceViaIO.arg),
    resulttype: coerceViaIO.resulttype,
    resultcollid: coerceViaIO.resultcollid,
    coerceformat: coerceViaIO.coerceformat,
    location: coerceViaIO.location
  };
}

function transformArrayCoerceExpr(arrayCoerceExpr: PG13Types.ArrayCoerceExpr): PG17Types.ArrayCoerceExpr {
  return {
    xpr: transformOptionalNode(arrayCoerceExpr.xpr),
    arg: transformOptionalNode(arrayCoerceExpr.arg),
    elemexpr: transformOptionalNode(arrayCoerceExpr.elemexpr),
    resulttype: arrayCoerceExpr.resulttype,
    resulttypmod: arrayCoerceExpr.resulttypmod,
    resultcollid: arrayCoerceExpr.resultcollid,
    coerceformat: arrayCoerceExpr.coerceformat,
    location: arrayCoerceExpr.location
  };
}

function transformConvertRowtypeExpr(convertRowtypeExpr: PG13Types.ConvertRowtypeExpr): PG17Types.ConvertRowtypeExpr {
  return {
    xpr: transformOptionalNode(convertRowtypeExpr.xpr),
    arg: transformOptionalNode(convertRowtypeExpr.arg),
    resulttype: convertRowtypeExpr.resulttype,
    convertformat: convertRowtypeExpr.convertformat,
    location: convertRowtypeExpr.location
  };
}

function transformCollateExpr(collateExpr: PG13Types.CollateExpr): PG17Types.CollateExpr {
  return {
    xpr: transformOptionalNode(collateExpr.xpr),
    arg: transformOptionalNode(collateExpr.arg),
    collOid: collateExpr.collOid,
    location: collateExpr.location
  };
}

function transformCaseExpr(caseExpr: PG13Types.CaseExpr): PG17Types.CaseExpr {
  return {
    xpr: transformOptionalNode(caseExpr.xpr),
    casetype: caseExpr.casetype,
    casecollid: caseExpr.casecollid,
    arg: transformOptionalNode(caseExpr.arg),
    args: transformNodeArray(caseExpr.args),
    defresult: transformOptionalNode(caseExpr.defresult),
    location: caseExpr.location
  };
}

function transformCaseWhen(caseWhen: PG13Types.CaseWhen): PG17Types.CaseWhen {
  return {
    xpr: transformOptionalNode(caseWhen.xpr),
    expr: transformOptionalNode(caseWhen.expr),
    result: transformOptionalNode(caseWhen.result),
    location: caseWhen.location
  };
}

function transformCaseTestExpr(caseTestExpr: PG13Types.CaseTestExpr): PG17Types.CaseTestExpr {
  return {
    xpr: transformOptionalNode(caseTestExpr.xpr),
    typeId: caseTestExpr.typeId,
    typeMod: caseTestExpr.typeMod,
    collation: caseTestExpr.collation
  };
}

function transformArrayExpr(arrayExpr: PG13Types.ArrayExpr): PG17Types.ArrayExpr {
  return {
    xpr: transformOptionalNode(arrayExpr.xpr),
    array_typeid: arrayExpr.array_typeid,
    array_collid: arrayExpr.array_collid,
    element_typeid: arrayExpr.element_typeid,
    elements: transformNodeArray(arrayExpr.elements),
    multidims: arrayExpr.multidims,
    location: arrayExpr.location
  };
}

function transformRowExpr(rowExpr: PG13Types.RowExpr): PG17Types.RowExpr {
  return {
    xpr: transformOptionalNode(rowExpr.xpr),
    args: transformNodeArray(rowExpr.args),
    row_typeid: rowExpr.row_typeid,
    row_format: rowExpr.row_format,
    colnames: transformNodeArray(rowExpr.colnames),
    location: rowExpr.location
  };
}

function transformRowCompareExpr(rowCompareExpr: PG13Types.RowCompareExpr): PG17Types.RowCompareExpr {
  return {
    xpr: transformOptionalNode(rowCompareExpr.xpr),
    rctype: rowCompareExpr.rctype,
    largs: transformNodeArray(rowCompareExpr.largs),
    rargs: transformNodeArray(rowCompareExpr.rargs)
  };
}

function transformCoalesceExpr(coalesceExpr: PG13Types.CoalesceExpr): PG17Types.CoalesceExpr {
  return {
    xpr: transformOptionalNode(coalesceExpr.xpr),
    coalescetype: coalesceExpr.coalescetype,
    coalescecollid: coalesceExpr.coalescecollid,
    args: transformNodeArray(coalesceExpr.args),
    location: coalesceExpr.location
  };
}

function transformMinMaxExpr(minMaxExpr: PG13Types.MinMaxExpr): PG17Types.MinMaxExpr {
  return {
    xpr: transformOptionalNode(minMaxExpr.xpr),
    minmaxtype: minMaxExpr.minmaxtype,
    minmaxcollid: minMaxExpr.minmaxcollid,
    inputcollid: minMaxExpr.inputcollid,
    op: minMaxExpr.op,
    args: transformNodeArray(minMaxExpr.args),
    location: minMaxExpr.location
  };
}

function transformSQLValueFunction(sqlValueFunction: PG13Types.SQLValueFunction): PG17Types.SQLValueFunction {
  return {
    xpr: transformOptionalNode(sqlValueFunction.xpr),
    op: sqlValueFunction.op,
    type: sqlValueFunction.type,
    typmod: sqlValueFunction.typmod,
    location: sqlValueFunction.location
  };
}

function transformXmlExpr(xmlExpr: PG13Types.XmlExpr): PG17Types.XmlExpr {
  return {
    xpr: transformOptionalNode(xmlExpr.xpr),
    op: xmlExpr.op,
    name: xmlExpr.name,
    named_args: transformNodeArray(xmlExpr.named_args),
    arg_names: transformNodeArray(xmlExpr.arg_names),
    args: transformNodeArray(xmlExpr.args),
    xmloption: xmlExpr.xmloption,
    type: xmlExpr.type,
    typmod: xmlExpr.typmod,
    location: xmlExpr.location
  };
}

function transformJsonFormat(jsonFormat: PG13Types.JsonFormat): PG17Types.JsonFormat {
  return {
    format_type: jsonFormat.format_type,
    encoding: jsonFormat.encoding,
    location: jsonFormat.location
  };
}

function transformJsonReturning(jsonReturning: PG13Types.JsonReturning): PG17Types.JsonReturning {
  return {
    format: jsonReturning.format ? transformJsonFormat(jsonReturning.format) : undefined,
    typid: jsonReturning.typid,
    typmod: jsonReturning.typmod
  };
}

function transformJsonValueExpr(jsonValueExpr: PG13Types.JsonValueExpr): PG17Types.JsonValueExpr {
  return {
    raw_expr: transformOptionalNode(jsonValueExpr.raw_expr),
    formatted_expr: transformOptionalNode(jsonValueExpr.formatted_expr),
    format: jsonValueExpr.format ? transformJsonFormat(jsonValueExpr.format) : undefined
  };
}

function transformJsonConstructorExpr(jsonConstructorExpr: PG13Types.JsonConstructorExpr): PG17Types.JsonConstructorExpr {
  return {
    xpr: transformOptionalNode(jsonConstructorExpr.xpr),
    type: jsonConstructorExpr.type,
    args: transformNodeArray(jsonConstructorExpr.args),
    func: transformOptionalNode(jsonConstructorExpr.func),
    coercion: transformOptionalNode(jsonConstructorExpr.coercion),
    returning: jsonConstructorExpr.returning ? transformJsonReturning(jsonConstructorExpr.returning) : undefined,
    absent_on_null: jsonConstructorExpr.absent_on_null,
    location: jsonConstructorExpr.location
  };
}

function transformJsonIsPredicate(jsonIsPredicate: PG13Types.JsonIsPredicate): PG17Types.JsonIsPredicate {
  return {
    expr: transformOptionalNode(jsonIsPredicate.expr),
    format: jsonIsPredicate.format ? transformJsonFormat(jsonIsPredicate.format) : undefined,
    item_type: jsonIsPredicate.item_type,
    location: jsonIsPredicate.location
  };
}

function transformNullTest(nullTest: PG13Types.NullTest): PG17Types.NullTest {
  return {
    xpr: transformOptionalNode(nullTest.xpr),
    arg: transformOptionalNode(nullTest.arg),
    nulltesttype: nullTest.nulltesttype,
    argisrow: nullTest.argisrow,
    location: nullTest.location
  };
}

function transformBooleanTest(booleanTest: PG13Types.BooleanTest): PG17Types.BooleanTest {
  return {
    xpr: transformOptionalNode(booleanTest.xpr),
    arg: transformOptionalNode(booleanTest.arg),
    booltesttype: booleanTest.booltesttype,
    location: booleanTest.location
  };
}

function transformCoerceToDomain(coerceToDomain: PG13Types.CoerceToDomain): PG17Types.CoerceToDomain {
  return {
    xpr: transformOptionalNode(coerceToDomain.xpr),
    arg: transformOptionalNode(coerceToDomain.arg),
    resulttype: coerceToDomain.resulttype,
    resulttypmod: coerceToDomain.resulttypmod,
    resultcollid: coerceToDomain.resultcollid,
    coercionformat: coerceToDomain.coercionformat,
    location: coerceToDomain.location
  };
}

function transformCoerceToDomainValue(coerceToDomainValue: PG13Types.CoerceToDomainValue): PG17Types.CoerceToDomainValue {
  return {
    xpr: transformOptionalNode(coerceToDomainValue.xpr),
    typeId: coerceToDomainValue.typeId,
    typeMod: coerceToDomainValue.typeMod,
    collation: coerceToDomainValue.collation,
    location: coerceToDomainValue.location
  };
}

function transformSetToDefault(setToDefault: PG13Types.SetToDefault): PG17Types.SetToDefault {
  return {
    xpr: transformOptionalNode(setToDefault.xpr),
    typeId: setToDefault.typeId,
    typeMod: setToDefault.typeMod,
    collation: setToDefault.collation,
    location: setToDefault.location
  };
}

function transformCurrentOfExpr(currentOfExpr: PG13Types.CurrentOfExpr): PG17Types.CurrentOfExpr {
  return {
    xpr: transformOptionalNode(currentOfExpr.xpr),
    cvarno: currentOfExpr.cvarno,
    cursor_name: currentOfExpr.cursor_name,
    cursor_param: currentOfExpr.cursor_param
  };
}

function transformNextValueExpr(nextValueExpr: PG13Types.NextValueExpr): PG17Types.NextValueExpr {
  return {
    xpr: transformOptionalNode(nextValueExpr.xpr),
    seqid: nextValueExpr.seqid,
    typeId: nextValueExpr.typeId
  };
}

function transformInferenceElem(inferenceElem: PG13Types.InferenceElem): PG17Types.InferenceElem {
  return {
    xpr: transformOptionalNode(inferenceElem.xpr),
    expr: transformOptionalNode(inferenceElem.expr),
    infercollid: inferenceElem.infercollid,
    inferopclass: inferenceElem.inferopclass
  };
}

function transformTargetEntry(targetEntry: PG13Types.TargetEntry): PG17Types.TargetEntry {
  return {
    xpr: transformOptionalNode(targetEntry.xpr),
    expr: transformOptionalNode(targetEntry.expr),
    resno: targetEntry.resno,
    resname: targetEntry.resname,
    ressortgroupref: targetEntry.ressortgroupref,
    resorigtbl: targetEntry.resorigtbl,
    resorigcol: targetEntry.resorigcol,
    resjunk: targetEntry.resjunk
  };
}

function transformRangeTblRef(rangeTblRef: PG13Types.RangeTblRef): PG17Types.RangeTblRef {
  return {
    rtindex: rangeTblRef.rtindex
  };
}

function transformJoinExpr(joinExpr: PG13Types.JoinExpr): PG17Types.JoinExpr {
  return {
    jointype: joinExpr.jointype,
    isNatural: joinExpr.isNatural,
    larg: transformOptionalNode(joinExpr.larg),
    rarg: transformOptionalNode(joinExpr.rarg),
    usingClause: transformNodeArray(joinExpr.usingClause),
    join_using_alias: joinExpr.join_using_alias ? transformAlias(joinExpr.join_using_alias) : undefined,
    quals: transformOptionalNode(joinExpr.quals),
    alias: joinExpr.alias ? transformAlias(joinExpr.alias) : undefined,
    rtindex: joinExpr.rtindex
  };
}

function transformFromExpr(fromExpr: PG13Types.FromExpr): PG17Types.FromExpr {
  return {
    fromlist: transformNodeArray(fromExpr.fromlist),
    quals: transformOptionalNode(fromExpr.quals)
  };
}

function transformOnConflictExpr(onConflictExpr: PG13Types.OnConflictExpr): PG17Types.OnConflictExpr {
  return {
    action: onConflictExpr.action,
    arbiterElems: transformNodeArray(onConflictExpr.arbiterElems),
    arbiterWhere: transformOptionalNode(onConflictExpr.arbiterWhere),
    constraint: onConflictExpr.constraint,
    onConflictSet: transformNodeArray(onConflictExpr.onConflictSet),
    onConflictWhere: transformOptionalNode(onConflictExpr.onConflictWhere),
    exclRelIndex: onConflictExpr.exclRelIndex,
    exclRelTlist: transformNodeArray(onConflictExpr.exclRelTlist)
  };
}

function transformQuery(query: PG13Types.Query): PG17Types.Query {
  return {
    commandType: query.commandType,
    querySource: query.querySource,
    canSetTag: query.canSetTag,
    utilityStmt: transformOptionalNode(query.utilityStmt),
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
    isReturn: query.isReturn,
    cteList: transformNodeArray(query.cteList),
    rtable: transformNodeArray(query.rtable),
    jointree: query.jointree ? transformFromExpr(query.jointree) : undefined,
    mergeActionList: transformNodeArray(query.mergeActionList),

    targetList: transformNodeArray(query.targetList),
    override: query.override,
    onConflict: query.onConflict ? transformOnConflictExpr(query.onConflict) : undefined,
    returningList: transformNodeArray(query.returningList),
    groupClause: transformNodeArray(query.groupClause),
    groupingSets: transformNodeArray(query.groupingSets),
    havingQual: transformOptionalNode(query.havingQual),
    windowClause: transformNodeArray(query.windowClause),
    distinctClause: transformNodeArray(query.distinctClause),
    sortClause: transformNodeArray(query.sortClause),
    limitOffset: transformOptionalNode(query.limitOffset),
    limitCount: transformOptionalNode(query.limitCount),
    limitOption: query.limitOption,
    rowMarks: transformNodeArray(query.rowMarks),
    setOperations: transformOptionalNode(query.setOperations),
    withCheckOptions: transformNodeArray(query.withCheckOptions),
    stmt_location: query.stmt_location,
    stmt_len: query.stmt_len
  };
}

function transformTypeName(typeName: PG13Types.TypeName): PG17Types.TypeName {
  return {
    names: transformNodeArray(typeName.names),
    typeOid: typeName.typeOid,
    setof: typeName.setof,
    pct_type: typeName.pct_type,
    typmods: transformNodeArray(typeName.typmods),
    typemod: typeName.typemod,
    arrayBounds: transformNodeArray(typeName.arrayBounds),
    location: typeName.location
  };
}

function transformColumnRef(columnRef: PG13Types.ColumnRef): PG17Types.ColumnRef {
  return {
    fields: transformNodeArray(columnRef.fields),
    location: columnRef.location
  };
}

function transformParamRef(paramRef: PG13Types.ParamRef): PG17Types.ParamRef {
  return {
    number: paramRef.number,
    location: paramRef.location
  };
}

function transformA_Expr(aExpr: PG13Types.A_Expr): PG17Types.A_Expr {
  return {
    kind: aExpr.kind,
    name: transformNodeArray(aExpr.name),
    lexpr: transformOptionalNode(aExpr.lexpr),
    rexpr: transformOptionalNode(aExpr.rexpr),
    location: aExpr.location
  };
}

function transformTypeCast(typeCast: PG13Types.TypeCast): PG17Types.TypeCast {
  return {
    arg: transformOptionalNode(typeCast.arg),
    typeName: typeCast.typeName ? transformTypeName(typeCast.typeName) : undefined,
    location: typeCast.location
  };
}

function transformCollateClause(collateClause: PG13Types.CollateClause): PG17Types.CollateClause {
  return {
    arg: transformOptionalNode(collateClause.arg),
    collname: transformNodeArray(collateClause.collname),
    location: collateClause.location
  };
}

function transformRoleSpec(roleSpec: PG13Types.RoleSpec): PG17Types.RoleSpec {
  return {
    roletype: roleSpec.roletype,
    rolename: roleSpec.rolename,
    location: roleSpec.location
  };
}

function transformFuncCall(funcCall: PG13Types.FuncCall): PG17Types.FuncCall {
  return {
    funcname: transformNodeArray(funcCall.funcname),
    args: transformNodeArray(funcCall.args),
    agg_order: transformNodeArray(funcCall.agg_order),
    agg_filter: transformOptionalNode(funcCall.agg_filter),
    over: funcCall.over ? transformWindowDef(funcCall.over) : undefined,
    agg_within_group: funcCall.agg_within_group,
    agg_star: funcCall.agg_star,
    agg_distinct: funcCall.agg_distinct,
    func_variadic: funcCall.func_variadic,
    funcformat: funcCall.funcformat,
    location: funcCall.location
  };
}



function transformA_Indices(aIndices: PG13Types.A_Indices): PG17Types.A_Indices {
  return {
    is_slice: aIndices.is_slice,
    lidx: transformOptionalNode(aIndices.lidx),
    uidx: transformOptionalNode(aIndices.uidx)
  };
}

function transformA_Indirection(aIndirection: PG13Types.A_Indirection): PG17Types.A_Indirection {
  return {
    arg: transformOptionalNode(aIndirection.arg),
    indirection: transformNodeArray(aIndirection.indirection)
  };
}

function transformA_ArrayExpr(aArrayExpr: PG13Types.A_ArrayExpr): PG17Types.A_ArrayExpr {
  return {
    elements: transformNodeArray(aArrayExpr.elements),
    location: aArrayExpr.location
  };
}

function transformResTarget(resTarget: PG13Types.ResTarget): PG17Types.ResTarget {
  return {
    name: resTarget.name,
    indirection: transformNodeArray(resTarget.indirection),
    val: transformOptionalNode(resTarget.val),
    location: resTarget.location
  };
}

function transformMultiAssignRef(multiAssignRef: PG13Types.MultiAssignRef): PG17Types.MultiAssignRef {
  return {
    source: transformOptionalNode(multiAssignRef.source),
    colno: multiAssignRef.colno,
    ncolumns: multiAssignRef.ncolumns
  };
}

function transformSortBy(sortBy: PG13Types.SortBy): PG17Types.SortBy {
  return {
    node: transformOptionalNode(sortBy.node),
    sortby_dir: sortBy.sortby_dir,
    sortby_nulls: sortBy.sortby_nulls,
    useOp: transformNodeArray(sortBy.useOp),
    location: sortBy.location
  };
}

function transformWindowDef(windowDef: PG13Types.WindowDef): PG17Types.WindowDef {
  return {
    name: windowDef.name,
    refname: windowDef.refname,
    partitionClause: transformNodeArray(windowDef.partitionClause),
    orderClause: transformNodeArray(windowDef.orderClause),
    frameOptions: windowDef.frameOptions,
    startOffset: transformOptionalNode(windowDef.startOffset),
    endOffset: transformOptionalNode(windowDef.endOffset),
    location: windowDef.location
  };
}

function transformRangeSubselect(rangeSubselect: PG13Types.RangeSubselect): PG17Types.RangeSubselect {
  return {
    lateral: rangeSubselect.lateral,
    subquery: transformOptionalNode(rangeSubselect.subquery),
    alias: rangeSubselect.alias ? transformAlias(rangeSubselect.alias) : undefined
  };
}

function transformRangeFunction(rangeFunction: PG13Types.RangeFunction): PG17Types.RangeFunction {
  return {
    lateral: rangeFunction.lateral,
    ordinality: rangeFunction.ordinality,
    is_rowsfrom: rangeFunction.is_rowsfrom,
    functions: transformNodeArray(rangeFunction.functions),
    alias: rangeFunction.alias ? transformAlias(rangeFunction.alias) : undefined,
    coldeflist: transformNodeArray(rangeFunction.coldeflist)
  };
}

function transformRangeTableFunc(rangeTableFunc: PG13Types.RangeTableFunc): PG17Types.RangeTableFunc {
  return {
    lateral: rangeTableFunc.lateral,
    docexpr: transformOptionalNode(rangeTableFunc.docexpr),
    rowexpr: transformOptionalNode(rangeTableFunc.rowexpr),
    namespaces: transformNodeArray(rangeTableFunc.namespaces),
    columns: transformNodeArray(rangeTableFunc.columns),
    alias: rangeTableFunc.alias ? transformAlias(rangeTableFunc.alias) : undefined,
    location: rangeTableFunc.location
  };
}

function transformRangeTableFuncCol(rangeTableFuncCol: PG13Types.RangeTableFuncCol): PG17Types.RangeTableFuncCol {
  return {
    colname: rangeTableFuncCol.colname,
    typeName: rangeTableFuncCol.typeName ? transformTypeName(rangeTableFuncCol.typeName) : undefined,
    for_ordinality: rangeTableFuncCol.for_ordinality,
    is_not_null: rangeTableFuncCol.is_not_null,
    colexpr: transformOptionalNode(rangeTableFuncCol.colexpr),
    coldefexpr: transformOptionalNode(rangeTableFuncCol.coldefexpr),
    location: rangeTableFuncCol.location
  };
}

function transformRangeTableSample(rangeTableSample: PG13Types.RangeTableSample): PG17Types.RangeTableSample {
  return {
    relation: transformOptionalNode(rangeTableSample.relation),
    method: transformNodeArray(rangeTableSample.method),
    args: transformNodeArray(rangeTableSample.args),
    repeatable: transformOptionalNode(rangeTableSample.repeatable),
    location: rangeTableSample.location
  };
}

function transformColumnDef(columnDef: PG13Types.ColumnDef): PG17Types.ColumnDef {
  return {
    colname: columnDef.colname,
    typeName: columnDef.typeName ? transformTypeName(columnDef.typeName) : undefined,
    compression: columnDef.compression,
    inhcount: columnDef.inhcount,
    is_local: columnDef.is_local,
    is_not_null: columnDef.is_not_null,
    is_from_type: columnDef.is_from_type,
    storage: columnDef.storage,
    raw_default: transformOptionalNode(columnDef.raw_default),
    cooked_default: transformOptionalNode(columnDef.cooked_default),
    identity: columnDef.identity,
    identitySequence: columnDef.identitySequence ? transformRangeVar(columnDef.identitySequence) : undefined,
    generated: columnDef.generated,
    collClause: columnDef.collClause ? transformCollateClause(columnDef.collClause) : undefined,
    collOid: columnDef.collOid,
    constraints: transformNodeArray(columnDef.constraints),
    fdwoptions: transformNodeArray(columnDef.fdwoptions),
    location: columnDef.location
  };
}

function transformTableLikeClause(tableLikeClause: PG13Types.TableLikeClause): PG17Types.TableLikeClause {
  return {
    relation: tableLikeClause.relation ? transformRangeVar(tableLikeClause.relation) : undefined,
    options: tableLikeClause.options,
    relationOid: tableLikeClause.relationOid
  };
}

function transformIndexElem(indexElem: PG13Types.IndexElem): PG17Types.IndexElem {
  return {
    name: indexElem.name,
    expr: transformOptionalNode(indexElem.expr),
    indexcolname: indexElem.indexcolname,
    collation: transformNodeArray(indexElem.collation),
    opclass: transformNodeArray(indexElem.opclass),
    opclassopts: transformNodeArray(indexElem.opclassopts),
    ordering: indexElem.ordering,
    nulls_ordering: indexElem.nulls_ordering
  };
}

function transformDefElem(defElem: PG13Types.DefElem): PG17Types.DefElem {
  return {
    defnamespace: defElem.defnamespace,
    defname: defElem.defname,
    arg: transformOptionalNode(defElem.arg),
    defaction: defElem.defaction,
    location: defElem.location
  };
}

function transformLockingClause(lockingClause: PG13Types.LockingClause): PG17Types.LockingClause {
  return {
    lockedRels: transformNodeArray(lockingClause.lockedRels),
    strength: lockingClause.strength,
    waitPolicy: lockingClause.waitPolicy
  };
}

function transformXmlSerialize(xmlSerialize: PG13Types.XmlSerialize): PG17Types.XmlSerialize {
  return {
    xmloption: xmlSerialize.xmloption,
    expr: transformOptionalNode(xmlSerialize.expr),
    typeName: xmlSerialize.typeName ? transformTypeName(xmlSerialize.typeName) : undefined,
    indent: xmlSerialize.indent,
    location: xmlSerialize.location
  };
}

function transformPartitionElem(partitionElem: PG13Types.PartitionElem): PG17Types.PartitionElem {
  return {
    name: partitionElem.name,
    expr: transformOptionalNode(partitionElem.expr),
    collation: transformNodeArray(partitionElem.collation),
    opclass: transformNodeArray(partitionElem.opclass),
    location: partitionElem.location
  };
}

function transformPartitionSpec(partitionSpec: PG13Types.PartitionSpec): PG17Types.PartitionSpec {
  return {
    strategy: partitionSpec.strategy,
    partParams: transformNodeArray(partitionSpec.partParams),
    location: partitionSpec.location
  };
}

function transformPartitionBoundSpec(partitionBoundSpec: PG13Types.PartitionBoundSpec): PG17Types.PartitionBoundSpec {
  return {
    strategy: partitionBoundSpec.strategy,
    is_default: partitionBoundSpec.is_default,
    modulus: partitionBoundSpec.modulus,
    remainder: partitionBoundSpec.remainder,
    listdatums: transformNodeArray(partitionBoundSpec.listdatums),
    lowerdatums: transformNodeArray(partitionBoundSpec.lowerdatums),
    upperdatums: transformNodeArray(partitionBoundSpec.upperdatums),
    location: partitionBoundSpec.location
  };
}

function transformPartitionRangeDatum(partitionRangeDatum: PG13Types.PartitionRangeDatum): PG17Types.PartitionRangeDatum {
  return {
    kind: partitionRangeDatum.kind,
    value: transformOptionalNode(partitionRangeDatum.value),
    location: partitionRangeDatum.location
  };
}

function transformPartitionCmd(partitionCmd: PG13Types.PartitionCmd): PG17Types.PartitionCmd {
  return {
    name: partitionCmd.name ? transformRangeVar(partitionCmd.name) : undefined,
    bound: partitionCmd.bound ? transformPartitionBoundSpec(partitionCmd.bound) : undefined,
    concurrent: partitionCmd.concurrent
  };
}

function transformRangeTblEntry(rangeTblEntry: PG13Types.RangeTblEntry): PG17Types.RangeTblEntry {
  return {
    alias: rangeTblEntry.alias ? transformAlias(rangeTblEntry.alias) : undefined,
    eref: rangeTblEntry.eref ? transformAlias(rangeTblEntry.eref) : undefined,
    rtekind: rangeTblEntry.rtekind,
    relid: rangeTblEntry.relid,
    inh: rangeTblEntry.inh,
    relkind: rangeTblEntry.relkind,
    rellockmode: rangeTblEntry.rellockmode,
    perminfoindex: rangeTblEntry.perminfoindex,
    tablesample: rangeTblEntry.tablesample ? transformTableSampleClause(rangeTblEntry.tablesample) : undefined,
    subquery: rangeTblEntry.subquery ? transformQuery(rangeTblEntry.subquery) : undefined,
    security_barrier: rangeTblEntry.security_barrier,
    jointype: rangeTblEntry.jointype,
    joinmergedcols: rangeTblEntry.joinmergedcols,
    joinaliasvars: transformNodeArray(rangeTblEntry.joinaliasvars),
    join_using_alias: rangeTblEntry.join_using_alias ? transformAlias(rangeTblEntry.join_using_alias) : undefined,
    functions: transformNodeArray(rangeTblEntry.functions),
    funcordinality: rangeTblEntry.funcordinality,
    tablefunc: rangeTblEntry.tablefunc ? transformTableFunc(rangeTblEntry.tablefunc) : undefined,
    values_lists: transformNodeArray(rangeTblEntry.values_lists),
    ctename: rangeTblEntry.ctename,
    ctelevelsup: rangeTblEntry.ctelevelsup,
    self_reference: rangeTblEntry.self_reference,
    enrname: rangeTblEntry.enrname,
    enrtuples: rangeTblEntry.enrtuples,
    lateral: rangeTblEntry.lateral,
    inFromCl: rangeTblEntry.inFromCl,
    securityQuals: transformNodeArray(rangeTblEntry.securityQuals)
  };
}

function transformOidList(oidList: PG13Types.OidList): PG17Types.OidList {
  return oidList as PG17Types.OidList;
}

function transformIntList(intList: PG13Types.IntList): PG17Types.IntList {
  return intList as PG17Types.IntList;
}

function transformRawStmt(rawStmt: PG13Types.RawStmt): PG17Types.RawStmt {
  return {
    stmt: transformOptionalNode(rawStmt.stmt),
    stmt_location: rawStmt.stmt_location,
    stmt_len: rawStmt.stmt_len
  };
}

function transformMergeAction(mergeAction: PG13Types.MergeAction): PG17Types.MergeAction {
  return {
    commandType: mergeAction.commandType,
    override: mergeAction.override,
    qual: transformOptionalNode(mergeAction.qual),
    targetList: transformNodeArray(mergeAction.targetList)
  };
}

function transformTableSampleClause(tableSampleClause: PG13Types.TableSampleClause): PG17Types.TableSampleClause {
  return tableSampleClause as PG17Types.TableSampleClause;
}

export { Node as PG13Node } from './13/types';
export { Node as PG17Node } from './17/types';
export * as PG13Types from './13/types';
export * as PG17Types from './17/types';
