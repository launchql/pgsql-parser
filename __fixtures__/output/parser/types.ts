export enum OverridingKind {
  OVERRIDING_NOT_SET = 0,
  OVERRIDING_USER_VALUE = 1,
  OVERRIDING_SYSTEM_VALUE = 2,
}
export enum QuerySource {
  QSRC_ORIGINAL = 0,
  QSRC_PARSER = 1,
  QSRC_INSTEAD_RULE = 2,
  QSRC_QUAL_INSTEAD_RULE = 3,
  QSRC_NON_INSTEAD_RULE = 4,
}
export enum SortByDir {
  SORTBY_DEFAULT = 0,
  SORTBY_ASC = 1,
  SORTBY_DESC = 2,
  SORTBY_USING = 3,
}
export enum SortByNulls {
  SORTBY_NULLS_DEFAULT = 0,
  SORTBY_NULLS_FIRST = 1,
  SORTBY_NULLS_LAST = 2,
}
export enum SetQuantifier {
  SET_QUANTIFIER_DEFAULT = 0,
  SET_QUANTIFIER_ALL = 1,
  SET_QUANTIFIER_DISTINCT = 2,
}
export enum A_Expr_Kind {
  AEXPR_OP = 0,
  AEXPR_OP_ANY = 1,
  AEXPR_OP_ALL = 2,
  AEXPR_DISTINCT = 3,
  AEXPR_NOT_DISTINCT = 4,
  AEXPR_NULLIF = 5,
  AEXPR_IN = 6,
  AEXPR_LIKE = 7,
  AEXPR_ILIKE = 8,
  AEXPR_SIMILAR = 9,
  AEXPR_BETWEEN = 10,
  AEXPR_NOT_BETWEEN = 11,
  AEXPR_BETWEEN_SYM = 12,
  AEXPR_NOT_BETWEEN_SYM = 13,
}
export enum RoleSpecType {
  ROLESPEC_CSTRING = 0,
  ROLESPEC_CURRENT_ROLE = 1,
  ROLESPEC_CURRENT_USER = 2,
  ROLESPEC_SESSION_USER = 3,
  ROLESPEC_PUBLIC = 4,
}
export enum TableLikeOption {
  CREATE_TABLE_LIKE_COMMENTS = 0,
  CREATE_TABLE_LIKE_COMPRESSION = 1,
  CREATE_TABLE_LIKE_CONSTRAINTS = 2,
  CREATE_TABLE_LIKE_DEFAULTS = 3,
  CREATE_TABLE_LIKE_GENERATED = 4,
  CREATE_TABLE_LIKE_IDENTITY = 5,
  CREATE_TABLE_LIKE_INDEXES = 6,
  CREATE_TABLE_LIKE_STATISTICS = 7,
  CREATE_TABLE_LIKE_STORAGE = 8,
  CREATE_TABLE_LIKE_ALL = 9,
}
export enum DefElemAction {
  DEFELEM_UNSPEC = 0,
  DEFELEM_SET = 1,
  DEFELEM_ADD = 2,
  DEFELEM_DROP = 3,
}
export enum PartitionStrategy {
  PARTITION_STRATEGY_LIST = 0,
  PARTITION_STRATEGY_RANGE = 1,
  PARTITION_STRATEGY_HASH = 2,
}
export enum PartitionRangeDatumKind {
  PARTITION_RANGE_DATUM_MINVALUE = 0,
  PARTITION_RANGE_DATUM_VALUE = 1,
  PARTITION_RANGE_DATUM_MAXVALUE = 2,
}
export enum RTEKind {
  RTE_RELATION = 0,
  RTE_SUBQUERY = 1,
  RTE_JOIN = 2,
  RTE_FUNCTION = 3,
  RTE_TABLEFUNC = 4,
  RTE_VALUES = 5,
  RTE_CTE = 6,
  RTE_NAMEDTUPLESTORE = 7,
  RTE_RESULT = 8,
}
export enum WCOKind {
  WCO_VIEW_CHECK = 0,
  WCO_RLS_INSERT_CHECK = 1,
  WCO_RLS_UPDATE_CHECK = 2,
  WCO_RLS_CONFLICT_CHECK = 3,
  WCO_RLS_MERGE_UPDATE_CHECK = 4,
  WCO_RLS_MERGE_DELETE_CHECK = 5,
}
export enum GroupingSetKind {
  GROUPING_SET_EMPTY = 0,
  GROUPING_SET_SIMPLE = 1,
  GROUPING_SET_ROLLUP = 2,
  GROUPING_SET_CUBE = 3,
  GROUPING_SET_SETS = 4,
}
export enum CTEMaterialize {
  CTEMaterializeDefault = 0,
  CTEMaterializeAlways = 1,
  CTEMaterializeNever = 2,
}
export enum SetOperation {
  SETOP_NONE = 0,
  SETOP_UNION = 1,
  SETOP_INTERSECT = 2,
  SETOP_EXCEPT = 3,
}
export enum ObjectType {
  OBJECT_ACCESS_METHOD = 0,
  OBJECT_AGGREGATE = 1,
  OBJECT_AMOP = 2,
  OBJECT_AMPROC = 3,
  OBJECT_ATTRIBUTE = 4,
  OBJECT_CAST = 5,
  OBJECT_COLUMN = 6,
  OBJECT_COLLATION = 7,
  OBJECT_CONVERSION = 8,
  OBJECT_DATABASE = 9,
  OBJECT_DEFAULT = 10,
  OBJECT_DEFACL = 11,
  OBJECT_DOMAIN = 12,
  OBJECT_DOMCONSTRAINT = 13,
  OBJECT_EVENT_TRIGGER = 14,
  OBJECT_EXTENSION = 15,
  OBJECT_FDW = 16,
  OBJECT_FOREIGN_SERVER = 17,
  OBJECT_FOREIGN_TABLE = 18,
  OBJECT_FUNCTION = 19,
  OBJECT_INDEX = 20,
  OBJECT_LANGUAGE = 21,
  OBJECT_LARGEOBJECT = 22,
  OBJECT_MATVIEW = 23,
  OBJECT_OPCLASS = 24,
  OBJECT_OPERATOR = 25,
  OBJECT_OPFAMILY = 26,
  OBJECT_PARAMETER_ACL = 27,
  OBJECT_POLICY = 28,
  OBJECT_PROCEDURE = 29,
  OBJECT_PUBLICATION = 30,
  OBJECT_PUBLICATION_NAMESPACE = 31,
  OBJECT_PUBLICATION_REL = 32,
  OBJECT_ROLE = 33,
  OBJECT_ROUTINE = 34,
  OBJECT_RULE = 35,
  OBJECT_SCHEMA = 36,
  OBJECT_SEQUENCE = 37,
  OBJECT_SUBSCRIPTION = 38,
  OBJECT_STATISTIC_EXT = 39,
  OBJECT_TABCONSTRAINT = 40,
  OBJECT_TABLE = 41,
  OBJECT_TABLESPACE = 42,
  OBJECT_TRANSFORM = 43,
  OBJECT_TRIGGER = 44,
  OBJECT_TSCONFIGURATION = 45,
  OBJECT_TSDICTIONARY = 46,
  OBJECT_TSPARSER = 47,
  OBJECT_TSTEMPLATE = 48,
  OBJECT_TYPE = 49,
  OBJECT_USER_MAPPING = 50,
  OBJECT_VIEW = 51,
}
export enum DropBehavior {
  DROP_RESTRICT = 0,
  DROP_CASCADE = 1,
}
export enum AlterTableType {
  AT_AddColumn = 0,
  AT_AddColumnToView = 1,
  AT_ColumnDefault = 2,
  AT_CookedColumnDefault = 3,
  AT_DropNotNull = 4,
  AT_SetNotNull = 5,
  AT_DropExpression = 6,
  AT_CheckNotNull = 7,
  AT_SetStatistics = 8,
  AT_SetOptions = 9,
  AT_ResetOptions = 10,
  AT_SetStorage = 11,
  AT_SetCompression = 12,
  AT_DropColumn = 13,
  AT_AddIndex = 14,
  AT_ReAddIndex = 15,
  AT_AddConstraint = 16,
  AT_ReAddConstraint = 17,
  AT_ReAddDomainConstraint = 18,
  AT_AlterConstraint = 19,
  AT_ValidateConstraint = 20,
  AT_AddIndexConstraint = 21,
  AT_DropConstraint = 22,
  AT_ReAddComment = 23,
  AT_AlterColumnType = 24,
  AT_AlterColumnGenericOptions = 25,
  AT_ChangeOwner = 26,
  AT_ClusterOn = 27,
  AT_DropCluster = 28,
  AT_SetLogged = 29,
  AT_SetUnLogged = 30,
  AT_DropOids = 31,
  AT_SetAccessMethod = 32,
  AT_SetTableSpace = 33,
  AT_SetRelOptions = 34,
  AT_ResetRelOptions = 35,
  AT_ReplaceRelOptions = 36,
  AT_EnableTrig = 37,
  AT_EnableAlwaysTrig = 38,
  AT_EnableReplicaTrig = 39,
  AT_DisableTrig = 40,
  AT_EnableTrigAll = 41,
  AT_DisableTrigAll = 42,
  AT_EnableTrigUser = 43,
  AT_DisableTrigUser = 44,
  AT_EnableRule = 45,
  AT_EnableAlwaysRule = 46,
  AT_EnableReplicaRule = 47,
  AT_DisableRule = 48,
  AT_AddInherit = 49,
  AT_DropInherit = 50,
  AT_AddOf = 51,
  AT_DropOf = 52,
  AT_ReplicaIdentity = 53,
  AT_EnableRowSecurity = 54,
  AT_DisableRowSecurity = 55,
  AT_ForceRowSecurity = 56,
  AT_NoForceRowSecurity = 57,
  AT_GenericOptions = 58,
  AT_AttachPartition = 59,
  AT_DetachPartition = 60,
  AT_DetachPartitionFinalize = 61,
  AT_AddIdentity = 62,
  AT_SetIdentity = 63,
  AT_DropIdentity = 64,
  AT_ReAddStatistics = 65,
}
export enum GrantTargetType {
  ACL_TARGET_OBJECT = 0,
  ACL_TARGET_ALL_IN_SCHEMA = 1,
  ACL_TARGET_DEFAULTS = 2,
}
export enum VariableSetKind {
  VAR_SET_VALUE = 0,
  VAR_SET_DEFAULT = 1,
  VAR_SET_CURRENT = 2,
  VAR_SET_MULTI = 3,
  VAR_RESET = 4,
  VAR_RESET_ALL = 5,
}
export enum ConstrType {
  CONSTR_NULL = 0,
  CONSTR_NOTNULL = 1,
  CONSTR_DEFAULT = 2,
  CONSTR_IDENTITY = 3,
  CONSTR_GENERATED = 4,
  CONSTR_CHECK = 5,
  CONSTR_PRIMARY = 6,
  CONSTR_UNIQUE = 7,
  CONSTR_EXCLUSION = 8,
  CONSTR_FOREIGN = 9,
  CONSTR_ATTR_DEFERRABLE = 10,
  CONSTR_ATTR_NOT_DEFERRABLE = 11,
  CONSTR_ATTR_DEFERRED = 12,
  CONSTR_ATTR_IMMEDIATE = 13,
}
export enum ImportForeignSchemaType {
  FDW_IMPORT_SCHEMA_ALL = 0,
  FDW_IMPORT_SCHEMA_LIMIT_TO = 1,
  FDW_IMPORT_SCHEMA_EXCEPT = 2,
}
export enum RoleStmtType {
  ROLESTMT_ROLE = 0,
  ROLESTMT_USER = 1,
  ROLESTMT_GROUP = 2,
}
export enum FetchDirection {
  FETCH_FORWARD = 0,
  FETCH_BACKWARD = 1,
  FETCH_ABSOLUTE = 2,
  FETCH_RELATIVE = 3,
}
export enum FunctionParameterMode {
  FUNC_PARAM_IN = 0,
  FUNC_PARAM_OUT = 1,
  FUNC_PARAM_INOUT = 2,
  FUNC_PARAM_VARIADIC = 3,
  FUNC_PARAM_TABLE = 4,
  FUNC_PARAM_DEFAULT = 5,
}
export enum TransactionStmtKind {
  TRANS_STMT_BEGIN = 0,
  TRANS_STMT_START = 1,
  TRANS_STMT_COMMIT = 2,
  TRANS_STMT_ROLLBACK = 3,
  TRANS_STMT_SAVEPOINT = 4,
  TRANS_STMT_RELEASE = 5,
  TRANS_STMT_ROLLBACK_TO = 6,
  TRANS_STMT_PREPARE = 7,
  TRANS_STMT_COMMIT_PREPARED = 8,
  TRANS_STMT_ROLLBACK_PREPARED = 9,
}
export enum ViewCheckOption {
  NO_CHECK_OPTION = 0,
  LOCAL_CHECK_OPTION = 1,
  CASCADED_CHECK_OPTION = 2,
}
export enum DiscardMode {
  DISCARD_ALL = 0,
  DISCARD_PLANS = 1,
  DISCARD_SEQUENCES = 2,
  DISCARD_TEMP = 3,
}
export enum ReindexObjectType {
  REINDEX_OBJECT_INDEX = 0,
  REINDEX_OBJECT_TABLE = 1,
  REINDEX_OBJECT_SCHEMA = 2,
  REINDEX_OBJECT_SYSTEM = 3,
  REINDEX_OBJECT_DATABASE = 4,
}
export enum AlterTSConfigType {
  ALTER_TSCONFIG_ADD_MAPPING = 0,
  ALTER_TSCONFIG_ALTER_MAPPING_FOR_TOKEN = 1,
  ALTER_TSCONFIG_REPLACE_DICT = 2,
  ALTER_TSCONFIG_REPLACE_DICT_FOR_TOKEN = 3,
  ALTER_TSCONFIG_DROP_MAPPING = 4,
}
export enum PublicationObjSpecType {
  PUBLICATIONOBJ_TABLE = 0,
  PUBLICATIONOBJ_TABLES_IN_SCHEMA = 1,
  PUBLICATIONOBJ_TABLES_IN_CUR_SCHEMA = 2,
  PUBLICATIONOBJ_CONTINUATION = 3,
}
export enum AlterPublicationAction {
  AP_AddObjects = 0,
  AP_DropObjects = 1,
  AP_SetObjects = 2,
}
export enum AlterSubscriptionType {
  ALTER_SUBSCRIPTION_OPTIONS = 0,
  ALTER_SUBSCRIPTION_CONNECTION = 1,
  ALTER_SUBSCRIPTION_SET_PUBLICATION = 2,
  ALTER_SUBSCRIPTION_ADD_PUBLICATION = 3,
  ALTER_SUBSCRIPTION_DROP_PUBLICATION = 4,
  ALTER_SUBSCRIPTION_REFRESH = 5,
  ALTER_SUBSCRIPTION_ENABLED = 6,
  ALTER_SUBSCRIPTION_SKIP = 7,
}
export enum OnCommitAction {
  ONCOMMIT_NOOP = 0,
  ONCOMMIT_PRESERVE_ROWS = 1,
  ONCOMMIT_DELETE_ROWS = 2,
  ONCOMMIT_DROP = 3,
}
export enum ParamKind {
  PARAM_EXTERN = 0,
  PARAM_EXEC = 1,
  PARAM_SUBLINK = 2,
  PARAM_MULTIEXPR = 3,
}
export enum CoercionContext {
  COERCION_IMPLICIT = 0,
  COERCION_ASSIGNMENT = 1,
  COERCION_PLPGSQL = 2,
  COERCION_EXPLICIT = 3,
}
export enum CoercionForm {
  COERCE_EXPLICIT_CALL = 0,
  COERCE_EXPLICIT_CAST = 1,
  COERCE_IMPLICIT_CAST = 2,
  COERCE_SQL_SYNTAX = 3,
}
export enum BoolExprType {
  AND_EXPR = 0,
  OR_EXPR = 1,
  NOT_EXPR = 2,
}
export enum SubLinkType {
  EXISTS_SUBLINK = 0,
  ALL_SUBLINK = 1,
  ANY_SUBLINK = 2,
  ROWCOMPARE_SUBLINK = 3,
  EXPR_SUBLINK = 4,
  MULTIEXPR_SUBLINK = 5,
  ARRAY_SUBLINK = 6,
  CTE_SUBLINK = 7,
}
export enum RowCompareType {
  ROWCOMPARE_LT = 0,
  ROWCOMPARE_LE = 1,
  ROWCOMPARE_EQ = 2,
  ROWCOMPARE_GE = 3,
  ROWCOMPARE_GT = 4,
  ROWCOMPARE_NE = 5,
}
export enum MinMaxOp {
  IS_GREATEST = 0,
  IS_LEAST = 1,
}
export enum SQLValueFunctionOp {
  SVFOP_CURRENT_DATE = 0,
  SVFOP_CURRENT_TIME = 1,
  SVFOP_CURRENT_TIME_N = 2,
  SVFOP_CURRENT_TIMESTAMP = 3,
  SVFOP_CURRENT_TIMESTAMP_N = 4,
  SVFOP_LOCALTIME = 5,
  SVFOP_LOCALTIME_N = 6,
  SVFOP_LOCALTIMESTAMP = 7,
  SVFOP_LOCALTIMESTAMP_N = 8,
  SVFOP_CURRENT_ROLE = 9,
  SVFOP_CURRENT_USER = 10,
  SVFOP_USER = 11,
  SVFOP_SESSION_USER = 12,
  SVFOP_CURRENT_CATALOG = 13,
  SVFOP_CURRENT_SCHEMA = 14,
}
export enum XmlExprOp {
  IS_XMLCONCAT = 0,
  IS_XMLELEMENT = 1,
  IS_XMLFOREST = 2,
  IS_XMLPARSE = 3,
  IS_XMLPI = 4,
  IS_XMLROOT = 5,
  IS_XMLSERIALIZE = 6,
  IS_DOCUMENT = 7,
}
export enum XmlOptionType {
  XMLOPTION_DOCUMENT = 0,
  XMLOPTION_CONTENT = 1,
}
export enum JsonEncoding {
  JS_ENC_DEFAULT = 0,
  JS_ENC_UTF8 = 1,
  JS_ENC_UTF16 = 2,
  JS_ENC_UTF32 = 3,
}
export enum JsonFormatType {
  JS_FORMAT_DEFAULT = 0,
  JS_FORMAT_JSON = 1,
  JS_FORMAT_JSONB = 2,
}
export enum JsonConstructorType {
  JSCTOR_JSON_OBJECT = 0,
  JSCTOR_JSON_ARRAY = 1,
  JSCTOR_JSON_OBJECTAGG = 2,
  JSCTOR_JSON_ARRAYAGG = 3,
}
export enum JsonValueType {
  JS_TYPE_ANY = 0,
  JS_TYPE_OBJECT = 1,
  JS_TYPE_ARRAY = 2,
  JS_TYPE_SCALAR = 3,
}
export enum NullTestType {
  IS_NULL = 0,
  IS_NOT_NULL = 1,
}
export enum BoolTestType {
  IS_TRUE = 0,
  IS_NOT_TRUE = 1,
  IS_FALSE = 2,
  IS_NOT_FALSE = 3,
  IS_UNKNOWN = 4,
  IS_NOT_UNKNOWN = 5,
}
export enum CmdType {
  CMD_UNKNOWN = 0,
  CMD_SELECT = 1,
  CMD_UPDATE = 2,
  CMD_INSERT = 3,
  CMD_DELETE = 4,
  CMD_MERGE = 5,
  CMD_UTILITY = 6,
  CMD_NOTHING = 7,
}
export enum JoinType {
  JOIN_INNER = 0,
  JOIN_LEFT = 1,
  JOIN_FULL = 2,
  JOIN_RIGHT = 3,
  JOIN_SEMI = 4,
  JOIN_ANTI = 5,
  JOIN_RIGHT_ANTI = 6,
  JOIN_UNIQUE_OUTER = 7,
  JOIN_UNIQUE_INNER = 8,
}
export enum AggStrategy {
  AGG_PLAIN = 0,
  AGG_SORTED = 1,
  AGG_HASHED = 2,
  AGG_MIXED = 3,
}
export enum AggSplit {
  AGGSPLIT_SIMPLE = 0,
  AGGSPLIT_INITIAL_SERIAL = 1,
  AGGSPLIT_FINAL_DESERIAL = 2,
}
export enum SetOpCmd {
  SETOPCMD_INTERSECT = 0,
  SETOPCMD_INTERSECT_ALL = 1,
  SETOPCMD_EXCEPT = 2,
  SETOPCMD_EXCEPT_ALL = 3,
}
export enum SetOpStrategy {
  SETOP_SORTED = 0,
  SETOP_HASHED = 1,
}
export enum OnConflictAction {
  ONCONFLICT_NONE = 0,
  ONCONFLICT_NOTHING = 1,
  ONCONFLICT_UPDATE = 2,
}
export enum LimitOption {
  LIMIT_OPTION_DEFAULT = 0,
  LIMIT_OPTION_COUNT = 1,
  LIMIT_OPTION_WITH_TIES = 2,
}
export enum LockClauseStrength {
  LCS_NONE = 0,
  LCS_FORKEYSHARE = 1,
  LCS_FORSHARE = 2,
  LCS_FORNOKEYUPDATE = 3,
  LCS_FORUPDATE = 4,
}
export enum LockWaitPolicy {
  LockWaitBlock = 0,
  LockWaitSkip = 1,
  LockWaitError = 2,
}
export enum LockTupleMode {
  LockTupleKeyShare = 0,
  LockTupleShare = 1,
  LockTupleNoKeyExclusive = 2,
  LockTupleExclusive = 3,
}
export enum KeywordKind {
  NO_KEYWORD = 0,
  UNRESERVED_KEYWORD = 1,
  COL_NAME_KEYWORD = 2,
  TYPE_FUNC_NAME_KEYWORD = 3,
  RESERVED_KEYWORD = 4,
}
export enum Token {
  NUL = 0,
  ASCII_36 = 36,
  ASCII_37 = 37,
  ASCII_40 = 40,
  ASCII_41 = 41,
  ASCII_42 = 42,
  ASCII_43 = 43,
  ASCII_44 = 44,
  ASCII_45 = 45,
  ASCII_46 = 46,
  ASCII_47 = 47,
  ASCII_58 = 58,
  ASCII_59 = 59,
  ASCII_60 = 60,
  ASCII_61 = 61,
  ASCII_62 = 62,
  ASCII_63 = 63,
  ASCII_91 = 91,
  ASCII_92 = 92,
  ASCII_93 = 93,
  ASCII_94 = 94,
  IDENT = 258,
  UIDENT = 259,
  FCONST = 260,
  SCONST = 261,
  USCONST = 262,
  BCONST = 263,
  XCONST = 264,
  Op = 265,
  ICONST = 266,
  PARAM = 267,
  TYPECAST = 268,
  DOT_DOT = 269,
  COLON_EQUALS = 270,
  EQUALS_GREATER = 271,
  LESS_EQUALS = 272,
  GREATER_EQUALS = 273,
  NOT_EQUALS = 274,
  SQL_COMMENT = 275,
  C_COMMENT = 276,
  ABORT_P = 277,
  ABSENT = 278,
  ABSOLUTE_P = 279,
  ACCESS = 280,
  ACTION = 281,
  ADD_P = 282,
  ADMIN = 283,
  AFTER = 284,
  AGGREGATE = 285,
  ALL = 286,
  ALSO = 287,
  ALTER = 288,
  ALWAYS = 289,
  ANALYSE = 290,
  ANALYZE = 291,
  AND = 292,
  ANY = 293,
  ARRAY = 294,
  AS = 295,
  ASC = 296,
  ASENSITIVE = 297,
  ASSERTION = 298,
  ASSIGNMENT = 299,
  ASYMMETRIC = 300,
  ATOMIC = 301,
  AT = 302,
  ATTACH = 303,
  ATTRIBUTE = 304,
  AUTHORIZATION = 305,
  BACKWARD = 306,
  BEFORE = 307,
  BEGIN_P = 308,
  BETWEEN = 309,
  BIGINT = 310,
  BINARY = 311,
  BIT = 312,
  BOOLEAN_P = 313,
  BOTH = 314,
  BREADTH = 315,
  BY = 316,
  CACHE = 317,
  CALL = 318,
  CALLED = 319,
  CASCADE = 320,
  CASCADED = 321,
  CASE = 322,
  CAST = 323,
  CATALOG_P = 324,
  CHAIN = 325,
  CHAR_P = 326,
  CHARACTER = 327,
  CHARACTERISTICS = 328,
  CHECK = 329,
  CHECKPOINT = 330,
  CLASS = 331,
  CLOSE = 332,
  CLUSTER = 333,
  COALESCE = 334,
  COLLATE = 335,
  COLLATION = 336,
  COLUMN = 337,
  COLUMNS = 338,
  COMMENT = 339,
  COMMENTS = 340,
  COMMIT = 341,
  COMMITTED = 342,
  COMPRESSION = 343,
  CONCURRENTLY = 344,
  CONFIGURATION = 345,
  CONFLICT = 346,
  CONNECTION = 347,
  CONSTRAINT = 348,
  CONSTRAINTS = 349,
  CONTENT_P = 350,
  CONTINUE_P = 351,
  CONVERSION_P = 352,
  COPY = 353,
  COST = 354,
  CREATE = 355,
  CROSS = 356,
  CSV = 357,
  CUBE = 358,
  CURRENT_P = 359,
  CURRENT_CATALOG = 360,
  CURRENT_DATE = 361,
  CURRENT_ROLE = 362,
  CURRENT_SCHEMA = 363,
  CURRENT_TIME = 364,
  CURRENT_TIMESTAMP = 365,
  CURRENT_USER = 366,
  CURSOR = 367,
  CYCLE = 368,
  DATA_P = 369,
  DATABASE = 370,
  DAY_P = 371,
  DEALLOCATE = 372,
  DEC = 373,
  DECIMAL_P = 374,
  DECLARE = 375,
  DEFAULT = 376,
  DEFAULTS = 377,
  DEFERRABLE = 378,
  DEFERRED = 379,
  DEFINER = 380,
  DELETE_P = 381,
  DELIMITER = 382,
  DELIMITERS = 383,
  DEPENDS = 384,
  DEPTH = 385,
  DESC = 386,
  DETACH = 387,
  DICTIONARY = 388,
  DISABLE_P = 389,
  DISCARD = 390,
  DISTINCT = 391,
  DO = 392,
  DOCUMENT_P = 393,
  DOMAIN_P = 394,
  DOUBLE_P = 395,
  DROP = 396,
  EACH = 397,
  ELSE = 398,
  ENABLE_P = 399,
  ENCODING = 400,
  ENCRYPTED = 401,
  END_P = 402,
  ENUM_P = 403,
  ESCAPE = 404,
  EVENT = 405,
  EXCEPT = 406,
  EXCLUDE = 407,
  EXCLUDING = 408,
  EXCLUSIVE = 409,
  EXECUTE = 410,
  EXISTS = 411,
  EXPLAIN = 412,
  EXPRESSION = 413,
  EXTENSION = 414,
  EXTERNAL = 415,
  EXTRACT = 416,
  FALSE_P = 417,
  FAMILY = 418,
  FETCH = 419,
  FILTER = 420,
  FINALIZE = 421,
  FIRST_P = 422,
  FLOAT_P = 423,
  FOLLOWING = 424,
  FOR = 425,
  FORCE = 426,
  FOREIGN = 427,
  FORMAT = 428,
  FORWARD = 429,
  FREEZE = 430,
  FROM = 431,
  FULL = 432,
  FUNCTION = 433,
  FUNCTIONS = 434,
  GENERATED = 435,
  GLOBAL = 436,
  GRANT = 437,
  GRANTED = 438,
  GREATEST = 439,
  GROUP_P = 440,
  GROUPING = 441,
  GROUPS = 442,
  HANDLER = 443,
  HAVING = 444,
  HEADER_P = 445,
  HOLD = 446,
  HOUR_P = 447,
  IDENTITY_P = 448,
  IF_P = 449,
  ILIKE = 450,
  IMMEDIATE = 451,
  IMMUTABLE = 452,
  IMPLICIT_P = 453,
  IMPORT_P = 454,
  IN_P = 455,
  INCLUDE = 456,
  INCLUDING = 457,
  INCREMENT = 458,
  INDENT = 459,
  INDEX = 460,
  INDEXES = 461,
  INHERIT = 462,
  INHERITS = 463,
  INITIALLY = 464,
  INLINE_P = 465,
  INNER_P = 466,
  INOUT = 467,
  INPUT_P = 468,
  INSENSITIVE = 469,
  INSERT = 470,
  INSTEAD = 471,
  INT_P = 472,
  INTEGER = 473,
  INTERSECT = 474,
  INTERVAL = 475,
  INTO = 476,
  INVOKER = 477,
  IS = 478,
  ISNULL = 479,
  ISOLATION = 480,
  JOIN = 481,
  JSON = 482,
  JSON_ARRAY = 483,
  JSON_ARRAYAGG = 484,
  JSON_OBJECT = 485,
  JSON_OBJECTAGG = 486,
  KEY = 487,
  KEYS = 488,
  LABEL = 489,
  LANGUAGE = 490,
  LARGE_P = 491,
  LAST_P = 492,
  LATERAL_P = 493,
  LEADING = 494,
  LEAKPROOF = 495,
  LEAST = 496,
  LEFT = 497,
  LEVEL = 498,
  LIKE = 499,
  LIMIT = 500,
  LISTEN = 501,
  LOAD = 502,
  LOCAL = 503,
  LOCALTIME = 504,
  LOCALTIMESTAMP = 505,
  LOCATION = 506,
  LOCK_P = 507,
  LOCKED = 508,
  LOGGED = 509,
  MAPPING = 510,
  MATCH = 511,
  MATCHED = 512,
  MATERIALIZED = 513,
  MAXVALUE = 514,
  MERGE = 515,
  METHOD = 516,
  MINUTE_P = 517,
  MINVALUE = 518,
  MODE = 519,
  MONTH_P = 520,
  MOVE = 521,
  NAME_P = 522,
  NAMES = 523,
  NATIONAL = 524,
  NATURAL = 525,
  NCHAR = 526,
  NEW = 527,
  NEXT = 528,
  NFC = 529,
  NFD = 530,
  NFKC = 531,
  NFKD = 532,
  NO = 533,
  NONE = 534,
  NORMALIZE = 535,
  NORMALIZED = 536,
  NOT = 537,
  NOTHING = 538,
  NOTIFY = 539,
  NOTNULL = 540,
  NOWAIT = 541,
  NULL_P = 542,
  NULLIF = 543,
  NULLS_P = 544,
  NUMERIC = 545,
  OBJECT_P = 546,
  OF = 547,
  OFF = 548,
  OFFSET = 549,
  OIDS = 550,
  OLD = 551,
  ON = 552,
  ONLY = 553,
  OPERATOR = 554,
  OPTION = 555,
  OPTIONS = 556,
  OR = 557,
  ORDER = 558,
  ORDINALITY = 559,
  OTHERS = 560,
  OUT_P = 561,
  OUTER_P = 562,
  OVER = 563,
  OVERLAPS = 564,
  OVERLAY = 565,
  OVERRIDING = 566,
  OWNED = 567,
  OWNER = 568,
  PARALLEL = 569,
  PARAMETER = 570,
  PARSER = 571,
  PARTIAL = 572,
  PARTITION = 573,
  PASSING = 574,
  PASSWORD = 575,
  PLACING = 576,
  PLANS = 577,
  POLICY = 578,
  POSITION = 579,
  PRECEDING = 580,
  PRECISION = 581,
  PRESERVE = 582,
  PREPARE = 583,
  PREPARED = 584,
  PRIMARY = 585,
  PRIOR = 586,
  PRIVILEGES = 587,
  PROCEDURAL = 588,
  PROCEDURE = 589,
  PROCEDURES = 590,
  PROGRAM = 591,
  PUBLICATION = 592,
  QUOTE = 593,
  RANGE = 594,
  READ = 595,
  REAL = 596,
  REASSIGN = 597,
  RECHECK = 598,
  RECURSIVE = 599,
  REF_P = 600,
  REFERENCES = 601,
  REFERENCING = 602,
  REFRESH = 603,
  REINDEX = 604,
  RELATIVE_P = 605,
  RELEASE = 606,
  RENAME = 607,
  REPEATABLE = 608,
  REPLACE = 609,
  REPLICA = 610,
  RESET = 611,
  RESTART = 612,
  RESTRICT = 613,
  RETURN = 614,
  RETURNING = 615,
  RETURNS = 616,
  REVOKE = 617,
  RIGHT = 618,
  ROLE = 619,
  ROLLBACK = 620,
  ROLLUP = 621,
  ROUTINE = 622,
  ROUTINES = 623,
  ROW = 624,
  ROWS = 625,
  RULE = 626,
  SAVEPOINT = 627,
  SCALAR = 628,
  SCHEMA = 629,
  SCHEMAS = 630,
  SCROLL = 631,
  SEARCH = 632,
  SECOND_P = 633,
  SECURITY = 634,
  SELECT = 635,
  SEQUENCE = 636,
  SEQUENCES = 637,
  SERIALIZABLE = 638,
  SERVER = 639,
  SESSION = 640,
  SESSION_USER = 641,
  SET = 642,
  SETS = 643,
  SETOF = 644,
  SHARE = 645,
  SHOW = 646,
  SIMILAR = 647,
  SIMPLE = 648,
  SKIP = 649,
  SMALLINT = 650,
  SNAPSHOT = 651,
  SOME = 652,
  SQL_P = 653,
  STABLE = 654,
  STANDALONE_P = 655,
  START = 656,
  STATEMENT = 657,
  STATISTICS = 658,
  STDIN = 659,
  STDOUT = 660,
  STORAGE = 661,
  STORED = 662,
  STRICT_P = 663,
  STRIP_P = 664,
  SUBSCRIPTION = 665,
  SUBSTRING = 666,
  SUPPORT = 667,
  SYMMETRIC = 668,
  SYSID = 669,
  SYSTEM_P = 670,
  SYSTEM_USER = 671,
  TABLE = 672,
  TABLES = 673,
  TABLESAMPLE = 674,
  TABLESPACE = 675,
  TEMP = 676,
  TEMPLATE = 677,
  TEMPORARY = 678,
  TEXT_P = 679,
  THEN = 680,
  TIES = 681,
  TIME = 682,
  TIMESTAMP = 683,
  TO = 684,
  TRAILING = 685,
  TRANSACTION = 686,
  TRANSFORM = 687,
  TREAT = 688,
  TRIGGER = 689,
  TRIM = 690,
  TRUE_P = 691,
  TRUNCATE = 692,
  TRUSTED = 693,
  TYPE_P = 694,
  TYPES_P = 695,
  UESCAPE = 696,
  UNBOUNDED = 697,
  UNCOMMITTED = 698,
  UNENCRYPTED = 699,
  UNION = 700,
  UNIQUE = 701,
  UNKNOWN = 702,
  UNLISTEN = 703,
  UNLOGGED = 704,
  UNTIL = 705,
  UPDATE = 706,
  USER = 707,
  USING = 708,
  VACUUM = 709,
  VALID = 710,
  VALIDATE = 711,
  VALIDATOR = 712,
  VALUE_P = 713,
  VALUES = 714,
  VARCHAR = 715,
  VARIADIC = 716,
  VARYING = 717,
  VERBOSE = 718,
  VERSION_P = 719,
  VIEW = 720,
  VIEWS = 721,
  VOLATILE = 722,
  WHEN = 723,
  WHERE = 724,
  WHITESPACE_P = 725,
  WINDOW = 726,
  WITH = 727,
  WITHIN = 728,
  WITHOUT = 729,
  WORK = 730,
  WRAPPER = 731,
  WRITE = 732,
  XML_P = 733,
  XMLATTRIBUTES = 734,
  XMLCONCAT = 735,
  XMLELEMENT = 736,
  XMLEXISTS = 737,
  XMLFOREST = 738,
  XMLNAMESPACES = 739,
  XMLPARSE = 740,
  XMLPI = 741,
  XMLROOT = 742,
  XMLSERIALIZE = 743,
  XMLTABLE = 744,
  YEAR_P = 745,
  YES_P = 746,
  ZONE = 747,
  FORMAT_LA = 748,
  NOT_LA = 749,
  NULLS_LA = 750,
  WITH_LA = 751,
  WITHOUT_LA = 752,
  MODE_TYPE_NAME = 753,
  MODE_PLPGSQL_EXPR = 754,
  MODE_PLPGSQL_ASSIGN1 = 755,
  MODE_PLPGSQL_ASSIGN2 = 756,
  MODE_PLPGSQL_ASSIGN3 = 757,
  UMINUS = 758,
}
export interface ParseResult {
  version: number;
  stmts: RawStmt[];
}
export interface ScanResult {
  version: number;
  tokens: ScanToken[];
}
export interface Node {
  Alias: Alias;
  RangeVar: RangeVar;
  TableFunc: TableFunc;
  IntoClause: IntoClause;
  Var: Var;
  Param: Param;
  Aggref: Aggref;
  GroupingFunc: GroupingFunc;
  WindowFunc: WindowFunc;
  SubscriptingRef: SubscriptingRef;
  FuncExpr: FuncExpr;
  NamedArgExpr: NamedArgExpr;
  OpExpr: OpExpr;
  DistinctExpr: DistinctExpr;
  NullIfExpr: NullIfExpr;
  ScalarArrayOpExpr: ScalarArrayOpExpr;
  BoolExpr: BoolExpr;
  SubLink: SubLink;
  SubPlan: SubPlan;
  AlternativeSubPlan: AlternativeSubPlan;
  FieldSelect: FieldSelect;
  FieldStore: FieldStore;
  RelabelType: RelabelType;
  CoerceViaIO: CoerceViaIO;
  ArrayCoerceExpr: ArrayCoerceExpr;
  ConvertRowtypeExpr: ConvertRowtypeExpr;
  CollateExpr: CollateExpr;
  CaseExpr: CaseExpr;
  CaseWhen: CaseWhen;
  CaseTestExpr: CaseTestExpr;
  ArrayExpr: ArrayExpr;
  RowExpr: RowExpr;
  RowCompareExpr: RowCompareExpr;
  CoalesceExpr: CoalesceExpr;
  MinMaxExpr: MinMaxExpr;
  SQLValueFunction: SQLValueFunction;
  XmlExpr: XmlExpr;
  JsonFormat: JsonFormat;
  JsonReturning: JsonReturning;
  JsonValueExpr: JsonValueExpr;
  JsonConstructorExpr: JsonConstructorExpr;
  JsonIsPredicate: JsonIsPredicate;
  NullTest: NullTest;
  BooleanTest: BooleanTest;
  CoerceToDomain: CoerceToDomain;
  CoerceToDomainValue: CoerceToDomainValue;
  SetToDefault: SetToDefault;
  CurrentOfExpr: CurrentOfExpr;
  NextValueExpr: NextValueExpr;
  InferenceElem: InferenceElem;
  TargetEntry: TargetEntry;
  RangeTblRef: RangeTblRef;
  JoinExpr: JoinExpr;
  FromExpr: FromExpr;
  OnConflictExpr: OnConflictExpr;
  Query: Query;
  TypeName: TypeName;
  ColumnRef: ColumnRef;
  ParamRef: ParamRef;
  A_Expr: A_Expr;
  TypeCast: TypeCast;
  CollateClause: CollateClause;
  RoleSpec: RoleSpec;
  FuncCall: FuncCall;
  A_Star: A_Star;
  A_Indices: A_Indices;
  A_Indirection: A_Indirection;
  A_ArrayExpr: A_ArrayExpr;
  ResTarget: ResTarget;
  MultiAssignRef: MultiAssignRef;
  SortBy: SortBy;
  WindowDef: WindowDef;
  RangeSubselect: RangeSubselect;
  RangeFunction: RangeFunction;
  RangeTableFunc: RangeTableFunc;
  RangeTableFuncCol: RangeTableFuncCol;
  RangeTableSample: RangeTableSample;
  ColumnDef: ColumnDef;
  TableLikeClause: TableLikeClause;
  IndexElem: IndexElem;
  DefElem: DefElem;
  LockingClause: LockingClause;
  XmlSerialize: XmlSerialize;
  PartitionElem: PartitionElem;
  PartitionSpec: PartitionSpec;
  PartitionBoundSpec: PartitionBoundSpec;
  PartitionRangeDatum: PartitionRangeDatum;
  PartitionCmd: PartitionCmd;
  RangeTblEntry: RangeTblEntry;
  RTEPermissionInfo: RTEPermissionInfo;
  RangeTblFunction: RangeTblFunction;
  TableSampleClause: TableSampleClause;
  WithCheckOption: WithCheckOption;
  SortGroupClause: SortGroupClause;
  GroupingSet: GroupingSet;
  WindowClause: WindowClause;
  RowMarkClause: RowMarkClause;
  WithClause: WithClause;
  InferClause: InferClause;
  OnConflictClause: OnConflictClause;
  CTESearchClause: CTESearchClause;
  CTECycleClause: CTECycleClause;
  CommonTableExpr: CommonTableExpr;
  MergeWhenClause: MergeWhenClause;
  MergeAction: MergeAction;
  TriggerTransition: TriggerTransition;
  JsonOutput: JsonOutput;
  JsonKeyValue: JsonKeyValue;
  JsonObjectConstructor: JsonObjectConstructor;
  JsonArrayConstructor: JsonArrayConstructor;
  JsonArrayQueryConstructor: JsonArrayQueryConstructor;
  JsonAggConstructor: JsonAggConstructor;
  JsonObjectAgg: JsonObjectAgg;
  JsonArrayAgg: JsonArrayAgg;
  RawStmt: RawStmt;
  InsertStmt: InsertStmt;
  DeleteStmt: DeleteStmt;
  UpdateStmt: UpdateStmt;
  MergeStmt: MergeStmt;
  SelectStmt: SelectStmt;
  SetOperationStmt: SetOperationStmt;
  ReturnStmt: ReturnStmt;
  PLAssignStmt: PLAssignStmt;
  CreateSchemaStmt: CreateSchemaStmt;
  AlterTableStmt: AlterTableStmt;
  ReplicaIdentityStmt: ReplicaIdentityStmt;
  AlterTableCmd: AlterTableCmd;
  AlterCollationStmt: AlterCollationStmt;
  AlterDomainStmt: AlterDomainStmt;
  GrantStmt: GrantStmt;
  ObjectWithArgs: ObjectWithArgs;
  AccessPriv: AccessPriv;
  GrantRoleStmt: GrantRoleStmt;
  AlterDefaultPrivilegesStmt: AlterDefaultPrivilegesStmt;
  CopyStmt: CopyStmt;
  VariableSetStmt: VariableSetStmt;
  VariableShowStmt: VariableShowStmt;
  CreateStmt: CreateStmt;
  Constraint: Constraint;
  CreateTableSpaceStmt: CreateTableSpaceStmt;
  DropTableSpaceStmt: DropTableSpaceStmt;
  AlterTableSpaceOptionsStmt: AlterTableSpaceOptionsStmt;
  AlterTableMoveAllStmt: AlterTableMoveAllStmt;
  CreateExtensionStmt: CreateExtensionStmt;
  AlterExtensionStmt: AlterExtensionStmt;
  AlterExtensionContentsStmt: AlterExtensionContentsStmt;
  CreateFdwStmt: CreateFdwStmt;
  AlterFdwStmt: AlterFdwStmt;
  CreateForeignServerStmt: CreateForeignServerStmt;
  AlterForeignServerStmt: AlterForeignServerStmt;
  CreateForeignTableStmt: CreateForeignTableStmt;
  CreateUserMappingStmt: CreateUserMappingStmt;
  AlterUserMappingStmt: AlterUserMappingStmt;
  DropUserMappingStmt: DropUserMappingStmt;
  ImportForeignSchemaStmt: ImportForeignSchemaStmt;
  CreatePolicyStmt: CreatePolicyStmt;
  AlterPolicyStmt: AlterPolicyStmt;
  CreateAmStmt: CreateAmStmt;
  CreateTrigStmt: CreateTrigStmt;
  CreateEventTrigStmt: CreateEventTrigStmt;
  AlterEventTrigStmt: AlterEventTrigStmt;
  CreatePLangStmt: CreatePLangStmt;
  CreateRoleStmt: CreateRoleStmt;
  AlterRoleStmt: AlterRoleStmt;
  AlterRoleSetStmt: AlterRoleSetStmt;
  DropRoleStmt: DropRoleStmt;
  CreateSeqStmt: CreateSeqStmt;
  AlterSeqStmt: AlterSeqStmt;
  DefineStmt: DefineStmt;
  CreateDomainStmt: CreateDomainStmt;
  CreateOpClassStmt: CreateOpClassStmt;
  CreateOpClassItem: CreateOpClassItem;
  CreateOpFamilyStmt: CreateOpFamilyStmt;
  AlterOpFamilyStmt: AlterOpFamilyStmt;
  DropStmt: DropStmt;
  TruncateStmt: TruncateStmt;
  CommentStmt: CommentStmt;
  SecLabelStmt: SecLabelStmt;
  DeclareCursorStmt: DeclareCursorStmt;
  ClosePortalStmt: ClosePortalStmt;
  FetchStmt: FetchStmt;
  IndexStmt: IndexStmt;
  CreateStatsStmt: CreateStatsStmt;
  StatsElem: StatsElem;
  AlterStatsStmt: AlterStatsStmt;
  CreateFunctionStmt: CreateFunctionStmt;
  FunctionParameter: FunctionParameter;
  AlterFunctionStmt: AlterFunctionStmt;
  DoStmt: DoStmt;
  InlineCodeBlock: InlineCodeBlock;
  CallStmt: CallStmt;
  CallContext: CallContext;
  RenameStmt: RenameStmt;
  AlterObjectDependsStmt: AlterObjectDependsStmt;
  AlterObjectSchemaStmt: AlterObjectSchemaStmt;
  AlterOwnerStmt: AlterOwnerStmt;
  AlterOperatorStmt: AlterOperatorStmt;
  AlterTypeStmt: AlterTypeStmt;
  RuleStmt: RuleStmt;
  NotifyStmt: NotifyStmt;
  ListenStmt: ListenStmt;
  UnlistenStmt: UnlistenStmt;
  TransactionStmt: TransactionStmt;
  CompositeTypeStmt: CompositeTypeStmt;
  CreateEnumStmt: CreateEnumStmt;
  CreateRangeStmt: CreateRangeStmt;
  AlterEnumStmt: AlterEnumStmt;
  ViewStmt: ViewStmt;
  LoadStmt: LoadStmt;
  CreatedbStmt: CreatedbStmt;
  AlterDatabaseStmt: AlterDatabaseStmt;
  AlterDatabaseRefreshCollStmt: AlterDatabaseRefreshCollStmt;
  AlterDatabaseSetStmt: AlterDatabaseSetStmt;
  DropdbStmt: DropdbStmt;
  AlterSystemStmt: AlterSystemStmt;
  ClusterStmt: ClusterStmt;
  VacuumStmt: VacuumStmt;
  VacuumRelation: VacuumRelation;
  ExplainStmt: ExplainStmt;
  CreateTableAsStmt: CreateTableAsStmt;
  RefreshMatViewStmt: RefreshMatViewStmt;
  CheckPointStmt: CheckPointStmt;
  DiscardStmt: DiscardStmt;
  LockStmt: LockStmt;
  ConstraintsSetStmt: ConstraintsSetStmt;
  ReindexStmt: ReindexStmt;
  CreateConversionStmt: CreateConversionStmt;
  CreateCastStmt: CreateCastStmt;
  CreateTransformStmt: CreateTransformStmt;
  PrepareStmt: PrepareStmt;
  ExecuteStmt: ExecuteStmt;
  DeallocateStmt: DeallocateStmt;
  DropOwnedStmt: DropOwnedStmt;
  ReassignOwnedStmt: ReassignOwnedStmt;
  AlterTSDictionaryStmt: AlterTSDictionaryStmt;
  AlterTSConfigurationStmt: AlterTSConfigurationStmt;
  PublicationTable: PublicationTable;
  PublicationObjSpec: PublicationObjSpec;
  CreatePublicationStmt: CreatePublicationStmt;
  AlterPublicationStmt: AlterPublicationStmt;
  CreateSubscriptionStmt: CreateSubscriptionStmt;
  AlterSubscriptionStmt: AlterSubscriptionStmt;
  DropSubscriptionStmt: DropSubscriptionStmt;
  Integer: Integer;
  Float: Float;
  Boolean: Boolean;
  String: String;
  BitString: BitString;
  List: List;
  IntList: IntList;
  OidList: OidList;
  A_Const: A_Const;
}
export interface Integer {
  ival: number;
}
export interface Float {
  fval: string;
}
export interface Boolean {
  boolval: boolean;
}
export interface String {
  sval: string;
}
export interface BitString {
  bsval: string;
}
export interface List {
  items: Node[];
}
export interface OidList {
  items: Node[];
}
export interface IntList {
  items: Node[];
}
export interface A_Const {
  ival: Integer;
  fval: Float;
  boolval: Boolean;
  sval: String;
  bsval: BitString;
  isnull: boolean;
  location: number;
}
export interface Alias {
  aliasname: string;
  colnames: Node[];
}
export interface RangeVar {
  catalogname: string;
  schemaname: string;
  relname: string;
  inh: boolean;
  relpersistence: string;
  alias: Alias;
  location: number;
}
export interface TableFunc {
  ns_uris: Node[];
  ns_names: Node[];
  docexpr: Node;
  rowexpr: Node;
  colnames: Node[];
  coltypes: Node[];
  coltypmods: Node[];
  colcollations: Node[];
  colexprs: Node[];
  coldefexprs: Node[];
  notnulls: bigint[];
  ordinalitycol: number;
  location: number;
}
export interface IntoClause {
  rel: RangeVar;
  colNames: Node[];
  accessMethod: string;
  options: Node[];
  onCommit: OnCommitAction;
  tableSpaceName: string;
  viewQuery: Node;
  skipData: boolean;
}
export interface Var {
  xpr: Node;
  varno: number;
  varattno: number;
  vartype: number;
  vartypmod: number;
  varcollid: number;
  varnullingrels: bigint[];
  varlevelsup: number;
  location: number;
}
export interface Param {
  xpr: Node;
  paramkind: ParamKind;
  paramid: number;
  paramtype: number;
  paramtypmod: number;
  paramcollid: number;
  location: number;
}
export interface Aggref {
  xpr: Node;
  aggfnoid: number;
  aggtype: number;
  aggcollid: number;
  inputcollid: number;
  aggargtypes: Node[];
  aggdirectargs: Node[];
  args: Node[];
  aggorder: Node[];
  aggdistinct: Node[];
  aggfilter: Node;
  aggstar: boolean;
  aggvariadic: boolean;
  aggkind: string;
  agglevelsup: number;
  aggsplit: AggSplit;
  aggno: number;
  aggtransno: number;
  location: number;
}
export interface GroupingFunc {
  xpr: Node;
  args: Node[];
  refs: Node[];
  agglevelsup: number;
  location: number;
}
export interface WindowFunc {
  xpr: Node;
  winfnoid: number;
  wintype: number;
  wincollid: number;
  inputcollid: number;
  args: Node[];
  aggfilter: Node;
  winref: number;
  winstar: boolean;
  winagg: boolean;
  location: number;
}
export interface SubscriptingRef {
  xpr: Node;
  refcontainertype: number;
  refelemtype: number;
  refrestype: number;
  reftypmod: number;
  refcollid: number;
  refupperindexpr: Node[];
  reflowerindexpr: Node[];
  refexpr: Node;
  refassgnexpr: Node;
}
export interface FuncExpr {
  xpr: Node;
  funcid: number;
  funcresulttype: number;
  funcretset: boolean;
  funcvariadic: boolean;
  funcformat: CoercionForm;
  funccollid: number;
  inputcollid: number;
  args: Node[];
  location: number;
}
export interface NamedArgExpr {
  xpr: Node;
  arg: Node;
  name: string;
  argnumber: number;
  location: number;
}
export interface OpExpr {
  xpr: Node;
  opno: number;
  opresulttype: number;
  opretset: boolean;
  opcollid: number;
  inputcollid: number;
  args: Node[];
  location: number;
}
export interface DistinctExpr {
  xpr: Node;
  opno: number;
  opresulttype: number;
  opretset: boolean;
  opcollid: number;
  inputcollid: number;
  args: Node[];
  location: number;
}
export interface NullIfExpr {
  xpr: Node;
  opno: number;
  opresulttype: number;
  opretset: boolean;
  opcollid: number;
  inputcollid: number;
  args: Node[];
  location: number;
}
export interface ScalarArrayOpExpr {
  xpr: Node;
  opno: number;
  useOr: boolean;
  inputcollid: number;
  args: Node[];
  location: number;
}
export interface BoolExpr {
  xpr: Node;
  boolop: BoolExprType;
  args: Node[];
  location: number;
}
export interface SubLink {
  xpr: Node;
  subLinkType: SubLinkType;
  subLinkId: number;
  testexpr: Node;
  operName: Node[];
  subselect: Node;
  location: number;
}
export interface SubPlan {
  xpr: Node;
  subLinkType: SubLinkType;
  testexpr: Node;
  paramIds: Node[];
  plan_id: number;
  plan_name: string;
  firstColType: number;
  firstColTypmod: number;
  firstColCollation: number;
  useHashTable: boolean;
  unknownEqFalse: boolean;
  parallel_safe: boolean;
  setParam: Node[];
  parParam: Node[];
  args: Node[];
  startup_cost: number;
  per_call_cost: number;
}
export interface AlternativeSubPlan {
  xpr: Node;
  subplans: Node[];
}
export interface FieldSelect {
  xpr: Node;
  arg: Node;
  fieldnum: number;
  resulttype: number;
  resulttypmod: number;
  resultcollid: number;
}
export interface FieldStore {
  xpr: Node;
  arg: Node;
  newvals: Node[];
  fieldnums: Node[];
  resulttype: number;
}
export interface RelabelType {
  xpr: Node;
  arg: Node;
  resulttype: number;
  resulttypmod: number;
  resultcollid: number;
  relabelformat: CoercionForm;
  location: number;
}
export interface CoerceViaIO {
  xpr: Node;
  arg: Node;
  resulttype: number;
  resultcollid: number;
  coerceformat: CoercionForm;
  location: number;
}
export interface ArrayCoerceExpr {
  xpr: Node;
  arg: Node;
  elemexpr: Node;
  resulttype: number;
  resulttypmod: number;
  resultcollid: number;
  coerceformat: CoercionForm;
  location: number;
}
export interface ConvertRowtypeExpr {
  xpr: Node;
  arg: Node;
  resulttype: number;
  convertformat: CoercionForm;
  location: number;
}
export interface CollateExpr {
  xpr: Node;
  arg: Node;
  collOid: number;
  location: number;
}
export interface CaseExpr {
  xpr: Node;
  casetype: number;
  casecollid: number;
  arg: Node;
  args: Node[];
  defresult: Node;
  location: number;
}
export interface CaseWhen {
  xpr: Node;
  expr: Node;
  result: Node;
  location: number;
}
export interface CaseTestExpr {
  xpr: Node;
  typeId: number;
  typeMod: number;
  collation: number;
}
export interface ArrayExpr {
  xpr: Node;
  array_typeid: number;
  array_collid: number;
  element_typeid: number;
  elements: Node[];
  multidims: boolean;
  location: number;
}
export interface RowExpr {
  xpr: Node;
  args: Node[];
  row_typeid: number;
  row_format: CoercionForm;
  colnames: Node[];
  location: number;
}
export interface RowCompareExpr {
  xpr: Node;
  rctype: RowCompareType;
  opnos: Node[];
  opfamilies: Node[];
  inputcollids: Node[];
  largs: Node[];
  rargs: Node[];
}
export interface CoalesceExpr {
  xpr: Node;
  coalescetype: number;
  coalescecollid: number;
  args: Node[];
  location: number;
}
export interface MinMaxExpr {
  xpr: Node;
  minmaxtype: number;
  minmaxcollid: number;
  inputcollid: number;
  op: MinMaxOp;
  args: Node[];
  location: number;
}
export interface SQLValueFunction {
  xpr: Node;
  op: SQLValueFunctionOp;
  type: number;
  typmod: number;
  location: number;
}
export interface XmlExpr {
  xpr: Node;
  op: XmlExprOp;
  name: string;
  named_args: Node[];
  arg_names: Node[];
  args: Node[];
  xmloption: XmlOptionType;
  indent: boolean;
  type: number;
  typmod: number;
  location: number;
}
export interface JsonFormat {
  format_type: JsonFormatType;
  encoding: JsonEncoding;
  location: number;
}
export interface JsonReturning {
  format: JsonFormat;
  typid: number;
  typmod: number;
}
export interface JsonValueExpr {
  raw_expr: Node;
  formatted_expr: Node;
  format: JsonFormat;
}
export interface JsonConstructorExpr {
  xpr: Node;
  type: JsonConstructorType;
  args: Node[];
  func: Node;
  coercion: Node;
  returning: JsonReturning;
  absent_on_null: boolean;
  unique: boolean;
  location: number;
}
export interface JsonIsPredicate {
  expr: Node;
  format: JsonFormat;
  item_type: JsonValueType;
  unique_keys: boolean;
  location: number;
}
export interface NullTest {
  xpr: Node;
  arg: Node;
  nulltesttype: NullTestType;
  argisrow: boolean;
  location: number;
}
export interface BooleanTest {
  xpr: Node;
  arg: Node;
  booltesttype: BoolTestType;
  location: number;
}
export interface CoerceToDomain {
  xpr: Node;
  arg: Node;
  resulttype: number;
  resulttypmod: number;
  resultcollid: number;
  coercionformat: CoercionForm;
  location: number;
}
export interface CoerceToDomainValue {
  xpr: Node;
  typeId: number;
  typeMod: number;
  collation: number;
  location: number;
}
export interface SetToDefault {
  xpr: Node;
  typeId: number;
  typeMod: number;
  collation: number;
  location: number;
}
export interface CurrentOfExpr {
  xpr: Node;
  cvarno: number;
  cursor_name: string;
  cursor_param: number;
}
export interface NextValueExpr {
  xpr: Node;
  seqid: number;
  typeId: number;
}
export interface InferenceElem {
  xpr: Node;
  expr: Node;
  infercollid: number;
  inferopclass: number;
}
export interface TargetEntry {
  xpr: Node;
  expr: Node;
  resno: number;
  resname: string;
  ressortgroupref: number;
  resorigtbl: number;
  resorigcol: number;
  resjunk: boolean;
}
export interface RangeTblRef {
  rtindex: number;
}
export interface JoinExpr {
  jointype: JoinType;
  isNatural: boolean;
  larg: Node;
  rarg: Node;
  usingClause: Node[];
  join_using_alias: Alias;
  quals: Node;
  alias: Alias;
  rtindex: number;
}
export interface FromExpr {
  fromlist: Node[];
  quals: Node;
}
export interface OnConflictExpr {
  action: OnConflictAction;
  arbiterElems: Node[];
  arbiterWhere: Node;
  constraint: number;
  onConflictSet: Node[];
  onConflictWhere: Node;
  exclRelIndex: number;
  exclRelTlist: Node[];
}
export interface Query {
  commandType: CmdType;
  querySource: QuerySource;
  canSetTag: boolean;
  utilityStmt: Node;
  resultRelation: number;
  hasAggs: boolean;
  hasWindowFuncs: boolean;
  hasTargetSRFs: boolean;
  hasSubLinks: boolean;
  hasDistinctOn: boolean;
  hasRecursive: boolean;
  hasModifyingCTE: boolean;
  hasForUpdate: boolean;
  hasRowSecurity: boolean;
  isReturn: boolean;
  cteList: Node[];
  rtable: Node[];
  rteperminfos: Node[];
  jointree: FromExpr;
  mergeActionList: Node[];
  mergeUseOuterJoin: boolean;
  targetList: Node[];
  override: OverridingKind;
  onConflict: OnConflictExpr;
  returningList: Node[];
  groupClause: Node[];
  groupDistinct: boolean;
  groupingSets: Node[];
  havingQual: Node;
  windowClause: Node[];
  distinctClause: Node[];
  sortClause: Node[];
  limitOffset: Node;
  limitCount: Node;
  limitOption: LimitOption;
  rowMarks: Node[];
  setOperations: Node;
  constraintDeps: Node[];
  withCheckOptions: Node[];
  stmt_location: number;
  stmt_len: number;
}
export interface TypeName {
  names: Node[];
  typeOid: number;
  setof: boolean;
  pct_type: boolean;
  typmods: Node[];
  typemod: number;
  arrayBounds: Node[];
  location: number;
}
export interface ColumnRef {
  fields: Node[];
  location: number;
}
export interface ParamRef {
  number: number;
  location: number;
}
export interface A_Expr {
  kind: A_Expr_Kind;
  name: Node[];
  lexpr: Node;
  rexpr: Node;
  location: number;
}
export interface TypeCast {
  arg: Node;
  typeName: TypeName;
  location: number;
}
export interface CollateClause {
  arg: Node;
  collname: Node[];
  location: number;
}
export interface RoleSpec {
  roletype: RoleSpecType;
  rolename: string;
  location: number;
}
export interface FuncCall {
  funcname: Node[];
  args: Node[];
  agg_order: Node[];
  agg_filter: Node;
  over: WindowDef;
  agg_within_group: boolean;
  agg_star: boolean;
  agg_distinct: boolean;
  func_variadic: boolean;
  funcformat: CoercionForm;
  location: number;
}
export interface A_Star {}
export interface A_Indices {
  is_slice: boolean;
  lidx: Node;
  uidx: Node;
}
export interface A_Indirection {
  arg: Node;
  indirection: Node[];
}
export interface A_ArrayExpr {
  elements: Node[];
  location: number;
}
export interface ResTarget {
  name: string;
  indirection: Node[];
  val: Node;
  location: number;
}
export interface MultiAssignRef {
  source: Node;
  colno: number;
  ncolumns: number;
}
export interface SortBy {
  node: Node;
  sortby_dir: SortByDir;
  sortby_nulls: SortByNulls;
  useOp: Node[];
  location: number;
}
export interface WindowDef {
  name: string;
  refname: string;
  partitionClause: Node[];
  orderClause: Node[];
  frameOptions: number;
  startOffset: Node;
  endOffset: Node;
  location: number;
}
export interface RangeSubselect {
  lateral: boolean;
  subquery: Node;
  alias: Alias;
}
export interface RangeFunction {
  lateral: boolean;
  ordinality: boolean;
  is_rowsfrom: boolean;
  functions: Node[];
  alias: Alias;
  coldeflist: Node[];
}
export interface RangeTableFunc {
  lateral: boolean;
  docexpr: Node;
  rowexpr: Node;
  namespaces: Node[];
  columns: Node[];
  alias: Alias;
  location: number;
}
export interface RangeTableFuncCol {
  colname: string;
  typeName: TypeName;
  for_ordinality: boolean;
  is_not_null: boolean;
  colexpr: Node;
  coldefexpr: Node;
  location: number;
}
export interface RangeTableSample {
  relation: Node;
  method: Node[];
  args: Node[];
  repeatable: Node;
  location: number;
}
export interface ColumnDef {
  colname: string;
  typeName: TypeName;
  compression: string;
  inhcount: number;
  is_local: boolean;
  is_not_null: boolean;
  is_from_type: boolean;
  storage: string;
  storage_name: string;
  raw_default: Node;
  cooked_default: Node;
  identity: string;
  identitySequence: RangeVar;
  generated: string;
  collClause: CollateClause;
  collOid: number;
  constraints: Node[];
  fdwoptions: Node[];
  location: number;
}
export interface TableLikeClause {
  relation: RangeVar;
  options: number;
  relationOid: number;
}
export interface IndexElem {
  name: string;
  expr: Node;
  indexcolname: string;
  collation: Node[];
  opclass: Node[];
  opclassopts: Node[];
  ordering: SortByDir;
  nulls_ordering: SortByNulls;
}
export interface DefElem {
  defnamespace: string;
  defname: string;
  arg: Node;
  defaction: DefElemAction;
  location: number;
}
export interface LockingClause {
  lockedRels: Node[];
  strength: LockClauseStrength;
  waitPolicy: LockWaitPolicy;
}
export interface XmlSerialize {
  xmloption: XmlOptionType;
  expr: Node;
  typeName: TypeName;
  indent: boolean;
  location: number;
}
export interface PartitionElem {
  name: string;
  expr: Node;
  collation: Node[];
  opclass: Node[];
  location: number;
}
export interface PartitionSpec {
  strategy: PartitionStrategy;
  partParams: Node[];
  location: number;
}
export interface PartitionBoundSpec {
  strategy: string;
  is_default: boolean;
  modulus: number;
  remainder: number;
  listdatums: Node[];
  lowerdatums: Node[];
  upperdatums: Node[];
  location: number;
}
export interface PartitionRangeDatum {
  kind: PartitionRangeDatumKind;
  value: Node;
  location: number;
}
export interface PartitionCmd {
  name: RangeVar;
  bound: PartitionBoundSpec;
  concurrent: boolean;
}
export interface RangeTblEntry {
  rtekind: RTEKind;
  relid: number;
  relkind: string;
  rellockmode: number;
  tablesample: TableSampleClause;
  perminfoindex: number;
  subquery: Query;
  security_barrier: boolean;
  jointype: JoinType;
  joinmergedcols: number;
  joinaliasvars: Node[];
  joinleftcols: Node[];
  joinrightcols: Node[];
  join_using_alias: Alias;
  functions: Node[];
  funcordinality: boolean;
  tablefunc: TableFunc;
  values_lists: Node[];
  ctename: string;
  ctelevelsup: number;
  self_reference: boolean;
  coltypes: Node[];
  coltypmods: Node[];
  colcollations: Node[];
  enrname: string;
  enrtuples: number;
  alias: Alias;
  eref: Alias;
  lateral: boolean;
  inh: boolean;
  inFromCl: boolean;
  securityQuals: Node[];
}
export interface RTEPermissionInfo {
  relid: number;
  inh: boolean;
  requiredPerms: bigint;
  checkAsUser: number;
  selectedCols: bigint[];
  insertedCols: bigint[];
  updatedCols: bigint[];
}
export interface RangeTblFunction {
  funcexpr: Node;
  funccolcount: number;
  funccolnames: Node[];
  funccoltypes: Node[];
  funccoltypmods: Node[];
  funccolcollations: Node[];
  funcparams: bigint[];
}
export interface TableSampleClause {
  tsmhandler: number;
  args: Node[];
  repeatable: Node;
}
export interface WithCheckOption {
  kind: WCOKind;
  relname: string;
  polname: string;
  qual: Node;
  cascaded: boolean;
}
export interface SortGroupClause {
  tleSortGroupRef: number;
  eqop: number;
  sortop: number;
  nulls_first: boolean;
  hashable: boolean;
}
export interface GroupingSet {
  kind: GroupingSetKind;
  content: Node[];
  location: number;
}
export interface WindowClause {
  name: string;
  refname: string;
  partitionClause: Node[];
  orderClause: Node[];
  frameOptions: number;
  startOffset: Node;
  endOffset: Node;
  runCondition: Node[];
  startInRangeFunc: number;
  endInRangeFunc: number;
  inRangeColl: number;
  inRangeAsc: boolean;
  inRangeNullsFirst: boolean;
  winref: number;
  copiedOrder: boolean;
}
export interface RowMarkClause {
  rti: number;
  strength: LockClauseStrength;
  waitPolicy: LockWaitPolicy;
  pushedDown: boolean;
}
export interface WithClause {
  ctes: Node[];
  recursive: boolean;
  location: number;
}
export interface InferClause {
  indexElems: Node[];
  whereClause: Node;
  conname: string;
  location: number;
}
export interface OnConflictClause {
  action: OnConflictAction;
  infer: InferClause;
  targetList: Node[];
  whereClause: Node;
  location: number;
}
export interface CTESearchClause {
  search_col_list: Node[];
  search_breadth_first: boolean;
  search_seq_column: string;
  location: number;
}
export interface CTECycleClause {
  cycle_col_list: Node[];
  cycle_mark_column: string;
  cycle_mark_value: Node;
  cycle_mark_default: Node;
  cycle_path_column: string;
  location: number;
  cycle_mark_type: number;
  cycle_mark_typmod: number;
  cycle_mark_collation: number;
  cycle_mark_neop: number;
}
export interface CommonTableExpr {
  ctename: string;
  aliascolnames: Node[];
  ctematerialized: CTEMaterialize;
  ctequery: Node;
  search_clause: CTESearchClause;
  cycle_clause: CTECycleClause;
  location: number;
  cterecursive: boolean;
  cterefcount: number;
  ctecolnames: Node[];
  ctecoltypes: Node[];
  ctecoltypmods: Node[];
  ctecolcollations: Node[];
}
export interface MergeWhenClause {
  matched: boolean;
  commandType: CmdType;
  override: OverridingKind;
  condition: Node;
  targetList: Node[];
  values: Node[];
}
export interface MergeAction {
  matched: boolean;
  commandType: CmdType;
  override: OverridingKind;
  qual: Node;
  targetList: Node[];
  updateColnos: Node[];
}
export interface TriggerTransition {
  name: string;
  isNew: boolean;
  isTable: boolean;
}
export interface JsonOutput {
  typeName: TypeName;
  returning: JsonReturning;
}
export interface JsonKeyValue {
  key: Node;
  value: JsonValueExpr;
}
export interface JsonObjectConstructor {
  exprs: Node[];
  output: JsonOutput;
  absent_on_null: boolean;
  unique: boolean;
  location: number;
}
export interface JsonArrayConstructor {
  exprs: Node[];
  output: JsonOutput;
  absent_on_null: boolean;
  location: number;
}
export interface JsonArrayQueryConstructor {
  query: Node;
  output: JsonOutput;
  format: JsonFormat;
  absent_on_null: boolean;
  location: number;
}
export interface JsonAggConstructor {
  output: JsonOutput;
  agg_filter: Node;
  agg_order: Node[];
  over: WindowDef;
  location: number;
}
export interface JsonObjectAgg {
  constructor: JsonAggConstructor;
  arg: JsonKeyValue;
  absent_on_null: boolean;
  unique: boolean;
}
export interface JsonArrayAgg {
  constructor: JsonAggConstructor;
  arg: JsonValueExpr;
  absent_on_null: boolean;
}
export interface RawStmt {
  stmt: Node;
  stmt_location: number;
  stmt_len: number;
}
export interface InsertStmt {
  relation: RangeVar;
  cols: Node[];
  selectStmt: Node;
  onConflictClause: OnConflictClause;
  returningList: Node[];
  withClause: WithClause;
  override: OverridingKind;
}
export interface DeleteStmt {
  relation: RangeVar;
  usingClause: Node[];
  whereClause: Node;
  returningList: Node[];
  withClause: WithClause;
}
export interface UpdateStmt {
  relation: RangeVar;
  targetList: Node[];
  whereClause: Node;
  fromClause: Node[];
  returningList: Node[];
  withClause: WithClause;
}
export interface MergeStmt {
  relation: RangeVar;
  sourceRelation: Node;
  joinCondition: Node;
  mergeWhenClauses: Node[];
  withClause: WithClause;
}
export interface SelectStmt {
  distinctClause: Node[];
  intoClause: IntoClause;
  targetList: Node[];
  fromClause: Node[];
  whereClause: Node;
  groupClause: Node[];
  groupDistinct: boolean;
  havingClause: Node;
  windowClause: Node[];
  valuesLists: Node[];
  sortClause: Node[];
  limitOffset: Node;
  limitCount: Node;
  limitOption: LimitOption;
  lockingClause: Node[];
  withClause: WithClause;
  op: SetOperation;
  all: boolean;
  larg: SelectStmt;
  rarg: SelectStmt;
}
export interface SetOperationStmt {
  op: SetOperation;
  all: boolean;
  larg: Node;
  rarg: Node;
  colTypes: Node[];
  colTypmods: Node[];
  colCollations: Node[];
  groupClauses: Node[];
}
export interface ReturnStmt {
  returnval: Node;
}
export interface PLAssignStmt {
  name: string;
  indirection: Node[];
  nnames: number;
  val: SelectStmt;
  location: number;
}
export interface CreateSchemaStmt {
  schemaname: string;
  authrole: RoleSpec;
  schemaElts: Node[];
  if_not_exists: boolean;
}
export interface AlterTableStmt {
  relation: RangeVar;
  cmds: Node[];
  objtype: ObjectType;
  missing_ok: boolean;
}
export interface ReplicaIdentityStmt {
  identity_type: string;
  name: string;
}
export interface AlterTableCmd {
  subtype: AlterTableType;
  name: string;
  num: number;
  newowner: RoleSpec;
  def: Node;
  behavior: DropBehavior;
  missing_ok: boolean;
  recurse: boolean;
}
export interface AlterCollationStmt {
  collname: Node[];
}
export interface AlterDomainStmt {
  subtype: string;
  typeName: Node[];
  name: string;
  def: Node;
  behavior: DropBehavior;
  missing_ok: boolean;
}
export interface GrantStmt {
  is_grant: boolean;
  targtype: GrantTargetType;
  objtype: ObjectType;
  objects: Node[];
  privileges: Node[];
  grantees: Node[];
  grant_option: boolean;
  grantor: RoleSpec;
  behavior: DropBehavior;
}
export interface ObjectWithArgs {
  objname: Node[];
  objargs: Node[];
  objfuncargs: Node[];
  args_unspecified: boolean;
}
export interface AccessPriv {
  priv_name: string;
  cols: Node[];
}
export interface GrantRoleStmt {
  granted_roles: Node[];
  grantee_roles: Node[];
  is_grant: boolean;
  opt: Node[];
  grantor: RoleSpec;
  behavior: DropBehavior;
}
export interface AlterDefaultPrivilegesStmt {
  options: Node[];
  action: GrantStmt;
}
export interface CopyStmt {
  relation: RangeVar;
  query: Node;
  attlist: Node[];
  is_from: boolean;
  is_program: boolean;
  filename: string;
  options: Node[];
  whereClause: Node;
}
export interface VariableSetStmt {
  kind: VariableSetKind;
  name: string;
  args: Node[];
  is_local: boolean;
}
export interface VariableShowStmt {
  name: string;
}
export interface CreateStmt {
  relation: RangeVar;
  tableElts: Node[];
  inhRelations: Node[];
  partbound: PartitionBoundSpec;
  partspec: PartitionSpec;
  ofTypename: TypeName;
  constraints: Node[];
  options: Node[];
  oncommit: OnCommitAction;
  tablespacename: string;
  accessMethod: string;
  if_not_exists: boolean;
}
export interface Constraint {
  contype: ConstrType;
  conname: string;
  deferrable: boolean;
  initdeferred: boolean;
  location: number;
  is_no_inherit: boolean;
  raw_expr: Node;
  cooked_expr: string;
  generated_when: string;
  nulls_not_distinct: boolean;
  keys: Node[];
  including: Node[];
  exclusions: Node[];
  options: Node[];
  indexname: string;
  indexspace: string;
  reset_default_tblspc: boolean;
  access_method: string;
  where_clause: Node;
  pktable: RangeVar;
  fk_attrs: Node[];
  pk_attrs: Node[];
  fk_matchtype: string;
  fk_upd_action: string;
  fk_del_action: string;
  fk_del_set_cols: Node[];
  old_conpfeqop: Node[];
  old_pktable_oid: number;
  skip_validation: boolean;
  initially_valid: boolean;
}
export interface CreateTableSpaceStmt {
  tablespacename: string;
  owner: RoleSpec;
  location: string;
  options: Node[];
}
export interface DropTableSpaceStmt {
  tablespacename: string;
  missing_ok: boolean;
}
export interface AlterTableSpaceOptionsStmt {
  tablespacename: string;
  options: Node[];
  isReset: boolean;
}
export interface AlterTableMoveAllStmt {
  orig_tablespacename: string;
  objtype: ObjectType;
  roles: Node[];
  new_tablespacename: string;
  nowait: boolean;
}
export interface CreateExtensionStmt {
  extname: string;
  if_not_exists: boolean;
  options: Node[];
}
export interface AlterExtensionStmt {
  extname: string;
  options: Node[];
}
export interface AlterExtensionContentsStmt {
  extname: string;
  action: number;
  objtype: ObjectType;
  object: Node;
}
export interface CreateFdwStmt {
  fdwname: string;
  func_options: Node[];
  options: Node[];
}
export interface AlterFdwStmt {
  fdwname: string;
  func_options: Node[];
  options: Node[];
}
export interface CreateForeignServerStmt {
  servername: string;
  servertype: string;
  version: string;
  fdwname: string;
  if_not_exists: boolean;
  options: Node[];
}
export interface AlterForeignServerStmt {
  servername: string;
  version: string;
  options: Node[];
  has_version: boolean;
}
export interface CreateForeignTableStmt {
  base: CreateStmt;
  servername: string;
  options: Node[];
}
export interface CreateUserMappingStmt {
  user: RoleSpec;
  servername: string;
  if_not_exists: boolean;
  options: Node[];
}
export interface AlterUserMappingStmt {
  user: RoleSpec;
  servername: string;
  options: Node[];
}
export interface DropUserMappingStmt {
  user: RoleSpec;
  servername: string;
  missing_ok: boolean;
}
export interface ImportForeignSchemaStmt {
  server_name: string;
  remote_schema: string;
  local_schema: string;
  list_type: ImportForeignSchemaType;
  table_list: Node[];
  options: Node[];
}
export interface CreatePolicyStmt {
  policy_name: string;
  table: RangeVar;
  cmd_name: string;
  permissive: boolean;
  roles: Node[];
  qual: Node;
  with_check: Node;
}
export interface AlterPolicyStmt {
  policy_name: string;
  table: RangeVar;
  roles: Node[];
  qual: Node;
  with_check: Node;
}
export interface CreateAmStmt {
  amname: string;
  handler_name: Node[];
  amtype: string;
}
export interface CreateTrigStmt {
  replace: boolean;
  isconstraint: boolean;
  trigname: string;
  relation: RangeVar;
  funcname: Node[];
  args: Node[];
  row: boolean;
  timing: number;
  events: number;
  columns: Node[];
  whenClause: Node;
  transitionRels: Node[];
  deferrable: boolean;
  initdeferred: boolean;
  constrrel: RangeVar;
}
export interface CreateEventTrigStmt {
  trigname: string;
  eventname: string;
  whenclause: Node[];
  funcname: Node[];
}
export interface AlterEventTrigStmt {
  trigname: string;
  tgenabled: string;
}
export interface CreatePLangStmt {
  replace: boolean;
  plname: string;
  plhandler: Node[];
  plinline: Node[];
  plvalidator: Node[];
  pltrusted: boolean;
}
export interface CreateRoleStmt {
  stmt_type: RoleStmtType;
  role: string;
  options: Node[];
}
export interface AlterRoleStmt {
  role: RoleSpec;
  options: Node[];
  action: number;
}
export interface AlterRoleSetStmt {
  role: RoleSpec;
  database: string;
  setstmt: VariableSetStmt;
}
export interface DropRoleStmt {
  roles: Node[];
  missing_ok: boolean;
}
export interface CreateSeqStmt {
  sequence: RangeVar;
  options: Node[];
  ownerId: number;
  for_identity: boolean;
  if_not_exists: boolean;
}
export interface AlterSeqStmt {
  sequence: RangeVar;
  options: Node[];
  for_identity: boolean;
  missing_ok: boolean;
}
export interface DefineStmt {
  kind: ObjectType;
  oldstyle: boolean;
  defnames: Node[];
  args: Node[];
  definition: Node[];
  if_not_exists: boolean;
  replace: boolean;
}
export interface CreateDomainStmt {
  domainname: Node[];
  typeName: TypeName;
  collClause: CollateClause;
  constraints: Node[];
}
export interface CreateOpClassStmt {
  opclassname: Node[];
  opfamilyname: Node[];
  amname: string;
  datatype: TypeName;
  items: Node[];
  isDefault: boolean;
}
export interface CreateOpClassItem {
  itemtype: number;
  name: ObjectWithArgs;
  number: number;
  order_family: Node[];
  class_args: Node[];
  storedtype: TypeName;
}
export interface CreateOpFamilyStmt {
  opfamilyname: Node[];
  amname: string;
}
export interface AlterOpFamilyStmt {
  opfamilyname: Node[];
  amname: string;
  isDrop: boolean;
  items: Node[];
}
export interface DropStmt {
  objects: Node[];
  removeType: ObjectType;
  behavior: DropBehavior;
  missing_ok: boolean;
  concurrent: boolean;
}
export interface TruncateStmt {
  relations: Node[];
  restart_seqs: boolean;
  behavior: DropBehavior;
}
export interface CommentStmt {
  objtype: ObjectType;
  object: Node;
  comment: string;
}
export interface SecLabelStmt {
  objtype: ObjectType;
  object: Node;
  provider: string;
  label: string;
}
export interface DeclareCursorStmt {
  portalname: string;
  options: number;
  query: Node;
}
export interface ClosePortalStmt {
  portalname: string;
}
export interface FetchStmt {
  direction: FetchDirection;
  howMany: bigint;
  portalname: string;
  ismove: boolean;
}
export interface IndexStmt {
  idxname: string;
  relation: RangeVar;
  accessMethod: string;
  tableSpace: string;
  indexParams: Node[];
  indexIncludingParams: Node[];
  options: Node[];
  whereClause: Node;
  excludeOpNames: Node[];
  idxcomment: string;
  indexOid: number;
  oldNumber: number;
  oldCreateSubid: number;
  oldFirstRelfilelocatorSubid: number;
  unique: boolean;
  nulls_not_distinct: boolean;
  primary: boolean;
  isconstraint: boolean;
  deferrable: boolean;
  initdeferred: boolean;
  transformed: boolean;
  concurrent: boolean;
  if_not_exists: boolean;
  reset_default_tblspc: boolean;
}
export interface CreateStatsStmt {
  defnames: Node[];
  stat_types: Node[];
  exprs: Node[];
  relations: Node[];
  stxcomment: string;
  transformed: boolean;
  if_not_exists: boolean;
}
export interface StatsElem {
  name: string;
  expr: Node;
}
export interface AlterStatsStmt {
  defnames: Node[];
  stxstattarget: number;
  missing_ok: boolean;
}
export interface CreateFunctionStmt {
  is_procedure: boolean;
  replace: boolean;
  funcname: Node[];
  parameters: Node[];
  returnType: TypeName;
  options: Node[];
  sql_body: Node;
}
export interface FunctionParameter {
  name: string;
  argType: TypeName;
  mode: FunctionParameterMode;
  defexpr: Node;
}
export interface AlterFunctionStmt {
  objtype: ObjectType;
  func: ObjectWithArgs;
  actions: Node[];
}
export interface DoStmt {
  args: Node[];
}
export interface InlineCodeBlock {
  source_text: string;
  langOid: number;
  langIsTrusted: boolean;
  atomic: boolean;
}
export interface CallStmt {
  funccall: FuncCall;
  funcexpr: FuncExpr;
  outargs: Node[];
}
export interface CallContext {
  atomic: boolean;
}
export interface RenameStmt {
  renameType: ObjectType;
  relationType: ObjectType;
  relation: RangeVar;
  object: Node;
  subname: string;
  newname: string;
  behavior: DropBehavior;
  missing_ok: boolean;
}
export interface AlterObjectDependsStmt {
  objectType: ObjectType;
  relation: RangeVar;
  object: Node;
  extname: String;
  remove: boolean;
}
export interface AlterObjectSchemaStmt {
  objectType: ObjectType;
  relation: RangeVar;
  object: Node;
  newschema: string;
  missing_ok: boolean;
}
export interface AlterOwnerStmt {
  objectType: ObjectType;
  relation: RangeVar;
  object: Node;
  newowner: RoleSpec;
}
export interface AlterOperatorStmt {
  opername: ObjectWithArgs;
  options: Node[];
}
export interface AlterTypeStmt {
  typeName: Node[];
  options: Node[];
}
export interface RuleStmt {
  relation: RangeVar;
  rulename: string;
  whereClause: Node;
  event: CmdType;
  instead: boolean;
  actions: Node[];
  replace: boolean;
}
export interface NotifyStmt {
  conditionname: string;
  payload: string;
}
export interface ListenStmt {
  conditionname: string;
}
export interface UnlistenStmt {
  conditionname: string;
}
export interface TransactionStmt {
  kind: TransactionStmtKind;
  options: Node[];
  savepoint_name: string;
  gid: string;
  chain: boolean;
}
export interface CompositeTypeStmt {
  typevar: RangeVar;
  coldeflist: Node[];
}
export interface CreateEnumStmt {
  typeName: Node[];
  vals: Node[];
}
export interface CreateRangeStmt {
  typeName: Node[];
  params: Node[];
}
export interface AlterEnumStmt {
  typeName: Node[];
  oldVal: string;
  newVal: string;
  newValNeighbor: string;
  newValIsAfter: boolean;
  skipIfNewValExists: boolean;
}
export interface ViewStmt {
  view: RangeVar;
  aliases: Node[];
  query: Node;
  replace: boolean;
  options: Node[];
  withCheckOption: ViewCheckOption;
}
export interface LoadStmt {
  filename: string;
}
export interface CreatedbStmt {
  dbname: string;
  options: Node[];
}
export interface AlterDatabaseStmt {
  dbname: string;
  options: Node[];
}
export interface AlterDatabaseRefreshCollStmt {
  dbname: string;
}
export interface AlterDatabaseSetStmt {
  dbname: string;
  setstmt: VariableSetStmt;
}
export interface DropdbStmt {
  dbname: string;
  missing_ok: boolean;
  options: Node[];
}
export interface AlterSystemStmt {
  setstmt: VariableSetStmt;
}
export interface ClusterStmt {
  relation: RangeVar;
  indexname: string;
  params: Node[];
}
export interface VacuumStmt {
  options: Node[];
  rels: Node[];
  is_vacuumcmd: boolean;
}
export interface VacuumRelation {
  relation: RangeVar;
  oid: number;
  va_cols: Node[];
}
export interface ExplainStmt {
  query: Node;
  options: Node[];
}
export interface CreateTableAsStmt {
  query: Node;
  into: IntoClause;
  objtype: ObjectType;
  is_select_into: boolean;
  if_not_exists: boolean;
}
export interface RefreshMatViewStmt {
  concurrent: boolean;
  skipData: boolean;
  relation: RangeVar;
}
export interface CheckPointStmt {}
export interface DiscardStmt {
  target: DiscardMode;
}
export interface LockStmt {
  relations: Node[];
  mode: number;
  nowait: boolean;
}
export interface ConstraintsSetStmt {
  constraints: Node[];
  deferred: boolean;
}
export interface ReindexStmt {
  kind: ReindexObjectType;
  relation: RangeVar;
  name: string;
  params: Node[];
}
export interface CreateConversionStmt {
  conversion_name: Node[];
  for_encoding_name: string;
  to_encoding_name: string;
  func_name: Node[];
  def: boolean;
}
export interface CreateCastStmt {
  sourcetype: TypeName;
  targettype: TypeName;
  func: ObjectWithArgs;
  context: CoercionContext;
  inout: boolean;
}
export interface CreateTransformStmt {
  replace: boolean;
  type_name: TypeName;
  lang: string;
  fromsql: ObjectWithArgs;
  tosql: ObjectWithArgs;
}
export interface PrepareStmt {
  name: string;
  argtypes: Node[];
  query: Node;
}
export interface ExecuteStmt {
  name: string;
  params: Node[];
}
export interface DeallocateStmt {
  name: string;
}
export interface DropOwnedStmt {
  roles: Node[];
  behavior: DropBehavior;
}
export interface ReassignOwnedStmt {
  roles: Node[];
  newrole: RoleSpec;
}
export interface AlterTSDictionaryStmt {
  dictname: Node[];
  options: Node[];
}
export interface AlterTSConfigurationStmt {
  kind: AlterTSConfigType;
  cfgname: Node[];
  tokentype: Node[];
  dicts: Node[];
  override: boolean;
  replace: boolean;
  missing_ok: boolean;
}
export interface PublicationTable {
  relation: RangeVar;
  whereClause: Node;
  columns: Node[];
}
export interface PublicationObjSpec {
  pubobjtype: PublicationObjSpecType;
  name: string;
  pubtable: PublicationTable;
  location: number;
}
export interface CreatePublicationStmt {
  pubname: string;
  options: Node[];
  pubobjects: Node[];
  for_all_tables: boolean;
}
export interface AlterPublicationStmt {
  pubname: string;
  options: Node[];
  pubobjects: Node[];
  for_all_tables: boolean;
  action: AlterPublicationAction;
}
export interface CreateSubscriptionStmt {
  subname: string;
  conninfo: string;
  publication: Node[];
  options: Node[];
}
export interface AlterSubscriptionStmt {
  kind: AlterSubscriptionType;
  subname: string;
  conninfo: string;
  publication: Node[];
  options: Node[];
}
export interface DropSubscriptionStmt {
  subname: string;
  missing_ok: boolean;
  behavior: DropBehavior;
}
export interface ScanToken {
  start: number;
  end: number;
  token: Token;
  keyword_kind: KeywordKind;
}