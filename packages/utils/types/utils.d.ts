/**
* This file was automatically generated by pg-proto-parser@1.12.2.
* DO NOT MODIFY IT BY HAND. Instead, modify the source proto file,
* and run the pg-proto-parser generate command to regenerate this file.
*/
export type EnumType = "OverridingKind" | "QuerySource" | "SortByDir" | "SortByNulls" | "A_Expr_Kind" | "RoleSpecType" | "TableLikeOption" | "DefElemAction" | "PartitionRangeDatumKind" | "RTEKind" | "WCOKind" | "GroupingSetKind" | "CTEMaterialize" | "SetOperation" | "ObjectType" | "DropBehavior" | "AlterTableType" | "GrantTargetType" | "VariableSetKind" | "ConstrType" | "ImportForeignSchemaType" | "RoleStmtType" | "FetchDirection" | "FunctionParameterMode" | "TransactionStmtKind" | "ViewCheckOption" | "ClusterOption" | "DiscardMode" | "ReindexObjectType" | "AlterTSConfigType" | "AlterSubscriptionType" | "OnCommitAction" | "ParamKind" | "CoercionContext" | "CoercionForm" | "BoolExprType" | "SubLinkType" | "RowCompareType" | "MinMaxOp" | "SQLValueFunctionOp" | "XmlExprOp" | "XmlOptionType" | "NullTestType" | "BoolTestType" | "CmdType" | "JoinType" | "AggStrategy" | "AggSplit" | "SetOpCmd" | "SetOpStrategy" | "OnConflictAction" | "LimitOption" | "LockClauseStrength" | "LockWaitPolicy" | "LockTupleMode" | "KeywordKind" | "Token";
export declare const getEnumValue: (enumType: EnumType, key: string | number) => "ONCOMMIT_NOOP" | "ONCOMMIT_PRESERVE_ROWS" | "ONCOMMIT_DELETE_ROWS" | "ONCOMMIT_DROP" | "PARAM_EXTERN" | "PARAM_EXEC" | "PARAM_SUBLINK" | "PARAM_MULTIEXPR" | "AGGSPLIT_SIMPLE" | "AGGSPLIT_INITIAL_SERIAL" | "AGGSPLIT_FINAL_DESERIAL" | "COERCE_EXPLICIT_CALL" | "COERCE_EXPLICIT_CAST" | "COERCE_IMPLICIT_CAST" | "AND_EXPR" | "OR_EXPR" | "NOT_EXPR" | "EXISTS_SUBLINK" | "ALL_SUBLINK" | "ANY_SUBLINK" | "ROWCOMPARE_SUBLINK" | "EXPR_SUBLINK" | "MULTIEXPR_SUBLINK" | "ARRAY_SUBLINK" | "CTE_SUBLINK" | "ROWCOMPARE_LT" | "ROWCOMPARE_LE" | "ROWCOMPARE_EQ" | "ROWCOMPARE_GE" | "ROWCOMPARE_GT" | "ROWCOMPARE_NE" | "IS_GREATEST" | "IS_LEAST" | "SVFOP_CURRENT_DATE" | "SVFOP_CURRENT_TIME" | "SVFOP_CURRENT_TIME_N" | "SVFOP_CURRENT_TIMESTAMP" | "SVFOP_CURRENT_TIMESTAMP_N" | "SVFOP_LOCALTIME" | "SVFOP_LOCALTIME_N" | "SVFOP_LOCALTIMESTAMP" | "SVFOP_LOCALTIMESTAMP_N" | "SVFOP_CURRENT_ROLE" | "SVFOP_CURRENT_USER" | "SVFOP_USER" | "SVFOP_SESSION_USER" | "SVFOP_CURRENT_CATALOG" | "SVFOP_CURRENT_SCHEMA" | "IS_XMLCONCAT" | "IS_XMLELEMENT" | "IS_XMLFOREST" | "IS_XMLPARSE" | "IS_XMLPI" | "IS_XMLROOT" | "IS_XMLSERIALIZE" | "IS_DOCUMENT" | "XMLOPTION_DOCUMENT" | "XMLOPTION_CONTENT" | "IS_NULL" | "IS_NOT_NULL" | "IS_TRUE" | "IS_NOT_TRUE" | "IS_FALSE" | "IS_NOT_FALSE" | "IS_UNKNOWN" | "IS_NOT_UNKNOWN" | "JOIN_INNER" | "JOIN_LEFT" | "JOIN_FULL" | "JOIN_RIGHT" | "JOIN_SEMI" | "JOIN_ANTI" | "JOIN_UNIQUE_OUTER" | "JOIN_UNIQUE_INNER" | "ONCONFLICT_NONE" | "ONCONFLICT_NOTHING" | "ONCONFLICT_UPDATE" | "CMD_UNKNOWN" | "CMD_SELECT" | "CMD_UPDATE" | "CMD_INSERT" | "CMD_DELETE" | "CMD_UTILITY" | "CMD_NOTHING" | "QSRC_ORIGINAL" | "QSRC_PARSER" | "QSRC_INSTEAD_RULE" | "QSRC_QUAL_INSTEAD_RULE" | "QSRC_NON_INSTEAD_RULE" | "OVERRIDING_NOT_SET" | "OVERRIDING_USER_VALUE" | "OVERRIDING_SYSTEM_VALUE" | "LIMIT_OPTION_DEFAULT" | "LIMIT_OPTION_COUNT" | "LIMIT_OPTION_WITH_TIES" | "AEXPR_OP" | "AEXPR_OP_ANY" | "AEXPR_OP_ALL" | "AEXPR_DISTINCT" | "AEXPR_NOT_DISTINCT" | "AEXPR_NULLIF" | "AEXPR_IN" | "AEXPR_LIKE" | "AEXPR_ILIKE" | "AEXPR_SIMILAR" | "AEXPR_BETWEEN" | "AEXPR_NOT_BETWEEN" | "AEXPR_BETWEEN_SYM" | "AEXPR_NOT_BETWEEN_SYM" | "ROLESPEC_CSTRING" | "ROLESPEC_CURRENT_USER" | "ROLESPEC_SESSION_USER" | "ROLESPEC_PUBLIC" | "SORTBY_DEFAULT" | "SORTBY_ASC" | "SORTBY_DESC" | "SORTBY_USING" | "SORTBY_NULLS_DEFAULT" | "SORTBY_NULLS_FIRST" | "SORTBY_NULLS_LAST" | "DEFELEM_UNSPEC" | "DEFELEM_SET" | "DEFELEM_ADD" | "DEFELEM_DROP" | "LCS_NONE" | "LCS_FORKEYSHARE" | "LCS_FORSHARE" | "LCS_FORNOKEYUPDATE" | "LCS_FORUPDATE" | "LockWaitBlock" | "LockWaitSkip" | "LockWaitError" | "PARTITION_RANGE_DATUM_MINVALUE" | "PARTITION_RANGE_DATUM_VALUE" | "PARTITION_RANGE_DATUM_MAXVALUE" | "RTE_RELATION" | "RTE_SUBQUERY" | "RTE_JOIN" | "RTE_FUNCTION" | "RTE_TABLEFUNC" | "RTE_VALUES" | "RTE_CTE" | "RTE_NAMEDTUPLESTORE" | "RTE_RESULT" | "WCO_VIEW_CHECK" | "WCO_RLS_INSERT_CHECK" | "WCO_RLS_UPDATE_CHECK" | "WCO_RLS_CONFLICT_CHECK" | "GROUPING_SET_EMPTY" | "GROUPING_SET_SIMPLE" | "GROUPING_SET_ROLLUP" | "GROUPING_SET_CUBE" | "GROUPING_SET_SETS" | "CTEMaterializeDefault" | "CTEMaterializeAlways" | "CTEMaterializeNever" | "SETOP_NONE" | "SETOP_UNION" | "SETOP_INTERSECT" | "SETOP_EXCEPT" | "OBJECT_ACCESS_METHOD" | "OBJECT_AGGREGATE" | "OBJECT_AMOP" | "OBJECT_AMPROC" | "OBJECT_ATTRIBUTE" | "OBJECT_CAST" | "OBJECT_COLUMN" | "OBJECT_COLLATION" | "OBJECT_CONVERSION" | "OBJECT_DATABASE" | "OBJECT_DEFAULT" | "OBJECT_DEFACL" | "OBJECT_DOMAIN" | "OBJECT_DOMCONSTRAINT" | "OBJECT_EVENT_TRIGGER" | "OBJECT_EXTENSION" | "OBJECT_FDW" | "OBJECT_FOREIGN_SERVER" | "OBJECT_FOREIGN_TABLE" | "OBJECT_FUNCTION" | "OBJECT_INDEX" | "OBJECT_LANGUAGE" | "OBJECT_LARGEOBJECT" | "OBJECT_MATVIEW" | "OBJECT_OPCLASS" | "OBJECT_OPERATOR" | "OBJECT_OPFAMILY" | "OBJECT_POLICY" | "OBJECT_PROCEDURE" | "OBJECT_PUBLICATION" | "OBJECT_PUBLICATION_REL" | "OBJECT_ROLE" | "OBJECT_ROUTINE" | "OBJECT_RULE" | "OBJECT_SCHEMA" | "OBJECT_SEQUENCE" | "OBJECT_SUBSCRIPTION" | "OBJECT_STATISTIC_EXT" | "OBJECT_TABCONSTRAINT" | "OBJECT_TABLE" | "OBJECT_TABLESPACE" | "OBJECT_TRANSFORM" | "OBJECT_TRIGGER" | "OBJECT_TSCONFIGURATION" | "OBJECT_TSDICTIONARY" | "OBJECT_TSPARSER" | "OBJECT_TSTEMPLATE" | "OBJECT_TYPE" | "OBJECT_USER_MAPPING" | "OBJECT_VIEW" | "AT_AddColumn" | "AT_AddColumnToView" | "AT_ColumnDefault" | "AT_CookedColumnDefault" | "AT_DropNotNull" | "AT_SetNotNull" | "AT_DropExpression" | "AT_CheckNotNull" | "AT_SetStatistics" | "AT_SetOptions" | "AT_ResetOptions" | "AT_SetStorage" | "AT_DropColumn" | "AT_AddIndex" | "AT_ReAddIndex" | "AT_AddConstraint" | "AT_ReAddConstraint" | "AT_ReAddDomainConstraint" | "AT_AlterConstraint" | "AT_ValidateConstraint" | "AT_AddIndexConstraint" | "AT_DropConstraint" | "AT_ReAddComment" | "AT_AlterColumnType" | "AT_AlterColumnGenericOptions" | "AT_ChangeOwner" | "AT_ClusterOn" | "AT_DropCluster" | "AT_SetLogged" | "AT_SetUnLogged" | "AT_DropOids" | "AT_SetTableSpace" | "AT_SetRelOptions" | "AT_ResetRelOptions" | "AT_ReplaceRelOptions" | "AT_EnableTrig" | "AT_EnableAlwaysTrig" | "AT_EnableReplicaTrig" | "AT_DisableTrig" | "AT_EnableTrigAll" | "AT_DisableTrigAll" | "AT_EnableTrigUser" | "AT_DisableTrigUser" | "AT_EnableRule" | "AT_EnableAlwaysRule" | "AT_EnableReplicaRule" | "AT_DisableRule" | "AT_AddInherit" | "AT_DropInherit" | "AT_AddOf" | "AT_DropOf" | "AT_ReplicaIdentity" | "AT_EnableRowSecurity" | "AT_DisableRowSecurity" | "AT_ForceRowSecurity" | "AT_NoForceRowSecurity" | "AT_GenericOptions" | "AT_AttachPartition" | "AT_DetachPartition" | "AT_AddIdentity" | "AT_SetIdentity" | "AT_DropIdentity" | "DROP_RESTRICT" | "DROP_CASCADE" | "ACL_TARGET_OBJECT" | "ACL_TARGET_ALL_IN_SCHEMA" | "ACL_TARGET_DEFAULTS" | "VAR_SET_VALUE" | "VAR_SET_DEFAULT" | "VAR_SET_CURRENT" | "VAR_SET_MULTI" | "VAR_RESET" | "VAR_RESET_ALL" | "CONSTR_NULL" | "CONSTR_NOTNULL" | "CONSTR_DEFAULT" | "CONSTR_IDENTITY" | "CONSTR_GENERATED" | "CONSTR_CHECK" | "CONSTR_PRIMARY" | "CONSTR_UNIQUE" | "CONSTR_EXCLUSION" | "CONSTR_FOREIGN" | "CONSTR_ATTR_DEFERRABLE" | "CONSTR_ATTR_NOT_DEFERRABLE" | "CONSTR_ATTR_DEFERRED" | "CONSTR_ATTR_IMMEDIATE" | "FDW_IMPORT_SCHEMA_ALL" | "FDW_IMPORT_SCHEMA_LIMIT_TO" | "FDW_IMPORT_SCHEMA_EXCEPT" | "ROLESTMT_ROLE" | "ROLESTMT_USER" | "ROLESTMT_GROUP" | "FETCH_FORWARD" | "FETCH_BACKWARD" | "FETCH_ABSOLUTE" | "FETCH_RELATIVE" | "FUNC_PARAM_IN" | "FUNC_PARAM_OUT" | "FUNC_PARAM_INOUT" | "FUNC_PARAM_VARIADIC" | "FUNC_PARAM_TABLE" | "TRANS_STMT_BEGIN" | "TRANS_STMT_START" | "TRANS_STMT_COMMIT" | "TRANS_STMT_ROLLBACK" | "TRANS_STMT_SAVEPOINT" | "TRANS_STMT_RELEASE" | "TRANS_STMT_ROLLBACK_TO" | "TRANS_STMT_PREPARE" | "TRANS_STMT_COMMIT_PREPARED" | "TRANS_STMT_ROLLBACK_PREPARED" | "NO_CHECK_OPTION" | "LOCAL_CHECK_OPTION" | "CASCADED_CHECK_OPTION" | "DISCARD_ALL" | "DISCARD_PLANS" | "DISCARD_SEQUENCES" | "DISCARD_TEMP" | "REINDEX_OBJECT_INDEX" | "REINDEX_OBJECT_TABLE" | "REINDEX_OBJECT_SCHEMA" | "REINDEX_OBJECT_SYSTEM" | "REINDEX_OBJECT_DATABASE" | "COERCION_IMPLICIT" | "COERCION_ASSIGNMENT" | "COERCION_EXPLICIT" | "ALTER_TSCONFIG_ADD_MAPPING" | "ALTER_TSCONFIG_ALTER_MAPPING_FOR_TOKEN" | "ALTER_TSCONFIG_REPLACE_DICT" | "ALTER_TSCONFIG_REPLACE_DICT_FOR_TOKEN" | "ALTER_TSCONFIG_DROP_MAPPING" | "ALTER_SUBSCRIPTION_OPTIONS" | "ALTER_SUBSCRIPTION_CONNECTION" | "ALTER_SUBSCRIPTION_REFRESH" | "ALTER_SUBSCRIPTION_ENABLED" | "NUL" | "ASCII_37" | "ASCII_40" | "ASCII_41" | "ASCII_42" | "ASCII_43" | "ASCII_44" | "ASCII_45" | "ASCII_46" | "ASCII_47" | "ASCII_58" | "ASCII_59" | "ASCII_60" | "ASCII_61" | "ASCII_62" | "ASCII_63" | "ASCII_91" | "ASCII_92" | "ASCII_93" | "ASCII_94" | "IDENT" | "UIDENT" | "FCONST" | "SCONST" | "USCONST" | "BCONST" | "XCONST" | "Op" | "ICONST" | "PARAM" | "TYPECAST" | "DOT_DOT" | "COLON_EQUALS" | "EQUALS_GREATER" | "LESS_EQUALS" | "GREATER_EQUALS" | "NOT_EQUALS" | "SQL_COMMENT" | "C_COMMENT" | "ABORT_P" | "ABSOLUTE_P" | "ACCESS" | "ACTION" | "ADD_P" | "ADMIN" | "AFTER" | "AGGREGATE" | "ALL" | "ALSO" | "ALTER" | "ALWAYS" | "ANALYSE" | "ANALYZE" | "AND" | "ANY" | "ARRAY" | "AS" | "ASC" | "ASSERTION" | "ASSIGNMENT" | "ASYMMETRIC" | "AT" | "ATTACH" | "ATTRIBUTE" | "AUTHORIZATION" | "BACKWARD" | "BEFORE" | "BEGIN_P" | "BETWEEN" | "BIGINT" | "BINARY" | "BIT" | "BOOLEAN_P" | "BOTH" | "BY" | "CACHE" | "CALL" | "CALLED" | "CASCADE" | "CASCADED" | "CASE" | "CAST" | "CATALOG_P" | "CHAIN" | "CHAR_P" | "CHARACTER" | "CHARACTERISTICS" | "CHECK" | "CHECKPOINT" | "CLASS" | "CLOSE" | "CLUSTER" | "COALESCE" | "COLLATE" | "COLLATION" | "COLUMN" | "COLUMNS" | "COMMENT" | "COMMENTS" | "COMMIT" | "COMMITTED" | "CONCURRENTLY" | "CONFIGURATION" | "CONFLICT" | "CONNECTION" | "CONSTRAINT" | "CONSTRAINTS" | "CONTENT_P" | "CONTINUE_P" | "CONVERSION_P" | "COPY" | "COST" | "CREATE" | "CROSS" | "CSV" | "CUBE" | "CURRENT_P" | "CURRENT_CATALOG" | "CURRENT_DATE" | "CURRENT_ROLE" | "CURRENT_SCHEMA" | "CURRENT_TIME" | "CURRENT_TIMESTAMP" | "CURRENT_USER" | "CURSOR" | "CYCLE" | "DATA_P" | "DATABASE" | "DAY_P" | "DEALLOCATE" | "DEC" | "DECIMAL_P" | "DECLARE" | "DEFAULT" | "DEFAULTS" | "DEFERRABLE" | "DEFERRED" | "DEFINER" | "DELETE_P" | "DELIMITER" | "DELIMITERS" | "DEPENDS" | "DESC" | "DETACH" | "DICTIONARY" | "DISABLE_P" | "DISCARD" | "DISTINCT" | "DO" | "DOCUMENT_P" | "DOMAIN_P" | "DOUBLE_P" | "DROP" | "EACH" | "ELSE" | "ENABLE_P" | "ENCODING" | "ENCRYPTED" | "END_P" | "ENUM_P" | "ESCAPE" | "EVENT" | "EXCEPT" | "EXCLUDE" | "EXCLUDING" | "EXCLUSIVE" | "EXECUTE" | "EXISTS" | "EXPLAIN" | "EXPRESSION" | "EXTENSION" | "EXTERNAL" | "EXTRACT" | "FALSE_P" | "FAMILY" | "FETCH" | "FILTER" | "FIRST_P" | "FLOAT_P" | "FOLLOWING" | "FOR" | "FORCE" | "FOREIGN" | "FORWARD" | "FREEZE" | "FROM" | "FULL" | "FUNCTION" | "FUNCTIONS" | "GENERATED" | "GLOBAL" | "GRANT" | "GRANTED" | "GREATEST" | "GROUP_P" | "GROUPING" | "GROUPS" | "HANDLER" | "HAVING" | "HEADER_P" | "HOLD" | "HOUR_P" | "IDENTITY_P" | "IF_P" | "ILIKE" | "IMMEDIATE" | "IMMUTABLE" | "IMPLICIT_P" | "IMPORT_P" | "IN_P" | "INCLUDE" | "INCLUDING" | "INCREMENT" | "INDEX" | "INDEXES" | "INHERIT" | "INHERITS" | "INITIALLY" | "INLINE_P" | "INNER_P" | "INOUT" | "INPUT_P" | "INSENSITIVE" | "INSERT" | "INSTEAD" | "INT_P" | "INTEGER" | "INTERSECT" | "INTERVAL" | "INTO" | "INVOKER" | "IS" | "ISNULL" | "ISOLATION" | "JOIN" | "KEY" | "LABEL" | "LANGUAGE" | "LARGE_P" | "LAST_P" | "LATERAL_P" | "LEADING" | "LEAKPROOF" | "LEAST" | "LEFT" | "LEVEL" | "LIKE" | "LIMIT" | "LISTEN" | "LOAD" | "LOCAL" | "LOCALTIME" | "LOCALTIMESTAMP" | "LOCATION" | "LOCK_P" | "LOCKED" | "LOGGED" | "MAPPING" | "MATCH" | "MATERIALIZED" | "MAXVALUE" | "METHOD" | "MINUTE_P" | "MINVALUE" | "MODE" | "MONTH_P" | "MOVE" | "NAME_P" | "NAMES" | "NATIONAL" | "NATURAL" | "NCHAR" | "NEW" | "NEXT" | "NFC" | "NFD" | "NFKC" | "NFKD" | "NO" | "NONE" | "NORMALIZE" | "NORMALIZED" | "NOT" | "NOTHING" | "NOTIFY" | "NOTNULL" | "NOWAIT" | "NULL_P" | "NULLIF" | "NULLS_P" | "NUMERIC" | "OBJECT_P" | "OF" | "OFF" | "OFFSET" | "OIDS" | "OLD" | "ON" | "ONLY" | "OPERATOR" | "OPTION" | "OPTIONS" | "OR" | "ORDER" | "ORDINALITY" | "OTHERS" | "OUT_P" | "OUTER_P" | "OVER" | "OVERLAPS" | "OVERLAY" | "OVERRIDING" | "OWNED" | "OWNER" | "PARALLEL" | "PARSER" | "PARTIAL" | "PARTITION" | "PASSING" | "PASSWORD" | "PLACING" | "PLANS" | "POLICY" | "POSITION" | "PRECEDING" | "PRECISION" | "PRESERVE" | "PREPARE" | "PREPARED" | "PRIMARY" | "PRIOR" | "PRIVILEGES" | "PROCEDURAL" | "PROCEDURE" | "PROCEDURES" | "PROGRAM" | "PUBLICATION" | "QUOTE" | "RANGE" | "READ" | "REAL" | "REASSIGN" | "RECHECK" | "RECURSIVE" | "REF_P" | "REFERENCES" | "REFERENCING" | "REFRESH" | "REINDEX" | "RELATIVE_P" | "RELEASE" | "RENAME" | "REPEATABLE" | "REPLACE" | "REPLICA" | "RESET" | "RESTART" | "RESTRICT" | "RETURNING" | "RETURNS" | "REVOKE" | "RIGHT" | "ROLE" | "ROLLBACK" | "ROLLUP" | "ROUTINE" | "ROUTINES" | "ROW" | "ROWS" | "RULE" | "SAVEPOINT" | "SCHEMA" | "SCHEMAS" | "SCROLL" | "SEARCH" | "SECOND_P" | "SECURITY" | "SELECT" | "SEQUENCE" | "SEQUENCES" | "SERIALIZABLE" | "SERVER" | "SESSION" | "SESSION_USER" | "SET" | "SETS" | "SETOF" | "SHARE" | "SHOW" | "SIMILAR" | "SIMPLE" | "SKIP" | "SMALLINT" | "SNAPSHOT" | "SOME" | "SQL_P" | "STABLE" | "STANDALONE_P" | "START" | "STATEMENT" | "STATISTICS" | "STDIN" | "STDOUT" | "STORAGE" | "STORED" | "STRICT_P" | "STRIP_P" | "SUBSCRIPTION" | "SUBSTRING" | "SUPPORT" | "SYMMETRIC" | "SYSID" | "SYSTEM_P" | "TABLE" | "TABLES" | "TABLESAMPLE" | "TABLESPACE" | "TEMP" | "TEMPLATE" | "TEMPORARY" | "TEXT_P" | "THEN" | "TIES" | "TIME" | "TIMESTAMP" | "TO" | "TRAILING" | "TRANSACTION" | "TRANSFORM" | "TREAT" | "TRIGGER" | "TRIM" | "TRUE_P" | "TRUNCATE" | "TRUSTED" | "TYPE_P" | "TYPES_P" | "UESCAPE" | "UNBOUNDED" | "UNCOMMITTED" | "UNENCRYPTED" | "UNION" | "UNIQUE" | "UNKNOWN" | "UNLISTEN" | "UNLOGGED" | "UNTIL" | "UPDATE" | "USER" | "USING" | "VACUUM" | "VALID" | "VALIDATE" | "VALIDATOR" | "VALUE_P" | "VALUES" | "VARCHAR" | "VARIADIC" | "VARYING" | "VERBOSE" | "VERSION_P" | "VIEW" | "VIEWS" | "VOLATILE" | "WHEN" | "WHERE" | "WHITESPACE_P" | "WINDOW" | "WITH" | "WITHIN" | "WITHOUT" | "WORK" | "WRAPPER" | "WRITE" | "XML_P" | "XMLATTRIBUTES" | "XMLCONCAT" | "XMLELEMENT" | "XMLEXISTS" | "XMLFOREST" | "XMLNAMESPACES" | "XMLPARSE" | "XMLPI" | "XMLROOT" | "XMLSERIALIZE" | "XMLTABLE" | "YEAR_P" | "YES_P" | "ZONE" | "NOT_LA" | "NULLS_LA" | "WITH_LA" | "UMINUS" | "NO_KEYWORD" | "UNRESERVED_KEYWORD" | "COL_NAME_KEYWORD" | "TYPE_FUNC_NAME_KEYWORD" | "RESERVED_KEYWORD" | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | "AEXPR_OF" | "AEXPR_PAREN" | "CREATE_TABLE_LIKE_COMMENTS" | "CREATE_TABLE_LIKE_CONSTRAINTS" | "CREATE_TABLE_LIKE_DEFAULTS" | "CREATE_TABLE_LIKE_GENERATED" | "CREATE_TABLE_LIKE_IDENTITY" | "CREATE_TABLE_LIKE_INDEXES" | "CREATE_TABLE_LIKE_STATISTICS" | "CREATE_TABLE_LIKE_STORAGE" | "CREATE_TABLE_LIKE_ALL" | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63 | 64 | 65 | 66 | "AT_AddColumnRecurse" | "AT_DropColumnRecurse" | "AT_AddConstraintRecurse" | "AT_ValidateConstraintRecurse" | "AT_DropConstraintRecurse" | "CLUOPT_RECHECK" | "CLUOPT_VERBOSE" | "ALTER_SUBSCRIPTION_PUBLICATION" | "AGG_PLAIN" | "AGG_SORTED" | "AGG_HASHED" | "AGG_MIXED" | "SETOPCMD_INTERSECT" | "SETOPCMD_INTERSECT_ALL" | "SETOPCMD_EXCEPT" | "SETOPCMD_EXCEPT_ALL" | "SETOP_SORTED" | "SETOP_HASHED" | "LockTupleKeyShare" | "LockTupleShare" | "LockTupleNoKeyExclusive" | "LockTupleExclusive" | 91 | 92 | 93 | 94 | 258 | 259 | 260 | 261 | 262 | 263 | 264 | 265 | 266 | 267 | 268 | 269 | 270 | 271 | 272 | 273 | 274 | 275 | 276 | 277 | 278 | 279 | 280 | 281 | 282 | 283 | 284 | 285 | 286 | 287 | 288 | 289 | 290 | 291 | 292 | 293 | 294 | 295 | 296 | 297 | 298 | 299 | 300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308 | 309 | 310 | 311 | 312 | 313 | 314 | 315 | 316 | 317 | 318 | 319 | 320 | 321 | 322 | 323 | 324 | 325 | 326 | 327 | 328 | 329 | 330 | 331 | 332 | 333 | 334 | 335 | 336 | 337 | 338 | 339 | 340 | 341 | 342 | 343 | 344 | 345 | 346 | 347 | 348 | 349 | 350 | 351 | 352 | 353 | 354 | 355 | 356 | 357 | 358 | 359 | 360 | 361 | 362 | 363 | 364 | 365 | 366 | 367 | 368 | 369 | 370 | 371 | 372 | 373 | 374 | 375 | 376 | 377 | 378 | 379 | 380 | 381 | 382 | 383 | 384 | 385 | 386 | 387 | 388 | 389 | 390 | 391 | 392 | 393 | 394 | 395 | 396 | 397 | 398 | 399 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 419 | 420 | 421 | 422 | 423 | 424 | 425 | 426 | 427 | 428 | 429 | 430 | 431 | 432 | 433 | 434 | 435 | 436 | 437 | 438 | 439 | 440 | 441 | 442 | 443 | 444 | 445 | 446 | 447 | 448 | 449 | 450 | 451 | 452 | 453 | 454 | 455 | 456 | 457 | 458 | 459 | 460 | 461 | 462 | 463 | 464 | 465 | 466 | 467 | 468 | 469 | 470 | 471 | 472 | 473 | 474 | 475 | 476 | 477 | 478 | 479 | 480 | 481 | 482 | 483 | 484 | 485 | 486 | 487 | 488 | 489 | 490 | 491 | 492 | 493 | 494 | 495 | 496 | 497 | 498 | 499 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 509 | 510 | 511 | 512 | 513 | 514 | 515 | 516 | 517 | 518 | 519 | 520 | 521 | 522 | 523 | 524 | 525 | 526 | 527 | 528 | 529 | 530 | 531 | 532 | 533 | 534 | 535 | 536 | 537 | 538 | 539 | 540 | 541 | 542 | 543 | 544 | 545 | 546 | 547 | 548 | 549 | 550 | 551 | 552 | 553 | 554 | 555 | 556 | 557 | 558 | 559 | 560 | 561 | 562 | 563 | 564 | 565 | 566 | 567 | 568 | 569 | 570 | 571 | 572 | 573 | 574 | 575 | 576 | 577 | 578 | 579 | 580 | 581 | 582 | 583 | 584 | 585 | 586 | 587 | 588 | 589 | 590 | 591 | 592 | 593 | 594 | 595 | 596 | 597 | 598 | 599 | 600 | 601 | 602 | 603 | 604 | 605 | 606 | 607 | 608 | 609 | 610 | 611 | 612 | 613 | 614 | 615 | 616 | 617 | 618 | 619 | 620 | 621 | 622 | 623 | 624 | 625 | 626 | 627 | 628 | 629 | 630 | 631 | 632 | 633 | 634 | 635 | 636 | 637 | 638 | 639 | 640 | 641 | 642 | 643 | 644 | 645 | 646 | 647 | 648 | 649 | 650 | 651 | 652 | 653 | 654 | 655 | 656 | 657 | 658 | 659 | 660 | 661 | 662 | 663 | 664 | 665 | 666 | 667 | 668 | 669 | 670 | 671 | 672 | 673 | 674 | 675 | 676 | 677 | 678 | 679 | 680 | 681 | 682 | 683 | 684 | 685 | 686 | 687 | 688 | 689 | 690 | 691 | 692 | 693 | 694 | 695 | 696 | 697 | 698 | 699 | 700 | 701 | 702 | 703 | 704 | 705 | 706 | 707 | 708 | 709 | 710 | 711 | 712 | 713 | 714 | 715 | 716 | 717 | 718 | 719 | 720 | 721 | 722 | 723 | 724 | 725 | 726 | 727 | 728 | 729 | 730 | 731 | "POSTFIXOP";
