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
export interface ParseResult {
  version?: number;
  stmts?: RawStmt[];
}
export interface ScanResult {
  version?: number;
  tokens?: ScanToken[];
}
export interface Node {
  Alias?: Alias;
  RangeVar?: RangeVar;
  TableFunc?: TableFunc;
  Expr?: Expr;
  Var?: Var;
  Param?: Param;
  Aggref?: Aggref;
  GroupingFunc?: GroupingFunc;
  WindowFunc?: WindowFunc;
  SubscriptingRef?: SubscriptingRef;
  FuncExpr?: FuncExpr;
  NamedArgExpr?: NamedArgExpr;
  OpExpr?: OpExpr;
  DistinctExpr?: DistinctExpr;
  NullIfExpr?: NullIfExpr;
  ScalarArrayOpExpr?: ScalarArrayOpExpr;
  BoolExpr?: BoolExpr;
  SubLink?: SubLink;
  SubPlan?: SubPlan;
  AlternativeSubPlan?: AlternativeSubPlan;
  FieldSelect?: FieldSelect;
  FieldStore?: FieldStore;
  RelabelType?: RelabelType;
  CoerceViaIO?: CoerceViaIO;
  ArrayCoerceExpr?: ArrayCoerceExpr;
  ConvertRowtypeExpr?: ConvertRowtypeExpr;
  CollateExpr?: CollateExpr;
  CaseExpr?: CaseExpr;
  CaseWhen?: CaseWhen;
  CaseTestExpr?: CaseTestExpr;
  ArrayExpr?: ArrayExpr;
  RowExpr?: RowExpr;
  RowCompareExpr?: RowCompareExpr;
  CoalesceExpr?: CoalesceExpr;
  MinMaxExpr?: MinMaxExpr;
  SQLValueFunction?: SQLValueFunction;
  XmlExpr?: XmlExpr;
  NullTest?: NullTest;
  BooleanTest?: BooleanTest;
  CoerceToDomain?: CoerceToDomain;
  CoerceToDomainValue?: CoerceToDomainValue;
  SetToDefault?: SetToDefault;
  CurrentOfExpr?: CurrentOfExpr;
  NextValueExpr?: NextValueExpr;
  InferenceElem?: InferenceElem;
  TargetEntry?: TargetEntry;
  RangeTblRef?: RangeTblRef;
  JoinExpr?: JoinExpr;
  FromExpr?: FromExpr;
  OnConflictExpr?: OnConflictExpr;
  IntoClause?: IntoClause;
  RawStmt?: RawStmt;
  Query?: Query;
  InsertStmt?: InsertStmt;
  DeleteStmt?: DeleteStmt;
  UpdateStmt?: UpdateStmt;
  SelectStmt?: SelectStmt;
  AlterTableStmt?: AlterTableStmt;
  AlterTableCmd?: AlterTableCmd;
  AlterDomainStmt?: AlterDomainStmt;
  SetOperationStmt?: SetOperationStmt;
  GrantStmt?: GrantStmt;
  GrantRoleStmt?: GrantRoleStmt;
  AlterDefaultPrivilegesStmt?: AlterDefaultPrivilegesStmt;
  ClosePortalStmt?: ClosePortalStmt;
  ClusterStmt?: ClusterStmt;
  CopyStmt?: CopyStmt;
  CreateStmt?: CreateStmt;
  DefineStmt?: DefineStmt;
  DropStmt?: DropStmt;
  TruncateStmt?: TruncateStmt;
  CommentStmt?: CommentStmt;
  FetchStmt?: FetchStmt;
  IndexStmt?: IndexStmt;
  CreateFunctionStmt?: CreateFunctionStmt;
  AlterFunctionStmt?: AlterFunctionStmt;
  DoStmt?: DoStmt;
  RenameStmt?: RenameStmt;
  RuleStmt?: RuleStmt;
  NotifyStmt?: NotifyStmt;
  ListenStmt?: ListenStmt;
  UnlistenStmt?: UnlistenStmt;
  TransactionStmt?: TransactionStmt;
  ViewStmt?: ViewStmt;
  LoadStmt?: LoadStmt;
  CreateDomainStmt?: CreateDomainStmt;
  CreatedbStmt?: CreatedbStmt;
  DropdbStmt?: DropdbStmt;
  VacuumStmt?: VacuumStmt;
  ExplainStmt?: ExplainStmt;
  CreateTableAsStmt?: CreateTableAsStmt;
  CreateSeqStmt?: CreateSeqStmt;
  AlterSeqStmt?: AlterSeqStmt;
  VariableSetStmt?: VariableSetStmt;
  VariableShowStmt?: VariableShowStmt;
  DiscardStmt?: DiscardStmt;
  CreateTrigStmt?: CreateTrigStmt;
  CreatePLangStmt?: CreatePLangStmt;
  CreateRoleStmt?: CreateRoleStmt;
  AlterRoleStmt?: AlterRoleStmt;
  DropRoleStmt?: DropRoleStmt;
  LockStmt?: LockStmt;
  ConstraintsSetStmt?: ConstraintsSetStmt;
  ReindexStmt?: ReindexStmt;
  CheckPointStmt?: CheckPointStmt;
  CreateSchemaStmt?: CreateSchemaStmt;
  AlterDatabaseStmt?: AlterDatabaseStmt;
  AlterDatabaseSetStmt?: AlterDatabaseSetStmt;
  AlterRoleSetStmt?: AlterRoleSetStmt;
  CreateConversionStmt?: CreateConversionStmt;
  CreateCastStmt?: CreateCastStmt;
  CreateOpClassStmt?: CreateOpClassStmt;
  CreateOpFamilyStmt?: CreateOpFamilyStmt;
  AlterOpFamilyStmt?: AlterOpFamilyStmt;
  PrepareStmt?: PrepareStmt;
  ExecuteStmt?: ExecuteStmt;
  DeallocateStmt?: DeallocateStmt;
  DeclareCursorStmt?: DeclareCursorStmt;
  CreateTableSpaceStmt?: CreateTableSpaceStmt;
  DropTableSpaceStmt?: DropTableSpaceStmt;
  AlterObjectDependsStmt?: AlterObjectDependsStmt;
  AlterObjectSchemaStmt?: AlterObjectSchemaStmt;
  AlterOwnerStmt?: AlterOwnerStmt;
  AlterOperatorStmt?: AlterOperatorStmt;
  AlterTypeStmt?: AlterTypeStmt;
  DropOwnedStmt?: DropOwnedStmt;
  ReassignOwnedStmt?: ReassignOwnedStmt;
  CompositeTypeStmt?: CompositeTypeStmt;
  CreateEnumStmt?: CreateEnumStmt;
  CreateRangeStmt?: CreateRangeStmt;
  AlterEnumStmt?: AlterEnumStmt;
  AlterTSDictionaryStmt?: AlterTSDictionaryStmt;
  AlterTSConfigurationStmt?: AlterTSConfigurationStmt;
  CreateFdwStmt?: CreateFdwStmt;
  AlterFdwStmt?: AlterFdwStmt;
  CreateForeignServerStmt?: CreateForeignServerStmt;
  AlterForeignServerStmt?: AlterForeignServerStmt;
  CreateUserMappingStmt?: CreateUserMappingStmt;
  AlterUserMappingStmt?: AlterUserMappingStmt;
  DropUserMappingStmt?: DropUserMappingStmt;
  AlterTableSpaceOptionsStmt?: AlterTableSpaceOptionsStmt;
  AlterTableMoveAllStmt?: AlterTableMoveAllStmt;
  SecLabelStmt?: SecLabelStmt;
  CreateForeignTableStmt?: CreateForeignTableStmt;
  ImportForeignSchemaStmt?: ImportForeignSchemaStmt;
  CreateExtensionStmt?: CreateExtensionStmt;
  AlterExtensionStmt?: AlterExtensionStmt;
  AlterExtensionContentsStmt?: AlterExtensionContentsStmt;
  CreateEventTrigStmt?: CreateEventTrigStmt;
  AlterEventTrigStmt?: AlterEventTrigStmt;
  RefreshMatViewStmt?: RefreshMatViewStmt;
  ReplicaIdentityStmt?: ReplicaIdentityStmt;
  AlterSystemStmt?: AlterSystemStmt;
  CreatePolicyStmt?: CreatePolicyStmt;
  AlterPolicyStmt?: AlterPolicyStmt;
  CreateTransformStmt?: CreateTransformStmt;
  CreateAmStmt?: CreateAmStmt;
  CreatePublicationStmt?: CreatePublicationStmt;
  AlterPublicationStmt?: AlterPublicationStmt;
  CreateSubscriptionStmt?: CreateSubscriptionStmt;
  AlterSubscriptionStmt?: AlterSubscriptionStmt;
  DropSubscriptionStmt?: DropSubscriptionStmt;
  CreateStatsStmt?: CreateStatsStmt;
  AlterCollationStmt?: AlterCollationStmt;
  CallStmt?: CallStmt;
  AlterStatsStmt?: AlterStatsStmt;
  A_Expr?: A_Expr;
  ColumnRef?: ColumnRef;
  ParamRef?: ParamRef;
  A_Const?: A_Const;
  FuncCall?: FuncCall;
  A_Star?: A_Star;
  A_Indices?: A_Indices;
  A_Indirection?: A_Indirection;
  A_ArrayExpr?: A_ArrayExpr;
  ResTarget?: ResTarget;
  MultiAssignRef?: MultiAssignRef;
  TypeCast?: TypeCast;
  CollateClause?: CollateClause;
  SortBy?: SortBy;
  WindowDef?: WindowDef;
  RangeSubselect?: RangeSubselect;
  RangeFunction?: RangeFunction;
  RangeTableSample?: RangeTableSample;
  RangeTableFunc?: RangeTableFunc;
  RangeTableFuncCol?: RangeTableFuncCol;
  TypeName?: TypeName;
  ColumnDef?: ColumnDef;
  IndexElem?: IndexElem;
  Constraint?: Constraint;
  DefElem?: DefElem;
  RangeTblEntry?: RangeTblEntry;
  RangeTblFunction?: RangeTblFunction;
  TableSampleClause?: TableSampleClause;
  WithCheckOption?: WithCheckOption;
  SortGroupClause?: SortGroupClause;
  GroupingSet?: GroupingSet;
  WindowClause?: WindowClause;
  ObjectWithArgs?: ObjectWithArgs;
  AccessPriv?: AccessPriv;
  CreateOpClassItem?: CreateOpClassItem;
  TableLikeClause?: TableLikeClause;
  FunctionParameter?: FunctionParameter;
  LockingClause?: LockingClause;
  RowMarkClause?: RowMarkClause;
  XmlSerialize?: XmlSerialize;
  WithClause?: WithClause;
  InferClause?: InferClause;
  OnConflictClause?: OnConflictClause;
  CommonTableExpr?: CommonTableExpr;
  RoleSpec?: RoleSpec;
  TriggerTransition?: TriggerTransition;
  PartitionElem?: PartitionElem;
  PartitionSpec?: PartitionSpec;
  PartitionBoundSpec?: PartitionBoundSpec;
  PartitionRangeDatum?: PartitionRangeDatum;
  PartitionCmd?: PartitionCmd;
  VacuumRelation?: VacuumRelation;
  InlineCodeBlock?: InlineCodeBlock;
  CallContext?: CallContext;
  Integer?: Integer;
  Float?: Float;
  String?: String;
  BitString?: BitString;
  Null?: Null;
  List?: List;
  IntList?: IntList;
  OidList?: OidList;
}
export interface Integer {
  ival?: number;
}
export interface Float {
  str?: string;
}
export interface String {
  str?: string;
}
export interface BitString {
  str?: string;
}
export interface Null {}
export interface List {
  items?: Node[];
}
export interface OidList {
  items?: Node[];
}
export interface IntList {
  items?: Node[];
}
export interface Alias {
  aliasname?: string;
  colnames?: Node[];
}
export interface RangeVar {
  catalogname?: string;
  schemaname?: string;
  relname?: string;
  inh?: boolean;
  relpersistence?: string;
  alias?: Alias;
  location?: number;
}
export interface TableFunc {
  ns_uris?: Node[];
  ns_names?: Node[];
  docexpr?: Node;
  rowexpr?: Node;
  colnames?: Node[];
  coltypes?: Node[];
  coltypmods?: Node[];
  colcollations?: Node[];
  colexprs?: Node[];
  coldefexprs?: Node[];
  notnulls?: bigint[];
  ordinalitycol?: number;
  location?: number;
}
export interface Expr {}
export interface Var {
  xpr?: Node;
  varno?: number;
  varattno?: number;
  vartype?: number;
  vartypmod?: number;
  varcollid?: number;
  varlevelsup?: number;
  varnosyn?: number;
  varattnosyn?: number;
  location?: number;
}
export interface Param {
  xpr?: Node;
  paramkind?: ParamKind;
  paramid?: number;
  paramtype?: number;
  paramtypmod?: number;
  paramcollid?: number;
  location?: number;
}
export interface Aggref {
  xpr?: Node;
  aggfnoid?: number;
  aggtype?: number;
  aggcollid?: number;
  inputcollid?: number;
  aggtranstype?: number;
  aggargtypes?: Node[];
  aggdirectargs?: Node[];
  args?: Node[];
  aggorder?: Node[];
  aggdistinct?: Node[];
  aggfilter?: Node;
  aggstar?: boolean;
  aggvariadic?: boolean;
  aggkind?: string;
  agglevelsup?: number;
  aggsplit?: AggSplit;
  location?: number;
}
export interface GroupingFunc {
  xpr?: Node;
  args?: Node[];
  refs?: Node[];
  cols?: Node[];
  agglevelsup?: number;
  location?: number;
}
export interface WindowFunc {
  xpr?: Node;
  winfnoid?: number;
  wintype?: number;
  wincollid?: number;
  inputcollid?: number;
  args?: Node[];
  aggfilter?: Node;
  winref?: number;
  winstar?: boolean;
  winagg?: boolean;
  location?: number;
}
export interface SubscriptingRef {
  xpr?: Node;
  refcontainertype?: number;
  refelemtype?: number;
  reftypmod?: number;
  refcollid?: number;
  refupperindexpr?: Node[];
  reflowerindexpr?: Node[];
  refexpr?: Node;
  refassgnexpr?: Node;
}
export interface FuncExpr {
  xpr?: Node;
  funcid?: number;
  funcresulttype?: number;
  funcretset?: boolean;
  funcvariadic?: boolean;
  funcformat?: CoercionForm;
  funccollid?: number;
  inputcollid?: number;
  args?: Node[];
  location?: number;
}
export interface NamedArgExpr {
  xpr?: Node;
  arg?: Node;
  name?: string;
  argnumber?: number;
  location?: number;
}
export interface OpExpr {
  xpr?: Node;
  opno?: number;
  opfuncid?: number;
  opresulttype?: number;
  opretset?: boolean;
  opcollid?: number;
  inputcollid?: number;
  args?: Node[];
  location?: number;
}
export interface DistinctExpr {
  xpr?: Node;
  opno?: number;
  opfuncid?: number;
  opresulttype?: number;
  opretset?: boolean;
  opcollid?: number;
  inputcollid?: number;
  args?: Node[];
  location?: number;
}
export interface NullIfExpr {
  xpr?: Node;
  opno?: number;
  opfuncid?: number;
  opresulttype?: number;
  opretset?: boolean;
  opcollid?: number;
  inputcollid?: number;
  args?: Node[];
  location?: number;
}
export interface ScalarArrayOpExpr {
  xpr?: Node;
  opno?: number;
  opfuncid?: number;
  useOr?: boolean;
  inputcollid?: number;
  args?: Node[];
  location?: number;
}
export interface BoolExpr {
  xpr?: Node;
  boolop?: BoolExprType;
  args?: Node[];
  location?: number;
}
export interface SubLink {
  xpr?: Node;
  subLinkType?: SubLinkType;
  subLinkId?: number;
  testexpr?: Node;
  operName?: Node[];
  subselect?: Node;
  location?: number;
}
export interface SubPlan {
  xpr?: Node;
  subLinkType?: SubLinkType;
  testexpr?: Node;
  paramIds?: Node[];
  plan_id?: number;
  plan_name?: string;
  firstColType?: number;
  firstColTypmod?: number;
  firstColCollation?: number;
  useHashTable?: boolean;
  unknownEqFalse?: boolean;
  parallel_safe?: boolean;
  setParam?: Node[];
  parParam?: Node[];
  args?: Node[];
  startup_cost?: number;
  per_call_cost?: number;
}
export interface AlternativeSubPlan {
  xpr?: Node;
  subplans?: Node[];
}
export interface FieldSelect {
  xpr?: Node;
  arg?: Node;
  fieldnum?: number;
  resulttype?: number;
  resulttypmod?: number;
  resultcollid?: number;
}
export interface FieldStore {
  xpr?: Node;
  arg?: Node;
  newvals?: Node[];
  fieldnums?: Node[];
  resulttype?: number;
}
export interface RelabelType {
  xpr?: Node;
  arg?: Node;
  resulttype?: number;
  resulttypmod?: number;
  resultcollid?: number;
  relabelformat?: CoercionForm;
  location?: number;
}
export interface CoerceViaIO {
  xpr?: Node;
  arg?: Node;
  resulttype?: number;
  resultcollid?: number;
  coerceformat?: CoercionForm;
  location?: number;
}
export interface ArrayCoerceExpr {
  xpr?: Node;
  arg?: Node;
  elemexpr?: Node;
  resulttype?: number;
  resulttypmod?: number;
  resultcollid?: number;
  coerceformat?: CoercionForm;
  location?: number;
}
export interface ConvertRowtypeExpr {
  xpr?: Node;
  arg?: Node;
  resulttype?: number;
  convertformat?: CoercionForm;
  location?: number;
}
export interface CollateExpr {
  xpr?: Node;
  arg?: Node;
  collOid?: number;
  location?: number;
}
export interface CaseExpr {
  xpr?: Node;
  casetype?: number;
  casecollid?: number;
  arg?: Node;
  args?: Node[];
  defresult?: Node;
  location?: number;
}
export interface CaseWhen {
  xpr?: Node;
  expr?: Node;
  result?: Node;
  location?: number;
}
export interface CaseTestExpr {
  xpr?: Node;
  typeId?: number;
  typeMod?: number;
  collation?: number;
}
export interface ArrayExpr {
  xpr?: Node;
  array_typeid?: number;
  array_collid?: number;
  element_typeid?: number;
  elements?: Node[];
  multidims?: boolean;
  location?: number;
}
export interface RowExpr {
  xpr?: Node;
  args?: Node[];
  row_typeid?: number;
  row_format?: CoercionForm;
  colnames?: Node[];
  location?: number;
}
export interface RowCompareExpr {
  xpr?: Node;
  rctype?: RowCompareType;
  opnos?: Node[];
  opfamilies?: Node[];
  inputcollids?: Node[];
  largs?: Node[];
  rargs?: Node[];
}
export interface CoalesceExpr {
  xpr?: Node;
  coalescetype?: number;
  coalescecollid?: number;
  args?: Node[];
  location?: number;
}
export interface MinMaxExpr {
  xpr?: Node;
  minmaxtype?: number;
  minmaxcollid?: number;
  inputcollid?: number;
  op?: MinMaxOp;
  args?: Node[];
  location?: number;
}
export interface SQLValueFunction {
  xpr?: Node;
  op?: SQLValueFunctionOp;
  type?: number;
  typmod?: number;
  location?: number;
}
export interface XmlExpr {
  xpr?: Node;
  op?: XmlExprOp;
  name?: string;
  named_args?: Node[];
  arg_names?: Node[];
  args?: Node[];
  xmloption?: XmlOptionType;
  type?: number;
  typmod?: number;
  location?: number;
}
export interface NullTest {
  xpr?: Node;
  arg?: Node;
  nulltesttype?: NullTestType;
  argisrow?: boolean;
  location?: number;
}
export interface BooleanTest {
  xpr?: Node;
  arg?: Node;
  booltesttype?: BoolTestType;
  location?: number;
}
export interface CoerceToDomain {
  xpr?: Node;
  arg?: Node;
  resulttype?: number;
  resulttypmod?: number;
  resultcollid?: number;
  coercionformat?: CoercionForm;
  location?: number;
}
export interface CoerceToDomainValue {
  xpr?: Node;
  typeId?: number;
  typeMod?: number;
  collation?: number;
  location?: number;
}
export interface SetToDefault {
  xpr?: Node;
  typeId?: number;
  typeMod?: number;
  collation?: number;
  location?: number;
}
export interface CurrentOfExpr {
  xpr?: Node;
  cvarno?: number;
  cursor_name?: string;
  cursor_param?: number;
}
export interface NextValueExpr {
  xpr?: Node;
  seqid?: number;
  typeId?: number;
}
export interface InferenceElem {
  xpr?: Node;
  expr?: Node;
  infercollid?: number;
  inferopclass?: number;
}
export interface TargetEntry {
  xpr?: Node;
  expr?: Node;
  resno?: number;
  resname?: string;
  ressortgroupref?: number;
  resorigtbl?: number;
  resorigcol?: number;
  resjunk?: boolean;
}
export interface RangeTblRef {
  rtindex?: number;
}
export interface JoinExpr {
  jointype?: JoinType;
  isNatural?: boolean;
  larg?: Node;
  rarg?: Node;
  usingClause?: Node[];
  quals?: Node;
  alias?: Alias;
  rtindex?: number;
}
export interface FromExpr {
  fromlist?: Node[];
  quals?: Node;
}
export interface OnConflictExpr {
  action?: OnConflictAction;
  arbiterElems?: Node[];
  arbiterWhere?: Node;
  constraint?: number;
  onConflictSet?: Node[];
  onConflictWhere?: Node;
  exclRelIndex?: number;
  exclRelTlist?: Node[];
}
export interface IntoClause {
  rel?: RangeVar;
  colNames?: Node[];
  accessMethod?: string;
  options?: Node[];
  onCommit?: OnCommitAction;
  tableSpaceName?: string;
  viewQuery?: Node;
  skipData?: boolean;
}
export interface RawStmt {
  stmt?: Node;
  stmt_location?: number;
  stmt_len?: number;
}
export interface Query {
  commandType?: CmdType;
  querySource?: QuerySource;
  canSetTag?: boolean;
  utilityStmt?: Node;
  resultRelation?: number;
  hasAggs?: boolean;
  hasWindowFuncs?: boolean;
  hasTargetSRFs?: boolean;
  hasSubLinks?: boolean;
  hasDistinctOn?: boolean;
  hasRecursive?: boolean;
  hasModifyingCTE?: boolean;
  hasForUpdate?: boolean;
  hasRowSecurity?: boolean;
  cteList?: Node[];
  rtable?: Node[];
  jointree?: FromExpr;
  targetList?: Node[];
  override?: OverridingKind;
  onConflict?: OnConflictExpr;
  returningList?: Node[];
  groupClause?: Node[];
  groupingSets?: Node[];
  havingQual?: Node;
  windowClause?: Node[];
  distinctClause?: Node[];
  sortClause?: Node[];
  limitOffset?: Node;
  limitCount?: Node;
  limitOption?: LimitOption;
  rowMarks?: Node[];
  setOperations?: Node;
  constraintDeps?: Node[];
  withCheckOptions?: Node[];
  stmt_location?: number;
  stmt_len?: number;
}
export interface InsertStmt {
  relation?: RangeVar;
  cols?: Node[];
  selectStmt?: Node;
  onConflictClause?: OnConflictClause;
  returningList?: Node[];
  withClause?: WithClause;
  override?: OverridingKind;
}
export interface DeleteStmt {
  relation?: RangeVar;
  usingClause?: Node[];
  whereClause?: Node;
  returningList?: Node[];
  withClause?: WithClause;
}
export interface UpdateStmt {
  relation?: RangeVar;
  targetList?: Node[];
  whereClause?: Node;
  fromClause?: Node[];
  returningList?: Node[];
  withClause?: WithClause;
}
export interface SelectStmt {
  distinctClause?: Node[];
  intoClause?: IntoClause;
  targetList?: Node[];
  fromClause?: Node[];
  whereClause?: Node;
  groupClause?: Node[];
  havingClause?: Node;
  windowClause?: Node[];
  valuesLists?: Node[];
  sortClause?: Node[];
  limitOffset?: Node;
  limitCount?: Node;
  limitOption?: LimitOption;
  lockingClause?: Node[];
  withClause?: WithClause;
  op?: SetOperation;
  all?: boolean;
  larg?: SelectStmt;
  rarg?: SelectStmt;
}
export interface AlterTableStmt {
  relation?: RangeVar;
  cmds?: Node[];
  relkind?: ObjectType;
  missing_ok?: boolean;
}
export interface AlterTableCmd {
  subtype?: AlterTableType;
  name?: string;
  num?: number;
  newowner?: RoleSpec;
  def?: Node;
  behavior?: DropBehavior;
  missing_ok?: boolean;
  recurse?: boolean;
}
export interface AlterDomainStmt {
  subtype?: string;
  typeName?: Node[];
  name?: string;
  def?: Node;
  behavior?: DropBehavior;
  missing_ok?: boolean;
}
export interface SetOperationStmt {
  op?: SetOperation;
  all?: boolean;
  larg?: Node;
  rarg?: Node;
  colTypes?: Node[];
  colTypmods?: Node[];
  colCollations?: Node[];
  groupClauses?: Node[];
}
export interface GrantStmt {
  is_grant?: boolean;
  targtype?: GrantTargetType;
  objtype?: ObjectType;
  objects?: Node[];
  privileges?: Node[];
  grantees?: Node[];
  grant_option?: boolean;
  behavior?: DropBehavior;
}
export interface GrantRoleStmt {
  granted_roles?: Node[];
  grantee_roles?: Node[];
  is_grant?: boolean;
  admin_opt?: boolean;
  grantor?: RoleSpec;
  behavior?: DropBehavior;
}
export interface AlterDefaultPrivilegesStmt {
  options?: Node[];
  action?: GrantStmt;
}
export interface ClosePortalStmt {
  portalname?: string;
}
export interface ClusterStmt {
  relation?: RangeVar;
  indexname?: string;
  options?: number;
}
export interface CopyStmt {
  relation?: RangeVar;
  query?: Node;
  attlist?: Node[];
  is_from?: boolean;
  is_program?: boolean;
  filename?: string;
  options?: Node[];
  whereClause?: Node;
}
export interface CreateStmt {
  relation?: RangeVar;
  tableElts?: Node[];
  inhRelations?: Node[];
  partbound?: PartitionBoundSpec;
  partspec?: PartitionSpec;
  ofTypename?: TypeName;
  constraints?: Node[];
  options?: Node[];
  oncommit?: OnCommitAction;
  tablespacename?: string;
  accessMethod?: string;
  if_not_exists?: boolean;
}
export interface DefineStmt {
  kind?: ObjectType;
  oldstyle?: boolean;
  defnames?: Node[];
  args?: Node[];
  definition?: Node[];
  if_not_exists?: boolean;
  replace?: boolean;
}
export interface DropStmt {
  objects?: Node[];
  removeType?: ObjectType;
  behavior?: DropBehavior;
  missing_ok?: boolean;
  concurrent?: boolean;
}
export interface TruncateStmt {
  relations?: Node[];
  restart_seqs?: boolean;
  behavior?: DropBehavior;
}
export interface CommentStmt {
  objtype?: ObjectType;
  object?: Node;
  comment?: string;
}
export interface FetchStmt {
  direction?: FetchDirection;
  howMany?: bigint;
  portalname?: string;
  ismove?: boolean;
}
export interface IndexStmt {
  idxname?: string;
  relation?: RangeVar;
  accessMethod?: string;
  tableSpace?: string;
  indexParams?: Node[];
  indexIncludingParams?: Node[];
  options?: Node[];
  whereClause?: Node;
  excludeOpNames?: Node[];
  idxcomment?: string;
  indexOid?: number;
  oldNode?: number;
  oldCreateSubid?: number;
  oldFirstRelfilenodeSubid?: number;
  unique?: boolean;
  primary?: boolean;
  isconstraint?: boolean;
  deferrable?: boolean;
  initdeferred?: boolean;
  transformed?: boolean;
  concurrent?: boolean;
  if_not_exists?: boolean;
  reset_default_tblspc?: boolean;
}
export interface CreateFunctionStmt {
  is_procedure?: boolean;
  replace?: boolean;
  funcname?: Node[];
  parameters?: Node[];
  returnType?: TypeName;
  options?: Node[];
}
export interface AlterFunctionStmt {
  objtype?: ObjectType;
  func?: ObjectWithArgs;
  actions?: Node[];
}
export interface DoStmt {
  args?: Node[];
}
export interface RenameStmt {
  renameType?: ObjectType;
  relationType?: ObjectType;
  relation?: RangeVar;
  object?: Node;
  subname?: string;
  newname?: string;
  behavior?: DropBehavior;
  missing_ok?: boolean;
}
export interface RuleStmt {
  relation?: RangeVar;
  rulename?: string;
  whereClause?: Node;
  event?: CmdType;
  instead?: boolean;
  actions?: Node[];
  replace?: boolean;
}
export interface NotifyStmt {
  conditionname?: string;
  payload?: string;
}
export interface ListenStmt {
  conditionname?: string;
}
export interface UnlistenStmt {
  conditionname?: string;
}
export interface TransactionStmt {
  kind?: TransactionStmtKind;
  options?: Node[];
  savepoint_name?: string;
  gid?: string;
  chain?: boolean;
}
export interface ViewStmt {
  view?: RangeVar;
  aliases?: Node[];
  query?: Node;
  replace?: boolean;
  options?: Node[];
  withCheckOption?: ViewCheckOption;
}
export interface LoadStmt {
  filename?: string;
}
export interface CreateDomainStmt {
  domainname?: Node[];
  typeName?: TypeName;
  collClause?: CollateClause;
  constraints?: Node[];
}
export interface CreatedbStmt {
  dbname?: string;
  options?: Node[];
}
export interface DropdbStmt {
  dbname?: string;
  missing_ok?: boolean;
  options?: Node[];
}
export interface VacuumStmt {
  options?: Node[];
  rels?: Node[];
  is_vacuumcmd?: boolean;
}
export interface ExplainStmt {
  query?: Node;
  options?: Node[];
}
export interface CreateTableAsStmt {
  query?: Node;
  into?: IntoClause;
  relkind?: ObjectType;
  is_select_into?: boolean;
  if_not_exists?: boolean;
}
export interface CreateSeqStmt {
  sequence?: RangeVar;
  options?: Node[];
  ownerId?: number;
  for_identity?: boolean;
  if_not_exists?: boolean;
}
export interface AlterSeqStmt {
  sequence?: RangeVar;
  options?: Node[];
  for_identity?: boolean;
  missing_ok?: boolean;
}
export interface VariableSetStmt {
  kind?: VariableSetKind;
  name?: string;
  args?: Node[];
  is_local?: boolean;
}
export interface VariableShowStmt {
  name?: string;
}
export interface DiscardStmt {
  target?: DiscardMode;
}
export interface CreateTrigStmt {
  trigname?: string;
  relation?: RangeVar;
  funcname?: Node[];
  args?: Node[];
  row?: boolean;
  timing?: number;
  events?: number;
  columns?: Node[];
  whenClause?: Node;
  isconstraint?: boolean;
  transitionRels?: Node[];
  deferrable?: boolean;
  initdeferred?: boolean;
  constrrel?: RangeVar;
}
export interface CreatePLangStmt {
  replace?: boolean;
  plname?: string;
  plhandler?: Node[];
  plinline?: Node[];
  plvalidator?: Node[];
  pltrusted?: boolean;
}
export interface CreateRoleStmt {
  stmt_type?: RoleStmtType;
  role?: string;
  options?: Node[];
}
export interface AlterRoleStmt {
  role?: RoleSpec;
  options?: Node[];
  action?: number;
}
export interface DropRoleStmt {
  roles?: Node[];
  missing_ok?: boolean;
}
export interface LockStmt {
  relations?: Node[];
  mode?: number;
  nowait?: boolean;
}
export interface ConstraintsSetStmt {
  constraints?: Node[];
  deferred?: boolean;
}
export interface ReindexStmt {
  kind?: ReindexObjectType;
  relation?: RangeVar;
  name?: string;
  options?: number;
  concurrent?: boolean;
}
export interface CheckPointStmt {}
export interface CreateSchemaStmt {
  schemaname?: string;
  authrole?: RoleSpec;
  schemaElts?: Node[];
  if_not_exists?: boolean;
}
export interface AlterDatabaseStmt {
  dbname?: string;
  options?: Node[];
}
export interface AlterDatabaseSetStmt {
  dbname?: string;
  setstmt?: VariableSetStmt;
}
export interface AlterRoleSetStmt {
  role?: RoleSpec;
  database?: string;
  setstmt?: VariableSetStmt;
}
export interface CreateConversionStmt {
  conversion_name?: Node[];
  for_encoding_name?: string;
  to_encoding_name?: string;
  func_name?: Node[];
  def?: boolean;
}
export interface CreateCastStmt {
  sourcetype?: TypeName;
  targettype?: TypeName;
  func?: ObjectWithArgs;
  context?: CoercionContext;
  inout?: boolean;
}
export interface CreateOpClassStmt {
  opclassname?: Node[];
  opfamilyname?: Node[];
  amname?: string;
  datatype?: TypeName;
  items?: Node[];
  isDefault?: boolean;
}
export interface CreateOpFamilyStmt {
  opfamilyname?: Node[];
  amname?: string;
}
export interface AlterOpFamilyStmt {
  opfamilyname?: Node[];
  amname?: string;
  isDrop?: boolean;
  items?: Node[];
}
export interface PrepareStmt {
  name?: string;
  argtypes?: Node[];
  query?: Node;
}
export interface ExecuteStmt {
  name?: string;
  params?: Node[];
}
export interface DeallocateStmt {
  name?: string;
}
export interface DeclareCursorStmt {
  portalname?: string;
  options?: number;
  query?: Node;
}
export interface CreateTableSpaceStmt {
  tablespacename?: string;
  owner?: RoleSpec;
  location?: string;
  options?: Node[];
}
export interface DropTableSpaceStmt {
  tablespacename?: string;
  missing_ok?: boolean;
}
export interface AlterObjectDependsStmt {
  objectType?: ObjectType;
  relation?: RangeVar;
  object?: Node;
  extname?: Node;
  remove?: boolean;
}
export interface AlterObjectSchemaStmt {
  objectType?: ObjectType;
  relation?: RangeVar;
  object?: Node;
  newschema?: string;
  missing_ok?: boolean;
}
export interface AlterOwnerStmt {
  objectType?: ObjectType;
  relation?: RangeVar;
  object?: Node;
  newowner?: RoleSpec;
}
export interface AlterOperatorStmt {
  opername?: ObjectWithArgs;
  options?: Node[];
}
export interface AlterTypeStmt {
  typeName?: Node[];
  options?: Node[];
}
export interface DropOwnedStmt {
  roles?: Node[];
  behavior?: DropBehavior;
}
export interface ReassignOwnedStmt {
  roles?: Node[];
  newrole?: RoleSpec;
}
export interface CompositeTypeStmt {
  typevar?: RangeVar;
  coldeflist?: Node[];
}
export interface CreateEnumStmt {
  typeName?: Node[];
  vals?: Node[];
}
export interface CreateRangeStmt {
  typeName?: Node[];
  params?: Node[];
}
export interface AlterEnumStmt {
  typeName?: Node[];
  oldVal?: string;
  newVal?: string;
  newValNeighbor?: string;
  newValIsAfter?: boolean;
  skipIfNewValExists?: boolean;
}
export interface AlterTSDictionaryStmt {
  dictname?: Node[];
  options?: Node[];
}
export interface AlterTSConfigurationStmt {
  kind?: AlterTSConfigType;
  cfgname?: Node[];
  tokentype?: Node[];
  dicts?: Node[];
  override?: boolean;
  replace?: boolean;
  missing_ok?: boolean;
}
export interface CreateFdwStmt {
  fdwname?: string;
  func_options?: Node[];
  options?: Node[];
}
export interface AlterFdwStmt {
  fdwname?: string;
  func_options?: Node[];
  options?: Node[];
}
export interface CreateForeignServerStmt {
  servername?: string;
  servertype?: string;
  version?: string;
  fdwname?: string;
  if_not_exists?: boolean;
  options?: Node[];
}
export interface AlterForeignServerStmt {
  servername?: string;
  version?: string;
  options?: Node[];
  has_version?: boolean;
}
export interface CreateUserMappingStmt {
  user?: RoleSpec;
  servername?: string;
  if_not_exists?: boolean;
  options?: Node[];
}
export interface AlterUserMappingStmt {
  user?: RoleSpec;
  servername?: string;
  options?: Node[];
}
export interface DropUserMappingStmt {
  user?: RoleSpec;
  servername?: string;
  missing_ok?: boolean;
}
export interface AlterTableSpaceOptionsStmt {
  tablespacename?: string;
  options?: Node[];
  isReset?: boolean;
}
export interface AlterTableMoveAllStmt {
  orig_tablespacename?: string;
  objtype?: ObjectType;
  roles?: Node[];
  new_tablespacename?: string;
  nowait?: boolean;
}
export interface SecLabelStmt {
  objtype?: ObjectType;
  object?: Node;
  provider?: string;
  label?: string;
}
export interface CreateForeignTableStmt {
  base?: CreateStmt;
  servername?: string;
  options?: Node[];
}
export interface ImportForeignSchemaStmt {
  server_name?: string;
  remote_schema?: string;
  local_schema?: string;
  list_type?: ImportForeignSchemaType;
  table_list?: Node[];
  options?: Node[];
}
export interface CreateExtensionStmt {
  extname?: string;
  if_not_exists?: boolean;
  options?: Node[];
}
export interface AlterExtensionStmt {
  extname?: string;
  options?: Node[];
}
export interface AlterExtensionContentsStmt {
  extname?: string;
  action?: number;
  objtype?: ObjectType;
  object?: Node;
}
export interface CreateEventTrigStmt {
  trigname?: string;
  eventname?: string;
  whenclause?: Node[];
  funcname?: Node[];
}
export interface AlterEventTrigStmt {
  trigname?: string;
  tgenabled?: string;
}
export interface RefreshMatViewStmt {
  concurrent?: boolean;
  skipData?: boolean;
  relation?: RangeVar;
}
export interface ReplicaIdentityStmt {
  identity_type?: string;
  name?: string;
}
export interface AlterSystemStmt {
  setstmt?: VariableSetStmt;
}
export interface CreatePolicyStmt {
  policy_name?: string;
  table?: RangeVar;
  cmd_name?: string;
  permissive?: boolean;
  roles?: Node[];
  qual?: Node;
  with_check?: Node;
}
export interface AlterPolicyStmt {
  policy_name?: string;
  table?: RangeVar;
  roles?: Node[];
  qual?: Node;
  with_check?: Node;
}
export interface CreateTransformStmt {
  replace?: boolean;
  type_name?: TypeName;
  lang?: string;
  fromsql?: ObjectWithArgs;
  tosql?: ObjectWithArgs;
}
export interface CreateAmStmt {
  amname?: string;
  handler_name?: Node[];
  amtype?: string;
}
export interface CreatePublicationStmt {
  pubname?: string;
  options?: Node[];
  tables?: Node[];
  for_all_tables?: boolean;
}
export interface AlterPublicationStmt {
  pubname?: string;
  options?: Node[];
  tables?: Node[];
  for_all_tables?: boolean;
  tableAction?: DefElemAction;
}
export interface CreateSubscriptionStmt {
  subname?: string;
  conninfo?: string;
  publication?: Node[];
  options?: Node[];
}
export interface AlterSubscriptionStmt {
  kind?: AlterSubscriptionType;
  subname?: string;
  conninfo?: string;
  publication?: Node[];
  options?: Node[];
}
export interface DropSubscriptionStmt {
  subname?: string;
  missing_ok?: boolean;
  behavior?: DropBehavior;
}
export interface CreateStatsStmt {
  defnames?: Node[];
  stat_types?: Node[];
  exprs?: Node[];
  relations?: Node[];
  stxcomment?: string;
  if_not_exists?: boolean;
}
export interface AlterCollationStmt {
  collname?: Node[];
}
export interface CallStmt {
  funccall?: FuncCall;
  funcexpr?: FuncExpr;
}
export interface AlterStatsStmt {
  defnames?: Node[];
  stxstattarget?: number;
  missing_ok?: boolean;
}
export interface A_Expr {
  kind?: A_Expr_Kind;
  name?: Node[];
  lexpr?: Node;
  rexpr?: Node;
  location?: number;
}
export interface ColumnRef {
  fields?: Node[];
  location?: number;
}
export interface ParamRef {
  number?: number;
  location?: number;
}
export interface A_Const {
  val?: Node;
  location?: number;
}
export interface FuncCall {
  funcname?: Node[];
  args?: Node[];
  agg_order?: Node[];
  agg_filter?: Node;
  agg_within_group?: boolean;
  agg_star?: boolean;
  agg_distinct?: boolean;
  func_variadic?: boolean;
  over?: WindowDef;
  location?: number;
}
export interface A_Star {}
export interface A_Indices {
  is_slice?: boolean;
  lidx?: Node;
  uidx?: Node;
}
export interface A_Indirection {
  arg?: Node;
  indirection?: Node[];
}
export interface A_ArrayExpr {
  elements?: Node[];
  location?: number;
}
export interface ResTarget {
  name?: string;
  indirection?: Node[];
  val?: Node;
  location?: number;
}
export interface MultiAssignRef {
  source?: Node;
  colno?: number;
  ncolumns?: number;
}
export interface TypeCast {
  arg?: Node;
  typeName?: TypeName;
  location?: number;
}
export interface CollateClause {
  arg?: Node;
  collname?: Node[];
  location?: number;
}
export interface SortBy {
  node?: Node;
  sortby_dir?: SortByDir;
  sortby_nulls?: SortByNulls;
  useOp?: Node[];
  location?: number;
}
export interface WindowDef {
  name?: string;
  refname?: string;
  partitionClause?: Node[];
  orderClause?: Node[];
  frameOptions?: number;
  startOffset?: Node;
  endOffset?: Node;
  location?: number;
}
export interface RangeSubselect {
  lateral?: boolean;
  subquery?: Node;
  alias?: Alias;
}
export interface RangeFunction {
  lateral?: boolean;
  ordinality?: boolean;
  is_rowsfrom?: boolean;
  functions?: Node[];
  alias?: Alias;
  coldeflist?: Node[];
}
export interface RangeTableSample {
  relation?: Node;
  method?: Node[];
  args?: Node[];
  repeatable?: Node;
  location?: number;
}
export interface RangeTableFunc {
  lateral?: boolean;
  docexpr?: Node;
  rowexpr?: Node;
  namespaces?: Node[];
  columns?: Node[];
  alias?: Alias;
  location?: number;
}
export interface RangeTableFuncCol {
  colname?: string;
  typeName?: TypeName;
  for_ordinality?: boolean;
  is_not_null?: boolean;
  colexpr?: Node;
  coldefexpr?: Node;
  location?: number;
}
export interface TypeName {
  names?: Node[];
  typeOid?: number;
  setof?: boolean;
  pct_type?: boolean;
  typmods?: Node[];
  typemod?: number;
  arrayBounds?: Node[];
  location?: number;
}
export interface ColumnDef {
  colname?: string;
  typeName?: TypeName;
  inhcount?: number;
  is_local?: boolean;
  is_not_null?: boolean;
  is_from_type?: boolean;
  storage?: string;
  raw_default?: Node;
  cooked_default?: Node;
  identity?: string;
  identitySequence?: RangeVar;
  generated?: string;
  collClause?: CollateClause;
  collOid?: number;
  constraints?: Node[];
  fdwoptions?: Node[];
  location?: number;
}
export interface IndexElem {
  name?: string;
  expr?: Node;
  indexcolname?: string;
  collation?: Node[];
  opclass?: Node[];
  opclassopts?: Node[];
  ordering?: SortByDir;
  nulls_ordering?: SortByNulls;
}
export interface Constraint {
  contype?: ConstrType;
  conname?: string;
  deferrable?: boolean;
  initdeferred?: boolean;
  location?: number;
  is_no_inherit?: boolean;
  raw_expr?: Node;
  cooked_expr?: string;
  generated_when?: string;
  keys?: Node[];
  including?: Node[];
  exclusions?: Node[];
  options?: Node[];
  indexname?: string;
  indexspace?: string;
  reset_default_tblspc?: boolean;
  access_method?: string;
  where_clause?: Node;
  pktable?: RangeVar;
  fk_attrs?: Node[];
  pk_attrs?: Node[];
  fk_matchtype?: string;
  fk_upd_action?: string;
  fk_del_action?: string;
  old_conpfeqop?: Node[];
  old_pktable_oid?: number;
  skip_validation?: boolean;
  initially_valid?: boolean;
}
export interface DefElem {
  defnamespace?: string;
  defname?: string;
  arg?: Node;
  defaction?: DefElemAction;
  location?: number;
}
export interface RangeTblEntry {
  rtekind?: RTEKind;
  relid?: number;
  relkind?: string;
  rellockmode?: number;
  tablesample?: TableSampleClause;
  subquery?: Query;
  security_barrier?: boolean;
  jointype?: JoinType;
  joinmergedcols?: number;
  joinaliasvars?: Node[];
  joinleftcols?: Node[];
  joinrightcols?: Node[];
  functions?: Node[];
  funcordinality?: boolean;
  tablefunc?: TableFunc;
  values_lists?: Node[];
  ctename?: string;
  ctelevelsup?: number;
  self_reference?: boolean;
  coltypes?: Node[];
  coltypmods?: Node[];
  colcollations?: Node[];
  enrname?: string;
  enrtuples?: number;
  alias?: Alias;
  eref?: Alias;
  lateral?: boolean;
  inh?: boolean;
  inFromCl?: boolean;
  requiredPerms?: number;
  checkAsUser?: number;
  selectedCols?: bigint[];
  insertedCols?: bigint[];
  updatedCols?: bigint[];
  extraUpdatedCols?: bigint[];
  securityQuals?: Node[];
}
export interface RangeTblFunction {
  funcexpr?: Node;
  funccolcount?: number;
  funccolnames?: Node[];
  funccoltypes?: Node[];
  funccoltypmods?: Node[];
  funccolcollations?: Node[];
  funcparams?: bigint[];
}
export interface TableSampleClause {
  tsmhandler?: number;
  args?: Node[];
  repeatable?: Node;
}
export interface WithCheckOption {
  kind?: WCOKind;
  relname?: string;
  polname?: string;
  qual?: Node;
  cascaded?: boolean;
}
export interface SortGroupClause {
  tleSortGroupRef?: number;
  eqop?: number;
  sortop?: number;
  nulls_first?: boolean;
  hashable?: boolean;
}
export interface GroupingSet {
  kind?: GroupingSetKind;
  content?: Node[];
  location?: number;
}
export interface WindowClause {
  name?: string;
  refname?: string;
  partitionClause?: Node[];
  orderClause?: Node[];
  frameOptions?: number;
  startOffset?: Node;
  endOffset?: Node;
  startInRangeFunc?: number;
  endInRangeFunc?: number;
  inRangeColl?: number;
  inRangeAsc?: boolean;
  inRangeNullsFirst?: boolean;
  winref?: number;
  copiedOrder?: boolean;
}
export interface ObjectWithArgs {
  objname?: Node[];
  objargs?: Node[];
  args_unspecified?: boolean;
}
export interface AccessPriv {
  priv_name?: string;
  cols?: Node[];
}
export interface CreateOpClassItem {
  itemtype?: number;
  name?: ObjectWithArgs;
  number?: number;
  order_family?: Node[];
  class_args?: Node[];
  storedtype?: TypeName;
}
export interface TableLikeClause {
  relation?: RangeVar;
  options?: number;
  relationOid?: number;
}
export interface FunctionParameter {
  name?: string;
  argType?: TypeName;
  mode?: FunctionParameterMode;
  defexpr?: Node;
}
export interface LockingClause {
  lockedRels?: Node[];
  strength?: LockClauseStrength;
  waitPolicy?: LockWaitPolicy;
}
export interface RowMarkClause {
  rti?: number;
  strength?: LockClauseStrength;
  waitPolicy?: LockWaitPolicy;
  pushedDown?: boolean;
}
export interface XmlSerialize {
  xmloption?: XmlOptionType;
  expr?: Node;
  typeName?: TypeName;
  location?: number;
}
export interface WithClause {
  ctes?: Node[];
  recursive?: boolean;
  location?: number;
}
export interface InferClause {
  indexElems?: Node[];
  whereClause?: Node;
  conname?: string;
  location?: number;
}
export interface OnConflictClause {
  action?: OnConflictAction;
  infer?: InferClause;
  targetList?: Node[];
  whereClause?: Node;
  location?: number;
}
export interface CommonTableExpr {
  ctename?: string;
  aliascolnames?: Node[];
  ctematerialized?: CTEMaterialize;
  ctequery?: Node;
  location?: number;
  cterecursive?: boolean;
  cterefcount?: number;
  ctecolnames?: Node[];
  ctecoltypes?: Node[];
  ctecoltypmods?: Node[];
  ctecolcollations?: Node[];
}
export interface RoleSpec {
  roletype?: RoleSpecType;
  rolename?: string;
  location?: number;
}
export interface TriggerTransition {
  name?: string;
  isNew?: boolean;
  isTable?: boolean;
}
export interface PartitionElem {
  name?: string;
  expr?: Node;
  collation?: Node[];
  opclass?: Node[];
  location?: number;
}
export interface PartitionSpec {
  strategy?: string;
  partParams?: Node[];
  location?: number;
}
export interface PartitionBoundSpec {
  strategy?: string;
  is_default?: boolean;
  modulus?: number;
  remainder?: number;
  listdatums?: Node[];
  lowerdatums?: Node[];
  upperdatums?: Node[];
  location?: number;
}
export interface PartitionRangeDatum {
  kind?: PartitionRangeDatumKind;
  value?: Node;
  location?: number;
}
export interface PartitionCmd {
  name?: RangeVar;
  bound?: PartitionBoundSpec;
}
export interface VacuumRelation {
  relation?: RangeVar;
  oid?: number;
  va_cols?: Node[];
}
export interface InlineCodeBlock {
  source_text?: string;
  langOid?: number;
  langIsTrusted?: boolean;
  atomic?: boolean;
}
export interface CallContext {
  atomic?: boolean;
}
export interface ScanToken {
  start?: number;
  end?: number;
  token?: Token;
  keywordKind?: KeywordKind;
}