export default {
  "Alias": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "aliasname": {
      "type": "char"
    },
    "colnames": {
      "type": "List"
    }
  },
  "RangeVar": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "catalogname": {
      "type": "char"
    },
    "schemaname": {
      "type": "char"
    },
    "relname": {
      "type": "char"
    },
    "inh": {
      "type": "bool"
    },
    "relpersistence": {
      "type": "char"
    },
    "alias": {
      "type": "Alias",
      "nested": true
    },
    "location": {
      "type": "int"
    }
  },
  "TableFunc": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "ns_uris": {
      "type": "List"
    },
    "ns_names": {
      "type": "List"
    },
    "docexpr": {
      "type": "Node"
    },
    "rowexpr": {
      "type": "Node"
    },
    "colnames": {
      "type": "List"
    },
    "coltypes": {
      "type": "List"
    },
    "coltypmods": {
      "type": "List"
    },
    "colcollations": {
      "type": "List"
    },
    "colexprs": {
      "type": "List"
    },
    "coldefexprs": {
      "type": "List"
    },
    "notnulls": {
      "type": "Bitmapset"
    },
    "ordinalitycol": {
      "type": "int"
    },
    "location": {
      "type": "int"
    }
  },
  "IntoClause": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "rel": {
      "type": "RangeVar",
      "nested": true
    },
    "colNames": {
      "type": "List"
    },
    "accessMethod": {
      "type": "char"
    },
    "options": {
      "type": "List"
    },
    "onCommit": {
      "type": "OnCommitAction",
      "enum": true
    },
    "tableSpaceName": {
      "type": "char"
    },
    "viewQuery": {
      "type": "Node"
    },
    "skipData": {
      "type": "bool"
    }
  },
  "Expr": {
    "type": {
      "type": "NodeTag",
      "enum": true
    }
  },
  "Var": {
    "xpr": {
      "type": "Expr",
      "nested": true
    },
    "varno": {
      "type": "Index"
    },
    "varattno": {
      "type": "AttrNumber"
    },
    "vartype": {
      "type": "Oid"
    },
    "vartypmod": {
      "type": "int32"
    },
    "varcollid": {
      "type": "Oid"
    },
    "varlevelsup": {
      "type": "Index"
    },
    "varnosyn": {
      "type": "Index"
    },
    "varattnosyn": {
      "type": "AttrNumber"
    },
    "location": {
      "type": "int"
    }
  },
  "Const": {
    "xpr": {
      "type": "Expr",
      "nested": true
    },
    "consttype": {
      "type": "Oid"
    },
    "consttypmod": {
      "type": "int32"
    },
    "constcollid": {
      "type": "Oid"
    },
    "constlen": {
      "type": "int"
    },
    "constvalue": {
      "type": "Datum"
    },
    "constisnull": {
      "type": "bool"
    },
    "constbyval": {
      "type": "bool"
    },
    "location": {
      "type": "int"
    }
  },
  "Param": {
    "xpr": {
      "type": "Expr",
      "nested": true
    },
    "paramkind": {
      "type": "ParamKind",
      "enum": true
    },
    "paramid": {
      "type": "int"
    },
    "paramtype": {
      "type": "Oid"
    },
    "paramtypmod": {
      "type": "int32"
    },
    "paramcollid": {
      "type": "Oid"
    },
    "location": {
      "type": "int"
    }
  },
  "Aggref": {
    "xpr": {
      "type": "Expr",
      "nested": true
    },
    "aggfnoid": {
      "type": "Oid"
    },
    "aggtype": {
      "type": "Oid"
    },
    "aggcollid": {
      "type": "Oid"
    },
    "inputcollid": {
      "type": "Oid"
    },
    "aggtranstype": {
      "type": "Oid"
    },
    "aggargtypes": {
      "type": "List"
    },
    "aggdirectargs": {
      "type": "List"
    },
    "args": {
      "type": "List"
    },
    "aggorder": {
      "type": "List"
    },
    "aggdistinct": {
      "type": "List"
    },
    "aggfilter": {
      "type": "Expr",
      "nested": true
    },
    "aggstar": {
      "type": "bool"
    },
    "aggvariadic": {
      "type": "bool"
    },
    "aggkind": {
      "type": "char"
    },
    "agglevelsup": {
      "type": "Index"
    },
    "aggsplit": {
      "type": "AggSplit",
      "enum": true
    },
    "location": {
      "type": "int"
    }
  },
  "GroupingFunc": {
    "xpr": {
      "type": "Expr",
      "nested": true
    },
    "args": {
      "type": "List"
    },
    "refs": {
      "type": "List"
    },
    "cols": {
      "type": "List"
    },
    "agglevelsup": {
      "type": "Index"
    },
    "location": {
      "type": "int"
    }
  },
  "WindowFunc": {
    "xpr": {
      "type": "Expr",
      "nested": true
    },
    "winfnoid": {
      "type": "Oid"
    },
    "wintype": {
      "type": "Oid"
    },
    "wincollid": {
      "type": "Oid"
    },
    "inputcollid": {
      "type": "Oid"
    },
    "args": {
      "type": "List"
    },
    "aggfilter": {
      "type": "Expr",
      "nested": true
    },
    "winref": {
      "type": "Index"
    },
    "winstar": {
      "type": "bool"
    },
    "winagg": {
      "type": "bool"
    },
    "location": {
      "type": "int"
    }
  },
  "SubscriptingRef": {
    "xpr": {
      "type": "Expr",
      "nested": true
    },
    "refcontainertype": {
      "type": "Oid"
    },
    "refelemtype": {
      "type": "Oid"
    },
    "reftypmod": {
      "type": "int32"
    },
    "refcollid": {
      "type": "Oid"
    },
    "refupperindexpr": {
      "type": "List"
    },
    "reflowerindexpr": {
      "type": "List"
    },
    "refexpr": {
      "type": "Expr",
      "nested": true
    },
    "refassgnexpr": {
      "type": "Expr",
      "nested": true
    }
  },
  "FuncExpr": {
    "xpr": {
      "type": "Expr",
      "nested": true
    },
    "funcid": {
      "type": "Oid"
    },
    "funcresulttype": {
      "type": "Oid"
    },
    "funcretset": {
      "type": "bool"
    },
    "funcvariadic": {
      "type": "bool"
    },
    "funcformat": {
      "type": "CoercionForm",
      "enum": true
    },
    "funccollid": {
      "type": "Oid"
    },
    "inputcollid": {
      "type": "Oid"
    },
    "args": {
      "type": "List"
    },
    "location": {
      "type": "int"
    }
  },
  "NamedArgExpr": {
    "xpr": {
      "type": "Expr",
      "nested": true
    },
    "arg": {
      "type": "Expr",
      "nested": true
    },
    "name": {
      "type": "char"
    },
    "argnumber": {
      "type": "int"
    },
    "location": {
      "type": "int"
    }
  },
  "OpExpr": {
    "xpr": {
      "type": "Expr",
      "nested": true
    },
    "opno": {
      "type": "Oid"
    },
    "opfuncid": {
      "type": "Oid"
    },
    "opresulttype": {
      "type": "Oid"
    },
    "opretset": {
      "type": "bool"
    },
    "opcollid": {
      "type": "Oid"
    },
    "inputcollid": {
      "type": "Oid"
    },
    "args": {
      "type": "List"
    },
    "location": {
      "type": "int"
    }
  },
  "ScalarArrayOpExpr": {
    "xpr": {
      "type": "Expr",
      "nested": true
    },
    "opno": {
      "type": "Oid"
    },
    "opfuncid": {
      "type": "Oid"
    },
    "useOr": {
      "type": "bool"
    },
    "inputcollid": {
      "type": "Oid"
    },
    "args": {
      "type": "List"
    },
    "location": {
      "type": "int"
    }
  },
  "BoolExpr": {
    "xpr": {
      "type": "Expr",
      "nested": true
    },
    "boolop": {
      "type": "BoolExprType",
      "enum": true
    },
    "args": {
      "type": "List"
    },
    "location": {
      "type": "int"
    }
  },
  "SubLink": {
    "xpr": {
      "type": "Expr",
      "nested": true
    },
    "subLinkType": {
      "type": "SubLinkType",
      "enum": true
    },
    "subLinkId": {
      "type": "int"
    },
    "testexpr": {
      "type": "Node"
    },
    "operName": {
      "type": "List"
    },
    "subselect": {
      "type": "Node"
    },
    "location": {
      "type": "int"
    }
  },
  "SubPlan": {
    "xpr": {
      "type": "Expr",
      "nested": true
    },
    "subLinkType": {
      "type": "SubLinkType",
      "enum": true
    },
    "testexpr": {
      "type": "Node"
    },
    "paramIds": {
      "type": "List"
    },
    "plan_id": {
      "type": "int"
    },
    "plan_name": {
      "type": "char"
    },
    "firstColType": {
      "type": "Oid"
    },
    "firstColTypmod": {
      "type": "int32"
    },
    "firstColCollation": {
      "type": "Oid"
    },
    "useHashTable": {
      "type": "bool"
    },
    "unknownEqFalse": {
      "type": "bool"
    },
    "parallel_safe": {
      "type": "bool"
    },
    "setParam": {
      "type": "List"
    },
    "parParam": {
      "type": "List"
    },
    "args": {
      "type": "List"
    },
    "startup_cost": {
      "type": "Cost"
    },
    "per_call_cost": {
      "type": "Cost"
    }
  },
  "AlternativeSubPlan": {
    "xpr": {
      "type": "Expr",
      "nested": true
    },
    "subplans": {
      "type": "List"
    }
  },
  "FieldSelect": {
    "xpr": {
      "type": "Expr",
      "nested": true
    },
    "arg": {
      "type": "Expr",
      "nested": true
    },
    "fieldnum": {
      "type": "AttrNumber"
    },
    "resulttype": {
      "type": "Oid"
    },
    "resulttypmod": {
      "type": "int32"
    },
    "resultcollid": {
      "type": "Oid"
    }
  },
  "FieldStore": {
    "xpr": {
      "type": "Expr",
      "nested": true
    },
    "arg": {
      "type": "Expr",
      "nested": true
    },
    "newvals": {
      "type": "List"
    },
    "fieldnums": {
      "type": "List"
    },
    "resulttype": {
      "type": "Oid"
    }
  },
  "RelabelType": {
    "xpr": {
      "type": "Expr",
      "nested": true
    },
    "arg": {
      "type": "Expr",
      "nested": true
    },
    "resulttype": {
      "type": "Oid"
    },
    "resulttypmod": {
      "type": "int32"
    },
    "resultcollid": {
      "type": "Oid"
    },
    "relabelformat": {
      "type": "CoercionForm",
      "enum": true
    },
    "location": {
      "type": "int"
    }
  },
  "CoerceViaIO": {
    "xpr": {
      "type": "Expr",
      "nested": true
    },
    "arg": {
      "type": "Expr",
      "nested": true
    },
    "resulttype": {
      "type": "Oid"
    },
    "resultcollid": {
      "type": "Oid"
    },
    "coerceformat": {
      "type": "CoercionForm",
      "enum": true
    },
    "location": {
      "type": "int"
    }
  },
  "ArrayCoerceExpr": {
    "xpr": {
      "type": "Expr",
      "nested": true
    },
    "arg": {
      "type": "Expr",
      "nested": true
    },
    "elemexpr": {
      "type": "Expr",
      "nested": true
    },
    "resulttype": {
      "type": "Oid"
    },
    "resulttypmod": {
      "type": "int32"
    },
    "resultcollid": {
      "type": "Oid"
    },
    "coerceformat": {
      "type": "CoercionForm",
      "enum": true
    },
    "location": {
      "type": "int"
    }
  },
  "ConvertRowtypeExpr": {
    "xpr": {
      "type": "Expr",
      "nested": true
    },
    "arg": {
      "type": "Expr",
      "nested": true
    },
    "resulttype": {
      "type": "Oid"
    },
    "convertformat": {
      "type": "CoercionForm",
      "enum": true
    },
    "location": {
      "type": "int"
    }
  },
  "CollateExpr": {
    "xpr": {
      "type": "Expr",
      "nested": true
    },
    "arg": {
      "type": "Expr",
      "nested": true
    },
    "collOid": {
      "type": "Oid"
    },
    "location": {
      "type": "int"
    }
  },
  "CaseExpr": {
    "xpr": {
      "type": "Expr",
      "nested": true
    },
    "casetype": {
      "type": "Oid"
    },
    "casecollid": {
      "type": "Oid"
    },
    "arg": {
      "type": "Expr",
      "nested": true
    },
    "args": {
      "type": "List"
    },
    "defresult": {
      "type": "Expr",
      "nested": true
    },
    "location": {
      "type": "int"
    }
  },
  "CaseWhen": {
    "xpr": {
      "type": "Expr",
      "nested": true
    },
    "expr": {
      "type": "Expr",
      "nested": true
    },
    "result": {
      "type": "Expr",
      "nested": true
    },
    "location": {
      "type": "int"
    }
  },
  "CaseTestExpr": {
    "xpr": {
      "type": "Expr",
      "nested": true
    },
    "typeId": {
      "type": "Oid"
    },
    "typeMod": {
      "type": "int32"
    },
    "collation": {
      "type": "Oid"
    }
  },
  "ArrayExpr": {
    "xpr": {
      "type": "Expr",
      "nested": true
    },
    "array_typeid": {
      "type": "Oid"
    },
    "array_collid": {
      "type": "Oid"
    },
    "element_typeid": {
      "type": "Oid"
    },
    "elements": {
      "type": "List"
    },
    "multidims": {
      "type": "bool"
    },
    "location": {
      "type": "int"
    }
  },
  "RowExpr": {
    "xpr": {
      "type": "Expr",
      "nested": true
    },
    "args": {
      "type": "List"
    },
    "row_typeid": {
      "type": "Oid"
    },
    "row_format": {
      "type": "CoercionForm",
      "enum": true
    },
    "colnames": {
      "type": "List"
    },
    "location": {
      "type": "int"
    }
  },
  "RowCompareExpr": {
    "xpr": {
      "type": "Expr",
      "nested": true
    },
    "rctype": {
      "type": "RowCompareType",
      "enum": true
    },
    "opnos": {
      "type": "List"
    },
    "opfamilies": {
      "type": "List"
    },
    "inputcollids": {
      "type": "List"
    },
    "largs": {
      "type": "List"
    },
    "rargs": {
      "type": "List"
    }
  },
  "CoalesceExpr": {
    "xpr": {
      "type": "Expr",
      "nested": true
    },
    "coalescetype": {
      "type": "Oid"
    },
    "coalescecollid": {
      "type": "Oid"
    },
    "args": {
      "type": "List"
    },
    "location": {
      "type": "int"
    }
  },
  "MinMaxExpr": {
    "xpr": {
      "type": "Expr",
      "nested": true
    },
    "minmaxtype": {
      "type": "Oid"
    },
    "minmaxcollid": {
      "type": "Oid"
    },
    "inputcollid": {
      "type": "Oid"
    },
    "op": {
      "type": "MinMaxOp",
      "enum": true
    },
    "args": {
      "type": "List"
    },
    "location": {
      "type": "int"
    }
  },
  "SQLValueFunction": {
    "xpr": {
      "type": "Expr",
      "nested": true
    },
    "op": {
      "type": "SQLValueFunctionOp",
      "enum": true
    },
    "type": {
      "type": "Oid"
    },
    "typmod": {
      "type": "int32"
    },
    "location": {
      "type": "int"
    }
  },
  "XmlExpr": {
    "xpr": {
      "type": "Expr",
      "nested": true
    },
    "op": {
      "type": "XmlExprOp",
      "enum": true
    },
    "name": {
      "type": "char"
    },
    "named_args": {
      "type": "List"
    },
    "arg_names": {
      "type": "List"
    },
    "args": {
      "type": "List"
    },
    "xmloption": {
      "type": "XmlOptionType",
      "enum": true
    },
    "type": {
      "type": "Oid"
    },
    "typmod": {
      "type": "int32"
    },
    "location": {
      "type": "int"
    }
  },
  "NullTest": {
    "xpr": {
      "type": "Expr",
      "nested": true
    },
    "arg": {
      "type": "Expr",
      "nested": true
    },
    "nulltesttype": {
      "type": "NullTestType",
      "enum": true
    },
    "argisrow": {
      "type": "bool"
    },
    "location": {
      "type": "int"
    }
  },
  "BooleanTest": {
    "xpr": {
      "type": "Expr",
      "nested": true
    },
    "arg": {
      "type": "Expr",
      "nested": true
    },
    "booltesttype": {
      "type": "BoolTestType",
      "enum": true
    },
    "location": {
      "type": "int"
    }
  },
  "CoerceToDomain": {
    "xpr": {
      "type": "Expr",
      "nested": true
    },
    "arg": {
      "type": "Expr",
      "nested": true
    },
    "resulttype": {
      "type": "Oid"
    },
    "resulttypmod": {
      "type": "int32"
    },
    "resultcollid": {
      "type": "Oid"
    },
    "coercionformat": {
      "type": "CoercionForm",
      "enum": true
    },
    "location": {
      "type": "int"
    }
  },
  "CoerceToDomainValue": {
    "xpr": {
      "type": "Expr",
      "nested": true
    },
    "typeId": {
      "type": "Oid"
    },
    "typeMod": {
      "type": "int32"
    },
    "collation": {
      "type": "Oid"
    },
    "location": {
      "type": "int"
    }
  },
  "SetToDefault": {
    "xpr": {
      "type": "Expr",
      "nested": true
    },
    "typeId": {
      "type": "Oid"
    },
    "typeMod": {
      "type": "int32"
    },
    "collation": {
      "type": "Oid"
    },
    "location": {
      "type": "int"
    }
  },
  "CurrentOfExpr": {
    "xpr": {
      "type": "Expr",
      "nested": true
    },
    "cvarno": {
      "type": "Index"
    },
    "cursor_name": {
      "type": "char"
    },
    "cursor_param": {
      "type": "int"
    }
  },
  "NextValueExpr": {
    "xpr": {
      "type": "Expr",
      "nested": true
    },
    "seqid": {
      "type": "Oid"
    },
    "typeId": {
      "type": "Oid"
    }
  },
  "InferenceElem": {
    "xpr": {
      "type": "Expr",
      "nested": true
    },
    "expr": {
      "type": "Node"
    },
    "infercollid": {
      "type": "Oid"
    },
    "inferopclass": {
      "type": "Oid"
    }
  },
  "TargetEntry": {
    "xpr": {
      "type": "Expr",
      "nested": true
    },
    "expr": {
      "type": "Expr",
      "nested": true
    },
    "resno": {
      "type": "AttrNumber"
    },
    "resname": {
      "type": "char"
    },
    "ressortgroupref": {
      "type": "Index"
    },
    "resorigtbl": {
      "type": "Oid"
    },
    "resorigcol": {
      "type": "AttrNumber"
    },
    "resjunk": {
      "type": "bool"
    }
  },
  "RangeTblRef": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "rtindex": {
      "type": "int"
    }
  },
  "JoinExpr": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "jointype": {
      "type": "JoinType",
      "enum": true
    },
    "isNatural": {
      "type": "bool"
    },
    "larg": {
      "type": "Node"
    },
    "rarg": {
      "type": "Node"
    },
    "usingClause": {
      "type": "List"
    },
    "quals": {
      "type": "Node"
    },
    "alias": {
      "type": "Alias",
      "nested": true
    },
    "rtindex": {
      "type": "int"
    }
  },
  "FromExpr": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "fromlist": {
      "type": "List"
    },
    "quals": {
      "type": "Node"
    }
  },
  "OnConflictExpr": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "action": {
      "type": "OnConflictAction",
      "enum": true
    },
    "arbiterElems": {
      "type": "List"
    },
    "arbiterWhere": {
      "type": "Node"
    },
    "constraint": {
      "type": "Oid"
    },
    "onConflictSet": {
      "type": "List"
    },
    "onConflictWhere": {
      "type": "Node"
    },
    "exclRelIndex": {
      "type": "int"
    },
    "exclRelTlist": {
      "type": "List"
    }
  },
  "Query": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "commandType": {
      "type": "CmdType",
      "enum": true
    },
    "querySource": {
      "type": "QuerySource",
      "enum": true
    },
    "queryId": {
      "type": "uint64"
    },
    "canSetTag": {
      "type": "bool"
    },
    "utilityStmt": {
      "type": "Node"
    },
    "resultRelation": {
      "type": "int"
    },
    "hasAggs": {
      "type": "bool"
    },
    "hasWindowFuncs": {
      "type": "bool"
    },
    "hasTargetSRFs": {
      "type": "bool"
    },
    "hasSubLinks": {
      "type": "bool"
    },
    "hasDistinctOn": {
      "type": "bool"
    },
    "hasRecursive": {
      "type": "bool"
    },
    "hasModifyingCTE": {
      "type": "bool"
    },
    "hasForUpdate": {
      "type": "bool"
    },
    "hasRowSecurity": {
      "type": "bool"
    },
    "cteList": {
      "type": "List"
    },
    "rtable": {
      "type": "List"
    },
    "jointree": {
      "type": "FromExpr"
    },
    "targetList": {
      "type": "List"
    },
    "override": {
      "type": "OverridingKind",
      "enum": true
    },
    "onConflict": {
      "type": "OnConflictExpr"
    },
    "returningList": {
      "type": "List"
    },
    "groupClause": {
      "type": "List"
    },
    "groupingSets": {
      "type": "List"
    },
    "havingQual": {
      "type": "Node"
    },
    "windowClause": {
      "type": "List"
    },
    "distinctClause": {
      "type": "List"
    },
    "sortClause": {
      "type": "List"
    },
    "limitOffset": {
      "type": "Node"
    },
    "limitCount": {
      "type": "Node"
    },
    "limitOption": {
      "type": "LimitOption",
      "enum": true
    },
    "rowMarks": {
      "type": "List"
    },
    "setOperations": {
      "type": "Node"
    },
    "constraintDeps": {
      "type": "List"
    },
    "withCheckOptions": {
      "type": "List"
    },
    "stmt_location": {
      "type": "int"
    },
    "stmt_len": {
      "type": "int"
    }
  },
  "TypeName": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "names": {
      "type": "List"
    },
    "typeOid": {
      "type": "Oid"
    },
    "setof": {
      "type": "bool"
    },
    "pct_type": {
      "type": "bool"
    },
    "typmods": {
      "type": "List"
    },
    "typemod": {
      "type": "int32"
    },
    "arrayBounds": {
      "type": "List"
    },
    "location": {
      "type": "int"
    }
  },
  "ColumnRef": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "fields": {
      "type": "List"
    },
    "location": {
      "type": "int"
    }
  },
  "ParamRef": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "number": {
      "type": "int"
    },
    "location": {
      "type": "int"
    }
  },
  "A_Expr": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "kind": {
      "type": "A_Expr_Kind",
      "enum": true
    },
    "name": {
      "type": "List"
    },
    "lexpr": {
      "type": "Node"
    },
    "rexpr": {
      "type": "Node"
    },
    "location": {
      "type": "int"
    }
  },
  "A_Const": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "val": {
      "type": "Value"
    },
    "location": {
      "type": "int"
    }
  },
  "TypeCast": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "arg": {
      "type": "Node"
    },
    "typeName": {
      "type": "TypeName",
      "nested": true
    },
    "location": {
      "type": "int"
    }
  },
  "CollateClause": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "arg": {
      "type": "Node"
    },
    "collname": {
      "type": "List"
    },
    "location": {
      "type": "int"
    }
  },
  "RoleSpec": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "roletype": {
      "type": "RoleSpecType",
      "enum": true
    },
    "rolename": {
      "type": "char"
    },
    "location": {
      "type": "int"
    }
  },
  "FuncCall": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "funcname": {
      "type": "List"
    },
    "args": {
      "type": "List"
    },
    "agg_order": {
      "type": "List"
    },
    "agg_filter": {
      "type": "Node"
    },
    "agg_within_group": {
      "type": "bool"
    },
    "agg_star": {
      "type": "bool"
    },
    "agg_distinct": {
      "type": "bool"
    },
    "func_variadic": {
      "type": "bool"
    },
    "over": {
      "type": "WindowDef",
      "nested": true
    },
    "location": {
      "type": "int"
    }
  },
  "A_Star": {
    "type": {
      "type": "NodeTag",
      "enum": true
    }
  },
  "A_Indices": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "is_slice": {
      "type": "bool"
    },
    "lidx": {
      "type": "Node"
    },
    "uidx": {
      "type": "Node"
    }
  },
  "A_Indirection": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "arg": {
      "type": "Node"
    },
    "indirection": {
      "type": "List"
    }
  },
  "A_ArrayExpr": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "elements": {
      "type": "List"
    },
    "location": {
      "type": "int"
    }
  },
  "ResTarget": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "name": {
      "type": "char"
    },
    "indirection": {
      "type": "List"
    },
    "val": {
      "type": "Node"
    },
    "location": {
      "type": "int"
    }
  },
  "MultiAssignRef": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "source": {
      "type": "Node"
    },
    "colno": {
      "type": "int"
    },
    "ncolumns": {
      "type": "int"
    }
  },
  "SortBy": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "node": {
      "type": "Node"
    },
    "sortby_dir": {
      "type": "SortByDir",
      "enum": true
    },
    "sortby_nulls": {
      "type": "SortByNulls",
      "enum": true
    },
    "useOp": {
      "type": "List"
    },
    "location": {
      "type": "int"
    }
  },
  "WindowDef": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "name": {
      "type": "char"
    },
    "refname": {
      "type": "char"
    },
    "partitionClause": {
      "type": "List"
    },
    "orderClause": {
      "type": "List"
    },
    "frameOptions": {
      "type": "int"
    },
    "startOffset": {
      "type": "Node"
    },
    "endOffset": {
      "type": "Node"
    },
    "location": {
      "type": "int"
    }
  },
  "RangeSubselect": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "lateral": {
      "type": "bool"
    },
    "subquery": {
      "type": "Node"
    },
    "alias": {
      "type": "Alias"
    }
  },
  "RangeFunction": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "lateral": {
      "type": "bool"
    },
    "ordinality": {
      "type": "bool"
    },
    "is_rowsfrom": {
      "type": "bool"
    },
    "functions": {
      "type": "List"
    },
    "alias": {
      "type": "Alias"
    },
    "coldeflist": {
      "type": "List"
    }
  },
  "RangeTableFunc": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "lateral": {
      "type": "bool"
    },
    "docexpr": {
      "type": "Node"
    },
    "rowexpr": {
      "type": "Node"
    },
    "namespaces": {
      "type": "List"
    },
    "columns": {
      "type": "List"
    },
    "alias": {
      "type": "Alias"
    },
    "location": {
      "type": "int"
    }
  },
  "RangeTableFuncCol": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "colname": {
      "type": "char"
    },
    "typeName": {
      "type": "TypeName",
      "nested": true
    },
    "for_ordinality": {
      "type": "bool"
    },
    "is_not_null": {
      "type": "bool"
    },
    "colexpr": {
      "type": "Node"
    },
    "coldefexpr": {
      "type": "Node"
    },
    "location": {
      "type": "int"
    }
  },
  "RangeTableSample": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "relation": {
      "type": "Node"
    },
    "method": {
      "type": "List"
    },
    "args": {
      "type": "List"
    },
    "repeatable": {
      "type": "Node"
    },
    "location": {
      "type": "int"
    }
  },
  "ColumnDef": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "colname": {
      "type": "char"
    },
    "typeName": {
      "type": "TypeName",
      "nested": true
    },
    "inhcount": {
      "type": "int"
    },
    "is_local": {
      "type": "bool"
    },
    "is_not_null": {
      "type": "bool"
    },
    "is_from_type": {
      "type": "bool"
    },
    "storage": {
      "type": "char"
    },
    "raw_default": {
      "type": "Node"
    },
    "cooked_default": {
      "type": "Node"
    },
    "identity": {
      "type": "char"
    },
    "identitySequence": {
      "type": "RangeVar"
    },
    "generated": {
      "type": "char"
    },
    "collClause": {
      "type": "CollateClause",
      "nested": true
    },
    "collOid": {
      "type": "Oid"
    },
    "constraints": {
      "type": "List"
    },
    "fdwoptions": {
      "type": "List"
    },
    "location": {
      "type": "int"
    }
  },
  "TableLikeClause": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "relation": {
      "type": "RangeVar"
    },
    "options": {
      "type": "bits32"
    }
  },
  "IndexElem": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "name": {
      "type": "char"
    },
    "expr": {
      "type": "Node"
    },
    "indexcolname": {
      "type": "char"
    },
    "collation": {
      "type": "List"
    },
    "opclass": {
      "type": "List"
    },
    "opclassopts": {
      "type": "List"
    },
    "ordering": {
      "type": "SortByDir",
      "enum": true
    },
    "nulls_ordering": {
      "type": "SortByNulls",
      "enum": true
    }
  },
  "DefElem": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "defnamespace": {
      "type": "char"
    },
    "defname": {
      "type": "char"
    },
    "arg": {
      "type": "Node"
    },
    "defaction": {
      "type": "DefElemAction",
      "enum": true
    },
    "location": {
      "type": "int"
    }
  },
  "LockingClause": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "lockedRels": {
      "type": "List"
    },
    "strength": {
      "type": "LockClauseStrength",
      "enum": true
    },
    "waitPolicy": {
      "type": "LockWaitPolicy",
      "enum": true
    }
  },
  "XmlSerialize": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "xmloption": {
      "type": "XmlOptionType",
      "enum": true
    },
    "expr": {
      "type": "Node"
    },
    "typeName": {
      "type": "TypeName",
      "nested": true
    },
    "location": {
      "type": "int"
    }
  },
  "PartitionElem": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "name": {
      "type": "char"
    },
    "expr": {
      "type": "Node"
    },
    "collation": {
      "type": "List"
    },
    "opclass": {
      "type": "List"
    },
    "location": {
      "type": "int"
    }
  },
  "PartitionSpec": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "strategy": {
      "type": "char"
    },
    "partParams": {
      "type": "List"
    },
    "location": {
      "type": "int"
    }
  },
  "PartitionBoundSpec": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "strategy": {
      "type": "char"
    },
    "is_default": {
      "type": "bool"
    },
    "modulus": {
      "type": "int"
    },
    "remainder": {
      "type": "int"
    },
    "listdatums": {
      "type": "List"
    },
    "lowerdatums": {
      "type": "List"
    },
    "upperdatums": {
      "type": "List"
    },
    "location": {
      "type": "int"
    }
  },
  "PartitionRangeDatum": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "kind": {
      "type": "PartitionRangeDatumKind",
      "enum": true
    },
    "value": {
      "type": "Node"
    },
    "location": {
      "type": "int"
    }
  },
  "PartitionCmd": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "name": {
      "type": "RangeVar"
    },
    "bound": {
      "type": "PartitionBoundSpec",
      "nested": true
    }
  },
  "RangeTblEntry": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "rtekind": {
      "type": "RTEKind",
      "enum": true
    },
    "relid": {
      "type": "Oid"
    },
    "relkind": {
      "type": "char"
    },
    "rellockmode": {
      "type": "int"
    },
    "tablesample": {
      "type": "TableSampleClause",
      "nested": true
    },
    "subquery": {
      "type": "Query",
      "nested": true
    },
    "security_barrier": {
      "type": "bool"
    },
    "jointype": {
      "type": "JoinType",
      "enum": true
    },
    "joinmergedcols": {
      "type": "int"
    },
    "joinaliasvars": {
      "type": "List"
    },
    "joinleftcols": {
      "type": "List"
    },
    "joinrightcols": {
      "type": "List"
    },
    "functions": {
      "type": "List"
    },
    "funcordinality": {
      "type": "bool"
    },
    "tablefunc": {
      "type": "TableFunc"
    },
    "values_lists": {
      "type": "List"
    },
    "ctename": {
      "type": "char"
    },
    "ctelevelsup": {
      "type": "Index"
    },
    "self_reference": {
      "type": "bool"
    },
    "coltypes": {
      "type": "List"
    },
    "coltypmods": {
      "type": "List"
    },
    "colcollations": {
      "type": "List"
    },
    "enrname": {
      "type": "char"
    },
    "enrtuples": {
      "type": "double"
    },
    "alias": {
      "type": "Alias"
    },
    "eref": {
      "type": "Alias"
    },
    "lateral": {
      "type": "bool"
    },
    "inh": {
      "type": "bool"
    },
    "inFromCl": {
      "type": "bool"
    },
    "requiredPerms": {
      "type": "AclMode"
    },
    "checkAsUser": {
      "type": "Oid"
    },
    "selectedCols": {
      "type": "Bitmapset"
    },
    "insertedCols": {
      "type": "Bitmapset"
    },
    "updatedCols": {
      "type": "Bitmapset"
    },
    "extraUpdatedCols": {
      "type": "Bitmapset"
    },
    "securityQuals": {
      "type": "List"
    }
  },
  "RangeTblFunction": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "funcexpr": {
      "type": "Node"
    },
    "funccolcount": {
      "type": "int"
    },
    "funccolnames": {
      "type": "List"
    },
    "funccoltypes": {
      "type": "List"
    },
    "funccoltypmods": {
      "type": "List"
    },
    "funccolcollations": {
      "type": "List"
    },
    "funcparams": {
      "type": "Bitmapset"
    }
  },
  "TableSampleClause": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "tsmhandler": {
      "type": "Oid"
    },
    "args": {
      "type": "List"
    },
    "repeatable": {
      "type": "Expr"
    }
  },
  "WithCheckOption": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "kind": {
      "type": "WCOKind",
      "enum": true
    },
    "relname": {
      "type": "char"
    },
    "polname": {
      "type": "char"
    },
    "qual": {
      "type": "Node"
    },
    "cascaded": {
      "type": "bool"
    }
  },
  "SortGroupClause": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "tleSortGroupRef": {
      "type": "Index"
    },
    "eqop": {
      "type": "Oid"
    },
    "sortop": {
      "type": "Oid"
    },
    "nulls_first": {
      "type": "bool"
    },
    "hashable": {
      "type": "bool"
    }
  },
  "GroupingSet": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "kind": {
      "type": "GroupingSetKind",
      "enum": true
    },
    "content": {
      "type": "List"
    },
    "location": {
      "type": "int"
    }
  },
  "WindowClause": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "name": {
      "type": "char"
    },
    "refname": {
      "type": "char"
    },
    "partitionClause": {
      "type": "List"
    },
    "orderClause": {
      "type": "List"
    },
    "frameOptions": {
      "type": "int"
    },
    "startOffset": {
      "type": "Node"
    },
    "endOffset": {
      "type": "Node"
    },
    "startInRangeFunc": {
      "type": "Oid"
    },
    "endInRangeFunc": {
      "type": "Oid"
    },
    "inRangeColl": {
      "type": "Oid"
    },
    "inRangeAsc": {
      "type": "bool"
    },
    "inRangeNullsFirst": {
      "type": "bool"
    },
    "winref": {
      "type": "Index"
    },
    "copiedOrder": {
      "type": "bool"
    }
  },
  "RowMarkClause": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "rti": {
      "type": "Index"
    },
    "strength": {
      "type": "LockClauseStrength",
      "enum": true
    },
    "waitPolicy": {
      "type": "LockWaitPolicy",
      "enum": true
    },
    "pushedDown": {
      "type": "bool"
    }
  },
  "WithClause": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "ctes": {
      "type": "List"
    },
    "recursive": {
      "type": "bool"
    },
    "location": {
      "type": "int"
    }
  },
  "InferClause": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "indexElems": {
      "type": "List"
    },
    "whereClause": {
      "type": "Node"
    },
    "conname": {
      "type": "char"
    },
    "location": {
      "type": "int"
    }
  },
  "OnConflictClause": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "action": {
      "type": "OnConflictAction",
      "enum": true
    },
    "infer": {
      "type": "InferClause",
      "nested": true
    },
    "targetList": {
      "type": "List"
    },
    "whereClause": {
      "type": "Node"
    },
    "location": {
      "type": "int"
    }
  },
  "CommonTableExpr": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "ctename": {
      "type": "char"
    },
    "aliascolnames": {
      "type": "List"
    },
    "ctematerialized": {
      "type": "CTEMaterialize",
      "enum": true
    },
    "ctequery": {
      "type": "Node"
    },
    "location": {
      "type": "int"
    },
    "cterecursive": {
      "type": "bool"
    },
    "cterefcount": {
      "type": "int"
    },
    "ctecolnames": {
      "type": "List"
    },
    "ctecoltypes": {
      "type": "List"
    },
    "ctecoltypmods": {
      "type": "List"
    },
    "ctecolcollations": {
      "type": "List"
    }
  },
  "TriggerTransition": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "name": {
      "type": "char"
    },
    "isNew": {
      "type": "bool"
    },
    "isTable": {
      "type": "bool"
    }
  },
  "RawStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "stmt": {
      "type": "Node"
    },
    "stmt_location": {
      "type": "int"
    },
    "stmt_len": {
      "type": "int"
    }
  },
  "InsertStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "relation": {
      "type": "RangeVar"
    },
    "cols": {
      "type": "List"
    },
    "selectStmt": {
      "type": "Node"
    },
    "onConflictClause": {
      "type": "OnConflictClause",
      "nested": true
    },
    "returningList": {
      "type": "List"
    },
    "withClause": {
      "type": "WithClause",
      "nested": true
    },
    "override": {
      "type": "OverridingKind",
      "enum": true
    }
  },
  "DeleteStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "relation": {
      "type": "RangeVar"
    },
    "usingClause": {
      "type": "List"
    },
    "whereClause": {
      "type": "Node"
    },
    "returningList": {
      "type": "List"
    },
    "withClause": {
      "type": "WithClause",
      "nested": true
    }
  },
  "UpdateStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "relation": {
      "type": "RangeVar"
    },
    "targetList": {
      "type": "List"
    },
    "whereClause": {
      "type": "Node"
    },
    "fromClause": {
      "type": "List"
    },
    "returningList": {
      "type": "List"
    },
    "withClause": {
      "type": "WithClause",
      "nested": true
    }
  },
  "SelectStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "distinctClause": {
      "type": "List"
    },
    "intoClause": {
      "type": "IntoClause"
    },
    "targetList": {
      "type": "List"
    },
    "fromClause": {
      "type": "List"
    },
    "whereClause": {
      "type": "Node"
    },
    "groupClause": {
      "type": "List"
    },
    "havingClause": {
      "type": "Node"
    },
    "windowClause": {
      "type": "List"
    },
    "valuesLists": {
      "type": "List"
    },
    "sortClause": {
      "type": "List"
    },
    "limitOffset": {
      "type": "Node"
    },
    "limitCount": {
      "type": "Node"
    },
    "limitOption": {
      "type": "LimitOption",
      "enum": true
    },
    "lockingClause": {
      "type": "List"
    },
    "withClause": {
      "type": "WithClause",
      "nested": true
    },
    "op": {
      "type": "SetOperation",
      "enum": true
    },
    "all": {
      "type": "bool"
    },
    "larg": {
      "type": "SelectStmt",
      "nested": true
    },
    "rarg": {
      "type": "SelectStmt",
      "nested": true
    }
  },
  "SetOperationStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "op": {
      "type": "SetOperation",
      "enum": true
    },
    "all": {
      "type": "bool"
    },
    "larg": {
      "type": "Node"
    },
    "rarg": {
      "type": "Node"
    },
    "colTypes": {
      "type": "List"
    },
    "colTypmods": {
      "type": "List"
    },
    "colCollations": {
      "type": "List"
    },
    "groupClauses": {
      "type": "List"
    }
  },
  "CreateSchemaStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "schemaname": {
      "type": "char"
    },
    "authrole": {
      "type": "RoleSpec",
      "nested": true
    },
    "schemaElts": {
      "type": "List"
    },
    "if_not_exists": {
      "type": "bool"
    }
  },
  "AlterTableStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "relation": {
      "type": "RangeVar"
    },
    "cmds": {
      "type": "List"
    },
    "relkind": {
      "type": "ObjectType",
      "enum": true
    },
    "missing_ok": {
      "type": "bool"
    }
  },
  "ReplicaIdentityStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "identity_type": {
      "type": "char"
    },
    "name": {
      "type": "char"
    }
  },
  "AlterTableCmd": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "subtype": {
      "type": "AlterTableType",
      "enum": true
    },
    "name": {
      "type": "char"
    },
    "num": {
      "type": "int16"
    },
    "newowner": {
      "type": "RoleSpec",
      "nested": true
    },
    "def": {
      "type": "Node"
    },
    "behavior": {
      "type": "DropBehavior",
      "enum": true
    },
    "missing_ok": {
      "type": "bool"
    }
  },
  "AlterCollationStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "collname": {
      "type": "List"
    }
  },
  "AlterDomainStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "subtype": {
      "type": "char"
    },
    "typeName": {
      "type": "List"
    },
    "name": {
      "type": "char"
    },
    "def": {
      "type": "Node"
    },
    "behavior": {
      "type": "DropBehavior",
      "enum": true
    },
    "missing_ok": {
      "type": "bool"
    }
  },
  "GrantStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "is_grant": {
      "type": "bool"
    },
    "targtype": {
      "type": "GrantTargetType",
      "enum": true
    },
    "objtype": {
      "type": "ObjectType",
      "enum": true
    },
    "objects": {
      "type": "List"
    },
    "privileges": {
      "type": "List"
    },
    "grantees": {
      "type": "List"
    },
    "grant_option": {
      "type": "bool"
    },
    "behavior": {
      "type": "DropBehavior",
      "enum": true
    }
  },
  "ObjectWithArgs": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "objname": {
      "type": "List"
    },
    "objargs": {
      "type": "List"
    },
    "args_unspecified": {
      "type": "bool"
    }
  },
  "AccessPriv": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "priv_name": {
      "type": "char"
    },
    "cols": {
      "type": "List"
    }
  },
  "GrantRoleStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "granted_roles": {
      "type": "List"
    },
    "grantee_roles": {
      "type": "List"
    },
    "is_grant": {
      "type": "bool"
    },
    "admin_opt": {
      "type": "bool"
    },
    "grantor": {
      "type": "RoleSpec",
      "nested": true
    },
    "behavior": {
      "type": "DropBehavior",
      "enum": true
    }
  },
  "AlterDefaultPrivilegesStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "options": {
      "type": "List"
    },
    "action": {
      "type": "GrantStmt",
      "nested": true
    }
  },
  "CopyStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "relation": {
      "type": "RangeVar"
    },
    "query": {
      "type": "Node"
    },
    "attlist": {
      "type": "List"
    },
    "is_from": {
      "type": "bool"
    },
    "is_program": {
      "type": "bool"
    },
    "filename": {
      "type": "char"
    },
    "options": {
      "type": "List"
    },
    "whereClause": {
      "type": "Node"
    }
  },
  "VariableSetStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "kind": {
      "type": "VariableSetKind",
      "enum": true
    },
    "name": {
      "type": "char"
    },
    "args": {
      "type": "List"
    },
    "is_local": {
      "type": "bool"
    }
  },
  "VariableShowStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "name": {
      "type": "char"
    }
  },
  "CreateStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "relation": {
      "type": "RangeVar"
    },
    "tableElts": {
      "type": "List"
    },
    "inhRelations": {
      "type": "List"
    },
    "partbound": {
      "type": "PartitionBoundSpec",
      "nested": true
    },
    "partspec": {
      "type": "PartitionSpec",
      "nested": true
    },
    "ofTypename": {
      "type": "TypeName",
      "nested": true
    },
    "constraints": {
      "type": "List"
    },
    "options": {
      "type": "List"
    },
    "oncommit": {
      "type": "OnCommitAction",
      "enum": true
    },
    "tablespacename": {
      "type": "char"
    },
    "accessMethod": {
      "type": "char"
    },
    "if_not_exists": {
      "type": "bool"
    }
  },
  "Constraint": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "contype": {
      "type": "ConstrType",
      "enum": true
    },
    "conname": {
      "type": "char"
    },
    "deferrable": {
      "type": "bool"
    },
    "initdeferred": {
      "type": "bool"
    },
    "location": {
      "type": "int"
    },
    "is_no_inherit": {
      "type": "bool"
    },
    "raw_expr": {
      "type": "Node"
    },
    "cooked_expr": {
      "type": "char"
    },
    "generated_when": {
      "type": "char"
    },
    "keys": {
      "type": "List"
    },
    "including": {
      "type": "List"
    },
    "exclusions": {
      "type": "List"
    },
    "options": {
      "type": "List"
    },
    "indexname": {
      "type": "char"
    },
    "indexspace": {
      "type": "char"
    },
    "reset_default_tblspc": {
      "type": "bool"
    },
    "access_method": {
      "type": "char"
    },
    "where_clause": {
      "type": "Node"
    },
    "pktable": {
      "type": "RangeVar"
    },
    "fk_attrs": {
      "type": "List"
    },
    "pk_attrs": {
      "type": "List"
    },
    "fk_matchtype": {
      "type": "char"
    },
    "fk_upd_action": {
      "type": "char"
    },
    "fk_del_action": {
      "type": "char"
    },
    "old_conpfeqop": {
      "type": "List"
    },
    "old_pktable_oid": {
      "type": "Oid"
    },
    "skip_validation": {
      "type": "bool"
    },
    "initially_valid": {
      "type": "bool"
    }
  },
  "CreateTableSpaceStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "tablespacename": {
      "type": "char"
    },
    "owner": {
      "type": "RoleSpec",
      "nested": true
    },
    "location": {
      "type": "char"
    },
    "options": {
      "type": "List"
    }
  },
  "DropTableSpaceStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "tablespacename": {
      "type": "char"
    },
    "missing_ok": {
      "type": "bool"
    }
  },
  "AlterTableSpaceOptionsStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "tablespacename": {
      "type": "char"
    },
    "options": {
      "type": "List"
    },
    "isReset": {
      "type": "bool"
    }
  },
  "AlterTableMoveAllStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "orig_tablespacename": {
      "type": "char"
    },
    "objtype": {
      "type": "ObjectType",
      "enum": true
    },
    "roles": {
      "type": "List"
    },
    "new_tablespacename": {
      "type": "char"
    },
    "nowait": {
      "type": "bool"
    }
  },
  "CreateExtensionStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "extname": {
      "type": "char"
    },
    "if_not_exists": {
      "type": "bool"
    },
    "options": {
      "type": "List"
    }
  },
  "AlterExtensionStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "extname": {
      "type": "char"
    },
    "options": {
      "type": "List"
    }
  },
  "AlterExtensionContentsStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "extname": {
      "type": "char"
    },
    "action": {
      "type": "int"
    },
    "objtype": {
      "type": "ObjectType",
      "enum": true
    },
    "object": {
      "type": "Node"
    }
  },
  "CreateFdwStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "fdwname": {
      "type": "char"
    },
    "func_options": {
      "type": "List"
    },
    "options": {
      "type": "List"
    }
  },
  "AlterFdwStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "fdwname": {
      "type": "char"
    },
    "func_options": {
      "type": "List"
    },
    "options": {
      "type": "List"
    }
  },
  "CreateForeignServerStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "servername": {
      "type": "char"
    },
    "servertype": {
      "type": "char"
    },
    "version": {
      "type": "char"
    },
    "fdwname": {
      "type": "char"
    },
    "if_not_exists": {
      "type": "bool"
    },
    "options": {
      "type": "List"
    }
  },
  "AlterForeignServerStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "servername": {
      "type": "char"
    },
    "version": {
      "type": "char"
    },
    "options": {
      "type": "List"
    },
    "has_version": {
      "type": "bool"
    }
  },
  "CreateForeignTableStmt": {
    "base": {
      "type": "CreateStmt",
      "nested": true
    },
    "servername": {
      "type": "char"
    },
    "options": {
      "type": "List"
    }
  },
  "CreateUserMappingStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "user": {
      "type": "RoleSpec",
      "nested": true
    },
    "servername": {
      "type": "char"
    },
    "if_not_exists": {
      "type": "bool"
    },
    "options": {
      "type": "List"
    }
  },
  "AlterUserMappingStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "user": {
      "type": "RoleSpec",
      "nested": true
    },
    "servername": {
      "type": "char"
    },
    "options": {
      "type": "List"
    }
  },
  "DropUserMappingStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "user": {
      "type": "RoleSpec",
      "nested": true
    },
    "servername": {
      "type": "char"
    },
    "missing_ok": {
      "type": "bool"
    }
  },
  "ImportForeignSchemaStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "server_name": {
      "type": "char"
    },
    "remote_schema": {
      "type": "char"
    },
    "local_schema": {
      "type": "char"
    },
    "list_type": {
      "type": "ImportForeignSchemaType",
      "enum": true
    },
    "table_list": {
      "type": "List"
    },
    "options": {
      "type": "List"
    }
  },
  "CreatePolicyStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "policy_name": {
      "type": "char"
    },
    "table": {
      "type": "RangeVar"
    },
    "cmd_name": {
      "type": "char"
    },
    "permissive": {
      "type": "bool"
    },
    "roles": {
      "type": "List"
    },
    "qual": {
      "type": "Node"
    },
    "with_check": {
      "type": "Node"
    }
  },
  "AlterPolicyStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "policy_name": {
      "type": "char"
    },
    "table": {
      "type": "RangeVar"
    },
    "roles": {
      "type": "List"
    },
    "qual": {
      "type": "Node"
    },
    "with_check": {
      "type": "Node"
    }
  },
  "CreateAmStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "amname": {
      "type": "char"
    },
    "handler_name": {
      "type": "List"
    },
    "amtype": {
      "type": "char"
    }
  },
  "CreateTrigStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "trigname": {
      "type": "char"
    },
    "relation": {
      "type": "RangeVar"
    },
    "funcname": {
      "type": "List"
    },
    "args": {
      "type": "List"
    },
    "row": {
      "type": "bool"
    },
    "timing": {
      "type": "int16"
    },
    "events": {
      "type": "int16"
    },
    "columns": {
      "type": "List"
    },
    "whenClause": {
      "type": "Node"
    },
    "isconstraint": {
      "type": "bool"
    },
    "transitionRels": {
      "type": "List"
    },
    "deferrable": {
      "type": "bool"
    },
    "initdeferred": {
      "type": "bool"
    },
    "constrrel": {
      "type": "RangeVar"
    }
  },
  "CreateEventTrigStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "trigname": {
      "type": "char"
    },
    "eventname": {
      "type": "char"
    },
    "whenclause": {
      "type": "List"
    },
    "funcname": {
      "type": "List"
    }
  },
  "AlterEventTrigStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "trigname": {
      "type": "char"
    },
    "tgenabled": {
      "type": "char"
    }
  },
  "CreatePLangStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "replace": {
      "type": "bool"
    },
    "plname": {
      "type": "char"
    },
    "plhandler": {
      "type": "List"
    },
    "plinline": {
      "type": "List"
    },
    "plvalidator": {
      "type": "List"
    },
    "pltrusted": {
      "type": "bool"
    }
  },
  "CreateRoleStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "stmt_type": {
      "type": "RoleStmtType",
      "enum": true
    },
    "role": {
      "type": "char"
    },
    "options": {
      "type": "List"
    }
  },
  "AlterRoleStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "role": {
      "type": "RoleSpec",
      "nested": true
    },
    "options": {
      "type": "List"
    },
    "action": {
      "type": "int"
    }
  },
  "AlterRoleSetStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "role": {
      "type": "RoleSpec",
      "nested": true
    },
    "database": {
      "type": "char"
    },
    "setstmt": {
      "type": "VariableSetStmt",
      "nested": true
    }
  },
  "DropRoleStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "roles": {
      "type": "List"
    },
    "missing_ok": {
      "type": "bool"
    }
  },
  "CreateSeqStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "sequence": {
      "type": "RangeVar"
    },
    "options": {
      "type": "List"
    },
    "ownerId": {
      "type": "Oid"
    },
    "for_identity": {
      "type": "bool"
    },
    "if_not_exists": {
      "type": "bool"
    }
  },
  "AlterSeqStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "sequence": {
      "type": "RangeVar"
    },
    "options": {
      "type": "List"
    },
    "for_identity": {
      "type": "bool"
    },
    "missing_ok": {
      "type": "bool"
    }
  },
  "DefineStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "kind": {
      "type": "ObjectType",
      "enum": true
    },
    "oldstyle": {
      "type": "bool"
    },
    "defnames": {
      "type": "List"
    },
    "args": {
      "type": "List"
    },
    "definition": {
      "type": "List"
    },
    "if_not_exists": {
      "type": "bool"
    },
    "replace": {
      "type": "bool"
    }
  },
  "CreateDomainStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "domainname": {
      "type": "List"
    },
    "typeName": {
      "type": "TypeName",
      "nested": true
    },
    "collClause": {
      "type": "CollateClause",
      "nested": true
    },
    "constraints": {
      "type": "List"
    }
  },
  "CreateOpClassStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "opclassname": {
      "type": "List"
    },
    "opfamilyname": {
      "type": "List"
    },
    "amname": {
      "type": "char"
    },
    "datatype": {
      "type": "TypeName",
      "nested": true
    },
    "items": {
      "type": "List"
    },
    "isDefault": {
      "type": "bool"
    }
  },
  "CreateOpClassItem": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "itemtype": {
      "type": "int"
    },
    "name": {
      "type": "ObjectWithArgs",
      "nested": true
    },
    "number": {
      "type": "int"
    },
    "order_family": {
      "type": "List"
    },
    "class_args": {
      "type": "List"
    },
    "storedtype": {
      "type": "TypeName",
      "nested": true
    }
  },
  "CreateOpFamilyStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "opfamilyname": {
      "type": "List"
    },
    "amname": {
      "type": "char"
    }
  },
  "AlterOpFamilyStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "opfamilyname": {
      "type": "List"
    },
    "amname": {
      "type": "char"
    },
    "isDrop": {
      "type": "bool"
    },
    "items": {
      "type": "List"
    }
  },
  "DropStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "objects": {
      "type": "List"
    },
    "removeType": {
      "type": "ObjectType",
      "enum": true
    },
    "behavior": {
      "type": "DropBehavior",
      "enum": true
    },
    "missing_ok": {
      "type": "bool"
    },
    "concurrent": {
      "type": "bool"
    }
  },
  "TruncateStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "relations": {
      "type": "List"
    },
    "restart_seqs": {
      "type": "bool"
    },
    "behavior": {
      "type": "DropBehavior",
      "enum": true
    }
  },
  "CommentStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "objtype": {
      "type": "ObjectType",
      "enum": true
    },
    "object": {
      "type": "Node"
    },
    "comment": {
      "type": "char"
    }
  },
  "SecLabelStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "objtype": {
      "type": "ObjectType",
      "enum": true
    },
    "object": {
      "type": "Node"
    },
    "provider": {
      "type": "char"
    },
    "label": {
      "type": "char"
    }
  },
  "DeclareCursorStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "portalname": {
      "type": "char"
    },
    "options": {
      "type": "int"
    },
    "query": {
      "type": "Node"
    }
  },
  "ClosePortalStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "portalname": {
      "type": "char"
    }
  },
  "FetchStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "direction": {
      "type": "FetchDirection",
      "enum": true
    },
    "howMany": {
      "type": "long"
    },
    "portalname": {
      "type": "char"
    },
    "ismove": {
      "type": "bool"
    }
  },
  "IndexStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "idxname": {
      "type": "char"
    },
    "relation": {
      "type": "RangeVar"
    },
    "accessMethod": {
      "type": "char"
    },
    "tableSpace": {
      "type": "char"
    },
    "indexParams": {
      "type": "List"
    },
    "indexIncludingParams": {
      "type": "List"
    },
    "options": {
      "type": "List"
    },
    "whereClause": {
      "type": "Node"
    },
    "excludeOpNames": {
      "type": "List"
    },
    "idxcomment": {
      "type": "char"
    },
    "indexOid": {
      "type": "Oid"
    },
    "oldNode": {
      "type": "Oid"
    },
    "oldCreateSubid": {
      "type": "SubTransactionId"
    },
    "oldFirstRelfilenodeSubid": {
      "type": "SubTransactionId"
    },
    "unique": {
      "type": "bool"
    },
    "primary": {
      "type": "bool"
    },
    "isconstraint": {
      "type": "bool"
    },
    "deferrable": {
      "type": "bool"
    },
    "initdeferred": {
      "type": "bool"
    },
    "transformed": {
      "type": "bool"
    },
    "concurrent": {
      "type": "bool"
    },
    "if_not_exists": {
      "type": "bool"
    },
    "reset_default_tblspc": {
      "type": "bool"
    }
  },
  "CreateStatsStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "defnames": {
      "type": "List"
    },
    "stat_types": {
      "type": "List"
    },
    "exprs": {
      "type": "List"
    },
    "relations": {
      "type": "List"
    },
    "stxcomment": {
      "type": "char"
    },
    "if_not_exists": {
      "type": "bool"
    }
  },
  "AlterStatsStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "defnames": {
      "type": "List"
    },
    "stxstattarget": {
      "type": "int"
    },
    "missing_ok": {
      "type": "bool"
    }
  },
  "CreateFunctionStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "is_procedure": {
      "type": "bool"
    },
    "replace": {
      "type": "bool"
    },
    "funcname": {
      "type": "List"
    },
    "parameters": {
      "type": "List"
    },
    "returnType": {
      "type": "TypeName",
      "nested": true
    },
    "options": {
      "type": "List"
    }
  },
  "FunctionParameter": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "name": {
      "type": "char"
    },
    "argType": {
      "type": "TypeName",
      "nested": true
    },
    "mode": {
      "type": "FunctionParameterMode",
      "enum": true
    },
    "defexpr": {
      "type": "Node"
    }
  },
  "AlterFunctionStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "objtype": {
      "type": "ObjectType",
      "enum": true
    },
    "func": {
      "type": "ObjectWithArgs",
      "nested": true
    },
    "actions": {
      "type": "List"
    }
  },
  "DoStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "args": {
      "type": "List"
    }
  },
  "InlineCodeBlock": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "source_text": {
      "type": "char"
    },
    "langOid": {
      "type": "Oid"
    },
    "langIsTrusted": {
      "type": "bool"
    },
    "atomic": {
      "type": "bool"
    }
  },
  "CallStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "funccall": {
      "type": "FuncCall",
      "nested": true
    },
    "funcexpr": {
      "type": "FuncExpr"
    }
  },
  "CallContext": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "atomic": {
      "type": "bool"
    }
  },
  "RenameStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "renameType": {
      "type": "ObjectType",
      "enum": true
    },
    "relationType": {
      "type": "ObjectType",
      "enum": true
    },
    "relation": {
      "type": "RangeVar"
    },
    "object": {
      "type": "Node"
    },
    "subname": {
      "type": "char"
    },
    "newname": {
      "type": "char"
    },
    "behavior": {
      "type": "DropBehavior",
      "enum": true
    },
    "missing_ok": {
      "type": "bool"
    }
  },
  "AlterObjectDependsStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "objectType": {
      "type": "ObjectType",
      "enum": true
    },
    "relation": {
      "type": "RangeVar"
    },
    "object": {
      "type": "Node"
    },
    "extname": {
      "type": "Value"
    },
    "remove": {
      "type": "bool"
    }
  },
  "AlterObjectSchemaStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "objectType": {
      "type": "ObjectType",
      "enum": true
    },
    "relation": {
      "type": "RangeVar"
    },
    "object": {
      "type": "Node"
    },
    "newschema": {
      "type": "char"
    },
    "missing_ok": {
      "type": "bool"
    }
  },
  "AlterOwnerStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "objectType": {
      "type": "ObjectType",
      "enum": true
    },
    "relation": {
      "type": "RangeVar"
    },
    "object": {
      "type": "Node"
    },
    "newowner": {
      "type": "RoleSpec",
      "nested": true
    }
  },
  "AlterOperatorStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "opername": {
      "type": "ObjectWithArgs",
      "nested": true
    },
    "options": {
      "type": "List"
    }
  },
  "AlterTypeStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "typeName": {
      "type": "List"
    },
    "options": {
      "type": "List"
    }
  },
  "RuleStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "relation": {
      "type": "RangeVar"
    },
    "rulename": {
      "type": "char"
    },
    "whereClause": {
      "type": "Node"
    },
    "event": {
      "type": "CmdType",
      "enum": true
    },
    "instead": {
      "type": "bool"
    },
    "actions": {
      "type": "List"
    },
    "replace": {
      "type": "bool"
    }
  },
  "NotifyStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "conditionname": {
      "type": "char"
    },
    "payload": {
      "type": "char"
    }
  },
  "ListenStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "conditionname": {
      "type": "char"
    }
  },
  "UnlistenStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "conditionname": {
      "type": "char"
    }
  },
  "TransactionStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "kind": {
      "type": "TransactionStmtKind",
      "enum": true
    },
    "options": {
      "type": "List"
    },
    "savepoint_name": {
      "type": "char"
    },
    "gid": {
      "type": "char"
    },
    "chain": {
      "type": "bool"
    }
  },
  "CompositeTypeStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "typevar": {
      "type": "RangeVar"
    },
    "coldeflist": {
      "type": "List"
    }
  },
  "CreateEnumStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "typeName": {
      "type": "List"
    },
    "vals": {
      "type": "List"
    }
  },
  "CreateRangeStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "typeName": {
      "type": "List"
    },
    "params": {
      "type": "List"
    }
  },
  "AlterEnumStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "typeName": {
      "type": "List"
    },
    "oldVal": {
      "type": "char"
    },
    "newVal": {
      "type": "char"
    },
    "newValNeighbor": {
      "type": "char"
    },
    "newValIsAfter": {
      "type": "bool"
    },
    "skipIfNewValExists": {
      "type": "bool"
    }
  },
  "ViewStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "view": {
      "type": "RangeVar"
    },
    "aliases": {
      "type": "List"
    },
    "query": {
      "type": "Node"
    },
    "replace": {
      "type": "bool"
    },
    "options": {
      "type": "List"
    },
    "withCheckOption": {
      "type": "ViewCheckOption",
      "enum": true
    }
  },
  "LoadStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "filename": {
      "type": "char"
    }
  },
  "CreatedbStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "dbname": {
      "type": "char"
    },
    "options": {
      "type": "List"
    }
  },
  "AlterDatabaseStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "dbname": {
      "type": "char"
    },
    "options": {
      "type": "List"
    }
  },
  "AlterDatabaseSetStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "dbname": {
      "type": "char"
    },
    "setstmt": {
      "type": "VariableSetStmt",
      "nested": true
    }
  },
  "DropdbStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "dbname": {
      "type": "char"
    },
    "missing_ok": {
      "type": "bool"
    },
    "options": {
      "type": "List"
    }
  },
  "AlterSystemStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "setstmt": {
      "type": "VariableSetStmt",
      "nested": true
    }
  },
  "ClusterStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "relation": {
      "type": "RangeVar"
    },
    "indexname": {
      "type": "char"
    },
    "options": {
      "type": "int"
    }
  },
  "VacuumStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "options": {
      "type": "List"
    },
    "rels": {
      "type": "List"
    },
    "is_vacuumcmd": {
      "type": "bool"
    }
  },
  "VacuumRelation": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "relation": {
      "type": "RangeVar"
    },
    "oid": {
      "type": "Oid"
    },
    "va_cols": {
      "type": "List"
    }
  },
  "ExplainStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "query": {
      "type": "Node"
    },
    "options": {
      "type": "List"
    }
  },
  "CreateTableAsStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "query": {
      "type": "Node"
    },
    "into": {
      "type": "IntoClause"
    },
    "relkind": {
      "type": "ObjectType",
      "enum": true
    },
    "is_select_into": {
      "type": "bool"
    },
    "if_not_exists": {
      "type": "bool"
    }
  },
  "RefreshMatViewStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "concurrent": {
      "type": "bool"
    },
    "skipData": {
      "type": "bool"
    },
    "relation": {
      "type": "RangeVar"
    }
  },
  "CheckPointStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    }
  },
  "DiscardStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "target": {
      "type": "DiscardMode",
      "enum": true
    }
  },
  "LockStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "relations": {
      "type": "List"
    },
    "mode": {
      "type": "int"
    },
    "nowait": {
      "type": "bool"
    }
  },
  "ConstraintsSetStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "constraints": {
      "type": "List"
    },
    "deferred": {
      "type": "bool"
    }
  },
  "ReindexStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "kind": {
      "type": "ReindexObjectType",
      "enum": true
    },
    "relation": {
      "type": "RangeVar"
    },
    "name": {
      "type": "char"
    },
    "options": {
      "type": "int"
    },
    "concurrent": {
      "type": "bool"
    }
  },
  "CreateConversionStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "conversion_name": {
      "type": "List"
    },
    "for_encoding_name": {
      "type": "char"
    },
    "to_encoding_name": {
      "type": "char"
    },
    "func_name": {
      "type": "List"
    },
    "def": {
      "type": "bool"
    }
  },
  "CreateCastStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "sourcetype": {
      "type": "TypeName",
      "nested": true
    },
    "targettype": {
      "type": "TypeName",
      "nested": true
    },
    "func": {
      "type": "ObjectWithArgs",
      "nested": true
    },
    "context": {
      "type": "CoercionContext",
      "enum": true
    },
    "inout": {
      "type": "bool"
    }
  },
  "CreateTransformStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "replace": {
      "type": "bool"
    },
    "type_name": {
      "type": "TypeName",
      "nested": true
    },
    "lang": {
      "type": "char"
    },
    "fromsql": {
      "type": "ObjectWithArgs",
      "nested": true
    },
    "tosql": {
      "type": "ObjectWithArgs",
      "nested": true
    }
  },
  "PrepareStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "name": {
      "type": "char"
    },
    "argtypes": {
      "type": "List"
    },
    "query": {
      "type": "Node"
    }
  },
  "ExecuteStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "name": {
      "type": "char"
    },
    "params": {
      "type": "List"
    }
  },
  "DeallocateStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "name": {
      "type": "char"
    }
  },
  "DropOwnedStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "roles": {
      "type": "List"
    },
    "behavior": {
      "type": "DropBehavior",
      "enum": true
    }
  },
  "ReassignOwnedStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "roles": {
      "type": "List"
    },
    "newrole": {
      "type": "RoleSpec",
      "nested": true
    }
  },
  "AlterTSDictionaryStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "dictname": {
      "type": "List"
    },
    "options": {
      "type": "List"
    }
  },
  "AlterTSConfigurationStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "kind": {
      "type": "AlterTSConfigType",
      "enum": true
    },
    "cfgname": {
      "type": "List"
    },
    "tokentype": {
      "type": "List"
    },
    "dicts": {
      "type": "List"
    },
    "override": {
      "type": "bool"
    },
    "replace": {
      "type": "bool"
    },
    "missing_ok": {
      "type": "bool"
    }
  },
  "CreatePublicationStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "pubname": {
      "type": "char"
    },
    "options": {
      "type": "List"
    },
    "tables": {
      "type": "List"
    },
    "for_all_tables": {
      "type": "bool"
    }
  },
  "AlterPublicationStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "pubname": {
      "type": "char"
    },
    "options": {
      "type": "List"
    },
    "tables": {
      "type": "List"
    },
    "for_all_tables": {
      "type": "bool"
    },
    "tableAction": {
      "type": "DefElemAction",
      "enum": true
    }
  },
  "CreateSubscriptionStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "subname": {
      "type": "char"
    },
    "conninfo": {
      "type": "char"
    },
    "publication": {
      "type": "List"
    },
    "options": {
      "type": "List"
    }
  },
  "AlterSubscriptionStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "kind": {
      "type": "AlterSubscriptionType",
      "enum": true
    },
    "subname": {
      "type": "char"
    },
    "conninfo": {
      "type": "char"
    },
    "publication": {
      "type": "List"
    },
    "options": {
      "type": "List"
    }
  },
  "DropSubscriptionStmt": {
    "type": {
      "type": "NodeTag",
      "enum": true
    },
    "subname": {
      "type": "char"
    },
    "missing_ok": {
      "type": "bool"
    },
    "behavior": {
      "type": "DropBehavior",
      "enum": true
    }
  },
  "VacAttrStats": {
    "attr": {
      "type": "Form_pg_attribute"
    },
    "attrtypid": {
      "type": "Oid"
    },
    "attrtypmod": {
      "type": "int32"
    },
    "attrtype": {
      "type": "Form_pg_type"
    },
    "attrcollid": {
      "type": "Oid"
    },
    "anl_context": {
      "type": "MemoryContext"
    },
    "compute_stats": {
      "type": "AnalyzeAttrComputeStatsFunc"
    },
    "minrows": {
      "type": "int"
    },
    "extra_data": {
      "type": "void"
    },
    "stats_valid": {
      "type": "bool"
    },
    "stanullfrac": {
      "type": "float4"
    },
    "stawidth": {
      "type": "int32"
    },
    "stadistinct": {
      "type": "float4"
    },
    "stakind[STATISTIC_NUM_SLOTS]": {
      "type": "int16"
    },
    "staop[STATISTIC_NUM_SLOTS]": {
      "type": "Oid"
    },
    "stacoll[STATISTIC_NUM_SLOTS]": {
      "type": "Oid"
    },
    "numnumbers[STATISTIC_NUM_SLOTS]": {
      "type": "int"
    },
    "stanumbers[STATISTIC_NUM_SLOTS]": {
      "type": "float4"
    },
    "numvalues[STATISTIC_NUM_SLOTS]": {
      "type": "int"
    },
    "stavalues[STATISTIC_NUM_SLOTS]": {
      "type": "Datum"
    },
    "statypid[STATISTIC_NUM_SLOTS]": {
      "type": "Oid"
    },
    "statyplen[STATISTIC_NUM_SLOTS]": {
      "type": "int16"
    },
    "statypbyval[STATISTIC_NUM_SLOTS]": {
      "type": "bool"
    },
    "statypalign[STATISTIC_NUM_SLOTS]": {
      "type": "char"
    },
    "tupattnum": {
      "type": "int"
    },
    "rows": {
      "type": "HeapTuple"
    },
    "tupDesc": {
      "type": "TupleDesc"
    },
    "exprvals": {
      "type": "Datum"
    },
    "exprnulls": {
      "type": "bool"
    },
    "rowstride": {
      "type": "int"
    }
  },
  "VacuumParams": {
    "options": {
      "type": "int"
    },
    "freeze_min_age": {
      "type": "int"
    },
    "freeze_table_age": {
      "type": "int"
    },
    "multixact_freeze_min_age": {
      "type": "int"
    },
    "multixact_freeze_table_age": {
      "type": "int"
    },
    "is_wraparound": {
      "type": "bool"
    },
    "log_min_duration": {
      "type": "int"
    },
    "index_cleanup": {
      "type": "VacOptTernaryValue",
      "enum": true
    },
    "truncate": {
      "type": "VacOptTernaryValue",
      "enum": true
    },
    "nworkers": {
      "type": "int"
    }
  },
  "Integer": {
    "ival": {
      "type": "long"
    }
  },
  "Float": {
    "str": {
      "type": "char"
    }
  },
  "String": {
    "str": {
      "type": "char"
    }
  },
  "BitString": {
    "str": {
      "type": "char"
    }
  },
  "Null": {}
}