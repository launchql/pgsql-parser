module.exports = {
  'nodes/parsenodes': {
    OverridingKind: {
      values: [
        {
          comment: ''
        },
        {
          name: 'OVERRIDING_NOT_SET',
          value: 0
        },
        {
          name: 'OVERRIDING_USER_VALUE',
          value: 1
        },
        {
          name: 'OVERRIDING_SYSTEM_VALUE',
          value: 2
        }
      ],
      comment:
        '/*-------------------------------------------------------------------------\n *\n * parsenodes.h\n *\t  definitions for parse tree nodes\n *\n * Many of the node types used in parsetrees include a "location" field.\n * This is a byte (not character) offset in the original source text, to be\n * used for positioning an error cursor when there is an error related to\n * the node.  Access to the original source text is needed to make use of\n * the location.  At the topmost (statement) level, we also provide a\n * statement length, likewise measured in bytes, for convenience in\n * identifying statement boundaries in multi-statement source strings.\n *\n *\n * Portions Copyright (c) 1996-2020, PostgreSQL Global Development Group\n * Portions Copyright (c) 1994, Regents of the University of California\n *\n * src/include/nodes/parsenodes.h\n *\n *-------------------------------------------------------------------------\n */\n'
    },
    QuerySource: {
      values: [
        {
          comment: ''
        },
        {
          name: 'QSRC_ORIGINAL',
          value: 0,
          comment: '/* original parsetree (explicit query) */'
        },
        {
          name: 'QSRC_PARSER',
          value: 1,
          comment: '/* added by parse analysis (now unused) */'
        },
        {
          name: 'QSRC_INSTEAD_RULE',
          value: 2,
          comment: '/* added by unconditional INSTEAD rule */'
        },
        {
          name: 'QSRC_QUAL_INSTEAD_RULE',
          value: 3,
          comment: '/* added by conditional INSTEAD rule */'
        },
        {
          name: 'QSRC_NON_INSTEAD_RULE',
          value: 4,
          comment: '/* added by non-INSTEAD rule */'
        }
      ],
      comment: '/* Possible sources of a Query */\n'
    },
    SortByDir: {
      values: [
        {
          comment: ''
        },
        {
          name: 'SORTBY_DEFAULT',
          value: 0
        },
        {
          name: 'SORTBY_ASC',
          value: 1
        },
        {
          name: 'SORTBY_DESC',
          value: 2
        },
        {
          name: 'SORTBY_USING',
          value: 3,
          comment: '/* not allowed in CREATE INDEX ... */'
        }
      ],
      comment: '/* Sort ordering options for ORDER BY and CREATE INDEX */\n'
    },
    SortByNulls: {
      values: [
        {
          comment: ''
        },
        {
          name: 'SORTBY_NULLS_DEFAULT',
          value: 0
        },
        {
          name: 'SORTBY_NULLS_FIRST',
          value: 1
        },
        {
          name: 'SORTBY_NULLS_LAST',
          value: 2
        }
      ],
      comment: null
    },
    A_Expr_Kind: {
      values: [
        {
          comment: ''
        },
        {
          name: 'AEXPR_OP',
          value: 0,
          comment: '/* normal operator */'
        },
        {
          name: 'AEXPR_OP_ANY',
          value: 1,
          comment: '/* scalar op ANY (array) */'
        },
        {
          name: 'AEXPR_OP_ALL',
          value: 2,
          comment: '/* scalar op ALL (array) */'
        },
        {
          name: 'AEXPR_DISTINCT',
          value: 3,
          comment: '/* IS DISTINCT FROM - name must be "=" */'
        },
        {
          name: 'AEXPR_NOT_DISTINCT',
          value: 4,
          comment: '/* IS NOT DISTINCT FROM - name must be "=" */'
        },
        {
          name: 'AEXPR_NULLIF',
          value: 5,
          comment: '/* NULLIF - name must be "=" */'
        },
        {
          name: 'AEXPR_OF',
          value: 6,
          comment: '/* IS [NOT] OF - name must be "=" or "<>" */'
        },
        {
          name: 'AEXPR_IN',
          value: 7,
          comment: '/* [NOT] IN - name must be "=" or "<>" */'
        },
        {
          name: 'AEXPR_LIKE',
          value: 8,
          comment: '/* [NOT] LIKE - name must be "~~" or "!~~" */'
        },
        {
          name: 'AEXPR_ILIKE',
          value: 9,
          comment: '/* [NOT] ILIKE - name must be "~~*" or "!~~*" */'
        },
        {
          name: 'AEXPR_SIMILAR',
          value: 10,
          comment: '/* [NOT] SIMILAR - name must be "~" or "!~" */'
        },
        {
          name: 'AEXPR_BETWEEN',
          value: 11,
          comment: '/* name must be "BETWEEN" */'
        },
        {
          name: 'AEXPR_NOT_BETWEEN',
          value: 12,
          comment: '/* name must be "NOT BETWEEN" */'
        },
        {
          name: 'AEXPR_BETWEEN_SYM',
          value: 13,
          comment: '/* name must be "BETWEEN SYMMETRIC" */'
        },
        {
          name: 'AEXPR_NOT_BETWEEN_SYM',
          value: 14,
          comment: '/* name must be "NOT BETWEEN SYMMETRIC" */'
        },
        {
          name: 'AEXPR_PAREN',
          value: 15,
          comment: '/* nameless dummy node for parentheses */'
        }
      ],
      comment: '/*\n * A_Expr - infix, prefix, and postfix expressions\n */\n'
    },
    RoleSpecType: {
      values: [
        {
          comment: ''
        },
        {
          name: 'ROLESPEC_CSTRING',
          value: 0,
          comment: '/* role name is stored as a C string */'
        },
        {
          name: 'ROLESPEC_CURRENT_USER',
          value: 1,
          comment: '/* role spec is CURRENT_USER */'
        },
        {
          name: 'ROLESPEC_SESSION_USER',
          value: 2,
          comment: '/* role spec is SESSION_USER */'
        },
        {
          name: 'ROLESPEC_PUBLIC',
          value: 3,
          comment: '/* role name is "public" */'
        }
      ],
      comment:
        '/*\n * RoleSpec - a role name or one of a few special values.\n */\n'
    },
    TableLikeOption: {
      values: [
        {
          comment: ''
        },
        {
          name: 'CREATE_TABLE_LIKE_COMMENTS',
          value: 1
        },
        {
          name: 'CREATE_TABLE_LIKE_CONSTRAINTS',
          value: 2
        },
        {
          name: 'CREATE_TABLE_LIKE_DEFAULTS',
          value: 4
        },
        {
          name: 'CREATE_TABLE_LIKE_GENERATED',
          value: 8
        },
        {
          name: 'CREATE_TABLE_LIKE_IDENTITY',
          value: 16
        },
        {
          name: 'CREATE_TABLE_LIKE_INDEXES',
          value: 32
        },
        {
          name: 'CREATE_TABLE_LIKE_STATISTICS',
          value: 64
        },
        {
          name: 'CREATE_TABLE_LIKE_STORAGE',
          value: 128
        },
        {
          name: 'CREATE_TABLE_LIKE_ALL',
          value: 2147483647
        }
      ],
      comment: null
    },
    DefElemAction: {
      values: [
        {
          comment: ''
        },
        {
          name: 'DEFELEM_UNSPEC',
          value: 0,
          comment: '/* no action given */'
        },
        {
          name: 'DEFELEM_SET',
          value: 1
        },
        {
          name: 'DEFELEM_ADD',
          value: 2
        },
        {
          name: 'DEFELEM_DROP',
          value: 3
        }
      ],
      comment:
        '/*\n * DefElem - a generic "name = value" option definition\n *\n * In some contexts the name can be qualified.  Also, certain SQL commands\n * allow a SET/ADD/DROP action to be attached to option settings, so it\'s\n * convenient to carry a field for that too.  (Note: currently, it is our\n * practice that the grammar allows namespace and action only in statements\n * where they are relevant; C code can just ignore those fields in other\n * statements.)\n */\n'
    },
    PartitionRangeDatumKind: {
      values: [
        {
          comment: ''
        },
        {
          name: 'PARTITION_RANGE_DATUM_MINVALUE',
          value: 0
        },
        {
          name: 'PARTITION_RANGE_DATUM_VALUE',
          value: 0,
          comment: '/* a specific (bounded) value */'
        },
        {
          name: 'PARTITION_RANGE_DATUM_MAXVALUE',
          value: 1,
          comment: '/* greater than any other value */'
        }
      ],
      comment:
        '/*\n * PartitionRangeDatum - one of the values in a range partition bound\n *\n * This can be MINVALUE, MAXVALUE or a specific bounded value.\n */\n'
    },
    RTEKind: {
      values: [
        {
          comment: ''
        },
        {
          name: 'RTE_RELATION',
          value: 0,
          comment: '/* ordinary relation reference */'
        },
        {
          name: 'RTE_SUBQUERY',
          value: 1,
          comment: '/* subquery in FROM */'
        },
        {
          name: 'RTE_JOIN',
          value: 2,
          comment: '/* join */'
        },
        {
          name: 'RTE_FUNCTION',
          value: 3,
          comment: '/* function in FROM */'
        },
        {
          name: 'RTE_TABLEFUNC',
          value: 4,
          comment: '/* TableFunc(.., column list) */'
        },
        {
          name: 'RTE_VALUES',
          value: 5,
          comment: '/* VALUES (<exprlist>), (<exprlist>), ... */'
        },
        {
          name: 'RTE_CTE',
          value: 6,
          comment: '/* common table expr (WITH list element) */'
        },
        {
          name: 'RTE_NAMEDTUPLESTORE',
          value: 7,
          comment: '/* tuplestore, e.g. for AFTER triggers */'
        },
        {
          name: 'RTE_RESULT',
          value: 8,
          comment:
            "/* RTE represents an empty FROM clause; such\n\t\t\t\t\t\t\t\t * RTEs are added by the planner, they're not\n\t\t\t\t\t\t\t\t * present during parsing or rewriting */\n"
        }
      ],
      comment:
        "/*--------------------\n * RangeTblEntry -\n *\t  A range table is a List of RangeTblEntry nodes.\n *\n *\t  A range table entry may represent a plain relation, a sub-select in\n *\t  FROM, or the result of a JOIN clause.  (Only explicit JOIN syntax\n *\t  produces an RTE, not the implicit join resulting from multiple FROM\n *\t  items.  This is because we only need the RTE to deal with SQL features\n *\t  like outer joins and join-output-column aliasing.)  Other special\n *\t  RTE types also exist, as indicated by RTEKind.\n *\n *\t  Note that we consider RTE_RELATION to cover anything that has a pg_class\n *\t  entry.  relkind distinguishes the sub-cases.\n *\n *\t  alias is an Alias node representing the AS alias-clause attached to the\n *\t  FROM expression, or NULL if no clause.\n *\n *\t  eref is the table reference name and column reference names (either\n *\t  real or aliases).  Note that system columns (OID etc) are not included\n *\t  in the column list.\n *\t  eref->aliasname is required to be present, and should generally be used\n *\t  to identify the RTE for error messages etc.\n *\n *\t  In RELATION RTEs, the colnames in both alias and eref are indexed by\n *\t  physical attribute number; this means there must be colname entries for\n *\t  dropped columns.  When building an RTE we insert empty strings (\"\") for\n *\t  dropped columns.  Note however that a stored rule may have nonempty\n *\t  colnames for columns dropped since the rule was created (and for that\n *\t  matter the colnames might be out of date due to column renamings).\n *\t  The same comments apply to FUNCTION RTEs when a function's return type\n *\t  is a named composite type.\n *\n *\t  In JOIN RTEs, the colnames in both alias and eref are one-to-one with\n *\t  joinaliasvars entries.  A JOIN RTE will omit columns of its inputs when\n *\t  those columns are known to be dropped at parse time.  Again, however,\n *\t  a stored rule might contain entries for columns dropped since the rule\n *\t  was created.  (This is only possible for columns not actually referenced\n *\t  in the rule.)  When loading a stored rule, we replace the joinaliasvars\n *\t  items for any such columns with null pointers.  (We can't simply delete\n *\t  them from the joinaliasvars list, because that would affect the attnums\n *\t  of Vars referencing the rest of the list.)\n *\n *\t  inh is true for relation references that should be expanded to include\n *\t  inheritance children, if the rel has any.  This *must* be false for\n *\t  RTEs other than RTE_RELATION entries.\n *\n *\t  inFromCl marks those range variables that are listed in the FROM clause.\n *\t  It's false for RTEs that are added to a query behind the scenes, such\n *\t  as the NEW and OLD variables for a rule, or the subqueries of a UNION.\n *\t  This flag is not used anymore during parsing, since the parser now uses\n *\t  a separate \"namespace\" data structure to control visibility, but it is\n *\t  needed by ruleutils.c to determine whether RTEs should be shown in\n *\t  decompiled queries.\n *\n *\t  requiredPerms and checkAsUser specify run-time access permissions\n *\t  checks to be performed at query startup.  The user must have *all*\n *\t  of the permissions that are OR'd together in requiredPerms (zero\n *\t  indicates no permissions checking).  If checkAsUser is not zero,\n *\t  then do the permissions checks using the access rights of that user,\n *\t  not the current effective user ID.  (This allows rules to act as\n *\t  setuid gateways.)  Permissions checks only apply to RELATION RTEs.\n *\n *\t  For SELECT/INSERT/UPDATE permissions, if the user doesn't have\n *\t  table-wide permissions then it is sufficient to have the permissions\n *\t  on all columns identified in selectedCols (for SELECT) and/or\n *\t  insertedCols and/or updatedCols (INSERT with ON CONFLICT DO UPDATE may\n *\t  have all 3).  selectedCols, insertedCols and updatedCols are bitmapsets,\n *\t  which cannot have negative integer members, so we subtract\n *\t  FirstLowInvalidHeapAttributeNumber from column numbers before storing\n *\t  them in these fields.  A whole-row Var reference is represented by\n *\t  setting the bit for InvalidAttrNumber.\n *\n *\t  updatedCols is also used in some other places, for example, to determine\n *\t  which triggers to fire and in FDWs to know which changed columns they\n *\t  need to ship off.\n *\n *\t  Generated columns that are caused to be updated by an update to a base\n *\t  column are listed in extraUpdatedCols.  This is not considered for\n *\t  permission checking, but it is useful in those places that want to know\n *\t  the full set of columns being updated as opposed to only the ones the\n *\t  user explicitly mentioned in the query.  (There is currently no need for\n *\t  an extraInsertedCols, but it could exist.)  Note that extraUpdatedCols\n *\t  is populated during query rewrite, NOT in the parser, since generated\n *\t  columns could be added after a rule has been parsed and stored.\n *\n *\t  securityQuals is a list of security barrier quals (boolean expressions),\n *\t  to be tested in the listed order before returning a row from the\n *\t  relation.  It is always NIL in parser output.  Entries are added by the\n *\t  rewriter to implement security-barrier views and/or row-level security.\n *\t  Note that the planner turns each boolean expression into an implicitly\n *\t  AND'ed sublist, as is its usual habit with qualification expressions.\n *--------------------\n */\n"
    },
    WCOKind: {
      values: [
        {
          comment: ''
        },
        {
          name: 'WCO_VIEW_CHECK',
          value: 0,
          comment: '/* WCO on an auto-updatable view */'
        },
        {
          name: 'WCO_RLS_INSERT_CHECK',
          value: 1,
          comment: '/* RLS INSERT WITH CHECK policy */'
        },
        {
          name: 'WCO_RLS_UPDATE_CHECK',
          value: 2,
          comment: '/* RLS UPDATE WITH CHECK policy */'
        },
        {
          name: 'WCO_RLS_CONFLICT_CHECK',
          value: 3,
          comment: '/* RLS ON CONFLICT DO UPDATE USING policy */'
        }
      ],
      comment:
        '/*\n * WithCheckOption -\n *\t\trepresentation of WITH CHECK OPTION checks to be applied to new tuples\n *\t\twhen inserting/updating an auto-updatable view, or RLS WITH CHECK\n *\t\tpolicies to be applied when inserting/updating a relation with RLS.\n */\n'
    },
    GroupingSetKind: {
      values: [
        {
          comment: ''
        },
        {
          name: 'GROUPING_SET_EMPTY',
          value: 0
        },
        {
          name: 'GROUPING_SET_SIMPLE',
          value: 1
        },
        {
          name: 'GROUPING_SET_ROLLUP',
          value: 2
        },
        {
          name: 'GROUPING_SET_CUBE',
          value: 3
        },
        {
          name: 'GROUPING_SET_SETS',
          value: 4
        }
      ],
      comment:
        "/*\n * GroupingSet -\n *\t\trepresentation of CUBE, ROLLUP and GROUPING SETS clauses\n *\n * In a Query with grouping sets, the groupClause contains a flat list of\n * SortGroupClause nodes for each distinct expression used.  The actual\n * structure of the GROUP BY clause is given by the groupingSets tree.\n *\n * In the raw parser output, GroupingSet nodes (of all types except SIMPLE\n * which is not used) are potentially mixed in with the expressions in the\n * groupClause of the SelectStmt.  (An expression can't contain a GroupingSet,\n * but a list may mix GroupingSet and expression nodes.)  At this stage, the\n * content of each node is a list of expressions, some of which may be RowExprs\n * which represent sublists rather than actual row constructors, and nested\n * GroupingSet nodes where legal in the grammar.  The structure directly\n * reflects the query syntax.\n *\n * In parse analysis, the transformed expressions are used to build the tlist\n * and groupClause list (of SortGroupClause nodes), and the groupingSets tree\n * is eventually reduced to a fixed format:\n *\n * EMPTY nodes represent (), and obviously have no content\n *\n * SIMPLE nodes represent a list of one or more expressions to be treated as an\n * atom by the enclosing structure; the content is an integer list of\n * ressortgroupref values (see SortGroupClause)\n *\n * CUBE and ROLLUP nodes contain a list of one or more SIMPLE nodes.\n *\n * SETS nodes contain a list of EMPTY, SIMPLE, CUBE or ROLLUP nodes, but after\n * parse analysis they cannot contain more SETS nodes; enough of the syntactic\n * transforms of the spec have been applied that we no longer have arbitrarily\n * deep nesting (though we still preserve the use of cube/rollup).\n *\n * Note that if the groupingSets tree contains no SIMPLE nodes (only EMPTY\n * nodes at the leaves), then the groupClause will be empty, but this is still\n * an aggregation query (similar to using aggs or HAVING without GROUP BY).\n *\n * As an example, the following clause:\n *\n * GROUP BY GROUPING SETS ((a,b), CUBE(c,(d,e)))\n *\n * looks like this after raw parsing:\n *\n * SETS( RowExpr(a,b) , CUBE( c, RowExpr(d,e) ) )\n *\n * and parse analysis converts it to:\n *\n * SETS( SIMPLE(1,2), CUBE( SIMPLE(3), SIMPLE(4,5) ) )\n */\n"
    },
    CTEMaterialize: {
      values: [
        {
          comment: ''
        },
        {
          name: 'CTEMaterializeDefault',
          value: 0,
          comment: '/* no option specified */'
        },
        {
          name: 'CTEMaterializeAlways',
          value: 1,
          comment: '/* MATERIALIZED */'
        },
        {
          name: 'CTEMaterializeNever',
          value: 2,
          comment: '/* NOT MATERIALIZED */'
        }
      ],
      comment:
        "/*\n * CommonTableExpr -\n *\t   representation of WITH list element\n *\n * We don't currently support the SEARCH or CYCLE clause.\n */\n"
    },
    SetOperation: {
      values: [
        {
          comment: ''
        },
        {
          name: 'SETOP_NONE',
          value: 0
        },
        {
          name: 'SETOP_UNION',
          value: 1
        },
        {
          name: 'SETOP_INTERSECT',
          value: 2
        },
        {
          name: 'SETOP_EXCEPT',
          value: 3
        }
      ],
      comment:
        '/* ----------------------\n *\t\tSelect Statement\n *\n * A "simple" SELECT is represented in the output of gram.y by a single\n * SelectStmt node; so is a VALUES construct.  A query containing set\n * operators (UNION, INTERSECT, EXCEPT) is represented by a tree of SelectStmt\n * nodes, in which the leaf nodes are component SELECTs and the internal nodes\n * represent UNION, INTERSECT, or EXCEPT operators.  Using the same node\n * type for both leaf and internal nodes allows gram.y to stick ORDER BY,\n * LIMIT, etc, clause values into a SELECT statement without worrying\n * whether it is a simple or compound SELECT.\n * ----------------------\n */\n'
    },
    ObjectType: {
      values: [
        {
          comment: ''
        },
        {
          name: 'OBJECT_ACCESS_METHOD',
          value: 0
        },
        {
          name: 'OBJECT_AGGREGATE',
          value: 1
        },
        {
          name: 'OBJECT_AMOP',
          value: 2
        },
        {
          name: 'OBJECT_AMPROC',
          value: 3
        },
        {
          name: 'OBJECT_ATTRIBUTE',
          value: 4,
          comment: "/* type's attribute, when distinct from column */"
        },
        {
          name: 'OBJECT_CAST',
          value: 5
        },
        {
          name: 'OBJECT_COLUMN',
          value: 6
        },
        {
          name: 'OBJECT_COLLATION',
          value: 7
        },
        {
          name: 'OBJECT_CONVERSION',
          value: 8
        },
        {
          name: 'OBJECT_DATABASE',
          value: 9
        },
        {
          name: 'OBJECT_DEFAULT',
          value: 10
        },
        {
          name: 'OBJECT_DEFACL',
          value: 11
        },
        {
          name: 'OBJECT_DOMAIN',
          value: 12
        },
        {
          name: 'OBJECT_DOMCONSTRAINT',
          value: 13
        },
        {
          name: 'OBJECT_EVENT_TRIGGER',
          value: 14
        },
        {
          name: 'OBJECT_EXTENSION',
          value: 15
        },
        {
          name: 'OBJECT_FDW',
          value: 16
        },
        {
          name: 'OBJECT_FOREIGN_SERVER',
          value: 17
        },
        {
          name: 'OBJECT_FOREIGN_TABLE',
          value: 18
        },
        {
          name: 'OBJECT_FUNCTION',
          value: 19
        },
        {
          name: 'OBJECT_INDEX',
          value: 20
        },
        {
          name: 'OBJECT_LANGUAGE',
          value: 21
        },
        {
          name: 'OBJECT_LARGEOBJECT',
          value: 22
        },
        {
          name: 'OBJECT_MATVIEW',
          value: 23
        },
        {
          name: 'OBJECT_OPCLASS',
          value: 24
        },
        {
          name: 'OBJECT_OPERATOR',
          value: 25
        },
        {
          name: 'OBJECT_OPFAMILY',
          value: 26
        },
        {
          name: 'OBJECT_POLICY',
          value: 27
        },
        {
          name: 'OBJECT_PROCEDURE',
          value: 28
        },
        {
          name: 'OBJECT_PUBLICATION',
          value: 29
        },
        {
          name: 'OBJECT_PUBLICATION_REL',
          value: 30
        },
        {
          name: 'OBJECT_ROLE',
          value: 31
        },
        {
          name: 'OBJECT_ROUTINE',
          value: 32
        },
        {
          name: 'OBJECT_RULE',
          value: 33
        },
        {
          name: 'OBJECT_SCHEMA',
          value: 34
        },
        {
          name: 'OBJECT_SEQUENCE',
          value: 35
        },
        {
          name: 'OBJECT_SUBSCRIPTION',
          value: 36
        },
        {
          name: 'OBJECT_STATISTIC_EXT',
          value: 37
        },
        {
          name: 'OBJECT_TABCONSTRAINT',
          value: 38
        },
        {
          name: 'OBJECT_TABLE',
          value: 39
        },
        {
          name: 'OBJECT_TABLESPACE',
          value: 40
        },
        {
          name: 'OBJECT_TRANSFORM',
          value: 41
        },
        {
          name: 'OBJECT_TRIGGER',
          value: 42
        },
        {
          name: 'OBJECT_TSCONFIGURATION',
          value: 43
        },
        {
          name: 'OBJECT_TSDICTIONARY',
          value: 44
        },
        {
          name: 'OBJECT_TSPARSER',
          value: 45
        },
        {
          name: 'OBJECT_TSTEMPLATE',
          value: 46
        },
        {
          name: 'OBJECT_TYPE',
          value: 47
        },
        {
          name: 'OBJECT_USER_MAPPING',
          value: 48
        },
        {
          name: 'OBJECT_VIEW',
          value: 49
        }
      ],
      comment:
        "/*\n * When a command can act on several kinds of objects with only one\n * parse structure required, use these constants to designate the\n * object type.  Note that commands typically don't support all the types.\n */\n"
    },
    DropBehavior: {
      values: [
        {
          comment: ''
        },
        {
          name: 'DROP_RESTRICT',
          value: 0,
          comment: '/* drop fails if any dependent objects */'
        },
        {
          name: 'DROP_CASCADE',
          value: 1,
          comment: '/* remove dependent objects too */'
        }
      ],
      comment: null
    },
    AlterTableType: {
      values: [
        {
          comment: ''
        },
        {
          name: 'AT_AddColumn',
          value: 0,
          comment: '/* add column */'
        },
        {
          name: 'AT_AddColumnRecurse',
          value: 1,
          comment: '/* internal to commands/tablecmds.c */'
        },
        {
          name: 'AT_AddColumnToView',
          value: 2,
          comment: '/* implicitly via CREATE OR REPLACE VIEW */'
        },
        {
          name: 'AT_ColumnDefault',
          value: 3,
          comment: '/* alter column default */'
        },
        {
          name: 'AT_CookedColumnDefault',
          value: 4,
          comment: '/* add a pre-cooked column default */'
        },
        {
          name: 'AT_DropNotNull',
          value: 5,
          comment: '/* alter column drop not null */'
        },
        {
          name: 'AT_SetNotNull',
          value: 6,
          comment: '/* alter column set not null */'
        },
        {
          name: 'AT_DropExpression',
          value: 7,
          comment: '/* alter column drop expression */'
        },
        {
          name: 'AT_CheckNotNull',
          value: 8,
          comment: '/* check column is already marked not null */'
        },
        {
          name: 'AT_SetStatistics',
          value: 9,
          comment: '/* alter column set statistics */'
        },
        {
          name: 'AT_SetOptions',
          value: 10,
          comment: '/* alter column set ( options ) */'
        },
        {
          name: 'AT_ResetOptions',
          value: 11,
          comment: '/* alter column reset ( options ) */'
        },
        {
          name: 'AT_SetStorage',
          value: 12,
          comment: '/* alter column set storage */'
        },
        {
          name: 'AT_DropColumn',
          value: 13,
          comment: '/* drop column */'
        },
        {
          name: 'AT_DropColumnRecurse',
          value: 14,
          comment: '/* internal to commands/tablecmds.c */'
        },
        {
          name: 'AT_AddIndex',
          value: 15,
          comment: '/* add index */'
        },
        {
          name: 'AT_ReAddIndex',
          value: 16,
          comment: '/* internal to commands/tablecmds.c */'
        },
        {
          name: 'AT_AddConstraint',
          value: 17,
          comment: '/* add constraint */'
        },
        {
          name: 'AT_AddConstraintRecurse',
          value: 18,
          comment: '/* internal to commands/tablecmds.c */'
        },
        {
          name: 'AT_ReAddConstraint',
          value: 19,
          comment: '/* internal to commands/tablecmds.c */'
        },
        {
          name: 'AT_ReAddDomainConstraint',
          value: 20,
          comment: '/* internal to commands/tablecmds.c */'
        },
        {
          name: 'AT_AlterConstraint',
          value: 21,
          comment: '/* alter constraint */'
        },
        {
          name: 'AT_ValidateConstraint',
          value: 22,
          comment: '/* validate constraint */'
        },
        {
          name: 'AT_ValidateConstraintRecurse',
          value: 23,
          comment: '/* internal to commands/tablecmds.c */'
        },
        {
          name: 'AT_AddIndexConstraint',
          value: 24,
          comment: '/* add constraint using existing index */'
        },
        {
          name: 'AT_DropConstraint',
          value: 25,
          comment: '/* drop constraint */'
        },
        {
          name: 'AT_DropConstraintRecurse',
          value: 26,
          comment: '/* internal to commands/tablecmds.c */'
        },
        {
          name: 'AT_ReAddComment',
          value: 27,
          comment: '/* internal to commands/tablecmds.c */'
        },
        {
          name: 'AT_AlterColumnType',
          value: 28,
          comment: '/* alter column type */'
        },
        {
          name: 'AT_AlterColumnGenericOptions',
          value: 29,
          comment: '/* alter column OPTIONS (...) */'
        },
        {
          name: 'AT_ChangeOwner',
          value: 30,
          comment: '/* change owner */'
        },
        {
          name: 'AT_ClusterOn',
          value: 31,
          comment: '/* CLUSTER ON */'
        },
        {
          name: 'AT_DropCluster',
          value: 32,
          comment: '/* SET WITHOUT CLUSTER */'
        },
        {
          name: 'AT_SetLogged',
          value: 33,
          comment: '/* SET LOGGED */'
        },
        {
          name: 'AT_SetUnLogged',
          value: 34,
          comment: '/* SET UNLOGGED */'
        },
        {
          name: 'AT_DropOids',
          value: 35,
          comment: '/* SET WITHOUT OIDS */'
        },
        {
          name: 'AT_SetTableSpace',
          value: 36,
          comment: '/* SET TABLESPACE */'
        },
        {
          name: 'AT_SetRelOptions',
          value: 37,
          comment: '/* SET (...) -- AM specific parameters */'
        },
        {
          name: 'AT_ResetRelOptions',
          value: 38,
          comment: '/* RESET (...) -- AM specific parameters */'
        },
        {
          name: 'AT_ReplaceRelOptions',
          value: 39,
          comment: '/* replace reloption list in its entirety */'
        },
        {
          name: 'AT_EnableTrig',
          value: 40,
          comment: '/* ENABLE TRIGGER name */'
        },
        {
          name: 'AT_EnableAlwaysTrig',
          value: 41,
          comment: '/* ENABLE ALWAYS TRIGGER name */'
        },
        {
          name: 'AT_EnableReplicaTrig',
          value: 42,
          comment: '/* ENABLE REPLICA TRIGGER name */'
        },
        {
          name: 'AT_DisableTrig',
          value: 43,
          comment: '/* DISABLE TRIGGER name */'
        },
        {
          name: 'AT_EnableTrigAll',
          value: 44,
          comment: '/* ENABLE TRIGGER ALL */'
        },
        {
          name: 'AT_DisableTrigAll',
          value: 45,
          comment: '/* DISABLE TRIGGER ALL */'
        },
        {
          name: 'AT_EnableTrigUser',
          value: 46,
          comment: '/* ENABLE TRIGGER USER */'
        },
        {
          name: 'AT_DisableTrigUser',
          value: 47,
          comment: '/* DISABLE TRIGGER USER */'
        },
        {
          name: 'AT_EnableRule',
          value: 48,
          comment: '/* ENABLE RULE name */'
        },
        {
          name: 'AT_EnableAlwaysRule',
          value: 49,
          comment: '/* ENABLE ALWAYS RULE name */'
        },
        {
          name: 'AT_EnableReplicaRule',
          value: 50,
          comment: '/* ENABLE REPLICA RULE name */'
        },
        {
          name: 'AT_DisableRule',
          value: 51,
          comment: '/* DISABLE RULE name */'
        },
        {
          name: 'AT_AddInherit',
          value: 52,
          comment: '/* INHERIT parent */'
        },
        {
          name: 'AT_DropInherit',
          value: 53,
          comment: '/* NO INHERIT parent */'
        },
        {
          name: 'AT_AddOf',
          value: 54,
          comment: '/* OF <type_name> */'
        },
        {
          name: 'AT_DropOf',
          value: 55,
          comment: '/* NOT OF */'
        },
        {
          name: 'AT_ReplicaIdentity',
          value: 56,
          comment: '/* REPLICA IDENTITY */'
        },
        {
          name: 'AT_EnableRowSecurity',
          value: 57,
          comment: '/* ENABLE ROW SECURITY */'
        },
        {
          name: 'AT_DisableRowSecurity',
          value: 58,
          comment: '/* DISABLE ROW SECURITY */'
        },
        {
          name: 'AT_ForceRowSecurity',
          value: 59,
          comment: '/* FORCE ROW SECURITY */'
        },
        {
          name: 'AT_NoForceRowSecurity',
          value: 60,
          comment: '/* NO FORCE ROW SECURITY */'
        },
        {
          name: 'AT_GenericOptions',
          value: 61,
          comment: '/* OPTIONS (...) */'
        },
        {
          name: 'AT_AttachPartition',
          value: 62,
          comment: '/* ATTACH PARTITION */'
        },
        {
          name: 'AT_DetachPartition',
          value: 63,
          comment: '/* DETACH PARTITION */'
        },
        {
          name: 'AT_AddIdentity',
          value: 64,
          comment: '/* ADD IDENTITY */'
        },
        {
          name: 'AT_SetIdentity',
          value: 65,
          comment: '/* SET identity column options */'
        },
        {
          name: 'AT_DropIdentity',
          value: 66,
          comment: '/* DROP IDENTITY */'
        }
      ],
      comment: null
    },
    GrantTargetType: {
      values: [
        {
          comment: ''
        },
        {
          name: 'ACL_TARGET_OBJECT',
          value: 0,
          comment: '/* grant on specific named object(s) */'
        },
        {
          name: 'ACL_TARGET_ALL_IN_SCHEMA',
          value: 1,
          comment: '/* grant on all objects in given schema(s) */'
        },
        {
          name: 'ACL_TARGET_DEFAULTS',
          value: 2,
          comment: '/* ALTER DEFAULT PRIVILEGES */'
        }
      ],
      comment:
        '/* ----------------------\n *\t\tGrant|Revoke Statement\n * ----------------------\n */\n'
    },
    VariableSetKind: {
      values: [
        {
          comment: ''
        },
        {
          name: 'VAR_SET_VALUE',
          value: 0,
          comment: '/* SET var = value */'
        },
        {
          name: 'VAR_SET_DEFAULT',
          value: 1,
          comment: '/* SET var TO DEFAULT */'
        },
        {
          name: 'VAR_SET_CURRENT',
          value: 2,
          comment: '/* SET var FROM CURRENT */'
        },
        {
          name: 'VAR_SET_MULTI',
          value: 3,
          comment: '/* special case for SET TRANSACTION ... */'
        },
        {
          name: 'VAR_RESET',
          value: 4,
          comment: '/* RESET var */'
        },
        {
          name: 'VAR_RESET_ALL',
          value: 5,
          comment: '/* RESET ALL */'
        }
      ],
      comment:
        '/* ----------------------\n * SET Statement (includes RESET)\n *\n * "SET var TO DEFAULT" and "RESET var" are semantically equivalent, but we\n * preserve the distinction in VariableSetKind for CreateCommandTag().\n * ----------------------\n */\n'
    },
    ConstrType: {
      values: [
        {
          comment: ''
        },
        {
          name: 'CONSTR_NULL',
          value: 0,
          comment:
            '/* not standard SQL, but a lot of people\n\t\t\t\t\t\t\t\t * expect it */\n'
        },
        {
          name: 'CONSTR_NOTNULL',
          value: 1
        },
        {
          name: 'CONSTR_DEFAULT',
          value: 2
        },
        {
          name: 'CONSTR_IDENTITY',
          value: 3
        },
        {
          name: 'CONSTR_GENERATED',
          value: 4
        },
        {
          name: 'CONSTR_CHECK',
          value: 5
        },
        {
          name: 'CONSTR_PRIMARY',
          value: 6
        },
        {
          name: 'CONSTR_UNIQUE',
          value: 7
        },
        {
          name: 'CONSTR_EXCLUSION',
          value: 8
        },
        {
          name: 'CONSTR_FOREIGN',
          value: 9
        },
        {
          name: 'CONSTR_ATTR_DEFERRABLE',
          value: 10,
          comment: '/* attributes for previous constraint node */'
        },
        {
          name: 'CONSTR_ATTR_NOT_DEFERRABLE',
          value: 11
        },
        {
          name: 'CONSTR_ATTR_DEFERRED',
          value: 12
        },
        {
          name: 'CONSTR_ATTR_IMMEDIATE',
          value: 13
        }
      ],
      comment:
        '/* ----------\n * Definitions for constraints in CreateStmt\n *\n * Note that column defaults are treated as a type of constraint,\n * even though that\'s a bit odd semantically.\n *\n * For constraints that use expressions (CONSTR_CHECK, CONSTR_DEFAULT)\n * we may have the expression in either "raw" form (an untransformed\n * parse tree) or "cooked" form (the nodeToString representation of\n * an executable expression tree), depending on how this Constraint\n * node was created (by parsing, or by inheritance from an existing\n * relation).  We should never have both in the same node!\n *\n * FKCONSTR_ACTION_xxx values are stored into pg_constraint.confupdtype\n * and pg_constraint.confdeltype columns; FKCONSTR_MATCH_xxx values are\n * stored into pg_constraint.confmatchtype.  Changing the code values may\n * require an initdb!\n *\n * If skip_validation is true then we skip checking that the existing rows\n * in the table satisfy the constraint, and just install the catalog entries\n * for the constraint.  A new FK constraint is marked as valid iff\n * initially_valid is true.  (Usually skip_validation and initially_valid\n * are inverses, but we can set both true if the table is known empty.)\n *\n * Constraint attributes (DEFERRABLE etc) are initially represented as\n * separate Constraint nodes for simplicity of parsing.  parse_utilcmd.c makes\n * a pass through the constraints list to insert the info into the appropriate\n * Constraint node.\n * ----------\n */\n'
    },
    ImportForeignSchemaType: {
      values: [
        {
          comment: ''
        },
        {
          name: 'FDW_IMPORT_SCHEMA_ALL',
          value: 0,
          comment: '/* all relations wanted */'
        },
        {
          name: 'FDW_IMPORT_SCHEMA_LIMIT_TO',
          value: 1,
          comment: '/* include only listed tables in import */'
        },
        {
          name: 'FDW_IMPORT_SCHEMA_EXCEPT',
          value: 2,
          comment: '/* exclude listed tables from import */'
        }
      ],
      comment:
        '/* ----------------------\n *\t\tImport Foreign Schema Statement\n * ----------------------\n */\n'
    },
    RoleStmtType: {
      values: [
        {
          comment: ''
        },
        {
          name: 'ROLESTMT_ROLE',
          value: 0
        },
        {
          name: 'ROLESTMT_USER',
          value: 1
        },
        {
          name: 'ROLESTMT_GROUP',
          value: 2
        }
      ],
      comment:
        "/* ----------------------\n *\tCreate/Alter/Drop Role Statements\n *\n * Note: these node types are also used for the backwards-compatible\n * Create/Alter/Drop User/Group statements.  In the ALTER and DROP cases\n * there's really no need to distinguish what the original spelling was,\n * but for CREATE we mark the type because the defaults vary.\n * ----------------------\n */\n"
    },
    FetchDirection: {
      values: [
        {
          comment: ''
        },
        {
          comment:
            '\t/* for these, howMany is how many rows to fetch; FETCH_ALL means ALL */\n'
        },
        {
          name: 'FETCH_FORWARD',
          value: 0
        },
        {
          name: 'FETCH_BACKWARD',
          value: 1
        },
        {
          comment:
            '\t/* for these, howMany indicates a position; only one row is fetched */\n'
        },
        {
          name: 'FETCH_ABSOLUTE',
          value: 2
        },
        {
          name: 'FETCH_RELATIVE',
          value: 3
        }
      ],
      comment:
        '/* ----------------------\n *\t\tFetch Statement (also Move)\n * ----------------------\n */\n'
    },
    FunctionParameterMode: {
      values: [
        {
          comment: ''
        },
        {
          comment:
            "\t/* the assigned enum values appear in pg_proc, don't change 'em! */\n"
        },
        {
          name: 'FUNC_PARAM_IN',
          value: 105,
          comment: '/* input only */'
        },
        {
          name: 'FUNC_PARAM_OUT',
          value: 111,
          comment: '/* output only */'
        },
        {
          name: 'FUNC_PARAM_INOUT',
          value: 98,
          comment: '/* both */'
        },
        {
          name: 'FUNC_PARAM_VARIADIC',
          value: 118,
          comment: '/* variadic (always input) */'
        },
        {
          name: 'FUNC_PARAM_TABLE',
          value: 116,
          comment: '/* table function output column */'
        }
      ],
      comment: null
    },
    TransactionStmtKind: {
      values: [
        {
          comment: ''
        },
        {
          name: 'TRANS_STMT_BEGIN',
          value: 0
        },
        {
          name: 'TRANS_STMT_START',
          value: 1,
          comment: '/* semantically identical to BEGIN */'
        },
        {
          name: 'TRANS_STMT_COMMIT',
          value: 2
        },
        {
          name: 'TRANS_STMT_ROLLBACK',
          value: 3
        },
        {
          name: 'TRANS_STMT_SAVEPOINT',
          value: 4
        },
        {
          name: 'TRANS_STMT_RELEASE',
          value: 5
        },
        {
          name: 'TRANS_STMT_ROLLBACK_TO',
          value: 6
        },
        {
          name: 'TRANS_STMT_PREPARE',
          value: 7
        },
        {
          name: 'TRANS_STMT_COMMIT_PREPARED',
          value: 8
        },
        {
          name: 'TRANS_STMT_ROLLBACK_PREPARED',
          value: 9
        }
      ],
      comment:
        '/* ----------------------\n *\t\t{Begin|Commit|Rollback} Transaction Statement\n * ----------------------\n */\n'
    },
    ViewCheckOption: {
      values: [
        {
          comment: ''
        },
        {
          name: 'NO_CHECK_OPTION',
          value: 0
        },
        {
          name: 'LOCAL_CHECK_OPTION',
          value: 1
        },
        {
          name: 'CASCADED_CHECK_OPTION',
          value: 2
        }
      ],
      comment:
        '/* ----------------------\n *\t\tCreate View Statement\n * ----------------------\n */\n'
    },
    ClusterOption: {
      values: [
        {
          comment: ''
        },
        {
          name: 'CLUOPT_RECHECK',
          value: 1,
          comment: '/* recheck relation state */'
        },
        {
          name: 'CLUOPT_VERBOSE',
          value: 2,
          comment: '/* print progress info */'
        }
      ],
      comment:
        "/* ----------------------\n *\t\tCluster Statement (support pbrown's cluster index implementation)\n * ----------------------\n */\n"
    },
    DiscardMode: {
      values: [
        {
          comment: ''
        },
        {
          name: 'DISCARD_ALL',
          value: 0
        },
        {
          name: 'DISCARD_PLANS',
          value: 1
        },
        {
          name: 'DISCARD_SEQUENCES',
          value: 2
        },
        {
          name: 'DISCARD_TEMP',
          value: 3
        }
      ],
      comment:
        '/* ----------------------\n * Discard Statement\n * ----------------------\n */\n'
    },
    ReindexObjectType: {
      values: [
        {
          comment: ''
        },
        {
          name: 'REINDEX_OBJECT_INDEX',
          value: 0,
          comment: '/* index */'
        },
        {
          name: 'REINDEX_OBJECT_TABLE',
          value: 1,
          comment: '/* table or materialized view */'
        },
        {
          name: 'REINDEX_OBJECT_SCHEMA',
          value: 2,
          comment: '/* schema */'
        },
        {
          name: 'REINDEX_OBJECT_SYSTEM',
          value: 3,
          comment: '/* system catalogs */'
        },
        {
          name: 'REINDEX_OBJECT_DATABASE',
          value: 4,
          comment: '/* database */'
        }
      ],
      comment: '/* Reindex options */\n'
    },
    AlterTSConfigType: {
      values: [
        {
          comment: ''
        },
        {
          name: 'ALTER_TSCONFIG_ADD_MAPPING',
          value: 0
        },
        {
          name: 'ALTER_TSCONFIG_ALTER_MAPPING_FOR_TOKEN',
          value: 1
        },
        {
          name: 'ALTER_TSCONFIG_REPLACE_DICT',
          value: 2
        },
        {
          name: 'ALTER_TSCONFIG_REPLACE_DICT_FOR_TOKEN',
          value: 3
        },
        {
          name: 'ALTER_TSCONFIG_DROP_MAPPING',
          value: 4
        }
      ],
      comment:
        '/*\n * TS Configuration stmts: DefineStmt, RenameStmt and DropStmt are default\n */\n'
    },
    AlterSubscriptionType: {
      values: [
        {
          comment: ''
        },
        {
          name: 'ALTER_SUBSCRIPTION_OPTIONS',
          value: 0
        },
        {
          name: 'ALTER_SUBSCRIPTION_CONNECTION',
          value: 1
        },
        {
          name: 'ALTER_SUBSCRIPTION_PUBLICATION',
          value: 2
        },
        {
          name: 'ALTER_SUBSCRIPTION_REFRESH',
          value: 3
        },
        {
          name: 'ALTER_SUBSCRIPTION_ENABLED',
          value: 4
        }
      ],
      comment: null
    }
  },
  'nodes/primnodes': {
    OnCommitAction: {
      values: [
        {
          comment: ''
        },
        {
          name: 'ONCOMMIT_NOOP',
          value: 0,
          comment: '/* No ON COMMIT clause (do nothing) */'
        },
        {
          name: 'ONCOMMIT_PRESERVE_ROWS',
          value: 1,
          comment: '/* ON COMMIT PRESERVE ROWS (do nothing) */'
        },
        {
          name: 'ONCOMMIT_DELETE_ROWS',
          value: 2,
          comment: '/* ON COMMIT DELETE ROWS */'
        },
        {
          name: 'ONCOMMIT_DROP',
          value: 3,
          comment: '/* ON COMMIT DROP */'
        }
      ],
      comment: '/* What to do at commit time for temporary relations */\n'
    },
    ParamKind: {
      values: [
        {
          comment: ''
        },
        {
          name: 'PARAM_EXTERN',
          value: 0
        },
        {
          name: 'PARAM_EXEC',
          value: 1
        },
        {
          name: 'PARAM_SUBLINK',
          value: 2
        },
        {
          name: 'PARAM_MULTIEXPR',
          value: 3
        }
      ],
      comment:
        "/*\n * Param\n *\n *\t\tparamkind specifies the kind of parameter. The possible values\n *\t\tfor this field are:\n *\n *\t\tPARAM_EXTERN:  The parameter value is supplied from outside the plan.\n *\t\t\t\tSuch parameters are numbered from 1 to n.\n *\n *\t\tPARAM_EXEC:  The parameter is an internal executor parameter, used\n *\t\t\t\tfor passing values into and out of sub-queries or from\n *\t\t\t\tnestloop joins to their inner scans.\n *\t\t\t\tFor historical reasons, such parameters are numbered from 0.\n *\t\t\t\tThese numbers are independent of PARAM_EXTERN numbers.\n *\n *\t\tPARAM_SUBLINK:\tThe parameter represents an output column of a SubLink\n *\t\t\t\tnode's sub-select.  The column number is contained in the\n *\t\t\t\t`paramid' field.  (This type of Param is converted to\n *\t\t\t\tPARAM_EXEC during planning.)\n *\n *\t\tPARAM_MULTIEXPR:  Like PARAM_SUBLINK, the parameter represents an\n *\t\t\t\toutput column of a SubLink node's sub-select, but here, the\n *\t\t\t\tSubLink is always a MULTIEXPR SubLink.  The high-order 16 bits\n *\t\t\t\tof the `paramid' field contain the SubLink's subLinkId, and\n *\t\t\t\tthe low-order 16 bits contain the column number.  (This type\n *\t\t\t\tof Param is also converted to PARAM_EXEC during planning.)\n */\n"
    },
    CoercionContext: {
      values: [
        {
          comment: ''
        },
        {
          name: 'COERCION_IMPLICIT',
          value: 0,
          comment: '/* coercion in context of expression */'
        },
        {
          name: 'COERCION_ASSIGNMENT',
          value: 1,
          comment: '/* coercion in context of assignment */'
        },
        {
          name: 'COERCION_EXPLICIT',
          value: 2,
          comment: '/* explicit cast operation */'
        }
      ],
      comment:
        '/*\n * CoercionContext - distinguishes the allowed set of type casts\n *\n * NB: ordering of the alternatives is significant; later (larger) values\n * allow more casts than earlier ones.\n */\n'
    },
    CoercionForm: {
      values: [
        {
          comment: ''
        },
        {
          name: 'COERCE_EXPLICIT_CALL',
          value: 0,
          comment: '/* display as a function call */'
        },
        {
          name: 'COERCE_EXPLICIT_CAST',
          value: 1,
          comment: '/* display as an explicit cast */'
        },
        {
          name: 'COERCE_IMPLICIT_CAST',
          value: 2,
          comment: '/* implicit cast, so hide it */'
        }
      ],
      comment:
        "/*\n * CoercionForm - how to display a node that could have come from a cast\n *\n * NB: equal() ignores CoercionForm fields, therefore this *must* not carry\n * any semantically significant information.  We need that behavior so that\n * the planner will consider equivalent implicit and explicit casts to be\n * equivalent.  In cases where those actually behave differently, the coercion\n * function's arguments will be different.\n */\n"
    },
    BoolExprType: {
      values: [
        {
          comment: ''
        },
        {
          name: 'AND_EXPR',
          value: 0
        },
        {
          name: 'OR_EXPR'
        },
        {
          name: 'NOT_EXPR'
        }
      ],
      comment:
        '/*\n * BoolExpr - expression node for the basic Boolean operators AND, OR, NOT\n *\n * Notice the arguments are given as a List.  For NOT, of course the list\n * must always have exactly one element.  For AND and OR, there can be two\n * or more arguments.\n */\n'
    },
    SubLinkType: {
      values: [
        {
          comment: ''
        },
        {
          name: 'EXISTS_SUBLINK',
          value: 0
        },
        {
          name: 'ALL_SUBLINK',
          value: 1
        },
        {
          name: 'ANY_SUBLINK',
          value: 2
        },
        {
          name: 'ROWCOMPARE_SUBLINK',
          value: 3
        },
        {
          name: 'EXPR_SUBLINK',
          value: 4
        },
        {
          name: 'MULTIEXPR_SUBLINK',
          value: 5
        },
        {
          name: 'ARRAY_SUBLINK',
          value: 6
        },
        {
          name: 'CTE_SUBLINK',
          value: 7,
          comment: '/* for SubPlans only */'
        }
      ],
      comment:
        "/*\n * SubLink\n *\n * A SubLink represents a subselect appearing in an expression, and in some\n * cases also the combining operator(s) just above it.  The subLinkType\n * indicates the form of the expression represented:\n *\tEXISTS_SUBLINK\t\tEXISTS(SELECT ...)\n *\tALL_SUBLINK\t\t\t(lefthand) op ALL (SELECT ...)\n *\tANY_SUBLINK\t\t\t(lefthand) op ANY (SELECT ...)\n *\tROWCOMPARE_SUBLINK\t(lefthand) op (SELECT ...)\n *\tEXPR_SUBLINK\t\t(SELECT with single targetlist item ...)\n *\tMULTIEXPR_SUBLINK\t(SELECT with multiple targetlist items ...)\n *\tARRAY_SUBLINK\t\tARRAY(SELECT with single targetlist item ...)\n *\tCTE_SUBLINK\t\t\tWITH query (never actually part of an expression)\n * For ALL, ANY, and ROWCOMPARE, the lefthand is a list of expressions of the\n * same length as the subselect's targetlist.  ROWCOMPARE will *always* have\n * a list with more than one entry; if the subselect has just one target\n * then the parser will create an EXPR_SUBLINK instead (and any operator\n * above the subselect will be represented separately).\n * ROWCOMPARE, EXPR, and MULTIEXPR require the subselect to deliver at most\n * one row (if it returns no rows, the result is NULL).\n * ALL, ANY, and ROWCOMPARE require the combining operators to deliver boolean\n * results.  ALL and ANY combine the per-row results using AND and OR\n * semantics respectively.\n * ARRAY requires just one target column, and creates an array of the target\n * column's type using any number of rows resulting from the subselect.\n *\n * SubLink is classed as an Expr node, but it is not actually executable;\n * it must be replaced in the expression tree by a SubPlan node during\n * planning.\n *\n * NOTE: in the raw output of gram.y, testexpr contains just the raw form\n * of the lefthand expression (if any), and operName is the String name of\n * the combining operator.  Also, subselect is a raw parsetree.  During parse\n * analysis, the parser transforms testexpr into a complete boolean expression\n * that compares the lefthand value(s) to PARAM_SUBLINK nodes representing the\n * output columns of the subselect.  And subselect is transformed to a Query.\n * This is the representation seen in saved rules and in the rewriter.\n *\n * In EXISTS, EXPR, MULTIEXPR, and ARRAY SubLinks, testexpr and operName\n * are unused and are always null.\n *\n * subLinkId is currently used only for MULTIEXPR SubLinks, and is zero in\n * other SubLinks.  This number identifies different multiple-assignment\n * subqueries within an UPDATE statement's SET list.  It is unique only\n * within a particular targetlist.  The output column(s) of the MULTIEXPR\n * are referenced by PARAM_MULTIEXPR Params appearing elsewhere in the tlist.\n *\n * The CTE_SUBLINK case never occurs in actual SubLink nodes, but it is used\n * in SubPlans generated for WITH subqueries.\n */\n"
    },
    RowCompareType: {
      values: [
        {
          comment: ''
        },
        {
          comment:
            '\t/* Values of this enum are chosen to match btree strategy numbers */\n'
        },
        {
          name: 'ROWCOMPARE_LT',
          value: 1,
          comment: '/* BTLessStrategyNumber */'
        },
        {
          name: 'ROWCOMPARE_LE',
          value: 2,
          comment: '/* BTLessEqualStrategyNumber */'
        },
        {
          name: 'ROWCOMPARE_EQ',
          value: 3,
          comment: '/* BTEqualStrategyNumber */'
        },
        {
          name: 'ROWCOMPARE_GE',
          value: 4,
          comment: '/* BTGreaterEqualStrategyNumber */'
        },
        {
          name: 'ROWCOMPARE_GT',
          value: 5,
          comment: '/* BTGreaterStrategyNumber */'
        },
        {
          name: 'ROWCOMPARE_NE',
          value: 6,
          comment: '/* no such btree strategy */'
        }
      ],
      comment:
        '/*\n * RowCompareExpr - row-wise comparison, such as (a, b) <= (1, 2)\n *\n * We support row comparison for any operator that can be determined to\n * act like =, <>, <, <=, >, or >= (we determine this by looking for the\n * operator in btree opfamilies).  Note that the same operator name might\n * map to a different operator for each pair of row elements, since the\n * element datatypes can vary.\n *\n * A RowCompareExpr node is only generated for the < <= > >= cases;\n * the = and <> cases are translated to simple AND or OR combinations\n * of the pairwise comparisons.  However, we include = and <> in the\n * RowCompareType enum for the convenience of parser logic.\n */\n'
    },
    MinMaxOp: {
      values: [
        {
          comment: ''
        },
        {
          name: 'IS_GREATEST',
          value: 0
        },
        {
          name: 'IS_LEAST',
          value: 1
        }
      ],
      comment: '/*\n * MinMaxExpr - a GREATEST or LEAST function\n */\n'
    },
    SQLValueFunctionOp: {
      values: [
        {
          comment: ''
        },
        {
          name: 'SVFOP_CURRENT_DATE',
          value: 0
        },
        {
          name: 'SVFOP_CURRENT_TIME',
          value: 1
        },
        {
          name: 'SVFOP_CURRENT_TIME_N',
          value: 2
        },
        {
          name: 'SVFOP_CURRENT_TIMESTAMP',
          value: 3
        },
        {
          name: 'SVFOP_CURRENT_TIMESTAMP_N',
          value: 4
        },
        {
          name: 'SVFOP_LOCALTIME',
          value: 5
        },
        {
          name: 'SVFOP_LOCALTIME_N',
          value: 6
        },
        {
          name: 'SVFOP_LOCALTIMESTAMP',
          value: 7
        },
        {
          name: 'SVFOP_LOCALTIMESTAMP_N',
          value: 8
        },
        {
          name: 'SVFOP_CURRENT_ROLE',
          value: 9
        },
        {
          name: 'SVFOP_CURRENT_USER',
          value: 10
        },
        {
          name: 'SVFOP_USER',
          value: 11
        },
        {
          name: 'SVFOP_SESSION_USER',
          value: 12
        },
        {
          name: 'SVFOP_CURRENT_CATALOG',
          value: 13
        },
        {
          name: 'SVFOP_CURRENT_SCHEMA',
          value: 14
        }
      ],
      comment:
        "/*\n * SQLValueFunction - parameterless functions with special grammar productions\n *\n * The SQL standard categorizes some of these as <datetime value function>\n * and others as <general value specification>.  We call 'em SQLValueFunctions\n * for lack of a better term.  We store type and typmod of the result so that\n * some code doesn't need to know each function individually, and because\n * we would need to store typmod anyway for some of the datetime functions.\n * Note that currently, all variants return non-collating datatypes, so we do\n * not need a collation field; also, all these functions are stable.\n */\n"
    },
    XmlExprOp: {
      values: [
        {
          comment: ''
        },
        {
          name: 'IS_XMLCONCAT',
          value: 0,
          comment: '/* XMLCONCAT(args) */'
        },
        {
          name: 'IS_XMLELEMENT',
          value: 1,
          comment: '/* XMLELEMENT(name, xml_attributes, args) */'
        },
        {
          name: 'IS_XMLFOREST',
          value: 2,
          comment: '/* XMLFOREST(xml_attributes) */'
        },
        {
          name: 'IS_XMLPARSE',
          value: 3,
          comment: '/* XMLPARSE(text, is_doc, preserve_ws) */'
        },
        {
          name: 'IS_XMLPI',
          value: 4,
          comment: '/* XMLPI(name [, args]) */'
        },
        {
          name: 'IS_XMLROOT',
          value: 5,
          comment: '/* XMLROOT(xml, version, standalone) */'
        },
        {
          name: 'IS_XMLSERIALIZE',
          value: 6,
          comment: '/* XMLSERIALIZE(is_document, xmlval) */'
        },
        {
          name: 'IS_DOCUMENT',
          value: 7,
          comment: '/* xmlval IS DOCUMENT */'
        }
      ],
      comment:
        "/*\n * XmlExpr - various SQL/XML functions requiring special grammar productions\n *\n * 'name' carries the \"NAME foo\" argument (already XML-escaped).\n * 'named_args' and 'arg_names' represent an xml_attribute list.\n * 'args' carries all other arguments.\n *\n * Note: result type/typmod/collation are not stored, but can be deduced\n * from the XmlExprOp.  The type/typmod fields are just used for display\n * purposes, and are NOT necessarily the true result type of the node.\n */\n"
    },
    XmlOptionType: {
      values: [
        {
          comment: ''
        },
        {
          name: 'XMLOPTION_DOCUMENT',
          value: 0
        },
        {
          name: 'XMLOPTION_CONTENT',
          value: 1
        }
      ],
      comment: null
    },
    NullTestType: {
      values: [
        {
          comment: ''
        },
        {
          name: 'IS_NULL',
          value: 0
        },
        {
          name: 'IS_NOT_NULL'
        }
      ],
      comment:
        '/* ----------------\n * NullTest\n *\n * NullTest represents the operation of testing a value for NULLness.\n * The appropriate test is performed and returned as a boolean Datum.\n *\n * When argisrow is false, this simply represents a test for the null value.\n *\n * When argisrow is true, the input expression must yield a rowtype, and\n * the node implements "row IS [NOT] NULL" per the SQL standard.  This\n * includes checking individual fields for NULLness when the row datum\n * itself isn\'t NULL.\n *\n * NOTE: the combination of a rowtype input and argisrow==false does NOT\n * correspond to the SQL notation "row IS [NOT] NULL"; instead, this case\n * represents the SQL notation "row IS [NOT] DISTINCT FROM NULL".\n * ----------------\n */\n'
    },
    BoolTestType: {
      values: [
        {
          comment: ''
        },
        {
          name: 'IS_TRUE',
          value: 0
        },
        {
          name: 'IS_NOT_TRUE'
        },
        {
          name: 'IS_FALSE'
        },
        {
          name: 'IS_NOT_FALSE'
        },
        {
          name: 'IS_UNKNOWN'
        },
        {
          name: 'IS_NOT_UNKNOWN'
        }
      ],
      comment:
        '/*\n * BooleanTest\n *\n * BooleanTest represents the operation of determining whether a boolean\n * is TRUE, FALSE, or UNKNOWN (ie, NULL).  All six meaningful combinations\n * are supported.  Note that a NULL input does *not* cause a NULL result.\n * The appropriate test is performed and returned as a boolean Datum.\n */\n'
    }
  },
  'nodes/lockoptions': {
    LockClauseStrength: {
      values: [
        {
          comment: ''
        },
        {
          name: 'LCS_NONE',
          value: 0,
          comment: '/* no such clause - only used in PlanRowMark */'
        },
        {
          name: 'LCS_FORKEYSHARE',
          value: 1,
          comment: '/* FOR KEY SHARE */'
        },
        {
          name: 'LCS_FORSHARE',
          value: 2,
          comment: '/* FOR SHARE */'
        },
        {
          name: 'LCS_FORNOKEYUPDATE',
          value: 3,
          comment: '/* FOR NO KEY UPDATE */'
        },
        {
          name: 'LCS_FORUPDATE',
          value: 4,
          comment: '/* FOR UPDATE */'
        }
      ],
      comment:
        '/*\n * This enum represents the different strengths of FOR UPDATE/SHARE clauses.\n * The ordering here is important, because the highest numerical value takes\n * precedence when a RTE is specified multiple ways.  See applyLockingClause.\n */\n'
    },
    LockWaitPolicy: {
      values: [
        {
          comment: ''
        },
        {
          comment:
            '\t/* Wait for the lock to become available (default behavior) */\n'
        },
        {
          name: 'LockWaitBlock',
          value: 0
        },
        {
          comment: "\t/* Skip rows that can't be locked (SKIP LOCKED) */\n"
        },
        {
          name: 'LockWaitSkip',
          value: 1
        },
        {
          comment: '\t/* Raise an error if a row cannot be locked (NOWAIT) */\n'
        },
        {
          name: 'LockWaitError',
          value: 2
        }
      ],
      comment:
        '/*\n * This enum controls how to deal with rows being locked by FOR UPDATE/SHARE\n * clauses (i.e., it represents the NOWAIT and SKIP LOCKED options).\n * The ordering here is important, because the highest numerical value takes\n * precedence when a RTE is specified multiple ways.  See applyLockingClause.\n */\n'
    },
    LockTupleMode: {
      values: [
        {
          comment: ''
        },
        {
          comment: '\t/* SELECT FOR KEY SHARE */\n'
        },
        {
          name: 'LockTupleKeyShare',
          value: 0
        },
        {
          comment: '\t/* SELECT FOR SHARE */\n'
        },
        {
          name: 'LockTupleShare',
          value: 1
        },
        {
          comment:
            "\t/* SELECT FOR NO KEY UPDATE, and UPDATEs that don't modify key columns */\n"
        },
        {
          name: 'LockTupleNoKeyExclusive',
          value: 2
        },
        {
          comment:
            '\t/* SELECT FOR UPDATE, UPDATEs that modify key columns, and DELETE */\n'
        },
        {
          name: 'LockTupleExclusive',
          value: 3
        }
      ],
      comment: '/*\n * Possible lock modes for a tuple.\n */\n'
    }
  },
  'nodes/nodes': {
    NodeTag: {
      values: [
        {
          comment: ''
        },
        {
          name: 'T_Invalid',
          value: 0
        },
        {
          comment: ''
        },
        {
          comment: '\t/*\n\t * TAGS FOR EXECUTOR NODES (execnodes.h)\n\t */\n'
        },
        {
          name: 'T_IndexInfo',
          value: 1
        },
        {
          name: 'T_ExprContext',
          value: 2
        },
        {
          name: 'T_ProjectionInfo',
          value: 3
        },
        {
          name: 'T_JunkFilter',
          value: 4
        },
        {
          name: 'T_OnConflictSetState',
          value: 5
        },
        {
          name: 'T_ResultRelInfo',
          value: 6
        },
        {
          name: 'T_EState',
          value: 7
        },
        {
          name: 'T_TupleTableSlot',
          value: 8
        },
        {
          comment: ''
        },
        {
          comment: '\t/*\n\t * TAGS FOR PLAN NODES (plannodes.h)\n\t */\n'
        },
        {
          name: 'T_Plan',
          value: 9
        },
        {
          name: 'T_Result',
          value: 10
        },
        {
          name: 'T_ProjectSet',
          value: 11
        },
        {
          name: 'T_ModifyTable',
          value: 12
        },
        {
          name: 'T_Append',
          value: 13
        },
        {
          name: 'T_MergeAppend',
          value: 14
        },
        {
          name: 'T_RecursiveUnion',
          value: 15
        },
        {
          name: 'T_BitmapAnd',
          value: 16
        },
        {
          name: 'T_BitmapOr',
          value: 17
        },
        {
          name: 'T_Scan',
          value: 18
        },
        {
          name: 'T_SeqScan',
          value: 19
        },
        {
          name: 'T_SampleScan',
          value: 20
        },
        {
          name: 'T_IndexScan',
          value: 21
        },
        {
          name: 'T_IndexOnlyScan',
          value: 22
        },
        {
          name: 'T_BitmapIndexScan',
          value: 23
        },
        {
          name: 'T_BitmapHeapScan',
          value: 24
        },
        {
          name: 'T_TidScan',
          value: 25
        },
        {
          name: 'T_SubqueryScan',
          value: 26
        },
        {
          name: 'T_FunctionScan',
          value: 27
        },
        {
          name: 'T_ValuesScan',
          value: 28
        },
        {
          name: 'T_TableFuncScan',
          value: 29
        },
        {
          name: 'T_CteScan',
          value: 30
        },
        {
          name: 'T_NamedTuplestoreScan',
          value: 31
        },
        {
          name: 'T_WorkTableScan',
          value: 32
        },
        {
          name: 'T_ForeignScan',
          value: 33
        },
        {
          name: 'T_CustomScan',
          value: 34
        },
        {
          name: 'T_Join',
          value: 35
        },
        {
          name: 'T_NestLoop',
          value: 36
        },
        {
          name: 'T_MergeJoin',
          value: 37
        },
        {
          name: 'T_HashJoin',
          value: 38
        },
        {
          name: 'T_Material',
          value: 39
        },
        {
          name: 'T_Sort',
          value: 40
        },
        {
          name: 'T_IncrementalSort',
          value: 41
        },
        {
          name: 'T_Group',
          value: 42
        },
        {
          name: 'T_Agg',
          value: 43
        },
        {
          name: 'T_WindowAgg',
          value: 44
        },
        {
          name: 'T_Unique',
          value: 45
        },
        {
          name: 'T_Gather',
          value: 46
        },
        {
          name: 'T_GatherMerge',
          value: 47
        },
        {
          name: 'T_Hash',
          value: 48
        },
        {
          name: 'T_SetOp',
          value: 49
        },
        {
          name: 'T_LockRows',
          value: 50
        },
        {
          name: 'T_Limit',
          value: 51
        },
        {
          comment: "\t/* these aren't subclasses of Plan: */\n"
        },
        {
          name: 'T_NestLoopParam',
          value: 52
        },
        {
          name: 'T_PlanRowMark',
          value: 53
        },
        {
          name: 'T_PartitionPruneInfo',
          value: 54
        },
        {
          name: 'T_PartitionedRelPruneInfo',
          value: 55
        },
        {
          name: 'T_PartitionPruneStepOp',
          value: 56
        },
        {
          name: 'T_PartitionPruneStepCombine',
          value: 57
        },
        {
          name: 'T_PlanInvalItem',
          value: 58
        },
        {
          comment: ''
        },
        {
          comment:
            '\t/*\n\t * TAGS FOR PLAN STATE NODES (execnodes.h)\n\t *\n\t * These should correspond one-to-one with Plan node types.\n\t */\n'
        },
        {
          name: 'T_PlanState',
          value: 59
        },
        {
          name: 'T_ResultState',
          value: 60
        },
        {
          name: 'T_ProjectSetState',
          value: 61
        },
        {
          name: 'T_ModifyTableState',
          value: 62
        },
        {
          name: 'T_AppendState',
          value: 63
        },
        {
          name: 'T_MergeAppendState',
          value: 64
        },
        {
          name: 'T_RecursiveUnionState',
          value: 65
        },
        {
          name: 'T_BitmapAndState',
          value: 66
        },
        {
          name: 'T_BitmapOrState',
          value: 67
        },
        {
          name: 'T_ScanState',
          value: 68
        },
        {
          name: 'T_SeqScanState',
          value: 69
        },
        {
          name: 'T_SampleScanState',
          value: 70
        },
        {
          name: 'T_IndexScanState',
          value: 71
        },
        {
          name: 'T_IndexOnlyScanState',
          value: 72
        },
        {
          name: 'T_BitmapIndexScanState',
          value: 73
        },
        {
          name: 'T_BitmapHeapScanState',
          value: 74
        },
        {
          name: 'T_TidScanState',
          value: 75
        },
        {
          name: 'T_SubqueryScanState',
          value: 76
        },
        {
          name: 'T_FunctionScanState',
          value: 77
        },
        {
          name: 'T_TableFuncScanState',
          value: 78
        },
        {
          name: 'T_ValuesScanState',
          value: 79
        },
        {
          name: 'T_CteScanState',
          value: 80
        },
        {
          name: 'T_NamedTuplestoreScanState',
          value: 81
        },
        {
          name: 'T_WorkTableScanState',
          value: 82
        },
        {
          name: 'T_ForeignScanState',
          value: 83
        },
        {
          name: 'T_CustomScanState',
          value: 84
        },
        {
          name: 'T_JoinState',
          value: 85
        },
        {
          name: 'T_NestLoopState',
          value: 86
        },
        {
          name: 'T_MergeJoinState',
          value: 87
        },
        {
          name: 'T_HashJoinState',
          value: 88
        },
        {
          name: 'T_MaterialState',
          value: 89
        },
        {
          name: 'T_SortState',
          value: 90
        },
        {
          name: 'T_IncrementalSortState',
          value: 91
        },
        {
          name: 'T_GroupState',
          value: 92
        },
        {
          name: 'T_AggState',
          value: 93
        },
        {
          name: 'T_WindowAggState',
          value: 94
        },
        {
          name: 'T_UniqueState',
          value: 95
        },
        {
          name: 'T_GatherState',
          value: 96
        },
        {
          name: 'T_GatherMergeState',
          value: 97
        },
        {
          name: 'T_HashState',
          value: 98
        },
        {
          name: 'T_SetOpState',
          value: 99
        },
        {
          name: 'T_LockRowsState',
          value: 100
        },
        {
          name: 'T_LimitState',
          value: 101
        },
        {
          comment: ''
        },
        {
          comment: '\t/*\n\t * TAGS FOR PRIMITIVE NODES (primnodes.h)\n\t */\n'
        },
        {
          name: 'T_Alias',
          value: 102
        },
        {
          name: 'T_RangeVar',
          value: 103
        },
        {
          name: 'T_TableFunc',
          value: 104
        },
        {
          name: 'T_Expr',
          value: 105
        },
        {
          name: 'T_Var',
          value: 106
        },
        {
          name: 'T_Const',
          value: 107
        },
        {
          name: 'T_Param',
          value: 108
        },
        {
          name: 'T_Aggref',
          value: 109
        },
        {
          name: 'T_GroupingFunc',
          value: 110
        },
        {
          name: 'T_WindowFunc',
          value: 111
        },
        {
          name: 'T_SubscriptingRef',
          value: 112
        },
        {
          name: 'T_FuncExpr',
          value: 113
        },
        {
          name: 'T_NamedArgExpr',
          value: 114
        },
        {
          name: 'T_OpExpr',
          value: 115
        },
        {
          name: 'T_DistinctExpr',
          value: 116
        },
        {
          name: 'T_NullIfExpr',
          value: 117
        },
        {
          name: 'T_ScalarArrayOpExpr',
          value: 118
        },
        {
          name: 'T_BoolExpr',
          value: 119
        },
        {
          name: 'T_SubLink',
          value: 120
        },
        {
          name: 'T_SubPlan',
          value: 121
        },
        {
          name: 'T_AlternativeSubPlan',
          value: 122
        },
        {
          name: 'T_FieldSelect',
          value: 123
        },
        {
          name: 'T_FieldStore',
          value: 124
        },
        {
          name: 'T_RelabelType',
          value: 125
        },
        {
          name: 'T_CoerceViaIO',
          value: 126
        },
        {
          name: 'T_ArrayCoerceExpr',
          value: 127
        },
        {
          name: 'T_ConvertRowtypeExpr',
          value: 128
        },
        {
          name: 'T_CollateExpr',
          value: 129
        },
        {
          name: 'T_CaseExpr',
          value: 130
        },
        {
          name: 'T_CaseWhen',
          value: 131
        },
        {
          name: 'T_CaseTestExpr',
          value: 132
        },
        {
          name: 'T_ArrayExpr',
          value: 133
        },
        {
          name: 'T_RowExpr',
          value: 134
        },
        {
          name: 'T_RowCompareExpr',
          value: 135
        },
        {
          name: 'T_CoalesceExpr',
          value: 136
        },
        {
          name: 'T_MinMaxExpr',
          value: 137
        },
        {
          name: 'T_SQLValueFunction',
          value: 138
        },
        {
          name: 'T_XmlExpr',
          value: 139
        },
        {
          name: 'T_NullTest',
          value: 140
        },
        {
          name: 'T_BooleanTest',
          value: 141
        },
        {
          name: 'T_CoerceToDomain',
          value: 142
        },
        {
          name: 'T_CoerceToDomainValue',
          value: 143
        },
        {
          name: 'T_SetToDefault',
          value: 144
        },
        {
          name: 'T_CurrentOfExpr',
          value: 145
        },
        {
          name: 'T_NextValueExpr',
          value: 146
        },
        {
          name: 'T_InferenceElem',
          value: 147
        },
        {
          name: 'T_TargetEntry',
          value: 148
        },
        {
          name: 'T_RangeTblRef',
          value: 149
        },
        {
          name: 'T_JoinExpr',
          value: 150
        },
        {
          name: 'T_FromExpr',
          value: 151
        },
        {
          name: 'T_OnConflictExpr',
          value: 152
        },
        {
          name: 'T_IntoClause',
          value: 153
        },
        {
          comment: ''
        },
        {
          comment:
            "\t/*\n\t * TAGS FOR EXPRESSION STATE NODES (execnodes.h)\n\t *\n\t * ExprState represents the evaluation state for a whole expression tree.\n\t * Most Expr-based plan nodes do not have a corresponding expression state\n\t * node, they're fully handled within execExpr* - but sometimes the state\n\t * needs to be shared with other parts of the executor, as for example\n\t * with AggrefExprState, which nodeAgg.c has to modify.\n\t */\n"
        },
        {
          name: 'T_ExprState',
          value: 154
        },
        {
          name: 'T_AggrefExprState',
          value: 155
        },
        {
          name: 'T_WindowFuncExprState',
          value: 156
        },
        {
          name: 'T_SetExprState',
          value: 157
        },
        {
          name: 'T_SubPlanState',
          value: 158
        },
        {
          name: 'T_AlternativeSubPlanState',
          value: 159
        },
        {
          name: 'T_DomainConstraintState',
          value: 160
        },
        {
          comment: ''
        },
        {
          comment: '\t/*\n\t * TAGS FOR PLANNER NODES (pathnodes.h)\n\t */\n'
        },
        {
          name: 'T_PlannerInfo',
          value: 161
        },
        {
          name: 'T_PlannerGlobal',
          value: 162
        },
        {
          name: 'T_RelOptInfo',
          value: 163
        },
        {
          name: 'T_IndexOptInfo',
          value: 164
        },
        {
          name: 'T_ForeignKeyOptInfo',
          value: 165
        },
        {
          name: 'T_ParamPathInfo',
          value: 166
        },
        {
          name: 'T_Path',
          value: 167
        },
        {
          name: 'T_IndexPath',
          value: 168
        },
        {
          name: 'T_BitmapHeapPath',
          value: 169
        },
        {
          name: 'T_BitmapAndPath',
          value: 170
        },
        {
          name: 'T_BitmapOrPath',
          value: 171
        },
        {
          name: 'T_TidPath',
          value: 172
        },
        {
          name: 'T_SubqueryScanPath',
          value: 173
        },
        {
          name: 'T_ForeignPath',
          value: 174
        },
        {
          name: 'T_CustomPath',
          value: 175
        },
        {
          name: 'T_NestPath',
          value: 176
        },
        {
          name: 'T_MergePath',
          value: 177
        },
        {
          name: 'T_HashPath',
          value: 178
        },
        {
          name: 'T_AppendPath',
          value: 179
        },
        {
          name: 'T_MergeAppendPath',
          value: 180
        },
        {
          name: 'T_GroupResultPath',
          value: 181
        },
        {
          name: 'T_MaterialPath',
          value: 182
        },
        {
          name: 'T_UniquePath',
          value: 183
        },
        {
          name: 'T_GatherPath',
          value: 184
        },
        {
          name: 'T_GatherMergePath',
          value: 185
        },
        {
          name: 'T_ProjectionPath',
          value: 186
        },
        {
          name: 'T_ProjectSetPath',
          value: 187
        },
        {
          name: 'T_SortPath',
          value: 188
        },
        {
          name: 'T_IncrementalSortPath',
          value: 189
        },
        {
          name: 'T_GroupPath',
          value: 190
        },
        {
          name: 'T_UpperUniquePath',
          value: 191
        },
        {
          name: 'T_AggPath',
          value: 192
        },
        {
          name: 'T_GroupingSetsPath',
          value: 193
        },
        {
          name: 'T_MinMaxAggPath',
          value: 194
        },
        {
          name: 'T_WindowAggPath',
          value: 195
        },
        {
          name: 'T_SetOpPath',
          value: 196
        },
        {
          name: 'T_RecursiveUnionPath',
          value: 197
        },
        {
          name: 'T_LockRowsPath',
          value: 198
        },
        {
          name: 'T_ModifyTablePath',
          value: 199
        },
        {
          name: 'T_LimitPath',
          value: 200
        },
        {
          comment: "\t/* these aren't subclasses of Path: */\n"
        },
        {
          name: 'T_EquivalenceClass',
          value: 201
        },
        {
          name: 'T_EquivalenceMember',
          value: 202
        },
        {
          name: 'T_PathKey',
          value: 203
        },
        {
          name: 'T_PathTarget',
          value: 204
        },
        {
          name: 'T_RestrictInfo',
          value: 205
        },
        {
          name: 'T_IndexClause',
          value: 206
        },
        {
          name: 'T_PlaceHolderVar',
          value: 207
        },
        {
          name: 'T_SpecialJoinInfo',
          value: 208
        },
        {
          name: 'T_AppendRelInfo',
          value: 209
        },
        {
          name: 'T_PlaceHolderInfo',
          value: 210
        },
        {
          name: 'T_MinMaxAggInfo',
          value: 211
        },
        {
          name: 'T_PlannerParamItem',
          value: 212
        },
        {
          name: 'T_RollupData',
          value: 213
        },
        {
          name: 'T_GroupingSetData',
          value: 214
        },
        {
          name: 'T_StatisticExtInfo',
          value: 215
        },
        {
          comment: ''
        },
        {
          comment: '\t/*\n\t * TAGS FOR MEMORY NODES (memnodes.h)\n\t */\n'
        },
        {
          name: 'T_MemoryContext',
          value: 216
        },
        {
          name: 'T_AllocSetContext',
          value: 217
        },
        {
          name: 'T_SlabContext',
          value: 218
        },
        {
          name: 'T_GenerationContext',
          value: 219
        },
        {
          comment: ''
        },
        {
          comment: '\t/*\n\t * TAGS FOR VALUE NODES (value.h)\n\t */\n'
        },
        {
          name: 'T_Value',
          value: 220
        },
        {
          name: 'T_Integer',
          value: 221
        },
        {
          name: 'T_Float',
          value: 222
        },
        {
          name: 'T_String',
          value: 223
        },
        {
          name: 'T_BitString',
          value: 224
        },
        {
          name: 'T_Null',
          value: 225
        },
        {
          comment: ''
        },
        {
          comment: '\t/*\n\t * TAGS FOR LIST NODES (pg_list.h)\n\t */\n'
        },
        {
          name: 'T_List',
          value: 226
        },
        {
          name: 'T_IntList',
          value: 227
        },
        {
          name: 'T_OidList',
          value: 228
        },
        {
          comment: ''
        },
        {
          comment:
            '\t/*\n\t * TAGS FOR EXTENSIBLE NODES (extensible.h)\n\t */\n'
        },
        {
          name: 'T_ExtensibleNode',
          value: 229
        },
        {
          comment: ''
        },
        {
          comment:
            '\t/*\n\t * TAGS FOR STATEMENT NODES (mostly in parsenodes.h)\n\t */\n'
        },
        {
          name: 'T_RawStmt',
          value: 230
        },
        {
          name: 'T_Query',
          value: 231
        },
        {
          name: 'T_PlannedStmt',
          value: 232
        },
        {
          name: 'T_InsertStmt',
          value: 233
        },
        {
          name: 'T_DeleteStmt',
          value: 234
        },
        {
          name: 'T_UpdateStmt',
          value: 235
        },
        {
          name: 'T_SelectStmt',
          value: 236
        },
        {
          name: 'T_AlterTableStmt',
          value: 237
        },
        {
          name: 'T_AlterTableCmd',
          value: 238
        },
        {
          name: 'T_AlterDomainStmt',
          value: 239
        },
        {
          name: 'T_SetOperationStmt',
          value: 240
        },
        {
          name: 'T_GrantStmt',
          value: 241
        },
        {
          name: 'T_GrantRoleStmt',
          value: 242
        },
        {
          name: 'T_AlterDefaultPrivilegesStmt',
          value: 243
        },
        {
          name: 'T_ClosePortalStmt',
          value: 244
        },
        {
          name: 'T_ClusterStmt',
          value: 245
        },
        {
          name: 'T_CopyStmt',
          value: 246
        },
        {
          name: 'T_CreateStmt',
          value: 247
        },
        {
          name: 'T_DefineStmt',
          value: 248
        },
        {
          name: 'T_DropStmt',
          value: 249
        },
        {
          name: 'T_TruncateStmt',
          value: 250
        },
        {
          name: 'T_CommentStmt',
          value: 251
        },
        {
          name: 'T_FetchStmt',
          value: 252
        },
        {
          name: 'T_IndexStmt',
          value: 253
        },
        {
          name: 'T_CreateFunctionStmt',
          value: 254
        },
        {
          name: 'T_AlterFunctionStmt',
          value: 255
        },
        {
          name: 'T_DoStmt',
          value: 256
        },
        {
          name: 'T_RenameStmt',
          value: 257
        },
        {
          name: 'T_RuleStmt',
          value: 258
        },
        {
          name: 'T_NotifyStmt',
          value: 259
        },
        {
          name: 'T_ListenStmt',
          value: 260
        },
        {
          name: 'T_UnlistenStmt',
          value: 261
        },
        {
          name: 'T_TransactionStmt',
          value: 262
        },
        {
          name: 'T_ViewStmt',
          value: 263
        },
        {
          name: 'T_LoadStmt',
          value: 264
        },
        {
          name: 'T_CreateDomainStmt',
          value: 265
        },
        {
          name: 'T_CreatedbStmt',
          value: 266
        },
        {
          name: 'T_DropdbStmt',
          value: 267
        },
        {
          name: 'T_VacuumStmt',
          value: 268
        },
        {
          name: 'T_ExplainStmt',
          value: 269
        },
        {
          name: 'T_CreateTableAsStmt',
          value: 270
        },
        {
          name: 'T_CreateSeqStmt',
          value: 271
        },
        {
          name: 'T_AlterSeqStmt',
          value: 272
        },
        {
          name: 'T_VariableSetStmt',
          value: 273
        },
        {
          name: 'T_VariableShowStmt',
          value: 274
        },
        {
          name: 'T_DiscardStmt',
          value: 275
        },
        {
          name: 'T_CreateTrigStmt',
          value: 276
        },
        {
          name: 'T_CreatePLangStmt',
          value: 277
        },
        {
          name: 'T_CreateRoleStmt',
          value: 278
        },
        {
          name: 'T_AlterRoleStmt',
          value: 279
        },
        {
          name: 'T_DropRoleStmt',
          value: 280
        },
        {
          name: 'T_LockStmt',
          value: 281
        },
        {
          name: 'T_ConstraintsSetStmt',
          value: 282
        },
        {
          name: 'T_ReindexStmt',
          value: 283
        },
        {
          name: 'T_CheckPointStmt',
          value: 284
        },
        {
          name: 'T_CreateSchemaStmt',
          value: 285
        },
        {
          name: 'T_AlterDatabaseStmt',
          value: 286
        },
        {
          name: 'T_AlterDatabaseSetStmt',
          value: 287
        },
        {
          name: 'T_AlterRoleSetStmt',
          value: 288
        },
        {
          name: 'T_CreateConversionStmt',
          value: 289
        },
        {
          name: 'T_CreateCastStmt',
          value: 290
        },
        {
          name: 'T_CreateOpClassStmt',
          value: 291
        },
        {
          name: 'T_CreateOpFamilyStmt',
          value: 292
        },
        {
          name: 'T_AlterOpFamilyStmt',
          value: 293
        },
        {
          name: 'T_PrepareStmt',
          value: 294
        },
        {
          name: 'T_ExecuteStmt',
          value: 295
        },
        {
          name: 'T_DeallocateStmt',
          value: 296
        },
        {
          name: 'T_DeclareCursorStmt',
          value: 297
        },
        {
          name: 'T_CreateTableSpaceStmt',
          value: 298
        },
        {
          name: 'T_DropTableSpaceStmt',
          value: 299
        },
        {
          name: 'T_AlterObjectDependsStmt',
          value: 300
        },
        {
          name: 'T_AlterObjectSchemaStmt',
          value: 301
        },
        {
          name: 'T_AlterOwnerStmt',
          value: 302
        },
        {
          name: 'T_AlterOperatorStmt',
          value: 303
        },
        {
          name: 'T_AlterTypeStmt',
          value: 304
        },
        {
          name: 'T_DropOwnedStmt',
          value: 305
        },
        {
          name: 'T_ReassignOwnedStmt',
          value: 306
        },
        {
          name: 'T_CompositeTypeStmt',
          value: 307
        },
        {
          name: 'T_CreateEnumStmt',
          value: 308
        },
        {
          name: 'T_CreateRangeStmt',
          value: 309
        },
        {
          name: 'T_AlterEnumStmt',
          value: 310
        },
        {
          name: 'T_AlterTSDictionaryStmt',
          value: 311
        },
        {
          name: 'T_AlterTSConfigurationStmt',
          value: 312
        },
        {
          name: 'T_CreateFdwStmt',
          value: 313
        },
        {
          name: 'T_AlterFdwStmt',
          value: 314
        },
        {
          name: 'T_CreateForeignServerStmt',
          value: 315
        },
        {
          name: 'T_AlterForeignServerStmt',
          value: 316
        },
        {
          name: 'T_CreateUserMappingStmt',
          value: 317
        },
        {
          name: 'T_AlterUserMappingStmt',
          value: 318
        },
        {
          name: 'T_DropUserMappingStmt',
          value: 319
        },
        {
          name: 'T_AlterTableSpaceOptionsStmt',
          value: 320
        },
        {
          name: 'T_AlterTableMoveAllStmt',
          value: 321
        },
        {
          name: 'T_SecLabelStmt',
          value: 322
        },
        {
          name: 'T_CreateForeignTableStmt',
          value: 323
        },
        {
          name: 'T_ImportForeignSchemaStmt',
          value: 324
        },
        {
          name: 'T_CreateExtensionStmt',
          value: 325
        },
        {
          name: 'T_AlterExtensionStmt',
          value: 326
        },
        {
          name: 'T_AlterExtensionContentsStmt',
          value: 327
        },
        {
          name: 'T_CreateEventTrigStmt',
          value: 328
        },
        {
          name: 'T_AlterEventTrigStmt',
          value: 329
        },
        {
          name: 'T_RefreshMatViewStmt',
          value: 330
        },
        {
          name: 'T_ReplicaIdentityStmt',
          value: 331
        },
        {
          name: 'T_AlterSystemStmt',
          value: 332
        },
        {
          name: 'T_CreatePolicyStmt',
          value: 333
        },
        {
          name: 'T_AlterPolicyStmt',
          value: 334
        },
        {
          name: 'T_CreateTransformStmt',
          value: 335
        },
        {
          name: 'T_CreateAmStmt',
          value: 336
        },
        {
          name: 'T_CreatePublicationStmt',
          value: 337
        },
        {
          name: 'T_AlterPublicationStmt',
          value: 338
        },
        {
          name: 'T_CreateSubscriptionStmt',
          value: 339
        },
        {
          name: 'T_AlterSubscriptionStmt',
          value: 340
        },
        {
          name: 'T_DropSubscriptionStmt',
          value: 341
        },
        {
          name: 'T_CreateStatsStmt',
          value: 342
        },
        {
          name: 'T_AlterCollationStmt',
          value: 343
        },
        {
          name: 'T_CallStmt',
          value: 344
        },
        {
          name: 'T_AlterStatsStmt',
          value: 345
        },
        {
          comment: ''
        },
        {
          comment:
            '\t/*\n\t * TAGS FOR PARSE TREE NODES (parsenodes.h)\n\t */\n'
        },
        {
          name: 'T_A_Expr',
          value: 346
        },
        {
          name: 'T_ColumnRef',
          value: 347
        },
        {
          name: 'T_ParamRef',
          value: 348
        },
        {
          name: 'T_A_Const',
          value: 349
        },
        {
          name: 'T_FuncCall',
          value: 350
        },
        {
          name: 'T_A_Star',
          value: 351
        },
        {
          name: 'T_A_Indices',
          value: 352
        },
        {
          name: 'T_A_Indirection',
          value: 353
        },
        {
          name: 'T_A_ArrayExpr',
          value: 354
        },
        {
          name: 'T_ResTarget',
          value: 355
        },
        {
          name: 'T_MultiAssignRef',
          value: 356
        },
        {
          name: 'T_TypeCast',
          value: 357
        },
        {
          name: 'T_CollateClause',
          value: 358
        },
        {
          name: 'T_SortBy',
          value: 359
        },
        {
          name: 'T_WindowDef',
          value: 360
        },
        {
          name: 'T_RangeSubselect',
          value: 361
        },
        {
          name: 'T_RangeFunction',
          value: 362
        },
        {
          name: 'T_RangeTableSample',
          value: 363
        },
        {
          name: 'T_RangeTableFunc',
          value: 364
        },
        {
          name: 'T_RangeTableFuncCol',
          value: 365
        },
        {
          name: 'T_TypeName',
          value: 366
        },
        {
          name: 'T_ColumnDef',
          value: 367
        },
        {
          name: 'T_IndexElem',
          value: 368
        },
        {
          name: 'T_Constraint',
          value: 369
        },
        {
          name: 'T_DefElem',
          value: 370
        },
        {
          name: 'T_RangeTblEntry',
          value: 371
        },
        {
          name: 'T_RangeTblFunction',
          value: 372
        },
        {
          name: 'T_TableSampleClause',
          value: 373
        },
        {
          name: 'T_WithCheckOption',
          value: 374
        },
        {
          name: 'T_SortGroupClause',
          value: 375
        },
        {
          name: 'T_GroupingSet',
          value: 376
        },
        {
          name: 'T_WindowClause',
          value: 377
        },
        {
          name: 'T_ObjectWithArgs',
          value: 378
        },
        {
          name: 'T_AccessPriv',
          value: 379
        },
        {
          name: 'T_CreateOpClassItem',
          value: 380
        },
        {
          name: 'T_TableLikeClause',
          value: 381
        },
        {
          name: 'T_FunctionParameter',
          value: 382
        },
        {
          name: 'T_LockingClause',
          value: 383
        },
        {
          name: 'T_RowMarkClause',
          value: 384
        },
        {
          name: 'T_XmlSerialize',
          value: 385
        },
        {
          name: 'T_WithClause',
          value: 386
        },
        {
          name: 'T_InferClause',
          value: 387
        },
        {
          name: 'T_OnConflictClause',
          value: 388
        },
        {
          name: 'T_CommonTableExpr',
          value: 389
        },
        {
          name: 'T_RoleSpec',
          value: 390
        },
        {
          name: 'T_TriggerTransition',
          value: 391
        },
        {
          name: 'T_PartitionElem',
          value: 392
        },
        {
          name: 'T_PartitionSpec',
          value: 393
        },
        {
          name: 'T_PartitionBoundSpec',
          value: 394
        },
        {
          name: 'T_PartitionRangeDatum',
          value: 395
        },
        {
          name: 'T_PartitionCmd',
          value: 396
        },
        {
          name: 'T_VacuumRelation',
          value: 397
        },
        {
          comment: ''
        },
        {
          comment:
            '\t/*\n\t * TAGS FOR REPLICATION GRAMMAR PARSE NODES (replnodes.h)\n\t */\n'
        },
        {
          name: 'T_IdentifySystemCmd',
          value: 398
        },
        {
          name: 'T_BaseBackupCmd',
          value: 399
        },
        {
          name: 'T_CreateReplicationSlotCmd',
          value: 400
        },
        {
          name: 'T_DropReplicationSlotCmd',
          value: 401
        },
        {
          name: 'T_StartReplicationCmd',
          value: 402
        },
        {
          name: 'T_TimeLineHistoryCmd',
          value: 403
        },
        {
          name: 'T_SQLCmd',
          value: 404
        },
        {
          comment: ''
        },
        {
          comment:
            "\t/*\n\t * TAGS FOR RANDOM OTHER STUFF\n\t *\n\t * These are objects that aren't part of parse/plan/execute node tree\n\t * structures, but we give them NodeTags anyway for identification\n\t * purposes (usually because they are involved in APIs where we want to\n\t * pass multiple object types through the same pointer).\n\t */\n"
        },
        {
          name: 'T_TriggerData',
          value: 405,
          comment: '/* in commands/trigger.h */'
        },
        {
          name: 'T_EventTriggerData',
          value: 406,
          comment: '/* in commands/event_trigger.h */'
        },
        {
          name: 'T_ReturnSetInfo',
          value: 407,
          comment: '/* in nodes/execnodes.h */'
        },
        {
          name: 'T_WindowObjectData',
          value: 408,
          comment: '/* private in nodeWindowAgg.c */'
        },
        {
          name: 'T_TIDBitmap',
          value: 409,
          comment: '/* in nodes/tidbitmap.h */'
        },
        {
          name: 'T_InlineCodeBlock',
          value: 410,
          comment: '/* in nodes/parsenodes.h */'
        },
        {
          name: 'T_FdwRoutine',
          value: 411,
          comment: '/* in foreign/fdwapi.h */'
        },
        {
          name: 'T_IndexAmRoutine',
          value: 412,
          comment: '/* in access/amapi.h */'
        },
        {
          name: 'T_TableAmRoutine',
          value: 413,
          comment: '/* in access/tableam.h */'
        },
        {
          name: 'T_TsmRoutine',
          value: 414,
          comment: '/* in access/tsmapi.h */'
        },
        {
          name: 'T_ForeignKeyCacheInfo',
          value: 415,
          comment: '/* in utils/rel.h */'
        },
        {
          name: 'T_CallContext',
          value: 416,
          comment: '/* in nodes/parsenodes.h */'
        },
        {
          name: 'T_SupportRequestSimplify',
          value: 417,
          comment: '/* in nodes/supportnodes.h */'
        },
        {
          name: 'T_SupportRequestSelectivity',
          value: 418,
          comment: '/* in nodes/supportnodes.h */'
        },
        {
          name: 'T_SupportRequestCost',
          value: 419,
          comment: '/* in nodes/supportnodes.h */'
        },
        {
          name: 'T_SupportRequestRows',
          value: 420,
          comment: '/* in nodes/supportnodes.h */'
        },
        {
          name: 'T_SupportRequestIndexCondition',
          value: 421,
          comment: '/* in nodes/supportnodes.h */'
        }
      ],
      comment:
        "/*\n * The first field of every node is NodeTag. Each node created (with makeNode)\n * will have one of the following tags as the value of its first field.\n *\n * Note that inserting or deleting node types changes the numbers of other\n * node types later in the list.  This is no problem during development, since\n * the node numbers are never stored on disk.  But don't do it in a released\n * branch, because that would represent an ABI break for extensions.\n */\n"
    },
    CmdType: {
      values: [
        {
          comment: ''
        },
        {
          name: 'CMD_UNKNOWN',
          value: 0
        },
        {
          name: 'CMD_SELECT',
          value: 1,
          comment: '/* select stmt */'
        },
        {
          name: 'CMD_UPDATE',
          value: 2,
          comment: '/* update stmt */'
        },
        {
          name: 'CMD_INSERT',
          value: 3,
          comment: '/* insert stmt */'
        },
        {
          name: 'CMD_DELETE',
          value: 4
        },
        {
          name: 'CMD_UTILITY',
          value: 5,
          comment:
            '/* cmds like create, destroy, copy, vacuum,\n\t\t\t\t\t\t\t\t * etc. */\n'
        },
        {
          name: 'CMD_NOTHING',
          value: 6,
          comment:
            '/* dummy command for instead nothing rules\n\t\t\t\t\t\t\t\t * with qual */\n'
        }
      ],
      comment:
        '/*\n * CmdType -\n *\t  enums for type of operation represented by a Query or PlannedStmt\n *\n * This is needed in both parsenodes.h and plannodes.h, so put it here...\n */\n'
    },
    JoinType: {
      values: [
        {
          comment: ''
        },
        {
          comment:
            '\t/*\n\t * The canonical kinds of joins according to the SQL JOIN syntax. Only\n\t * these codes can appear in parser output (e.g., JoinExpr nodes).\n\t */\n'
        },
        {
          name: 'JOIN_INNER',
          value: 0,
          comment: '/* matching tuple pairs only */'
        },
        {
          name: 'JOIN_LEFT',
          value: 1,
          comment: '/* pairs + unmatched LHS tuples */'
        },
        {
          name: 'JOIN_FULL',
          value: 2,
          comment: '/* pairs + unmatched LHS + unmatched RHS */'
        },
        {
          name: 'JOIN_RIGHT',
          value: 3,
          comment: '/* pairs + unmatched RHS tuples */'
        },
        {
          comment: ''
        },
        {
          comment:
            '\t/*\n\t * Semijoins and anti-semijoins (as defined in relational theory) do not\n\t * appear in the SQL JOIN syntax, but there are standard idioms for\n\t * representing them (e.g., using EXISTS).  The planner recognizes these\n\t * cases and converts them to joins.  So the planner and executor must\n\t * support these codes.  NOTE: in JOIN_SEMI output, it is unspecified\n\t * which matching RHS row is joined to.  In JOIN_ANTI output, the row is\n\t * guaranteed to be null-extended.\n\t */\n'
        },
        {
          name: 'JOIN_SEMI',
          value: 4,
          comment: '/* 1 copy of each LHS row that has match(es) */'
        },
        {
          name: 'JOIN_ANTI',
          value: 5,
          comment: '/* 1 copy of each LHS row that has no match */'
        },
        {
          comment: ''
        },
        {
          comment:
            '\t/*\n\t * These codes are used internally in the planner, but are not supported\n\t * by the executor (nor, indeed, by most of the planner).\n\t */\n'
        },
        {
          name: 'JOIN_UNIQUE_OUTER',
          value: 6,
          comment: '/* LHS path must be made unique */'
        },
        {
          name: 'JOIN_UNIQUE_INNER',
          value: 7,
          comment: '/* RHS path must be made unique */'
        },
        {
          comment: ''
        },
        {
          comment:
            '\t/*\n\t * We might need additional join types someday.\n\t */\n'
        }
      ],
      comment:
        '/*\n * JoinType -\n *\t  enums for types of relation joins\n *\n * JoinType determines the exact semantics of joining two relations using\n * a matching qualification.  For example, it tells what to do with a tuple\n * that has no match in the other relation.\n *\n * This is needed in both parsenodes.h and plannodes.h, so put it here...\n */\n'
    },
    AggStrategy: {
      values: [
        {
          comment: ''
        },
        {
          name: 'AGG_PLAIN',
          value: 0,
          comment: '/* simple agg across all input rows */'
        },
        {
          name: 'AGG_SORTED',
          value: 1,
          comment: '/* grouped agg, input must be sorted */'
        },
        {
          name: 'AGG_HASHED',
          value: 2,
          comment: '/* grouped agg, use internal hashtable */'
        },
        {
          name: 'AGG_MIXED',
          value: 3,
          comment: '/* grouped agg, hash and sort both used */'
        }
      ],
      comment:
        '/*\n * AggStrategy -\n *\t  overall execution strategies for Agg plan nodes\n *\n * This is needed in both pathnodes.h and plannodes.h, so put it here...\n */\n'
    },
    AggSplit: {
      values: [
        {
          comment: ''
        },
        {
          comment: '\t/* Basic, non-split aggregation: */\n'
        },
        {
          name: 'AGGSPLIT_SIMPLE',
          value: 0
        },
        {
          comment:
            '\t/* Initial phase of partial aggregation, with serialization: */\n'
        },
        {
          name: 'AGGSPLIT_INITIAL_SERIAL',
          value: 1
        },
        {
          comment:
            '\t/* Final phase of partial aggregation, with deserialization: */\n'
        },
        {
          name: 'AGGSPLIT_FINAL_DESERIAL',
          value: 2
        }
      ],
      comment:
        '/* Supported operating modes (i.e., useful combinations of these options): */\n'
    },
    SetOpCmd: {
      values: [
        {
          comment: ''
        },
        {
          name: 'SETOPCMD_INTERSECT',
          value: 0
        },
        {
          name: 'SETOPCMD_INTERSECT_ALL',
          value: 1
        },
        {
          name: 'SETOPCMD_EXCEPT',
          value: 2
        },
        {
          name: 'SETOPCMD_EXCEPT_ALL',
          value: 3
        }
      ],
      comment:
        '/*\n * SetOpCmd and SetOpStrategy -\n *\t  overall semantics and execution strategies for SetOp plan nodes\n *\n * This is needed in both pathnodes.h and plannodes.h, so put it here...\n */\n'
    },
    SetOpStrategy: {
      values: [
        {
          comment: ''
        },
        {
          name: 'SETOP_SORTED',
          value: 0,
          comment: '/* input must be sorted */'
        },
        {
          name: 'SETOP_HASHED',
          value: 1,
          comment: '/* use internal hashtable */'
        }
      ],
      comment: null
    },
    OnConflictAction: {
      values: [
        {
          comment: ''
        },
        {
          name: 'ONCONFLICT_NONE',
          value: 0,
          comment: '/* No "ON CONFLICT" clause */'
        },
        {
          name: 'ONCONFLICT_NOTHING',
          value: 1,
          comment: '/* ON CONFLICT ... DO NOTHING */'
        },
        {
          name: 'ONCONFLICT_UPDATE',
          value: 2,
          comment: '/* ON CONFLICT ... DO UPDATE */'
        }
      ],
      comment:
        '/*\n * OnConflictAction -\n *\t  "ON CONFLICT" clause type of query\n *\n * This is needed in both parsenodes.h and plannodes.h, so put it here...\n */\n'
    },
    LimitOption: {
      values: [
        {
          comment: ''
        },
        {
          name: 'LIMIT_OPTION_DEFAULT',
          value: 0,
          comment: '/* No limit present */'
        },
        {
          name: 'LIMIT_OPTION_COUNT',
          value: 1,
          comment: '/* FETCH FIRST... ONLY */'
        },
        {
          name: 'LIMIT_OPTION_WITH_TIES',
          value: 2,
          comment: '/* FETCH FIRST... WITH TIES */'
        }
      ],
      comment:
        '/*\n * LimitOption -\n *\tLIMIT option of query\n *\n * This is needed in both parsenodes.h and plannodes.h, so put it here...\n */\n'
    }
  },
  'nodes/params': {},
  'access/attnum': {},
  c: {},
  postgres: {
    vartag_external: {
      values: [
        {
          comment: ''
        },
        {
          name: 'VARTAG_INDIRECT',
          value: 1
        },
        {
          name: 'VARTAG_EXPANDED_RO',
          value: 2
        },
        {
          name: 'VARTAG_EXPANDED_RW',
          value: 3
        },
        {
          name: 'VARTAG_ONDISK',
          value: 18
        }
      ],
      comment:
        '/*\n * Type tag for the various sorts of "TOAST pointer" datums.  The peculiar\n * value for VARTAG_ONDISK comes from a requirement for on-disk compatibility\n * with a previous notion that the tag field was the pointer datum\'s length.\n */\n'
    }
  },
  postgres_ext: {},
  'commands/vacuum': {
    VacuumOption: {
      values: [
        {
          comment: ''
        },
        {
          name: 'VACOPT_VACUUM',
          value: 1,
          comment: '/* do VACUUM */'
        },
        {
          name: 'VACOPT_ANALYZE',
          value: 2,
          comment: '/* do ANALYZE */'
        },
        {
          name: 'VACOPT_VERBOSE',
          value: 4,
          comment: '/* print progress info */'
        },
        {
          name: 'VACOPT_FREEZE',
          value: 8,
          comment: '/* FREEZE option */'
        },
        {
          name: 'VACOPT_FULL',
          value: 16,
          comment: '/* FULL (non-concurrent) vacuum */'
        },
        {
          name: 'VACOPT_SKIP_LOCKED',
          value: 32,
          comment: '/* skip if cannot get lock */'
        },
        {
          name: 'VACOPT_SKIPTOAST',
          value: 64,
          comment: "/* don't process the TOAST table, if any */"
        },
        {
          name: 'VACOPT_DISABLE_PAGE_SKIPPING',
          value: 128,
          comment: "/* don't skip any pages */"
        }
      ],
      comment: null
    },
    VacOptTernaryValue: {
      values: [
        {
          comment: ''
        },
        {
          name: 'VACOPT_TERNARY_DEFAULT',
          value: 0
        },
        {
          name: 'VACOPT_TERNARY_DISABLED',
          value: 1
        },
        {
          name: 'VACOPT_TERNARY_ENABLED',
          value: 2
        }
      ],
      comment:
        '/*\n * A ternary value used by vacuum parameters.\n *\n * DEFAULT value is used to determine the value based on other\n * configurations, e.g. reloptions.\n */\n'
    }
  },
  'storage/block': {},
  'access/sdir': {
    ScanDirection: {
      values: [
        {
          comment: ''
        },
        {
          name: 'BackwardScanDirection',
          value: 0
        },
        {
          name: 'NoMovementScanDirection',
          value: 0
        },
        {
          name: 'ForwardScanDirection',
          value: 1
        }
      ],
      comment:
        "/*\n * ScanDirection was an int8 for no apparent reason. I kept the original\n * values because I'm not sure if I'll break anything otherwise.  -ay 2/95\n */\n"
    }
  },
  'mb/pg_wchar': {
    pg_enc: {
      values: [
        {
          comment: ''
        },
        {
          name: 'PG_SQL_ASCII',
          value: 0,
          comment: '/* SQL/ASCII */'
        },
        {
          name: 'PG_EUC_JP',
          value: 1,
          comment: '/* EUC for Japanese */'
        },
        {
          name: 'PG_EUC_CN',
          value: 2,
          comment: '/* EUC for Chinese */'
        },
        {
          name: 'PG_EUC_KR',
          value: 3,
          comment: '/* EUC for Korean */'
        },
        {
          name: 'PG_EUC_TW',
          value: 4,
          comment: '/* EUC for Taiwan */'
        },
        {
          name: 'PG_EUC_JIS_2004',
          value: 5,
          comment: '/* EUC-JIS-2004 */'
        },
        {
          name: 'PG_UTF8',
          value: 6,
          comment: '/* Unicode UTF8 */'
        },
        {
          name: 'PG_MULE_INTERNAL',
          value: 7,
          comment: '/* Mule internal code */'
        },
        {
          name: 'PG_LATIN1',
          value: 8,
          comment: '/* ISO-8859-1 Latin 1 */'
        },
        {
          name: 'PG_LATIN2',
          value: 9,
          comment: '/* ISO-8859-2 Latin 2 */'
        },
        {
          name: 'PG_LATIN3',
          value: 10,
          comment: '/* ISO-8859-3 Latin 3 */'
        },
        {
          name: 'PG_LATIN4',
          value: 11,
          comment: '/* ISO-8859-4 Latin 4 */'
        },
        {
          name: 'PG_LATIN5',
          value: 12,
          comment: '/* ISO-8859-9 Latin 5 */'
        },
        {
          name: 'PG_LATIN6',
          value: 13,
          comment: '/* ISO-8859-10 Latin6 */'
        },
        {
          name: 'PG_LATIN7',
          value: 14,
          comment: '/* ISO-8859-13 Latin7 */'
        },
        {
          name: 'PG_LATIN8',
          value: 15,
          comment: '/* ISO-8859-14 Latin8 */'
        },
        {
          name: 'PG_LATIN9',
          value: 16,
          comment: '/* ISO-8859-15 Latin9 */'
        },
        {
          name: 'PG_LATIN10',
          value: 17,
          comment: '/* ISO-8859-16 Latin10 */'
        },
        {
          name: 'PG_WIN1256',
          value: 18,
          comment: '/* windows-1256 */'
        },
        {
          name: 'PG_WIN1258',
          value: 19,
          comment: '/* Windows-1258 */'
        },
        {
          name: 'PG_WIN866',
          value: 20,
          comment: '/* (MS-DOS CP866) */'
        },
        {
          name: 'PG_WIN874',
          value: 21,
          comment: '/* windows-874 */'
        },
        {
          name: 'PG_KOI8R',
          value: 22,
          comment: '/* KOI8-R */'
        },
        {
          name: 'PG_WIN1251',
          value: 23,
          comment: '/* windows-1251 */'
        },
        {
          name: 'PG_WIN1252',
          value: 24,
          comment: '/* windows-1252 */'
        },
        {
          name: 'PG_ISO_8859_5',
          value: 25,
          comment: '/* ISO-8859-5 */'
        },
        {
          name: 'PG_ISO_8859_6',
          value: 26,
          comment: '/* ISO-8859-6 */'
        },
        {
          name: 'PG_ISO_8859_7',
          value: 27,
          comment: '/* ISO-8859-7 */'
        },
        {
          name: 'PG_ISO_8859_8',
          value: 28,
          comment: '/* ISO-8859-8 */'
        },
        {
          name: 'PG_WIN1250',
          value: 29,
          comment: '/* windows-1250 */'
        },
        {
          name: 'PG_WIN1253',
          value: 30,
          comment: '/* windows-1253 */'
        },
        {
          name: 'PG_WIN1254',
          value: 31,
          comment: '/* windows-1254 */'
        },
        {
          name: 'PG_WIN1255',
          value: 32,
          comment: '/* windows-1255 */'
        },
        {
          name: 'PG_WIN1257',
          value: 33,
          comment: '/* windows-1257 */'
        },
        {
          name: 'PG_KOI8U',
          value: 34,
          comment: '/* KOI8-U */'
        },
        {
          comment: '\t/* PG_ENCODING_BE_LAST points to the above entry */\n'
        },
        {
          comment: ''
        },
        {
          comment: '\t/* followings are for client encoding only */\n'
        },
        {
          name: 'PG_SJIS',
          value: 35,
          comment: '/* Shift JIS (Windows-932) */'
        },
        {
          name: 'PG_BIG5',
          value: 36,
          comment: '/* Big5 (Windows-950) */'
        },
        {
          name: 'PG_GBK',
          value: 37,
          comment: '/* GBK (Windows-936) */'
        },
        {
          name: 'PG_UHC',
          value: 38,
          comment: '/* UHC (Windows-949) */'
        },
        {
          name: 'PG_GB18030',
          value: 39,
          comment: '/* GB18030 */'
        },
        {
          name: 'PG_JOHAB',
          value: 40,
          comment: '/* EUC for Korean JOHAB */'
        },
        {
          name: 'PG_SHIFT_JIS_2004',
          value: 41,
          comment: '/* Shift-JIS-2004 */'
        },
        {
          name: '_PG_LAST_ENCODING_',
          value: 42,
          comment: '/* mark only */'
        },
        {
          comment: ''
        }
      ],
      comment:
        "/*\n * PostgreSQL encoding identifiers\n *\n * WARNING: the order of this enum must be same as order of entries\n *\t\t\tin the pg_enc2name_tbl[] array (in src/common/encnames.c), and\n *\t\t\tin the pg_wchar_table[] array (in src/common/wchar.c)!\n *\n *\t\t\tIf you add some encoding don't forget to check\n *\t\t\tPG_ENCODING_BE_LAST macro.\n *\n * PG_SQL_ASCII is default encoding and must be = 0.\n *\n * XXX\tWe must avoid renumbering any backend encoding until libpq's major\n * version number is increased beyond 5; it turns out that the backend\n * encoding IDs are effectively part of libpq's ABI as far as 8.2 initdb and\n * psql are concerned.\n */\n"
    }
  },
  '../backend/parser/gram': {
    yytokentype: {
      values: [
        {
          name: 'IDENT',
          value: 258
        },
        {
          name: 'UIDENT',
          value: 259
        },
        {
          name: 'FCONST',
          value: 260
        },
        {
          name: 'SCONST',
          value: 261
        },
        {
          name: 'USCONST',
          value: 262
        },
        {
          name: 'BCONST',
          value: 263
        },
        {
          name: 'XCONST',
          value: 264
        },
        {
          name: 'Op',
          value: 265
        },
        {
          name: 'ICONST',
          value: 266
        },
        {
          name: 'PARAM',
          value: 267
        },
        {
          name: 'TYPECAST',
          value: 268
        },
        {
          name: 'DOT_DOT',
          value: 269
        },
        {
          name: 'COLON_EQUALS',
          value: 270
        },
        {
          name: 'EQUALS_GREATER',
          value: 271
        },
        {
          name: 'LESS_EQUALS',
          value: 272
        },
        {
          name: 'GREATER_EQUALS',
          value: 273
        },
        {
          name: 'NOT_EQUALS',
          value: 274
        },
        {
          name: 'SQL_COMMENT',
          value: 275
        },
        {
          name: 'C_COMMENT',
          value: 276
        },
        {
          name: 'ABORT_P',
          value: 277
        },
        {
          name: 'ABSOLUTE_P',
          value: 278
        },
        {
          name: 'ACCESS',
          value: 279
        },
        {
          name: 'ACTION',
          value: 280
        },
        {
          name: 'ADD_P',
          value: 281
        },
        {
          name: 'ADMIN',
          value: 282
        },
        {
          name: 'AFTER',
          value: 283
        },
        {
          name: 'AGGREGATE',
          value: 284
        },
        {
          name: 'ALL',
          value: 285
        },
        {
          name: 'ALSO',
          value: 286
        },
        {
          name: 'ALTER',
          value: 287
        },
        {
          name: 'ALWAYS',
          value: 288
        },
        {
          name: 'ANALYSE',
          value: 289
        },
        {
          name: 'ANALYZE',
          value: 290
        },
        {
          name: 'AND',
          value: 291
        },
        {
          name: 'ANY',
          value: 292
        },
        {
          name: 'ARRAY',
          value: 293
        },
        {
          name: 'AS',
          value: 294
        },
        {
          name: 'ASC',
          value: 295
        },
        {
          name: 'ASSERTION',
          value: 296
        },
        {
          name: 'ASSIGNMENT',
          value: 297
        },
        {
          name: 'ASYMMETRIC',
          value: 298
        },
        {
          name: 'AT',
          value: 299
        },
        {
          name: 'ATTACH',
          value: 300
        },
        {
          name: 'ATTRIBUTE',
          value: 301
        },
        {
          name: 'AUTHORIZATION',
          value: 302
        },
        {
          name: 'BACKWARD',
          value: 303
        },
        {
          name: 'BEFORE',
          value: 304
        },
        {
          name: 'BEGIN_P',
          value: 305
        },
        {
          name: 'BETWEEN',
          value: 306
        },
        {
          name: 'BIGINT',
          value: 307
        },
        {
          name: 'BINARY',
          value: 308
        },
        {
          name: 'BIT',
          value: 309
        },
        {
          name: 'BOOLEAN_P',
          value: 310
        },
        {
          name: 'BOTH',
          value: 311
        },
        {
          name: 'BY',
          value: 312
        },
        {
          name: 'CACHE',
          value: 313
        },
        {
          name: 'CALL',
          value: 314
        },
        {
          name: 'CALLED',
          value: 315
        },
        {
          name: 'CASCADE',
          value: 316
        },
        {
          name: 'CASCADED',
          value: 317
        },
        {
          name: 'CASE',
          value: 318
        },
        {
          name: 'CAST',
          value: 319
        },
        {
          name: 'CATALOG_P',
          value: 320
        },
        {
          name: 'CHAIN',
          value: 321
        },
        {
          name: 'CHAR_P',
          value: 322
        },
        {
          name: 'CHARACTER',
          value: 323
        },
        {
          name: 'CHARACTERISTICS',
          value: 324
        },
        {
          name: 'CHECK',
          value: 325
        },
        {
          name: 'CHECKPOINT',
          value: 326
        },
        {
          name: 'CLASS',
          value: 327
        },
        {
          name: 'CLOSE',
          value: 328
        },
        {
          name: 'CLUSTER',
          value: 329
        },
        {
          name: 'COALESCE',
          value: 330
        },
        {
          name: 'COLLATE',
          value: 331
        },
        {
          name: 'COLLATION',
          value: 332
        },
        {
          name: 'COLUMN',
          value: 333
        },
        {
          name: 'COLUMNS',
          value: 334
        },
        {
          name: 'COMMENT',
          value: 335
        },
        {
          name: 'COMMENTS',
          value: 336
        },
        {
          name: 'COMMIT',
          value: 337
        },
        {
          name: 'COMMITTED',
          value: 338
        },
        {
          name: 'CONCURRENTLY',
          value: 339
        },
        {
          name: 'CONFIGURATION',
          value: 340
        },
        {
          name: 'CONFLICT',
          value: 341
        },
        {
          name: 'CONNECTION',
          value: 342
        },
        {
          name: 'CONSTRAINT',
          value: 343
        },
        {
          name: 'CONSTRAINTS',
          value: 344
        },
        {
          name: 'CONTENT_P',
          value: 345
        },
        {
          name: 'CONTINUE_P',
          value: 346
        },
        {
          name: 'CONVERSION_P',
          value: 347
        },
        {
          name: 'COPY',
          value: 348
        },
        {
          name: 'COST',
          value: 349
        },
        {
          name: 'CREATE',
          value: 350
        },
        {
          name: 'CROSS',
          value: 351
        },
        {
          name: 'CSV',
          value: 352
        },
        {
          name: 'CUBE',
          value: 353
        },
        {
          name: 'CURRENT_P',
          value: 354
        },
        {
          name: 'CURRENT_CATALOG',
          value: 355
        },
        {
          name: 'CURRENT_DATE',
          value: 356
        },
        {
          name: 'CURRENT_ROLE',
          value: 357
        },
        {
          name: 'CURRENT_SCHEMA',
          value: 358
        },
        {
          name: 'CURRENT_TIME',
          value: 359
        },
        {
          name: 'CURRENT_TIMESTAMP',
          value: 360
        },
        {
          name: 'CURRENT_USER',
          value: 361
        },
        {
          name: 'CURSOR',
          value: 362
        },
        {
          name: 'CYCLE',
          value: 363
        },
        {
          name: 'DATA_P',
          value: 364
        },
        {
          name: 'DATABASE',
          value: 365
        },
        {
          name: 'DAY_P',
          value: 366
        },
        {
          name: 'DEALLOCATE',
          value: 367
        },
        {
          name: 'DEC',
          value: 368
        },
        {
          name: 'DECIMAL_P',
          value: 369
        },
        {
          name: 'DECLARE',
          value: 370
        },
        {
          name: 'DEFAULT',
          value: 371
        },
        {
          name: 'DEFAULTS',
          value: 372
        },
        {
          name: 'DEFERRABLE',
          value: 373
        },
        {
          name: 'DEFERRED',
          value: 374
        },
        {
          name: 'DEFINER',
          value: 375
        },
        {
          name: 'DELETE_P',
          value: 376
        },
        {
          name: 'DELIMITER',
          value: 377
        },
        {
          name: 'DELIMITERS',
          value: 378
        },
        {
          name: 'DEPENDS',
          value: 379
        },
        {
          name: 'DESC',
          value: 380
        },
        {
          name: 'DETACH',
          value: 381
        },
        {
          name: 'DICTIONARY',
          value: 382
        },
        {
          name: 'DISABLE_P',
          value: 383
        },
        {
          name: 'DISCARD',
          value: 384
        },
        {
          name: 'DISTINCT',
          value: 385
        },
        {
          name: 'DO',
          value: 386
        },
        {
          name: 'DOCUMENT_P',
          value: 387
        },
        {
          name: 'DOMAIN_P',
          value: 388
        },
        {
          name: 'DOUBLE_P',
          value: 389
        },
        {
          name: 'DROP',
          value: 390
        },
        {
          name: 'EACH',
          value: 391
        },
        {
          name: 'ELSE',
          value: 392
        },
        {
          name: 'ENABLE_P',
          value: 393
        },
        {
          name: 'ENCODING',
          value: 394
        },
        {
          name: 'ENCRYPTED',
          value: 395
        },
        {
          name: 'END_P',
          value: 396
        },
        {
          name: 'ENUM_P',
          value: 397
        },
        {
          name: 'ESCAPE',
          value: 398
        },
        {
          name: 'EVENT',
          value: 399
        },
        {
          name: 'EXCEPT',
          value: 400
        },
        {
          name: 'EXCLUDE',
          value: 401
        },
        {
          name: 'EXCLUDING',
          value: 402
        },
        {
          name: 'EXCLUSIVE',
          value: 403
        },
        {
          name: 'EXECUTE',
          value: 404
        },
        {
          name: 'EXISTS',
          value: 405
        },
        {
          name: 'EXPLAIN',
          value: 406
        },
        {
          name: 'EXPRESSION',
          value: 407
        },
        {
          name: 'EXTENSION',
          value: 408
        },
        {
          name: 'EXTERNAL',
          value: 409
        },
        {
          name: 'EXTRACT',
          value: 410
        },
        {
          name: 'FALSE_P',
          value: 411
        },
        {
          name: 'FAMILY',
          value: 412
        },
        {
          name: 'FETCH',
          value: 413
        },
        {
          name: 'FILTER',
          value: 414
        },
        {
          name: 'FIRST_P',
          value: 415
        },
        {
          name: 'FLOAT_P',
          value: 416
        },
        {
          name: 'FOLLOWING',
          value: 417
        },
        {
          name: 'FOR',
          value: 418
        },
        {
          name: 'FORCE',
          value: 419
        },
        {
          name: 'FOREIGN',
          value: 420
        },
        {
          name: 'FORWARD',
          value: 421
        },
        {
          name: 'FREEZE',
          value: 422
        },
        {
          name: 'FROM',
          value: 423
        },
        {
          name: 'FULL',
          value: 424
        },
        {
          name: 'FUNCTION',
          value: 425
        },
        {
          name: 'FUNCTIONS',
          value: 426
        },
        {
          name: 'GENERATED',
          value: 427
        },
        {
          name: 'GLOBAL',
          value: 428
        },
        {
          name: 'GRANT',
          value: 429
        },
        {
          name: 'GRANTED',
          value: 430
        },
        {
          name: 'GREATEST',
          value: 431
        },
        {
          name: 'GROUP_P',
          value: 432
        },
        {
          name: 'GROUPING',
          value: 433
        },
        {
          name: 'GROUPS',
          value: 434
        },
        {
          name: 'HANDLER',
          value: 435
        },
        {
          name: 'HAVING',
          value: 436
        },
        {
          name: 'HEADER_P',
          value: 437
        },
        {
          name: 'HOLD',
          value: 438
        },
        {
          name: 'HOUR_P',
          value: 439
        },
        {
          name: 'IDENTITY_P',
          value: 440
        },
        {
          name: 'IF_P',
          value: 441
        },
        {
          name: 'ILIKE',
          value: 442
        },
        {
          name: 'IMMEDIATE',
          value: 443
        },
        {
          name: 'IMMUTABLE',
          value: 444
        },
        {
          name: 'IMPLICIT_P',
          value: 445
        },
        {
          name: 'IMPORT_P',
          value: 446
        },
        {
          name: 'IN_P',
          value: 447
        },
        {
          name: 'INCLUDE',
          value: 448
        },
        {
          name: 'INCLUDING',
          value: 449
        },
        {
          name: 'INCREMENT',
          value: 450
        },
        {
          name: 'INDEX',
          value: 451
        },
        {
          name: 'INDEXES',
          value: 452
        },
        {
          name: 'INHERIT',
          value: 453
        },
        {
          name: 'INHERITS',
          value: 454
        },
        {
          name: 'INITIALLY',
          value: 455
        },
        {
          name: 'INLINE_P',
          value: 456
        },
        {
          name: 'INNER_P',
          value: 457
        },
        {
          name: 'INOUT',
          value: 458
        },
        {
          name: 'INPUT_P',
          value: 459
        },
        {
          name: 'INSENSITIVE',
          value: 460
        },
        {
          name: 'INSERT',
          value: 461
        },
        {
          name: 'INSTEAD',
          value: 462
        },
        {
          name: 'INT_P',
          value: 463
        },
        {
          name: 'INTEGER',
          value: 464
        },
        {
          name: 'INTERSECT',
          value: 465
        },
        {
          name: 'INTERVAL',
          value: 466
        },
        {
          name: 'INTO',
          value: 467
        },
        {
          name: 'INVOKER',
          value: 468
        },
        {
          name: 'IS',
          value: 469
        },
        {
          name: 'ISNULL',
          value: 470
        },
        {
          name: 'ISOLATION',
          value: 471
        },
        {
          name: 'JOIN',
          value: 472
        },
        {
          name: 'KEY',
          value: 473
        },
        {
          name: 'LABEL',
          value: 474
        },
        {
          name: 'LANGUAGE',
          value: 475
        },
        {
          name: 'LARGE_P',
          value: 476
        },
        {
          name: 'LAST_P',
          value: 477
        },
        {
          name: 'LATERAL_P',
          value: 478
        },
        {
          name: 'LEADING',
          value: 479
        },
        {
          name: 'LEAKPROOF',
          value: 480
        },
        {
          name: 'LEAST',
          value: 481
        },
        {
          name: 'LEFT',
          value: 482
        },
        {
          name: 'LEVEL',
          value: 483
        },
        {
          name: 'LIKE',
          value: 484
        },
        {
          name: 'LIMIT',
          value: 485
        },
        {
          name: 'LISTEN',
          value: 486
        },
        {
          name: 'LOAD',
          value: 487
        },
        {
          name: 'LOCAL',
          value: 488
        },
        {
          name: 'LOCALTIME',
          value: 489
        },
        {
          name: 'LOCALTIMESTAMP',
          value: 490
        },
        {
          name: 'LOCATION',
          value: 491
        },
        {
          name: 'LOCK_P',
          value: 492
        },
        {
          name: 'LOCKED',
          value: 493
        },
        {
          name: 'LOGGED',
          value: 494
        },
        {
          name: 'MAPPING',
          value: 495
        },
        {
          name: 'MATCH',
          value: 496
        },
        {
          name: 'MATERIALIZED',
          value: 497
        },
        {
          name: 'MAXVALUE',
          value: 498
        },
        {
          name: 'METHOD',
          value: 499
        },
        {
          name: 'MINUTE_P',
          value: 500
        },
        {
          name: 'MINVALUE',
          value: 501
        },
        {
          name: 'MODE',
          value: 502
        },
        {
          name: 'MONTH_P',
          value: 503
        },
        {
          name: 'MOVE',
          value: 504
        },
        {
          name: 'NAME_P',
          value: 505
        },
        {
          name: 'NAMES',
          value: 506
        },
        {
          name: 'NATIONAL',
          value: 507
        },
        {
          name: 'NATURAL',
          value: 508
        },
        {
          name: 'NCHAR',
          value: 509
        },
        {
          name: 'NEW',
          value: 510
        },
        {
          name: 'NEXT',
          value: 511
        },
        {
          name: 'NFC',
          value: 512
        },
        {
          name: 'NFD',
          value: 513
        },
        {
          name: 'NFKC',
          value: 514
        },
        {
          name: 'NFKD',
          value: 515
        },
        {
          name: 'NO',
          value: 516
        },
        {
          name: 'NONE',
          value: 517
        },
        {
          name: 'NORMALIZE',
          value: 518
        },
        {
          name: 'NORMALIZED',
          value: 519
        },
        {
          name: 'NOT',
          value: 520
        },
        {
          name: 'NOTHING',
          value: 521
        },
        {
          name: 'NOTIFY',
          value: 522
        },
        {
          name: 'NOTNULL',
          value: 523
        },
        {
          name: 'NOWAIT',
          value: 524
        },
        {
          name: 'NULL_P',
          value: 525
        },
        {
          name: 'NULLIF',
          value: 526
        },
        {
          name: 'NULLS_P',
          value: 527
        },
        {
          name: 'NUMERIC',
          value: 528
        },
        {
          name: 'OBJECT_P',
          value: 529
        },
        {
          name: 'OF',
          value: 530
        },
        {
          name: 'OFF',
          value: 531
        },
        {
          name: 'OFFSET',
          value: 532
        },
        {
          name: 'OIDS',
          value: 533
        },
        {
          name: 'OLD',
          value: 534
        },
        {
          name: 'ON',
          value: 535
        },
        {
          name: 'ONLY',
          value: 536
        },
        {
          name: 'OPERATOR',
          value: 537
        },
        {
          name: 'OPTION',
          value: 538
        },
        {
          name: 'OPTIONS',
          value: 539
        },
        {
          name: 'OR',
          value: 540
        },
        {
          name: 'ORDER',
          value: 541
        },
        {
          name: 'ORDINALITY',
          value: 542
        },
        {
          name: 'OTHERS',
          value: 543
        },
        {
          name: 'OUT_P',
          value: 544
        },
        {
          name: 'OUTER_P',
          value: 545
        },
        {
          name: 'OVER',
          value: 546
        },
        {
          name: 'OVERLAPS',
          value: 547
        },
        {
          name: 'OVERLAY',
          value: 548
        },
        {
          name: 'OVERRIDING',
          value: 549
        },
        {
          name: 'OWNED',
          value: 550
        },
        {
          name: 'OWNER',
          value: 551
        },
        {
          name: 'PARALLEL',
          value: 552
        },
        {
          name: 'PARSER',
          value: 553
        },
        {
          name: 'PARTIAL',
          value: 554
        },
        {
          name: 'PARTITION',
          value: 555
        },
        {
          name: 'PASSING',
          value: 556
        },
        {
          name: 'PASSWORD',
          value: 557
        },
        {
          name: 'PLACING',
          value: 558
        },
        {
          name: 'PLANS',
          value: 559
        },
        {
          name: 'POLICY',
          value: 560
        },
        {
          name: 'POSITION',
          value: 561
        },
        {
          name: 'PRECEDING',
          value: 562
        },
        {
          name: 'PRECISION',
          value: 563
        },
        {
          name: 'PRESERVE',
          value: 564
        },
        {
          name: 'PREPARE',
          value: 565
        },
        {
          name: 'PREPARED',
          value: 566
        },
        {
          name: 'PRIMARY',
          value: 567
        },
        {
          name: 'PRIOR',
          value: 568
        },
        {
          name: 'PRIVILEGES',
          value: 569
        },
        {
          name: 'PROCEDURAL',
          value: 570
        },
        {
          name: 'PROCEDURE',
          value: 571
        },
        {
          name: 'PROCEDURES',
          value: 572
        },
        {
          name: 'PROGRAM',
          value: 573
        },
        {
          name: 'PUBLICATION',
          value: 574
        },
        {
          name: 'QUOTE',
          value: 575
        },
        {
          name: 'RANGE',
          value: 576
        },
        {
          name: 'READ',
          value: 577
        },
        {
          name: 'REAL',
          value: 578
        },
        {
          name: 'REASSIGN',
          value: 579
        },
        {
          name: 'RECHECK',
          value: 580
        },
        {
          name: 'RECURSIVE',
          value: 581
        },
        {
          name: 'REF',
          value: 582
        },
        {
          name: 'REFERENCES',
          value: 583
        },
        {
          name: 'REFERENCING',
          value: 584
        },
        {
          name: 'REFRESH',
          value: 585
        },
        {
          name: 'REINDEX',
          value: 586
        },
        {
          name: 'RELATIVE_P',
          value: 587
        },
        {
          name: 'RELEASE',
          value: 588
        },
        {
          name: 'RENAME',
          value: 589
        },
        {
          name: 'REPEATABLE',
          value: 590
        },
        {
          name: 'REPLACE',
          value: 591
        },
        {
          name: 'REPLICA',
          value: 592
        },
        {
          name: 'RESET',
          value: 593
        },
        {
          name: 'RESTART',
          value: 594
        },
        {
          name: 'RESTRICT',
          value: 595
        },
        {
          name: 'RETURNING',
          value: 596
        },
        {
          name: 'RETURNS',
          value: 597
        },
        {
          name: 'REVOKE',
          value: 598
        },
        {
          name: 'RIGHT',
          value: 599
        },
        {
          name: 'ROLE',
          value: 600
        },
        {
          name: 'ROLLBACK',
          value: 601
        },
        {
          name: 'ROLLUP',
          value: 602
        },
        {
          name: 'ROUTINE',
          value: 603
        },
        {
          name: 'ROUTINES',
          value: 604
        },
        {
          name: 'ROW',
          value: 605
        },
        {
          name: 'ROWS',
          value: 606
        },
        {
          name: 'RULE',
          value: 607
        },
        {
          name: 'SAVEPOINT',
          value: 608
        },
        {
          name: 'SCHEMA',
          value: 609
        },
        {
          name: 'SCHEMAS',
          value: 610
        },
        {
          name: 'SCROLL',
          value: 611
        },
        {
          name: 'SEARCH',
          value: 612
        },
        {
          name: 'SECOND_P',
          value: 613
        },
        {
          name: 'SECURITY',
          value: 614
        },
        {
          name: 'SELECT',
          value: 615
        },
        {
          name: 'SEQUENCE',
          value: 616
        },
        {
          name: 'SEQUENCES',
          value: 617
        },
        {
          name: 'SERIALIZABLE',
          value: 618
        },
        {
          name: 'SERVER',
          value: 619
        },
        {
          name: 'SESSION',
          value: 620
        },
        {
          name: 'SESSION_USER',
          value: 621
        },
        {
          name: 'SET',
          value: 622
        },
        {
          name: 'SETS',
          value: 623
        },
        {
          name: 'SETOF',
          value: 624
        },
        {
          name: 'SHARE',
          value: 625
        },
        {
          name: 'SHOW',
          value: 626
        },
        {
          name: 'SIMILAR',
          value: 627
        },
        {
          name: 'SIMPLE',
          value: 628
        },
        {
          name: 'SKIP',
          value: 629
        },
        {
          name: 'SMALLINT',
          value: 630
        },
        {
          name: 'SNAPSHOT',
          value: 631
        },
        {
          name: 'SOME',
          value: 632
        },
        {
          name: 'SQL_P',
          value: 633
        },
        {
          name: 'STABLE',
          value: 634
        },
        {
          name: 'STANDALONE_P',
          value: 635
        },
        {
          name: 'START',
          value: 636
        },
        {
          name: 'STATEMENT',
          value: 637
        },
        {
          name: 'STATISTICS',
          value: 638
        },
        {
          name: 'STDIN',
          value: 639
        },
        {
          name: 'STDOUT',
          value: 640
        },
        {
          name: 'STORAGE',
          value: 641
        },
        {
          name: 'STORED',
          value: 642
        },
        {
          name: 'STRICT_P',
          value: 643
        },
        {
          name: 'STRIP_P',
          value: 644
        },
        {
          name: 'SUBSCRIPTION',
          value: 645
        },
        {
          name: 'SUBSTRING',
          value: 646
        },
        {
          name: 'SUPPORT',
          value: 647
        },
        {
          name: 'SYMMETRIC',
          value: 648
        },
        {
          name: 'SYSID',
          value: 649
        },
        {
          name: 'SYSTEM_P',
          value: 650
        },
        {
          name: 'TABLE',
          value: 651
        },
        {
          name: 'TABLES',
          value: 652
        },
        {
          name: 'TABLESAMPLE',
          value: 653
        },
        {
          name: 'TABLESPACE',
          value: 654
        },
        {
          name: 'TEMP',
          value: 655
        },
        {
          name: 'TEMPLATE',
          value: 656
        },
        {
          name: 'TEMPORARY',
          value: 657
        },
        {
          name: 'TEXT_P',
          value: 658
        },
        {
          name: 'THEN',
          value: 659
        },
        {
          name: 'TIES',
          value: 660
        },
        {
          name: 'TIME',
          value: 661
        },
        {
          name: 'TIMESTAMP',
          value: 662
        },
        {
          name: 'TO',
          value: 663
        },
        {
          name: 'TRAILING',
          value: 664
        },
        {
          name: 'TRANSACTION',
          value: 665
        },
        {
          name: 'TRANSFORM',
          value: 666
        },
        {
          name: 'TREAT',
          value: 667
        },
        {
          name: 'TRIGGER',
          value: 668
        },
        {
          name: 'TRIM',
          value: 669
        },
        {
          name: 'TRUE_P',
          value: 670
        },
        {
          name: 'TRUNCATE',
          value: 671
        },
        {
          name: 'TRUSTED',
          value: 672
        },
        {
          name: 'TYPE_P',
          value: 673
        },
        {
          name: 'TYPES_P',
          value: 674
        },
        {
          name: 'UESCAPE',
          value: 675
        },
        {
          name: 'UNBOUNDED',
          value: 676
        },
        {
          name: 'UNCOMMITTED',
          value: 677
        },
        {
          name: 'UNENCRYPTED',
          value: 678
        },
        {
          name: 'UNION',
          value: 679
        },
        {
          name: 'UNIQUE',
          value: 680
        },
        {
          name: 'UNKNOWN',
          value: 681
        },
        {
          name: 'UNLISTEN',
          value: 682
        },
        {
          name: 'UNLOGGED',
          value: 683
        },
        {
          name: 'UNTIL',
          value: 684
        },
        {
          name: 'UPDATE',
          value: 685
        },
        {
          name: 'USER',
          value: 686
        },
        {
          name: 'USING',
          value: 687
        },
        {
          name: 'VACUUM',
          value: 688
        },
        {
          name: 'VALID',
          value: 689
        },
        {
          name: 'VALIDATE',
          value: 690
        },
        {
          name: 'VALIDATOR',
          value: 691
        },
        {
          name: 'VALUE_P',
          value: 692
        },
        {
          name: 'VALUES',
          value: 693
        },
        {
          name: 'VARCHAR',
          value: 694
        },
        {
          name: 'VARIADIC',
          value: 695
        },
        {
          name: 'VARYING',
          value: 696
        },
        {
          name: 'VERBOSE',
          value: 697
        },
        {
          name: 'VERSION_P',
          value: 698
        },
        {
          name: 'VIEW',
          value: 699
        },
        {
          name: 'VIEWS',
          value: 700
        },
        {
          name: 'VOLATILE',
          value: 701
        },
        {
          name: 'WHEN',
          value: 702
        },
        {
          name: 'WHERE',
          value: 703
        },
        {
          name: 'WHITESPACE_P',
          value: 704
        },
        {
          name: 'WINDOW',
          value: 705
        },
        {
          name: 'WITH',
          value: 706
        },
        {
          name: 'WITHIN',
          value: 707
        },
        {
          name: 'WITHOUT',
          value: 708
        },
        {
          name: 'WORK',
          value: 709
        },
        {
          name: 'WRAPPER',
          value: 710
        },
        {
          name: 'WRITE',
          value: 711
        },
        {
          name: 'XML_P',
          value: 712
        },
        {
          name: 'XMLATTRIBUTES',
          value: 713
        },
        {
          name: 'XMLCONCAT',
          value: 714
        },
        {
          name: 'XMLELEMENT',
          value: 715
        },
        {
          name: 'XMLEXISTS',
          value: 716
        },
        {
          name: 'XMLFOREST',
          value: 717
        },
        {
          name: 'XMLNAMESPACES',
          value: 718
        },
        {
          name: 'XMLPARSE',
          value: 719
        },
        {
          name: 'XMLPI',
          value: 720
        },
        {
          name: 'XMLROOT',
          value: 721
        },
        {
          name: 'XMLSERIALIZE',
          value: 722
        },
        {
          name: 'XMLTABLE',
          value: 723
        },
        {
          name: 'YEAR_P',
          value: 724
        },
        {
          name: 'YES_P',
          value: 725
        },
        {
          name: 'ZONE',
          value: 726
        },
        {
          name: 'NOT_LA',
          value: 727
        },
        {
          name: 'NULLS_LA',
          value: 728
        },
        {
          name: 'WITH_LA',
          value: 729
        },
        {
          name: 'POSTFIXOP',
          value: 730
        },
        {
          name: 'UMINUS',
          value: 731
        }
      ],
      comment:
        '   /* Put the tokens into the symbol table, so that GDB and other debuggers\n      know about them.  */\n'
    }
  }
};
