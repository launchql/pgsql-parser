/**
* This file was automatically generated by pg-proto-parser@1.20.0.
* DO NOT MODIFY IT BY HAND. Instead, modify the source proto file,
* and run the pg-proto-parser generate command to regenerate this file.
*/
export type OverridingKind = "OVERRIDING_NOT_SET" | "OVERRIDING_USER_VALUE" | "OVERRIDING_SYSTEM_VALUE";
export type QuerySource = "QSRC_ORIGINAL" | "QSRC_PARSER" | "QSRC_INSTEAD_RULE" | "QSRC_QUAL_INSTEAD_RULE" | "QSRC_NON_INSTEAD_RULE";
export type SortByDir = "SORTBY_DEFAULT" | "SORTBY_ASC" | "SORTBY_DESC" | "SORTBY_USING";
export type SortByNulls = "SORTBY_NULLS_DEFAULT" | "SORTBY_NULLS_FIRST" | "SORTBY_NULLS_LAST";
export type A_Expr_Kind = "AEXPR_OP" | "AEXPR_OP_ANY" | "AEXPR_OP_ALL" | "AEXPR_DISTINCT" | "AEXPR_NOT_DISTINCT" | "AEXPR_NULLIF" | "AEXPR_OF" | "AEXPR_IN" | "AEXPR_LIKE" | "AEXPR_ILIKE" | "AEXPR_SIMILAR" | "AEXPR_BETWEEN" | "AEXPR_NOT_BETWEEN" | "AEXPR_BETWEEN_SYM" | "AEXPR_NOT_BETWEEN_SYM" | "AEXPR_PAREN";
export type RoleSpecType = "ROLESPEC_CSTRING" | "ROLESPEC_CURRENT_USER" | "ROLESPEC_SESSION_USER" | "ROLESPEC_PUBLIC";
export type TableLikeOption = "CREATE_TABLE_LIKE_COMMENTS" | "CREATE_TABLE_LIKE_CONSTRAINTS" | "CREATE_TABLE_LIKE_DEFAULTS" | "CREATE_TABLE_LIKE_GENERATED" | "CREATE_TABLE_LIKE_IDENTITY" | "CREATE_TABLE_LIKE_INDEXES" | "CREATE_TABLE_LIKE_STATISTICS" | "CREATE_TABLE_LIKE_STORAGE" | "CREATE_TABLE_LIKE_ALL";
export type DefElemAction = "DEFELEM_UNSPEC" | "DEFELEM_SET" | "DEFELEM_ADD" | "DEFELEM_DROP";
export type PartitionRangeDatumKind = "PARTITION_RANGE_DATUM_MINVALUE" | "PARTITION_RANGE_DATUM_VALUE" | "PARTITION_RANGE_DATUM_MAXVALUE";
export type RTEKind = "RTE_RELATION" | "RTE_SUBQUERY" | "RTE_JOIN" | "RTE_FUNCTION" | "RTE_TABLEFUNC" | "RTE_VALUES" | "RTE_CTE" | "RTE_NAMEDTUPLESTORE" | "RTE_RESULT";
export type WCOKind = "WCO_VIEW_CHECK" | "WCO_RLS_INSERT_CHECK" | "WCO_RLS_UPDATE_CHECK" | "WCO_RLS_CONFLICT_CHECK";
export type GroupingSetKind = "GROUPING_SET_EMPTY" | "GROUPING_SET_SIMPLE" | "GROUPING_SET_ROLLUP" | "GROUPING_SET_CUBE" | "GROUPING_SET_SETS";
export type CTEMaterialize = "CTEMaterializeDefault" | "CTEMaterializeAlways" | "CTEMaterializeNever";
export type SetOperation = "SETOP_NONE" | "SETOP_UNION" | "SETOP_INTERSECT" | "SETOP_EXCEPT";
export type ObjectType = "OBJECT_ACCESS_METHOD" | "OBJECT_AGGREGATE" | "OBJECT_AMOP" | "OBJECT_AMPROC" | "OBJECT_ATTRIBUTE" | "OBJECT_CAST" | "OBJECT_COLUMN" | "OBJECT_COLLATION" | "OBJECT_CONVERSION" | "OBJECT_DATABASE" | "OBJECT_DEFAULT" | "OBJECT_DEFACL" | "OBJECT_DOMAIN" | "OBJECT_DOMCONSTRAINT" | "OBJECT_EVENT_TRIGGER" | "OBJECT_EXTENSION" | "OBJECT_FDW" | "OBJECT_FOREIGN_SERVER" | "OBJECT_FOREIGN_TABLE" | "OBJECT_FUNCTION" | "OBJECT_INDEX" | "OBJECT_LANGUAGE" | "OBJECT_LARGEOBJECT" | "OBJECT_MATVIEW" | "OBJECT_OPCLASS" | "OBJECT_OPERATOR" | "OBJECT_OPFAMILY" | "OBJECT_POLICY" | "OBJECT_PROCEDURE" | "OBJECT_PUBLICATION" | "OBJECT_PUBLICATION_REL" | "OBJECT_ROLE" | "OBJECT_ROUTINE" | "OBJECT_RULE" | "OBJECT_SCHEMA" | "OBJECT_SEQUENCE" | "OBJECT_SUBSCRIPTION" | "OBJECT_STATISTIC_EXT" | "OBJECT_TABCONSTRAINT" | "OBJECT_TABLE" | "OBJECT_TABLESPACE" | "OBJECT_TRANSFORM" | "OBJECT_TRIGGER" | "OBJECT_TSCONFIGURATION" | "OBJECT_TSDICTIONARY" | "OBJECT_TSPARSER" | "OBJECT_TSTEMPLATE" | "OBJECT_TYPE" | "OBJECT_USER_MAPPING" | "OBJECT_VIEW";
export type DropBehavior = "DROP_RESTRICT" | "DROP_CASCADE";
export type AlterTableType = "AT_AddColumn" | "AT_AddColumnRecurse" | "AT_AddColumnToView" | "AT_ColumnDefault" | "AT_CookedColumnDefault" | "AT_DropNotNull" | "AT_SetNotNull" | "AT_DropExpression" | "AT_CheckNotNull" | "AT_SetStatistics" | "AT_SetOptions" | "AT_ResetOptions" | "AT_SetStorage" | "AT_DropColumn" | "AT_DropColumnRecurse" | "AT_AddIndex" | "AT_ReAddIndex" | "AT_AddConstraint" | "AT_AddConstraintRecurse" | "AT_ReAddConstraint" | "AT_ReAddDomainConstraint" | "AT_AlterConstraint" | "AT_ValidateConstraint" | "AT_ValidateConstraintRecurse" | "AT_AddIndexConstraint" | "AT_DropConstraint" | "AT_DropConstraintRecurse" | "AT_ReAddComment" | "AT_AlterColumnType" | "AT_AlterColumnGenericOptions" | "AT_ChangeOwner" | "AT_ClusterOn" | "AT_DropCluster" | "AT_SetLogged" | "AT_SetUnLogged" | "AT_DropOids" | "AT_SetTableSpace" | "AT_SetRelOptions" | "AT_ResetRelOptions" | "AT_ReplaceRelOptions" | "AT_EnableTrig" | "AT_EnableAlwaysTrig" | "AT_EnableReplicaTrig" | "AT_DisableTrig" | "AT_EnableTrigAll" | "AT_DisableTrigAll" | "AT_EnableTrigUser" | "AT_DisableTrigUser" | "AT_EnableRule" | "AT_EnableAlwaysRule" | "AT_EnableReplicaRule" | "AT_DisableRule" | "AT_AddInherit" | "AT_DropInherit" | "AT_AddOf" | "AT_DropOf" | "AT_ReplicaIdentity" | "AT_EnableRowSecurity" | "AT_DisableRowSecurity" | "AT_ForceRowSecurity" | "AT_NoForceRowSecurity" | "AT_GenericOptions" | "AT_AttachPartition" | "AT_DetachPartition" | "AT_AddIdentity" | "AT_SetIdentity" | "AT_DropIdentity";
export type GrantTargetType = "ACL_TARGET_OBJECT" | "ACL_TARGET_ALL_IN_SCHEMA" | "ACL_TARGET_DEFAULTS";
export type VariableSetKind = "VAR_SET_VALUE" | "VAR_SET_DEFAULT" | "VAR_SET_CURRENT" | "VAR_SET_MULTI" | "VAR_RESET" | "VAR_RESET_ALL";
export type ConstrType = "CONSTR_NULL" | "CONSTR_NOTNULL" | "CONSTR_DEFAULT" | "CONSTR_IDENTITY" | "CONSTR_GENERATED" | "CONSTR_CHECK" | "CONSTR_PRIMARY" | "CONSTR_UNIQUE" | "CONSTR_EXCLUSION" | "CONSTR_FOREIGN" | "CONSTR_ATTR_DEFERRABLE" | "CONSTR_ATTR_NOT_DEFERRABLE" | "CONSTR_ATTR_DEFERRED" | "CONSTR_ATTR_IMMEDIATE";
export type ImportForeignSchemaType = "FDW_IMPORT_SCHEMA_ALL" | "FDW_IMPORT_SCHEMA_LIMIT_TO" | "FDW_IMPORT_SCHEMA_EXCEPT";
export type RoleStmtType = "ROLESTMT_ROLE" | "ROLESTMT_USER" | "ROLESTMT_GROUP";
export type FetchDirection = "FETCH_FORWARD" | "FETCH_BACKWARD" | "FETCH_ABSOLUTE" | "FETCH_RELATIVE";
export type FunctionParameterMode = "FUNC_PARAM_IN" | "FUNC_PARAM_OUT" | "FUNC_PARAM_INOUT" | "FUNC_PARAM_VARIADIC" | "FUNC_PARAM_TABLE";
export type TransactionStmtKind = "TRANS_STMT_BEGIN" | "TRANS_STMT_START" | "TRANS_STMT_COMMIT" | "TRANS_STMT_ROLLBACK" | "TRANS_STMT_SAVEPOINT" | "TRANS_STMT_RELEASE" | "TRANS_STMT_ROLLBACK_TO" | "TRANS_STMT_PREPARE" | "TRANS_STMT_COMMIT_PREPARED" | "TRANS_STMT_ROLLBACK_PREPARED";
export type ViewCheckOption = "NO_CHECK_OPTION" | "LOCAL_CHECK_OPTION" | "CASCADED_CHECK_OPTION";
export type ClusterOption = "CLUOPT_RECHECK" | "CLUOPT_VERBOSE";
export type DiscardMode = "DISCARD_ALL" | "DISCARD_PLANS" | "DISCARD_SEQUENCES" | "DISCARD_TEMP";
export type ReindexObjectType = "REINDEX_OBJECT_INDEX" | "REINDEX_OBJECT_TABLE" | "REINDEX_OBJECT_SCHEMA" | "REINDEX_OBJECT_SYSTEM" | "REINDEX_OBJECT_DATABASE";
export type AlterTSConfigType = "ALTER_TSCONFIG_ADD_MAPPING" | "ALTER_TSCONFIG_ALTER_MAPPING_FOR_TOKEN" | "ALTER_TSCONFIG_REPLACE_DICT" | "ALTER_TSCONFIG_REPLACE_DICT_FOR_TOKEN" | "ALTER_TSCONFIG_DROP_MAPPING";
export type AlterSubscriptionType = "ALTER_SUBSCRIPTION_OPTIONS" | "ALTER_SUBSCRIPTION_CONNECTION" | "ALTER_SUBSCRIPTION_PUBLICATION" | "ALTER_SUBSCRIPTION_REFRESH" | "ALTER_SUBSCRIPTION_ENABLED";
export type OnCommitAction = "ONCOMMIT_NOOP" | "ONCOMMIT_PRESERVE_ROWS" | "ONCOMMIT_DELETE_ROWS" | "ONCOMMIT_DROP";
export type ParamKind = "PARAM_EXTERN" | "PARAM_EXEC" | "PARAM_SUBLINK" | "PARAM_MULTIEXPR";
export type CoercionContext = "COERCION_IMPLICIT" | "COERCION_ASSIGNMENT" | "COERCION_EXPLICIT";
export type CoercionForm = "COERCE_EXPLICIT_CALL" | "COERCE_EXPLICIT_CAST" | "COERCE_IMPLICIT_CAST";
export type BoolExprType = "AND_EXPR" | "OR_EXPR" | "NOT_EXPR";
export type SubLinkType = "EXISTS_SUBLINK" | "ALL_SUBLINK" | "ANY_SUBLINK" | "ROWCOMPARE_SUBLINK" | "EXPR_SUBLINK" | "MULTIEXPR_SUBLINK" | "ARRAY_SUBLINK" | "CTE_SUBLINK";
export type RowCompareType = "ROWCOMPARE_LT" | "ROWCOMPARE_LE" | "ROWCOMPARE_EQ" | "ROWCOMPARE_GE" | "ROWCOMPARE_GT" | "ROWCOMPARE_NE";
export type MinMaxOp = "IS_GREATEST" | "IS_LEAST";
export type SQLValueFunctionOp = "SVFOP_CURRENT_DATE" | "SVFOP_CURRENT_TIME" | "SVFOP_CURRENT_TIME_N" | "SVFOP_CURRENT_TIMESTAMP" | "SVFOP_CURRENT_TIMESTAMP_N" | "SVFOP_LOCALTIME" | "SVFOP_LOCALTIME_N" | "SVFOP_LOCALTIMESTAMP" | "SVFOP_LOCALTIMESTAMP_N" | "SVFOP_CURRENT_ROLE" | "SVFOP_CURRENT_USER" | "SVFOP_USER" | "SVFOP_SESSION_USER" | "SVFOP_CURRENT_CATALOG" | "SVFOP_CURRENT_SCHEMA";
export type XmlExprOp = "IS_XMLCONCAT" | "IS_XMLELEMENT" | "IS_XMLFOREST" | "IS_XMLPARSE" | "IS_XMLPI" | "IS_XMLROOT" | "IS_XMLSERIALIZE" | "IS_DOCUMENT";
export type XmlOptionType = "XMLOPTION_DOCUMENT" | "XMLOPTION_CONTENT";
export type NullTestType = "IS_NULL" | "IS_NOT_NULL";
export type BoolTestType = "IS_TRUE" | "IS_NOT_TRUE" | "IS_FALSE" | "IS_NOT_FALSE" | "IS_UNKNOWN" | "IS_NOT_UNKNOWN";
export type CmdType = "CMD_UNKNOWN" | "CMD_SELECT" | "CMD_UPDATE" | "CMD_INSERT" | "CMD_DELETE" | "CMD_UTILITY" | "CMD_NOTHING";
export type JoinType = "JOIN_INNER" | "JOIN_LEFT" | "JOIN_FULL" | "JOIN_RIGHT" | "JOIN_SEMI" | "JOIN_ANTI" | "JOIN_UNIQUE_OUTER" | "JOIN_UNIQUE_INNER";
export type AggStrategy = "AGG_PLAIN" | "AGG_SORTED" | "AGG_HASHED" | "AGG_MIXED";
export type AggSplit = "AGGSPLIT_SIMPLE" | "AGGSPLIT_INITIAL_SERIAL" | "AGGSPLIT_FINAL_DESERIAL";
export type SetOpCmd = "SETOPCMD_INTERSECT" | "SETOPCMD_INTERSECT_ALL" | "SETOPCMD_EXCEPT" | "SETOPCMD_EXCEPT_ALL";
export type SetOpStrategy = "SETOP_SORTED" | "SETOP_HASHED";
export type OnConflictAction = "ONCONFLICT_NONE" | "ONCONFLICT_NOTHING" | "ONCONFLICT_UPDATE";
export type LimitOption = "LIMIT_OPTION_DEFAULT" | "LIMIT_OPTION_COUNT" | "LIMIT_OPTION_WITH_TIES";
export type LockClauseStrength = "LCS_NONE" | "LCS_FORKEYSHARE" | "LCS_FORSHARE" | "LCS_FORNOKEYUPDATE" | "LCS_FORUPDATE";
export type LockWaitPolicy = "LockWaitBlock" | "LockWaitSkip" | "LockWaitError";
export type LockTupleMode = "LockTupleKeyShare" | "LockTupleShare" | "LockTupleNoKeyExclusive" | "LockTupleExclusive";
export type KeywordKind = "NO_KEYWORD" | "UNRESERVED_KEYWORD" | "COL_NAME_KEYWORD" | "TYPE_FUNC_NAME_KEYWORD" | "RESERVED_KEYWORD";
export type Token = "NUL" | "ASCII_37" | "ASCII_40" | "ASCII_41" | "ASCII_42" | "ASCII_43" | "ASCII_44" | "ASCII_45" | "ASCII_46" | "ASCII_47" | "ASCII_58" | "ASCII_59" | "ASCII_60" | "ASCII_61" | "ASCII_62" | "ASCII_63" | "ASCII_91" | "ASCII_92" | "ASCII_93" | "ASCII_94" | "IDENT" | "UIDENT" | "FCONST" | "SCONST" | "USCONST" | "BCONST" | "XCONST" | "Op" | "ICONST" | "PARAM" | "TYPECAST" | "DOT_DOT" | "COLON_EQUALS" | "EQUALS_GREATER" | "LESS_EQUALS" | "GREATER_EQUALS" | "NOT_EQUALS" | "SQL_COMMENT" | "C_COMMENT" | "ABORT_P" | "ABSOLUTE_P" | "ACCESS" | "ACTION" | "ADD_P" | "ADMIN" | "AFTER" | "AGGREGATE" | "ALL" | "ALSO" | "ALTER" | "ALWAYS" | "ANALYSE" | "ANALYZE" | "AND" | "ANY" | "ARRAY" | "AS" | "ASC" | "ASSERTION" | "ASSIGNMENT" | "ASYMMETRIC" | "AT" | "ATTACH" | "ATTRIBUTE" | "AUTHORIZATION" | "BACKWARD" | "BEFORE" | "BEGIN_P" | "BETWEEN" | "BIGINT" | "BINARY" | "BIT" | "BOOLEAN_P" | "BOTH" | "BY" | "CACHE" | "CALL" | "CALLED" | "CASCADE" | "CASCADED" | "CASE" | "CAST" | "CATALOG_P" | "CHAIN" | "CHAR_P" | "CHARACTER" | "CHARACTERISTICS" | "CHECK" | "CHECKPOINT" | "CLASS" | "CLOSE" | "CLUSTER" | "COALESCE" | "COLLATE" | "COLLATION" | "COLUMN" | "COLUMNS" | "COMMENT" | "COMMENTS" | "COMMIT" | "COMMITTED" | "CONCURRENTLY" | "CONFIGURATION" | "CONFLICT" | "CONNECTION" | "CONSTRAINT" | "CONSTRAINTS" | "CONTENT_P" | "CONTINUE_P" | "CONVERSION_P" | "COPY" | "COST" | "CREATE" | "CROSS" | "CSV" | "CUBE" | "CURRENT_P" | "CURRENT_CATALOG" | "CURRENT_DATE" | "CURRENT_ROLE" | "CURRENT_SCHEMA" | "CURRENT_TIME" | "CURRENT_TIMESTAMP" | "CURRENT_USER" | "CURSOR" | "CYCLE" | "DATA_P" | "DATABASE" | "DAY_P" | "DEALLOCATE" | "DEC" | "DECIMAL_P" | "DECLARE" | "DEFAULT" | "DEFAULTS" | "DEFERRABLE" | "DEFERRED" | "DEFINER" | "DELETE_P" | "DELIMITER" | "DELIMITERS" | "DEPENDS" | "DESC" | "DETACH" | "DICTIONARY" | "DISABLE_P" | "DISCARD" | "DISTINCT" | "DO" | "DOCUMENT_P" | "DOMAIN_P" | "DOUBLE_P" | "DROP" | "EACH" | "ELSE" | "ENABLE_P" | "ENCODING" | "ENCRYPTED" | "END_P" | "ENUM_P" | "ESCAPE" | "EVENT" | "EXCEPT" | "EXCLUDE" | "EXCLUDING" | "EXCLUSIVE" | "EXECUTE" | "EXISTS" | "EXPLAIN" | "EXPRESSION" | "EXTENSION" | "EXTERNAL" | "EXTRACT" | "FALSE_P" | "FAMILY" | "FETCH" | "FILTER" | "FIRST_P" | "FLOAT_P" | "FOLLOWING" | "FOR" | "FORCE" | "FOREIGN" | "FORWARD" | "FREEZE" | "FROM" | "FULL" | "FUNCTION" | "FUNCTIONS" | "GENERATED" | "GLOBAL" | "GRANT" | "GRANTED" | "GREATEST" | "GROUP_P" | "GROUPING" | "GROUPS" | "HANDLER" | "HAVING" | "HEADER_P" | "HOLD" | "HOUR_P" | "IDENTITY_P" | "IF_P" | "ILIKE" | "IMMEDIATE" | "IMMUTABLE" | "IMPLICIT_P" | "IMPORT_P" | "IN_P" | "INCLUDE" | "INCLUDING" | "INCREMENT" | "INDEX" | "INDEXES" | "INHERIT" | "INHERITS" | "INITIALLY" | "INLINE_P" | "INNER_P" | "INOUT" | "INPUT_P" | "INSENSITIVE" | "INSERT" | "INSTEAD" | "INT_P" | "INTEGER" | "INTERSECT" | "INTERVAL" | "INTO" | "INVOKER" | "IS" | "ISNULL" | "ISOLATION" | "JOIN" | "KEY" | "LABEL" | "LANGUAGE" | "LARGE_P" | "LAST_P" | "LATERAL_P" | "LEADING" | "LEAKPROOF" | "LEAST" | "LEFT" | "LEVEL" | "LIKE" | "LIMIT" | "LISTEN" | "LOAD" | "LOCAL" | "LOCALTIME" | "LOCALTIMESTAMP" | "LOCATION" | "LOCK_P" | "LOCKED" | "LOGGED" | "MAPPING" | "MATCH" | "MATERIALIZED" | "MAXVALUE" | "METHOD" | "MINUTE_P" | "MINVALUE" | "MODE" | "MONTH_P" | "MOVE" | "NAME_P" | "NAMES" | "NATIONAL" | "NATURAL" | "NCHAR" | "NEW" | "NEXT" | "NFC" | "NFD" | "NFKC" | "NFKD" | "NO" | "NONE" | "NORMALIZE" | "NORMALIZED" | "NOT" | "NOTHING" | "NOTIFY" | "NOTNULL" | "NOWAIT" | "NULL_P" | "NULLIF" | "NULLS_P" | "NUMERIC" | "OBJECT_P" | "OF" | "OFF" | "OFFSET" | "OIDS" | "OLD" | "ON" | "ONLY" | "OPERATOR" | "OPTION" | "OPTIONS" | "OR" | "ORDER" | "ORDINALITY" | "OTHERS" | "OUT_P" | "OUTER_P" | "OVER" | "OVERLAPS" | "OVERLAY" | "OVERRIDING" | "OWNED" | "OWNER" | "PARALLEL" | "PARSER" | "PARTIAL" | "PARTITION" | "PASSING" | "PASSWORD" | "PLACING" | "PLANS" | "POLICY" | "POSITION" | "PRECEDING" | "PRECISION" | "PRESERVE" | "PREPARE" | "PREPARED" | "PRIMARY" | "PRIOR" | "PRIVILEGES" | "PROCEDURAL" | "PROCEDURE" | "PROCEDURES" | "PROGRAM" | "PUBLICATION" | "QUOTE" | "RANGE" | "READ" | "REAL" | "REASSIGN" | "RECHECK" | "RECURSIVE" | "REF_P" | "REFERENCES" | "REFERENCING" | "REFRESH" | "REINDEX" | "RELATIVE_P" | "RELEASE" | "RENAME" | "REPEATABLE" | "REPLACE" | "REPLICA" | "RESET" | "RESTART" | "RESTRICT" | "RETURNING" | "RETURNS" | "REVOKE" | "RIGHT" | "ROLE" | "ROLLBACK" | "ROLLUP" | "ROUTINE" | "ROUTINES" | "ROW" | "ROWS" | "RULE" | "SAVEPOINT" | "SCHEMA" | "SCHEMAS" | "SCROLL" | "SEARCH" | "SECOND_P" | "SECURITY" | "SELECT" | "SEQUENCE" | "SEQUENCES" | "SERIALIZABLE" | "SERVER" | "SESSION" | "SESSION_USER" | "SET" | "SETS" | "SETOF" | "SHARE" | "SHOW" | "SIMILAR" | "SIMPLE" | "SKIP" | "SMALLINT" | "SNAPSHOT" | "SOME" | "SQL_P" | "STABLE" | "STANDALONE_P" | "START" | "STATEMENT" | "STATISTICS" | "STDIN" | "STDOUT" | "STORAGE" | "STORED" | "STRICT_P" | "STRIP_P" | "SUBSCRIPTION" | "SUBSTRING" | "SUPPORT" | "SYMMETRIC" | "SYSID" | "SYSTEM_P" | "TABLE" | "TABLES" | "TABLESAMPLE" | "TABLESPACE" | "TEMP" | "TEMPLATE" | "TEMPORARY" | "TEXT_P" | "THEN" | "TIES" | "TIME" | "TIMESTAMP" | "TO" | "TRAILING" | "TRANSACTION" | "TRANSFORM" | "TREAT" | "TRIGGER" | "TRIM" | "TRUE_P" | "TRUNCATE" | "TRUSTED" | "TYPE_P" | "TYPES_P" | "UESCAPE" | "UNBOUNDED" | "UNCOMMITTED" | "UNENCRYPTED" | "UNION" | "UNIQUE" | "UNKNOWN" | "UNLISTEN" | "UNLOGGED" | "UNTIL" | "UPDATE" | "USER" | "USING" | "VACUUM" | "VALID" | "VALIDATE" | "VALIDATOR" | "VALUE_P" | "VALUES" | "VARCHAR" | "VARIADIC" | "VARYING" | "VERBOSE" | "VERSION_P" | "VIEW" | "VIEWS" | "VOLATILE" | "WHEN" | "WHERE" | "WHITESPACE_P" | "WINDOW" | "WITH" | "WITHIN" | "WITHOUT" | "WORK" | "WRAPPER" | "WRITE" | "XML_P" | "XMLATTRIBUTES" | "XMLCONCAT" | "XMLELEMENT" | "XMLEXISTS" | "XMLFOREST" | "XMLNAMESPACES" | "XMLPARSE" | "XMLPI" | "XMLROOT" | "XMLSERIALIZE" | "XMLTABLE" | "YEAR_P" | "YES_P" | "ZONE" | "NOT_LA" | "NULLS_LA" | "WITH_LA" | "POSTFIXOP" | "UMINUS";
