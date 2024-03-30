declare const _default: {
    Alias: {
        type: {
            type: string;
            enum: boolean;
        };
        aliasname: {
            type: string;
        };
        colnames: {
            type: string;
        };
    };
    RangeVar: {
        type: {
            type: string;
            enum: boolean;
        };
        catalogname: {
            type: string;
        };
        schemaname: {
            type: string;
        };
        relname: {
            type: string;
        };
        inh: {
            type: string;
        };
        relpersistence: {
            type: string;
        };
        alias: {
            type: string;
            nested: boolean;
        };
        location: {
            type: string;
        };
    };
    TableFunc: {
        type: {
            type: string;
            enum: boolean;
        };
        ns_uris: {
            type: string;
        };
        ns_names: {
            type: string;
        };
        docexpr: {
            type: string;
        };
        rowexpr: {
            type: string;
        };
        colnames: {
            type: string;
        };
        coltypes: {
            type: string;
        };
        coltypmods: {
            type: string;
        };
        colcollations: {
            type: string;
        };
        colexprs: {
            type: string;
        };
        coldefexprs: {
            type: string;
        };
        notnulls: {
            type: string;
        };
        ordinalitycol: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    IntoClause: {
        type: {
            type: string;
            enum: boolean;
        };
        rel: {
            type: string;
            nested: boolean;
        };
        colNames: {
            type: string;
        };
        accessMethod: {
            type: string;
        };
        options: {
            type: string;
        };
        onCommit: {
            type: string;
            enum: boolean;
        };
        tableSpaceName: {
            type: string;
        };
        viewQuery: {
            type: string;
        };
        skipData: {
            type: string;
        };
    };
    Expr: {
        type: {
            type: string;
            enum: boolean;
        };
    };
    Var: {
        xpr: {
            type: string;
            nested: boolean;
        };
        varno: {
            type: string;
        };
        varattno: {
            type: string;
        };
        vartype: {
            type: string;
        };
        vartypmod: {
            type: string;
        };
        varcollid: {
            type: string;
        };
        varlevelsup: {
            type: string;
        };
        varnosyn: {
            type: string;
        };
        varattnosyn: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    Const: {
        xpr: {
            type: string;
            nested: boolean;
        };
        consttype: {
            type: string;
        };
        consttypmod: {
            type: string;
        };
        constcollid: {
            type: string;
        };
        constlen: {
            type: string;
        };
        constvalue: {
            type: string;
        };
        constisnull: {
            type: string;
        };
        constbyval: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    Param: {
        xpr: {
            type: string;
            nested: boolean;
        };
        paramkind: {
            type: string;
            enum: boolean;
        };
        paramid: {
            type: string;
        };
        paramtype: {
            type: string;
        };
        paramtypmod: {
            type: string;
        };
        paramcollid: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    Aggref: {
        xpr: {
            type: string;
            nested: boolean;
        };
        aggfnoid: {
            type: string;
        };
        aggtype: {
            type: string;
        };
        aggcollid: {
            type: string;
        };
        inputcollid: {
            type: string;
        };
        aggtranstype: {
            type: string;
        };
        aggargtypes: {
            type: string;
        };
        aggdirectargs: {
            type: string;
        };
        args: {
            type: string;
        };
        aggorder: {
            type: string;
        };
        aggdistinct: {
            type: string;
        };
        aggfilter: {
            type: string;
            nested: boolean;
        };
        aggstar: {
            type: string;
        };
        aggvariadic: {
            type: string;
        };
        aggkind: {
            type: string;
        };
        agglevelsup: {
            type: string;
        };
        aggsplit: {
            type: string;
            enum: boolean;
        };
        location: {
            type: string;
        };
    };
    GroupingFunc: {
        xpr: {
            type: string;
            nested: boolean;
        };
        args: {
            type: string;
        };
        refs: {
            type: string;
        };
        cols: {
            type: string;
        };
        agglevelsup: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    WindowFunc: {
        xpr: {
            type: string;
            nested: boolean;
        };
        winfnoid: {
            type: string;
        };
        wintype: {
            type: string;
        };
        wincollid: {
            type: string;
        };
        inputcollid: {
            type: string;
        };
        args: {
            type: string;
        };
        aggfilter: {
            type: string;
            nested: boolean;
        };
        winref: {
            type: string;
        };
        winstar: {
            type: string;
        };
        winagg: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    SubscriptingRef: {
        xpr: {
            type: string;
            nested: boolean;
        };
        refcontainertype: {
            type: string;
        };
        refelemtype: {
            type: string;
        };
        reftypmod: {
            type: string;
        };
        refcollid: {
            type: string;
        };
        refupperindexpr: {
            type: string;
        };
        reflowerindexpr: {
            type: string;
        };
        refexpr: {
            type: string;
            nested: boolean;
        };
        refassgnexpr: {
            type: string;
            nested: boolean;
        };
    };
    FuncExpr: {
        xpr: {
            type: string;
            nested: boolean;
        };
        funcid: {
            type: string;
        };
        funcresulttype: {
            type: string;
        };
        funcretset: {
            type: string;
        };
        funcvariadic: {
            type: string;
        };
        funcformat: {
            type: string;
            enum: boolean;
        };
        funccollid: {
            type: string;
        };
        inputcollid: {
            type: string;
        };
        args: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    NamedArgExpr: {
        xpr: {
            type: string;
            nested: boolean;
        };
        arg: {
            type: string;
            nested: boolean;
        };
        name: {
            type: string;
        };
        argnumber: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    OpExpr: {
        xpr: {
            type: string;
            nested: boolean;
        };
        opno: {
            type: string;
        };
        opfuncid: {
            type: string;
        };
        opresulttype: {
            type: string;
        };
        opretset: {
            type: string;
        };
        opcollid: {
            type: string;
        };
        inputcollid: {
            type: string;
        };
        args: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    ScalarArrayOpExpr: {
        xpr: {
            type: string;
            nested: boolean;
        };
        opno: {
            type: string;
        };
        opfuncid: {
            type: string;
        };
        useOr: {
            type: string;
        };
        inputcollid: {
            type: string;
        };
        args: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    BoolExpr: {
        xpr: {
            type: string;
            nested: boolean;
        };
        boolop: {
            type: string;
            enum: boolean;
        };
        args: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    SubLink: {
        xpr: {
            type: string;
            nested: boolean;
        };
        subLinkType: {
            type: string;
            enum: boolean;
        };
        subLinkId: {
            type: string;
        };
        testexpr: {
            type: string;
        };
        operName: {
            type: string;
        };
        subselect: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    SubPlan: {
        xpr: {
            type: string;
            nested: boolean;
        };
        subLinkType: {
            type: string;
            enum: boolean;
        };
        testexpr: {
            type: string;
        };
        paramIds: {
            type: string;
        };
        plan_id: {
            type: string;
        };
        plan_name: {
            type: string;
        };
        firstColType: {
            type: string;
        };
        firstColTypmod: {
            type: string;
        };
        firstColCollation: {
            type: string;
        };
        useHashTable: {
            type: string;
        };
        unknownEqFalse: {
            type: string;
        };
        parallel_safe: {
            type: string;
        };
        setParam: {
            type: string;
        };
        parParam: {
            type: string;
        };
        args: {
            type: string;
        };
        startup_cost: {
            type: string;
        };
        per_call_cost: {
            type: string;
        };
    };
    AlternativeSubPlan: {
        xpr: {
            type: string;
            nested: boolean;
        };
        subplans: {
            type: string;
        };
    };
    FieldSelect: {
        xpr: {
            type: string;
            nested: boolean;
        };
        arg: {
            type: string;
            nested: boolean;
        };
        fieldnum: {
            type: string;
        };
        resulttype: {
            type: string;
        };
        resulttypmod: {
            type: string;
        };
        resultcollid: {
            type: string;
        };
    };
    FieldStore: {
        xpr: {
            type: string;
            nested: boolean;
        };
        arg: {
            type: string;
            nested: boolean;
        };
        newvals: {
            type: string;
        };
        fieldnums: {
            type: string;
        };
        resulttype: {
            type: string;
        };
    };
    RelabelType: {
        xpr: {
            type: string;
            nested: boolean;
        };
        arg: {
            type: string;
            nested: boolean;
        };
        resulttype: {
            type: string;
        };
        resulttypmod: {
            type: string;
        };
        resultcollid: {
            type: string;
        };
        relabelformat: {
            type: string;
            enum: boolean;
        };
        location: {
            type: string;
        };
    };
    CoerceViaIO: {
        xpr: {
            type: string;
            nested: boolean;
        };
        arg: {
            type: string;
            nested: boolean;
        };
        resulttype: {
            type: string;
        };
        resultcollid: {
            type: string;
        };
        coerceformat: {
            type: string;
            enum: boolean;
        };
        location: {
            type: string;
        };
    };
    ArrayCoerceExpr: {
        xpr: {
            type: string;
            nested: boolean;
        };
        arg: {
            type: string;
            nested: boolean;
        };
        elemexpr: {
            type: string;
            nested: boolean;
        };
        resulttype: {
            type: string;
        };
        resulttypmod: {
            type: string;
        };
        resultcollid: {
            type: string;
        };
        coerceformat: {
            type: string;
            enum: boolean;
        };
        location: {
            type: string;
        };
    };
    ConvertRowtypeExpr: {
        xpr: {
            type: string;
            nested: boolean;
        };
        arg: {
            type: string;
            nested: boolean;
        };
        resulttype: {
            type: string;
        };
        convertformat: {
            type: string;
            enum: boolean;
        };
        location: {
            type: string;
        };
    };
    CollateExpr: {
        xpr: {
            type: string;
            nested: boolean;
        };
        arg: {
            type: string;
            nested: boolean;
        };
        collOid: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    CaseExpr: {
        xpr: {
            type: string;
            nested: boolean;
        };
        casetype: {
            type: string;
        };
        casecollid: {
            type: string;
        };
        arg: {
            type: string;
            nested: boolean;
        };
        args: {
            type: string;
        };
        defresult: {
            type: string;
            nested: boolean;
        };
        location: {
            type: string;
        };
    };
    CaseWhen: {
        xpr: {
            type: string;
            nested: boolean;
        };
        expr: {
            type: string;
            nested: boolean;
        };
        result: {
            type: string;
            nested: boolean;
        };
        location: {
            type: string;
        };
    };
    CaseTestExpr: {
        xpr: {
            type: string;
            nested: boolean;
        };
        typeId: {
            type: string;
        };
        typeMod: {
            type: string;
        };
        collation: {
            type: string;
        };
    };
    ArrayExpr: {
        xpr: {
            type: string;
            nested: boolean;
        };
        array_typeid: {
            type: string;
        };
        array_collid: {
            type: string;
        };
        element_typeid: {
            type: string;
        };
        elements: {
            type: string;
        };
        multidims: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    RowExpr: {
        xpr: {
            type: string;
            nested: boolean;
        };
        args: {
            type: string;
        };
        row_typeid: {
            type: string;
        };
        row_format: {
            type: string;
            enum: boolean;
        };
        colnames: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    RowCompareExpr: {
        xpr: {
            type: string;
            nested: boolean;
        };
        rctype: {
            type: string;
            enum: boolean;
        };
        opnos: {
            type: string;
        };
        opfamilies: {
            type: string;
        };
        inputcollids: {
            type: string;
        };
        largs: {
            type: string;
        };
        rargs: {
            type: string;
        };
    };
    CoalesceExpr: {
        xpr: {
            type: string;
            nested: boolean;
        };
        coalescetype: {
            type: string;
        };
        coalescecollid: {
            type: string;
        };
        args: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    MinMaxExpr: {
        xpr: {
            type: string;
            nested: boolean;
        };
        minmaxtype: {
            type: string;
        };
        minmaxcollid: {
            type: string;
        };
        inputcollid: {
            type: string;
        };
        op: {
            type: string;
            enum: boolean;
        };
        args: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    SQLValueFunction: {
        xpr: {
            type: string;
            nested: boolean;
        };
        op: {
            type: string;
            enum: boolean;
        };
        type: {
            type: string;
        };
        typmod: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    XmlExpr: {
        xpr: {
            type: string;
            nested: boolean;
        };
        op: {
            type: string;
            enum: boolean;
        };
        name: {
            type: string;
        };
        named_args: {
            type: string;
        };
        arg_names: {
            type: string;
        };
        args: {
            type: string;
        };
        xmloption: {
            type: string;
            enum: boolean;
        };
        type: {
            type: string;
        };
        typmod: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    NullTest: {
        xpr: {
            type: string;
            nested: boolean;
        };
        arg: {
            type: string;
            nested: boolean;
        };
        nulltesttype: {
            type: string;
            enum: boolean;
        };
        argisrow: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    BooleanTest: {
        xpr: {
            type: string;
            nested: boolean;
        };
        arg: {
            type: string;
            nested: boolean;
        };
        booltesttype: {
            type: string;
            enum: boolean;
        };
        location: {
            type: string;
        };
    };
    CoerceToDomain: {
        xpr: {
            type: string;
            nested: boolean;
        };
        arg: {
            type: string;
            nested: boolean;
        };
        resulttype: {
            type: string;
        };
        resulttypmod: {
            type: string;
        };
        resultcollid: {
            type: string;
        };
        coercionformat: {
            type: string;
            enum: boolean;
        };
        location: {
            type: string;
        };
    };
    CoerceToDomainValue: {
        xpr: {
            type: string;
            nested: boolean;
        };
        typeId: {
            type: string;
        };
        typeMod: {
            type: string;
        };
        collation: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    SetToDefault: {
        xpr: {
            type: string;
            nested: boolean;
        };
        typeId: {
            type: string;
        };
        typeMod: {
            type: string;
        };
        collation: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    CurrentOfExpr: {
        xpr: {
            type: string;
            nested: boolean;
        };
        cvarno: {
            type: string;
        };
        cursor_name: {
            type: string;
        };
        cursor_param: {
            type: string;
        };
    };
    NextValueExpr: {
        xpr: {
            type: string;
            nested: boolean;
        };
        seqid: {
            type: string;
        };
        typeId: {
            type: string;
        };
    };
    InferenceElem: {
        xpr: {
            type: string;
            nested: boolean;
        };
        expr: {
            type: string;
        };
        infercollid: {
            type: string;
        };
        inferopclass: {
            type: string;
        };
    };
    TargetEntry: {
        xpr: {
            type: string;
            nested: boolean;
        };
        expr: {
            type: string;
            nested: boolean;
        };
        resno: {
            type: string;
        };
        resname: {
            type: string;
        };
        ressortgroupref: {
            type: string;
        };
        resorigtbl: {
            type: string;
        };
        resorigcol: {
            type: string;
        };
        resjunk: {
            type: string;
        };
    };
    RangeTblRef: {
        type: {
            type: string;
            enum: boolean;
        };
        rtindex: {
            type: string;
        };
    };
    JoinExpr: {
        type: {
            type: string;
            enum: boolean;
        };
        jointype: {
            type: string;
            enum: boolean;
        };
        isNatural: {
            type: string;
        };
        larg: {
            type: string;
        };
        rarg: {
            type: string;
        };
        usingClause: {
            type: string;
        };
        quals: {
            type: string;
        };
        alias: {
            type: string;
            nested: boolean;
        };
        rtindex: {
            type: string;
        };
    };
    FromExpr: {
        type: {
            type: string;
            enum: boolean;
        };
        fromlist: {
            type: string;
        };
        quals: {
            type: string;
        };
    };
    OnConflictExpr: {
        type: {
            type: string;
            enum: boolean;
        };
        action: {
            type: string;
            enum: boolean;
        };
        arbiterElems: {
            type: string;
        };
        arbiterWhere: {
            type: string;
        };
        constraint: {
            type: string;
        };
        onConflictSet: {
            type: string;
        };
        onConflictWhere: {
            type: string;
        };
        exclRelIndex: {
            type: string;
        };
        exclRelTlist: {
            type: string;
        };
    };
    Query: {
        type: {
            type: string;
            enum: boolean;
        };
        commandType: {
            type: string;
            enum: boolean;
        };
        querySource: {
            type: string;
            enum: boolean;
        };
        queryId: {
            type: string;
        };
        canSetTag: {
            type: string;
        };
        utilityStmt: {
            type: string;
        };
        resultRelation: {
            type: string;
        };
        hasAggs: {
            type: string;
        };
        hasWindowFuncs: {
            type: string;
        };
        hasTargetSRFs: {
            type: string;
        };
        hasSubLinks: {
            type: string;
        };
        hasDistinctOn: {
            type: string;
        };
        hasRecursive: {
            type: string;
        };
        hasModifyingCTE: {
            type: string;
        };
        hasForUpdate: {
            type: string;
        };
        hasRowSecurity: {
            type: string;
        };
        cteList: {
            type: string;
        };
        rtable: {
            type: string;
        };
        jointree: {
            type: string;
        };
        targetList: {
            type: string;
        };
        override: {
            type: string;
            enum: boolean;
        };
        onConflict: {
            type: string;
        };
        returningList: {
            type: string;
        };
        groupClause: {
            type: string;
        };
        groupingSets: {
            type: string;
        };
        havingQual: {
            type: string;
        };
        windowClause: {
            type: string;
        };
        distinctClause: {
            type: string;
        };
        sortClause: {
            type: string;
        };
        limitOffset: {
            type: string;
        };
        limitCount: {
            type: string;
        };
        limitOption: {
            type: string;
            enum: boolean;
        };
        rowMarks: {
            type: string;
        };
        setOperations: {
            type: string;
        };
        constraintDeps: {
            type: string;
        };
        withCheckOptions: {
            type: string;
        };
        stmt_location: {
            type: string;
        };
        stmt_len: {
            type: string;
        };
    };
    TypeName: {
        type: {
            type: string;
            enum: boolean;
        };
        names: {
            type: string;
        };
        typeOid: {
            type: string;
        };
        setof: {
            type: string;
        };
        pct_type: {
            type: string;
        };
        typmods: {
            type: string;
        };
        typemod: {
            type: string;
        };
        arrayBounds: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    ColumnRef: {
        type: {
            type: string;
            enum: boolean;
        };
        fields: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    ParamRef: {
        type: {
            type: string;
            enum: boolean;
        };
        number: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    A_Expr: {
        type: {
            type: string;
            enum: boolean;
        };
        kind: {
            type: string;
            enum: boolean;
        };
        name: {
            type: string;
        };
        lexpr: {
            type: string;
        };
        rexpr: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    A_Const: {
        type: {
            type: string;
            enum: boolean;
        };
        val: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    TypeCast: {
        type: {
            type: string;
            enum: boolean;
        };
        arg: {
            type: string;
        };
        typeName: {
            type: string;
            nested: boolean;
        };
        location: {
            type: string;
        };
    };
    CollateClause: {
        type: {
            type: string;
            enum: boolean;
        };
        arg: {
            type: string;
        };
        collname: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    RoleSpec: {
        type: {
            type: string;
            enum: boolean;
        };
        roletype: {
            type: string;
            enum: boolean;
        };
        rolename: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    FuncCall: {
        type: {
            type: string;
            enum: boolean;
        };
        funcname: {
            type: string;
        };
        args: {
            type: string;
        };
        agg_order: {
            type: string;
        };
        agg_filter: {
            type: string;
        };
        agg_within_group: {
            type: string;
        };
        agg_star: {
            type: string;
        };
        agg_distinct: {
            type: string;
        };
        func_variadic: {
            type: string;
        };
        over: {
            type: string;
            nested: boolean;
        };
        location: {
            type: string;
        };
    };
    A_Star: {
        type: {
            type: string;
            enum: boolean;
        };
    };
    A_Indices: {
        type: {
            type: string;
            enum: boolean;
        };
        is_slice: {
            type: string;
        };
        lidx: {
            type: string;
        };
        uidx: {
            type: string;
        };
    };
    A_Indirection: {
        type: {
            type: string;
            enum: boolean;
        };
        arg: {
            type: string;
        };
        indirection: {
            type: string;
        };
    };
    A_ArrayExpr: {
        type: {
            type: string;
            enum: boolean;
        };
        elements: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    ResTarget: {
        type: {
            type: string;
            enum: boolean;
        };
        name: {
            type: string;
        };
        indirection: {
            type: string;
        };
        val: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    MultiAssignRef: {
        type: {
            type: string;
            enum: boolean;
        };
        source: {
            type: string;
        };
        colno: {
            type: string;
        };
        ncolumns: {
            type: string;
        };
    };
    SortBy: {
        type: {
            type: string;
            enum: boolean;
        };
        node: {
            type: string;
        };
        sortby_dir: {
            type: string;
            enum: boolean;
        };
        sortby_nulls: {
            type: string;
            enum: boolean;
        };
        useOp: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    WindowDef: {
        type: {
            type: string;
            enum: boolean;
        };
        name: {
            type: string;
        };
        refname: {
            type: string;
        };
        partitionClause: {
            type: string;
        };
        orderClause: {
            type: string;
        };
        frameOptions: {
            type: string;
        };
        startOffset: {
            type: string;
        };
        endOffset: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    RangeSubselect: {
        type: {
            type: string;
            enum: boolean;
        };
        lateral: {
            type: string;
        };
        subquery: {
            type: string;
        };
        alias: {
            type: string;
        };
    };
    RangeFunction: {
        type: {
            type: string;
            enum: boolean;
        };
        lateral: {
            type: string;
        };
        ordinality: {
            type: string;
        };
        is_rowsfrom: {
            type: string;
        };
        functions: {
            type: string;
        };
        alias: {
            type: string;
        };
        coldeflist: {
            type: string;
        };
    };
    RangeTableFunc: {
        type: {
            type: string;
            enum: boolean;
        };
        lateral: {
            type: string;
        };
        docexpr: {
            type: string;
        };
        rowexpr: {
            type: string;
        };
        namespaces: {
            type: string;
        };
        columns: {
            type: string;
        };
        alias: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    RangeTableFuncCol: {
        type: {
            type: string;
            enum: boolean;
        };
        colname: {
            type: string;
        };
        typeName: {
            type: string;
            nested: boolean;
        };
        for_ordinality: {
            type: string;
        };
        is_not_null: {
            type: string;
        };
        colexpr: {
            type: string;
        };
        coldefexpr: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    RangeTableSample: {
        type: {
            type: string;
            enum: boolean;
        };
        relation: {
            type: string;
        };
        method: {
            type: string;
        };
        args: {
            type: string;
        };
        repeatable: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    ColumnDef: {
        type: {
            type: string;
            enum: boolean;
        };
        colname: {
            type: string;
        };
        typeName: {
            type: string;
            nested: boolean;
        };
        inhcount: {
            type: string;
        };
        is_local: {
            type: string;
        };
        is_not_null: {
            type: string;
        };
        is_from_type: {
            type: string;
        };
        storage: {
            type: string;
        };
        raw_default: {
            type: string;
        };
        cooked_default: {
            type: string;
        };
        identity: {
            type: string;
        };
        identitySequence: {
            type: string;
        };
        generated: {
            type: string;
        };
        collClause: {
            type: string;
            nested: boolean;
        };
        collOid: {
            type: string;
        };
        constraints: {
            type: string;
        };
        fdwoptions: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    TableLikeClause: {
        type: {
            type: string;
            enum: boolean;
        };
        relation: {
            type: string;
        };
        options: {
            type: string;
        };
    };
    IndexElem: {
        type: {
            type: string;
            enum: boolean;
        };
        name: {
            type: string;
        };
        expr: {
            type: string;
        };
        indexcolname: {
            type: string;
        };
        collation: {
            type: string;
        };
        opclass: {
            type: string;
        };
        opclassopts: {
            type: string;
        };
        ordering: {
            type: string;
            enum: boolean;
        };
        nulls_ordering: {
            type: string;
            enum: boolean;
        };
    };
    DefElem: {
        type: {
            type: string;
            enum: boolean;
        };
        defnamespace: {
            type: string;
        };
        defname: {
            type: string;
        };
        arg: {
            type: string;
        };
        defaction: {
            type: string;
            enum: boolean;
        };
        location: {
            type: string;
        };
    };
    LockingClause: {
        type: {
            type: string;
            enum: boolean;
        };
        lockedRels: {
            type: string;
        };
        strength: {
            type: string;
            enum: boolean;
        };
        waitPolicy: {
            type: string;
            enum: boolean;
        };
    };
    XmlSerialize: {
        type: {
            type: string;
            enum: boolean;
        };
        xmloption: {
            type: string;
            enum: boolean;
        };
        expr: {
            type: string;
        };
        typeName: {
            type: string;
            nested: boolean;
        };
        location: {
            type: string;
        };
    };
    PartitionElem: {
        type: {
            type: string;
            enum: boolean;
        };
        name: {
            type: string;
        };
        expr: {
            type: string;
        };
        collation: {
            type: string;
        };
        opclass: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    PartitionSpec: {
        type: {
            type: string;
            enum: boolean;
        };
        strategy: {
            type: string;
        };
        partParams: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    PartitionBoundSpec: {
        type: {
            type: string;
            enum: boolean;
        };
        strategy: {
            type: string;
        };
        is_default: {
            type: string;
        };
        modulus: {
            type: string;
        };
        remainder: {
            type: string;
        };
        listdatums: {
            type: string;
        };
        lowerdatums: {
            type: string;
        };
        upperdatums: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    PartitionRangeDatum: {
        type: {
            type: string;
            enum: boolean;
        };
        kind: {
            type: string;
            enum: boolean;
        };
        value: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    PartitionCmd: {
        type: {
            type: string;
            enum: boolean;
        };
        name: {
            type: string;
        };
        bound: {
            type: string;
            nested: boolean;
        };
    };
    RangeTblEntry: {
        type: {
            type: string;
            enum: boolean;
        };
        rtekind: {
            type: string;
            enum: boolean;
        };
        relid: {
            type: string;
        };
        relkind: {
            type: string;
        };
        rellockmode: {
            type: string;
        };
        tablesample: {
            type: string;
            nested: boolean;
        };
        subquery: {
            type: string;
            nested: boolean;
        };
        security_barrier: {
            type: string;
        };
        jointype: {
            type: string;
            enum: boolean;
        };
        joinmergedcols: {
            type: string;
        };
        joinaliasvars: {
            type: string;
        };
        joinleftcols: {
            type: string;
        };
        joinrightcols: {
            type: string;
        };
        functions: {
            type: string;
        };
        funcordinality: {
            type: string;
        };
        tablefunc: {
            type: string;
        };
        values_lists: {
            type: string;
        };
        ctename: {
            type: string;
        };
        ctelevelsup: {
            type: string;
        };
        self_reference: {
            type: string;
        };
        coltypes: {
            type: string;
        };
        coltypmods: {
            type: string;
        };
        colcollations: {
            type: string;
        };
        enrname: {
            type: string;
        };
        enrtuples: {
            type: string;
        };
        alias: {
            type: string;
        };
        eref: {
            type: string;
        };
        lateral: {
            type: string;
        };
        inh: {
            type: string;
        };
        inFromCl: {
            type: string;
        };
        requiredPerms: {
            type: string;
        };
        checkAsUser: {
            type: string;
        };
        selectedCols: {
            type: string;
        };
        insertedCols: {
            type: string;
        };
        updatedCols: {
            type: string;
        };
        extraUpdatedCols: {
            type: string;
        };
        securityQuals: {
            type: string;
        };
    };
    RangeTblFunction: {
        type: {
            type: string;
            enum: boolean;
        };
        funcexpr: {
            type: string;
        };
        funccolcount: {
            type: string;
        };
        funccolnames: {
            type: string;
        };
        funccoltypes: {
            type: string;
        };
        funccoltypmods: {
            type: string;
        };
        funccolcollations: {
            type: string;
        };
        funcparams: {
            type: string;
        };
    };
    TableSampleClause: {
        type: {
            type: string;
            enum: boolean;
        };
        tsmhandler: {
            type: string;
        };
        args: {
            type: string;
        };
        repeatable: {
            type: string;
        };
    };
    WithCheckOption: {
        type: {
            type: string;
            enum: boolean;
        };
        kind: {
            type: string;
            enum: boolean;
        };
        relname: {
            type: string;
        };
        polname: {
            type: string;
        };
        qual: {
            type: string;
        };
        cascaded: {
            type: string;
        };
    };
    SortGroupClause: {
        type: {
            type: string;
            enum: boolean;
        };
        tleSortGroupRef: {
            type: string;
        };
        eqop: {
            type: string;
        };
        sortop: {
            type: string;
        };
        nulls_first: {
            type: string;
        };
        hashable: {
            type: string;
        };
    };
    GroupingSet: {
        type: {
            type: string;
            enum: boolean;
        };
        kind: {
            type: string;
            enum: boolean;
        };
        content: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    WindowClause: {
        type: {
            type: string;
            enum: boolean;
        };
        name: {
            type: string;
        };
        refname: {
            type: string;
        };
        partitionClause: {
            type: string;
        };
        orderClause: {
            type: string;
        };
        frameOptions: {
            type: string;
        };
        startOffset: {
            type: string;
        };
        endOffset: {
            type: string;
        };
        startInRangeFunc: {
            type: string;
        };
        endInRangeFunc: {
            type: string;
        };
        inRangeColl: {
            type: string;
        };
        inRangeAsc: {
            type: string;
        };
        inRangeNullsFirst: {
            type: string;
        };
        winref: {
            type: string;
        };
        copiedOrder: {
            type: string;
        };
    };
    RowMarkClause: {
        type: {
            type: string;
            enum: boolean;
        };
        rti: {
            type: string;
        };
        strength: {
            type: string;
            enum: boolean;
        };
        waitPolicy: {
            type: string;
            enum: boolean;
        };
        pushedDown: {
            type: string;
        };
    };
    WithClause: {
        type: {
            type: string;
            enum: boolean;
        };
        ctes: {
            type: string;
        };
        recursive: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    InferClause: {
        type: {
            type: string;
            enum: boolean;
        };
        indexElems: {
            type: string;
        };
        whereClause: {
            type: string;
        };
        conname: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    OnConflictClause: {
        type: {
            type: string;
            enum: boolean;
        };
        action: {
            type: string;
            enum: boolean;
        };
        infer: {
            type: string;
            nested: boolean;
        };
        targetList: {
            type: string;
        };
        whereClause: {
            type: string;
        };
        location: {
            type: string;
        };
    };
    CommonTableExpr: {
        type: {
            type: string;
            enum: boolean;
        };
        ctename: {
            type: string;
        };
        aliascolnames: {
            type: string;
        };
        ctematerialized: {
            type: string;
            enum: boolean;
        };
        ctequery: {
            type: string;
        };
        location: {
            type: string;
        };
        cterecursive: {
            type: string;
        };
        cterefcount: {
            type: string;
        };
        ctecolnames: {
            type: string;
        };
        ctecoltypes: {
            type: string;
        };
        ctecoltypmods: {
            type: string;
        };
        ctecolcollations: {
            type: string;
        };
    };
    TriggerTransition: {
        type: {
            type: string;
            enum: boolean;
        };
        name: {
            type: string;
        };
        isNew: {
            type: string;
        };
        isTable: {
            type: string;
        };
    };
    RawStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        stmt: {
            type: string;
        };
        stmt_location: {
            type: string;
        };
        stmt_len: {
            type: string;
        };
    };
    InsertStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        relation: {
            type: string;
        };
        cols: {
            type: string;
        };
        selectStmt: {
            type: string;
        };
        onConflictClause: {
            type: string;
            nested: boolean;
        };
        returningList: {
            type: string;
        };
        withClause: {
            type: string;
            nested: boolean;
        };
        override: {
            type: string;
            enum: boolean;
        };
    };
    DeleteStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        relation: {
            type: string;
        };
        usingClause: {
            type: string;
        };
        whereClause: {
            type: string;
        };
        returningList: {
            type: string;
        };
        withClause: {
            type: string;
            nested: boolean;
        };
    };
    UpdateStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        relation: {
            type: string;
        };
        targetList: {
            type: string;
        };
        whereClause: {
            type: string;
        };
        fromClause: {
            type: string;
        };
        returningList: {
            type: string;
        };
        withClause: {
            type: string;
            nested: boolean;
        };
    };
    SelectStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        distinctClause: {
            type: string;
        };
        intoClause: {
            type: string;
        };
        targetList: {
            type: string;
        };
        fromClause: {
            type: string;
        };
        whereClause: {
            type: string;
        };
        groupClause: {
            type: string;
        };
        havingClause: {
            type: string;
        };
        windowClause: {
            type: string;
        };
        valuesLists: {
            type: string;
        };
        sortClause: {
            type: string;
        };
        limitOffset: {
            type: string;
        };
        limitCount: {
            type: string;
        };
        limitOption: {
            type: string;
            enum: boolean;
        };
        lockingClause: {
            type: string;
        };
        withClause: {
            type: string;
            nested: boolean;
        };
        op: {
            type: string;
            enum: boolean;
        };
        all: {
            type: string;
        };
        larg: {
            type: string;
            nested: boolean;
        };
        rarg: {
            type: string;
            nested: boolean;
        };
    };
    SetOperationStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        op: {
            type: string;
            enum: boolean;
        };
        all: {
            type: string;
        };
        larg: {
            type: string;
        };
        rarg: {
            type: string;
        };
        colTypes: {
            type: string;
        };
        colTypmods: {
            type: string;
        };
        colCollations: {
            type: string;
        };
        groupClauses: {
            type: string;
        };
    };
    CreateSchemaStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        schemaname: {
            type: string;
        };
        authrole: {
            type: string;
            nested: boolean;
        };
        schemaElts: {
            type: string;
        };
        if_not_exists: {
            type: string;
        };
    };
    AlterTableStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        relation: {
            type: string;
        };
        cmds: {
            type: string;
        };
        relkind: {
            type: string;
            enum: boolean;
        };
        missing_ok: {
            type: string;
        };
    };
    ReplicaIdentityStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        identity_type: {
            type: string;
        };
        name: {
            type: string;
        };
    };
    AlterTableCmd: {
        type: {
            type: string;
            enum: boolean;
        };
        subtype: {
            type: string;
            enum: boolean;
        };
        name: {
            type: string;
        };
        num: {
            type: string;
        };
        newowner: {
            type: string;
            nested: boolean;
        };
        def: {
            type: string;
        };
        behavior: {
            type: string;
            enum: boolean;
        };
        missing_ok: {
            type: string;
        };
    };
    AlterCollationStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        collname: {
            type: string;
        };
    };
    AlterDomainStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        subtype: {
            type: string;
        };
        typeName: {
            type: string;
        };
        name: {
            type: string;
        };
        def: {
            type: string;
        };
        behavior: {
            type: string;
            enum: boolean;
        };
        missing_ok: {
            type: string;
        };
    };
    GrantStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        is_grant: {
            type: string;
        };
        targtype: {
            type: string;
            enum: boolean;
        };
        objtype: {
            type: string;
            enum: boolean;
        };
        objects: {
            type: string;
        };
        privileges: {
            type: string;
        };
        grantees: {
            type: string;
        };
        grant_option: {
            type: string;
        };
        behavior: {
            type: string;
            enum: boolean;
        };
    };
    ObjectWithArgs: {
        type: {
            type: string;
            enum: boolean;
        };
        objname: {
            type: string;
        };
        objargs: {
            type: string;
        };
        args_unspecified: {
            type: string;
        };
    };
    AccessPriv: {
        type: {
            type: string;
            enum: boolean;
        };
        priv_name: {
            type: string;
        };
        cols: {
            type: string;
        };
    };
    GrantRoleStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        granted_roles: {
            type: string;
        };
        grantee_roles: {
            type: string;
        };
        is_grant: {
            type: string;
        };
        admin_opt: {
            type: string;
        };
        grantor: {
            type: string;
            nested: boolean;
        };
        behavior: {
            type: string;
            enum: boolean;
        };
    };
    AlterDefaultPrivilegesStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        options: {
            type: string;
        };
        action: {
            type: string;
            nested: boolean;
        };
    };
    CopyStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        relation: {
            type: string;
        };
        query: {
            type: string;
        };
        attlist: {
            type: string;
        };
        is_from: {
            type: string;
        };
        is_program: {
            type: string;
        };
        filename: {
            type: string;
        };
        options: {
            type: string;
        };
        whereClause: {
            type: string;
        };
    };
    VariableSetStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        kind: {
            type: string;
            enum: boolean;
        };
        name: {
            type: string;
        };
        args: {
            type: string;
        };
        is_local: {
            type: string;
        };
    };
    VariableShowStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        name: {
            type: string;
        };
    };
    CreateStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        relation: {
            type: string;
        };
        tableElts: {
            type: string;
        };
        inhRelations: {
            type: string;
        };
        partbound: {
            type: string;
            nested: boolean;
        };
        partspec: {
            type: string;
            nested: boolean;
        };
        ofTypename: {
            type: string;
            nested: boolean;
        };
        constraints: {
            type: string;
        };
        options: {
            type: string;
        };
        oncommit: {
            type: string;
            enum: boolean;
        };
        tablespacename: {
            type: string;
        };
        accessMethod: {
            type: string;
        };
        if_not_exists: {
            type: string;
        };
    };
    Constraint: {
        type: {
            type: string;
            enum: boolean;
        };
        contype: {
            type: string;
            enum: boolean;
        };
        conname: {
            type: string;
        };
        deferrable: {
            type: string;
        };
        initdeferred: {
            type: string;
        };
        location: {
            type: string;
        };
        is_no_inherit: {
            type: string;
        };
        raw_expr: {
            type: string;
        };
        cooked_expr: {
            type: string;
        };
        generated_when: {
            type: string;
        };
        keys: {
            type: string;
        };
        including: {
            type: string;
        };
        exclusions: {
            type: string;
        };
        options: {
            type: string;
        };
        indexname: {
            type: string;
        };
        indexspace: {
            type: string;
        };
        reset_default_tblspc: {
            type: string;
        };
        access_method: {
            type: string;
        };
        where_clause: {
            type: string;
        };
        pktable: {
            type: string;
        };
        fk_attrs: {
            type: string;
        };
        pk_attrs: {
            type: string;
        };
        fk_matchtype: {
            type: string;
        };
        fk_upd_action: {
            type: string;
        };
        fk_del_action: {
            type: string;
        };
        old_conpfeqop: {
            type: string;
        };
        old_pktable_oid: {
            type: string;
        };
        skip_validation: {
            type: string;
        };
        initially_valid: {
            type: string;
        };
    };
    CreateTableSpaceStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        tablespacename: {
            type: string;
        };
        owner: {
            type: string;
            nested: boolean;
        };
        location: {
            type: string;
        };
        options: {
            type: string;
        };
    };
    DropTableSpaceStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        tablespacename: {
            type: string;
        };
        missing_ok: {
            type: string;
        };
    };
    AlterTableSpaceOptionsStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        tablespacename: {
            type: string;
        };
        options: {
            type: string;
        };
        isReset: {
            type: string;
        };
    };
    AlterTableMoveAllStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        orig_tablespacename: {
            type: string;
        };
        objtype: {
            type: string;
            enum: boolean;
        };
        roles: {
            type: string;
        };
        new_tablespacename: {
            type: string;
        };
        nowait: {
            type: string;
        };
    };
    CreateExtensionStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        extname: {
            type: string;
        };
        if_not_exists: {
            type: string;
        };
        options: {
            type: string;
        };
    };
    AlterExtensionStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        extname: {
            type: string;
        };
        options: {
            type: string;
        };
    };
    AlterExtensionContentsStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        extname: {
            type: string;
        };
        action: {
            type: string;
        };
        objtype: {
            type: string;
            enum: boolean;
        };
        object: {
            type: string;
        };
    };
    CreateFdwStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        fdwname: {
            type: string;
        };
        func_options: {
            type: string;
        };
        options: {
            type: string;
        };
    };
    AlterFdwStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        fdwname: {
            type: string;
        };
        func_options: {
            type: string;
        };
        options: {
            type: string;
        };
    };
    CreateForeignServerStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        servername: {
            type: string;
        };
        servertype: {
            type: string;
        };
        version: {
            type: string;
        };
        fdwname: {
            type: string;
        };
        if_not_exists: {
            type: string;
        };
        options: {
            type: string;
        };
    };
    AlterForeignServerStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        servername: {
            type: string;
        };
        version: {
            type: string;
        };
        options: {
            type: string;
        };
        has_version: {
            type: string;
        };
    };
    CreateForeignTableStmt: {
        base: {
            type: string;
            nested: boolean;
        };
        servername: {
            type: string;
        };
        options: {
            type: string;
        };
    };
    CreateUserMappingStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        user: {
            type: string;
            nested: boolean;
        };
        servername: {
            type: string;
        };
        if_not_exists: {
            type: string;
        };
        options: {
            type: string;
        };
    };
    AlterUserMappingStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        user: {
            type: string;
            nested: boolean;
        };
        servername: {
            type: string;
        };
        options: {
            type: string;
        };
    };
    DropUserMappingStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        user: {
            type: string;
            nested: boolean;
        };
        servername: {
            type: string;
        };
        missing_ok: {
            type: string;
        };
    };
    ImportForeignSchemaStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        server_name: {
            type: string;
        };
        remote_schema: {
            type: string;
        };
        local_schema: {
            type: string;
        };
        list_type: {
            type: string;
            enum: boolean;
        };
        table_list: {
            type: string;
        };
        options: {
            type: string;
        };
    };
    CreatePolicyStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        policy_name: {
            type: string;
        };
        table: {
            type: string;
        };
        cmd_name: {
            type: string;
        };
        permissive: {
            type: string;
        };
        roles: {
            type: string;
        };
        qual: {
            type: string;
        };
        with_check: {
            type: string;
        };
    };
    AlterPolicyStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        policy_name: {
            type: string;
        };
        table: {
            type: string;
        };
        roles: {
            type: string;
        };
        qual: {
            type: string;
        };
        with_check: {
            type: string;
        };
    };
    CreateAmStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        amname: {
            type: string;
        };
        handler_name: {
            type: string;
        };
        amtype: {
            type: string;
        };
    };
    CreateTrigStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        trigname: {
            type: string;
        };
        relation: {
            type: string;
        };
        funcname: {
            type: string;
        };
        args: {
            type: string;
        };
        row: {
            type: string;
        };
        timing: {
            type: string;
        };
        events: {
            type: string;
        };
        columns: {
            type: string;
        };
        whenClause: {
            type: string;
        };
        isconstraint: {
            type: string;
        };
        transitionRels: {
            type: string;
        };
        deferrable: {
            type: string;
        };
        initdeferred: {
            type: string;
        };
        constrrel: {
            type: string;
        };
    };
    CreateEventTrigStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        trigname: {
            type: string;
        };
        eventname: {
            type: string;
        };
        whenclause: {
            type: string;
        };
        funcname: {
            type: string;
        };
    };
    AlterEventTrigStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        trigname: {
            type: string;
        };
        tgenabled: {
            type: string;
        };
    };
    CreatePLangStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        replace: {
            type: string;
        };
        plname: {
            type: string;
        };
        plhandler: {
            type: string;
        };
        plinline: {
            type: string;
        };
        plvalidator: {
            type: string;
        };
        pltrusted: {
            type: string;
        };
    };
    CreateRoleStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        stmt_type: {
            type: string;
            enum: boolean;
        };
        role: {
            type: string;
        };
        options: {
            type: string;
        };
    };
    AlterRoleStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        role: {
            type: string;
            nested: boolean;
        };
        options: {
            type: string;
        };
        action: {
            type: string;
        };
    };
    AlterRoleSetStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        role: {
            type: string;
            nested: boolean;
        };
        database: {
            type: string;
        };
        setstmt: {
            type: string;
            nested: boolean;
        };
    };
    DropRoleStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        roles: {
            type: string;
        };
        missing_ok: {
            type: string;
        };
    };
    CreateSeqStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        sequence: {
            type: string;
        };
        options: {
            type: string;
        };
        ownerId: {
            type: string;
        };
        for_identity: {
            type: string;
        };
        if_not_exists: {
            type: string;
        };
    };
    AlterSeqStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        sequence: {
            type: string;
        };
        options: {
            type: string;
        };
        for_identity: {
            type: string;
        };
        missing_ok: {
            type: string;
        };
    };
    DefineStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        kind: {
            type: string;
            enum: boolean;
        };
        oldstyle: {
            type: string;
        };
        defnames: {
            type: string;
        };
        args: {
            type: string;
        };
        definition: {
            type: string;
        };
        if_not_exists: {
            type: string;
        };
        replace: {
            type: string;
        };
    };
    CreateDomainStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        domainname: {
            type: string;
        };
        typeName: {
            type: string;
            nested: boolean;
        };
        collClause: {
            type: string;
            nested: boolean;
        };
        constraints: {
            type: string;
        };
    };
    CreateOpClassStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        opclassname: {
            type: string;
        };
        opfamilyname: {
            type: string;
        };
        amname: {
            type: string;
        };
        datatype: {
            type: string;
            nested: boolean;
        };
        items: {
            type: string;
        };
        isDefault: {
            type: string;
        };
    };
    CreateOpClassItem: {
        type: {
            type: string;
            enum: boolean;
        };
        itemtype: {
            type: string;
        };
        name: {
            type: string;
            nested: boolean;
        };
        number: {
            type: string;
        };
        order_family: {
            type: string;
        };
        class_args: {
            type: string;
        };
        storedtype: {
            type: string;
            nested: boolean;
        };
    };
    CreateOpFamilyStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        opfamilyname: {
            type: string;
        };
        amname: {
            type: string;
        };
    };
    AlterOpFamilyStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        opfamilyname: {
            type: string;
        };
        amname: {
            type: string;
        };
        isDrop: {
            type: string;
        };
        items: {
            type: string;
        };
    };
    DropStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        objects: {
            type: string;
        };
        removeType: {
            type: string;
            enum: boolean;
        };
        behavior: {
            type: string;
            enum: boolean;
        };
        missing_ok: {
            type: string;
        };
        concurrent: {
            type: string;
        };
    };
    TruncateStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        relations: {
            type: string;
        };
        restart_seqs: {
            type: string;
        };
        behavior: {
            type: string;
            enum: boolean;
        };
    };
    CommentStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        objtype: {
            type: string;
            enum: boolean;
        };
        object: {
            type: string;
        };
        comment: {
            type: string;
        };
    };
    SecLabelStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        objtype: {
            type: string;
            enum: boolean;
        };
        object: {
            type: string;
        };
        provider: {
            type: string;
        };
        label: {
            type: string;
        };
    };
    DeclareCursorStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        portalname: {
            type: string;
        };
        options: {
            type: string;
        };
        query: {
            type: string;
        };
    };
    ClosePortalStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        portalname: {
            type: string;
        };
    };
    FetchStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        direction: {
            type: string;
            enum: boolean;
        };
        howMany: {
            type: string;
        };
        portalname: {
            type: string;
        };
        ismove: {
            type: string;
        };
    };
    IndexStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        idxname: {
            type: string;
        };
        relation: {
            type: string;
        };
        accessMethod: {
            type: string;
        };
        tableSpace: {
            type: string;
        };
        indexParams: {
            type: string;
        };
        indexIncludingParams: {
            type: string;
        };
        options: {
            type: string;
        };
        whereClause: {
            type: string;
        };
        excludeOpNames: {
            type: string;
        };
        idxcomment: {
            type: string;
        };
        indexOid: {
            type: string;
        };
        oldNode: {
            type: string;
        };
        oldCreateSubid: {
            type: string;
        };
        oldFirstRelfilenodeSubid: {
            type: string;
        };
        unique: {
            type: string;
        };
        primary: {
            type: string;
        };
        isconstraint: {
            type: string;
        };
        deferrable: {
            type: string;
        };
        initdeferred: {
            type: string;
        };
        transformed: {
            type: string;
        };
        concurrent: {
            type: string;
        };
        if_not_exists: {
            type: string;
        };
        reset_default_tblspc: {
            type: string;
        };
    };
    CreateStatsStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        defnames: {
            type: string;
        };
        stat_types: {
            type: string;
        };
        exprs: {
            type: string;
        };
        relations: {
            type: string;
        };
        stxcomment: {
            type: string;
        };
        if_not_exists: {
            type: string;
        };
    };
    AlterStatsStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        defnames: {
            type: string;
        };
        stxstattarget: {
            type: string;
        };
        missing_ok: {
            type: string;
        };
    };
    CreateFunctionStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        is_procedure: {
            type: string;
        };
        replace: {
            type: string;
        };
        funcname: {
            type: string;
        };
        parameters: {
            type: string;
        };
        returnType: {
            type: string;
            nested: boolean;
        };
        options: {
            type: string;
        };
    };
    FunctionParameter: {
        type: {
            type: string;
            enum: boolean;
        };
        name: {
            type: string;
        };
        argType: {
            type: string;
            nested: boolean;
        };
        mode: {
            type: string;
            enum: boolean;
        };
        defexpr: {
            type: string;
        };
    };
    AlterFunctionStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        objtype: {
            type: string;
            enum: boolean;
        };
        func: {
            type: string;
            nested: boolean;
        };
        actions: {
            type: string;
        };
    };
    DoStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        args: {
            type: string;
        };
    };
    InlineCodeBlock: {
        type: {
            type: string;
            enum: boolean;
        };
        source_text: {
            type: string;
        };
        langOid: {
            type: string;
        };
        langIsTrusted: {
            type: string;
        };
        atomic: {
            type: string;
        };
    };
    CallStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        funccall: {
            type: string;
            nested: boolean;
        };
        funcexpr: {
            type: string;
        };
    };
    CallContext: {
        type: {
            type: string;
            enum: boolean;
        };
        atomic: {
            type: string;
        };
    };
    RenameStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        renameType: {
            type: string;
            enum: boolean;
        };
        relationType: {
            type: string;
            enum: boolean;
        };
        relation: {
            type: string;
        };
        object: {
            type: string;
        };
        subname: {
            type: string;
        };
        newname: {
            type: string;
        };
        behavior: {
            type: string;
            enum: boolean;
        };
        missing_ok: {
            type: string;
        };
    };
    AlterObjectDependsStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        objectType: {
            type: string;
            enum: boolean;
        };
        relation: {
            type: string;
        };
        object: {
            type: string;
        };
        extname: {
            type: string;
        };
        remove: {
            type: string;
        };
    };
    AlterObjectSchemaStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        objectType: {
            type: string;
            enum: boolean;
        };
        relation: {
            type: string;
        };
        object: {
            type: string;
        };
        newschema: {
            type: string;
        };
        missing_ok: {
            type: string;
        };
    };
    AlterOwnerStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        objectType: {
            type: string;
            enum: boolean;
        };
        relation: {
            type: string;
        };
        object: {
            type: string;
        };
        newowner: {
            type: string;
            nested: boolean;
        };
    };
    AlterOperatorStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        opername: {
            type: string;
            nested: boolean;
        };
        options: {
            type: string;
        };
    };
    AlterTypeStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        typeName: {
            type: string;
        };
        options: {
            type: string;
        };
    };
    RuleStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        relation: {
            type: string;
        };
        rulename: {
            type: string;
        };
        whereClause: {
            type: string;
        };
        event: {
            type: string;
            enum: boolean;
        };
        instead: {
            type: string;
        };
        actions: {
            type: string;
        };
        replace: {
            type: string;
        };
    };
    NotifyStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        conditionname: {
            type: string;
        };
        payload: {
            type: string;
        };
    };
    ListenStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        conditionname: {
            type: string;
        };
    };
    UnlistenStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        conditionname: {
            type: string;
        };
    };
    TransactionStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        kind: {
            type: string;
            enum: boolean;
        };
        options: {
            type: string;
        };
        savepoint_name: {
            type: string;
        };
        gid: {
            type: string;
        };
        chain: {
            type: string;
        };
    };
    CompositeTypeStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        typevar: {
            type: string;
        };
        coldeflist: {
            type: string;
        };
    };
    CreateEnumStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        typeName: {
            type: string;
        };
        vals: {
            type: string;
        };
    };
    CreateRangeStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        typeName: {
            type: string;
        };
        params: {
            type: string;
        };
    };
    AlterEnumStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        typeName: {
            type: string;
        };
        oldVal: {
            type: string;
        };
        newVal: {
            type: string;
        };
        newValNeighbor: {
            type: string;
        };
        newValIsAfter: {
            type: string;
        };
        skipIfNewValExists: {
            type: string;
        };
    };
    ViewStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        view: {
            type: string;
        };
        aliases: {
            type: string;
        };
        query: {
            type: string;
        };
        replace: {
            type: string;
        };
        options: {
            type: string;
        };
        withCheckOption: {
            type: string;
            enum: boolean;
        };
    };
    LoadStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        filename: {
            type: string;
        };
    };
    CreatedbStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        dbname: {
            type: string;
        };
        options: {
            type: string;
        };
    };
    AlterDatabaseStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        dbname: {
            type: string;
        };
        options: {
            type: string;
        };
    };
    AlterDatabaseSetStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        dbname: {
            type: string;
        };
        setstmt: {
            type: string;
            nested: boolean;
        };
    };
    DropdbStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        dbname: {
            type: string;
        };
        missing_ok: {
            type: string;
        };
        options: {
            type: string;
        };
    };
    AlterSystemStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        setstmt: {
            type: string;
            nested: boolean;
        };
    };
    ClusterStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        relation: {
            type: string;
        };
        indexname: {
            type: string;
        };
        options: {
            type: string;
        };
    };
    VacuumStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        options: {
            type: string;
        };
        rels: {
            type: string;
        };
        is_vacuumcmd: {
            type: string;
        };
    };
    VacuumRelation: {
        type: {
            type: string;
            enum: boolean;
        };
        relation: {
            type: string;
        };
        oid: {
            type: string;
        };
        va_cols: {
            type: string;
        };
    };
    ExplainStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        query: {
            type: string;
        };
        options: {
            type: string;
        };
    };
    CreateTableAsStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        query: {
            type: string;
        };
        into: {
            type: string;
        };
        relkind: {
            type: string;
            enum: boolean;
        };
        is_select_into: {
            type: string;
        };
        if_not_exists: {
            type: string;
        };
    };
    RefreshMatViewStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        concurrent: {
            type: string;
        };
        skipData: {
            type: string;
        };
        relation: {
            type: string;
        };
    };
    CheckPointStmt: {
        type: {
            type: string;
            enum: boolean;
        };
    };
    DiscardStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        target: {
            type: string;
            enum: boolean;
        };
    };
    LockStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        relations: {
            type: string;
        };
        mode: {
            type: string;
        };
        nowait: {
            type: string;
        };
    };
    ConstraintsSetStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        constraints: {
            type: string;
        };
        deferred: {
            type: string;
        };
    };
    ReindexStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        kind: {
            type: string;
            enum: boolean;
        };
        relation: {
            type: string;
        };
        name: {
            type: string;
        };
        options: {
            type: string;
        };
        concurrent: {
            type: string;
        };
    };
    CreateConversionStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        conversion_name: {
            type: string;
        };
        for_encoding_name: {
            type: string;
        };
        to_encoding_name: {
            type: string;
        };
        func_name: {
            type: string;
        };
        def: {
            type: string;
        };
    };
    CreateCastStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        sourcetype: {
            type: string;
            nested: boolean;
        };
        targettype: {
            type: string;
            nested: boolean;
        };
        func: {
            type: string;
            nested: boolean;
        };
        context: {
            type: string;
            enum: boolean;
        };
        inout: {
            type: string;
        };
    };
    CreateTransformStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        replace: {
            type: string;
        };
        type_name: {
            type: string;
            nested: boolean;
        };
        lang: {
            type: string;
        };
        fromsql: {
            type: string;
            nested: boolean;
        };
        tosql: {
            type: string;
            nested: boolean;
        };
    };
    PrepareStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        name: {
            type: string;
        };
        argtypes: {
            type: string;
        };
        query: {
            type: string;
        };
    };
    ExecuteStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        name: {
            type: string;
        };
        params: {
            type: string;
        };
    };
    DeallocateStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        name: {
            type: string;
        };
    };
    DropOwnedStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        roles: {
            type: string;
        };
        behavior: {
            type: string;
            enum: boolean;
        };
    };
    ReassignOwnedStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        roles: {
            type: string;
        };
        newrole: {
            type: string;
            nested: boolean;
        };
    };
    AlterTSDictionaryStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        dictname: {
            type: string;
        };
        options: {
            type: string;
        };
    };
    AlterTSConfigurationStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        kind: {
            type: string;
            enum: boolean;
        };
        cfgname: {
            type: string;
        };
        tokentype: {
            type: string;
        };
        dicts: {
            type: string;
        };
        override: {
            type: string;
        };
        replace: {
            type: string;
        };
        missing_ok: {
            type: string;
        };
    };
    CreatePublicationStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        pubname: {
            type: string;
        };
        options: {
            type: string;
        };
        tables: {
            type: string;
        };
        for_all_tables: {
            type: string;
        };
    };
    AlterPublicationStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        pubname: {
            type: string;
        };
        options: {
            type: string;
        };
        tables: {
            type: string;
        };
        for_all_tables: {
            type: string;
        };
        tableAction: {
            type: string;
            enum: boolean;
        };
    };
    CreateSubscriptionStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        subname: {
            type: string;
        };
        conninfo: {
            type: string;
        };
        publication: {
            type: string;
        };
        options: {
            type: string;
        };
    };
    AlterSubscriptionStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        kind: {
            type: string;
            enum: boolean;
        };
        subname: {
            type: string;
        };
        conninfo: {
            type: string;
        };
        publication: {
            type: string;
        };
        options: {
            type: string;
        };
    };
    DropSubscriptionStmt: {
        type: {
            type: string;
            enum: boolean;
        };
        subname: {
            type: string;
        };
        missing_ok: {
            type: string;
        };
        behavior: {
            type: string;
            enum: boolean;
        };
    };
    VacAttrStats: {
        attr: {
            type: string;
        };
        attrtypid: {
            type: string;
        };
        attrtypmod: {
            type: string;
        };
        attrtype: {
            type: string;
        };
        attrcollid: {
            type: string;
        };
        anl_context: {
            type: string;
        };
        compute_stats: {
            type: string;
        };
        minrows: {
            type: string;
        };
        extra_data: {
            type: string;
        };
        stats_valid: {
            type: string;
        };
        stanullfrac: {
            type: string;
        };
        stawidth: {
            type: string;
        };
        stadistinct: {
            type: string;
        };
        "stakind[STATISTIC_NUM_SLOTS]": {
            type: string;
        };
        "staop[STATISTIC_NUM_SLOTS]": {
            type: string;
        };
        "stacoll[STATISTIC_NUM_SLOTS]": {
            type: string;
        };
        "numnumbers[STATISTIC_NUM_SLOTS]": {
            type: string;
        };
        "stanumbers[STATISTIC_NUM_SLOTS]": {
            type: string;
        };
        "numvalues[STATISTIC_NUM_SLOTS]": {
            type: string;
        };
        "stavalues[STATISTIC_NUM_SLOTS]": {
            type: string;
        };
        "statypid[STATISTIC_NUM_SLOTS]": {
            type: string;
        };
        "statyplen[STATISTIC_NUM_SLOTS]": {
            type: string;
        };
        "statypbyval[STATISTIC_NUM_SLOTS]": {
            type: string;
        };
        "statypalign[STATISTIC_NUM_SLOTS]": {
            type: string;
        };
        tupattnum: {
            type: string;
        };
        rows: {
            type: string;
        };
        tupDesc: {
            type: string;
        };
        exprvals: {
            type: string;
        };
        exprnulls: {
            type: string;
        };
        rowstride: {
            type: string;
        };
    };
    VacuumParams: {
        options: {
            type: string;
        };
        freeze_min_age: {
            type: string;
        };
        freeze_table_age: {
            type: string;
        };
        multixact_freeze_min_age: {
            type: string;
        };
        multixact_freeze_table_age: {
            type: string;
        };
        is_wraparound: {
            type: string;
        };
        log_min_duration: {
            type: string;
        };
        index_cleanup: {
            type: string;
            enum: boolean;
        };
        truncate: {
            type: string;
            enum: boolean;
        };
        nworkers: {
            type: string;
        };
    };
    Integer: {
        ival: {
            type: string;
        };
    };
    Float: {
        str: {
            type: string;
        };
    };
    String: {
        str: {
            type: string;
        };
    };
    BitString: {
        str: {
            type: string;
        };
    };
    Null: {};
};
export default _default;
