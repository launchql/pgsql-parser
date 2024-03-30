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
export enum A_Expr_Kind {
  AEXPR_OP = 0,
  AEXPR_OP_ANY = 1,
  AEXPR_OP_ALL = 2,
  AEXPR_DISTINCT = 3,
  AEXPR_NOT_DISTINCT = 4,
  AEXPR_NULLIF = 5,
  AEXPR_OF = 6,
  AEXPR_IN = 7,
  AEXPR_LIKE = 8,
  AEXPR_ILIKE = 9,
  AEXPR_SIMILAR = 10,
  AEXPR_BETWEEN = 11,
  AEXPR_NOT_BETWEEN = 12,
  AEXPR_BETWEEN_SYM = 13,
  AEXPR_NOT_BETWEEN_SYM = 14,
  AEXPR_PAREN = 15,
}
export enum RoleSpecType {
  ROLESPEC_CSTRING = 0,
  ROLESPEC_CURRENT_USER = 1,
  ROLESPEC_SESSION_USER = 2,
  ROLESPEC_PUBLIC = 3,
}
export enum TableLikeOption {
  CREATE_TABLE_LIKE_COMMENTS = 0,
  CREATE_TABLE_LIKE_CONSTRAINTS = 1,
  CREATE_TABLE_LIKE_DEFAULTS = 2,
  CREATE_TABLE_LIKE_GENERATED = 3,
  CREATE_TABLE_LIKE_IDENTITY = 4,
  CREATE_TABLE_LIKE_INDEXES = 5,
  CREATE_TABLE_LIKE_STATISTICS = 6,
  CREATE_TABLE_LIKE_STORAGE = 7,
  CREATE_TABLE_LIKE_ALL = 8,
}
export enum DefElemAction {
  DEFELEM_UNSPEC = 0,
  DEFELEM_SET = 1,
  DEFELEM_ADD = 2,
  DEFELEM_DROP = 3,
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
  OBJECT_POLICY = 27,
  OBJECT_PROCEDURE = 28,
  OBJECT_PUBLICATION = 29,
  OBJECT_PUBLICATION_REL = 30,
  OBJECT_ROLE = 31,
  OBJECT_ROUTINE = 32,
  OBJECT_RULE = 33,
  OBJECT_SCHEMA = 34,
  OBJECT_SEQUENCE = 35,
  OBJECT_SUBSCRIPTION = 36,
  OBJECT_STATISTIC_EXT = 37,
  OBJECT_TABCONSTRAINT = 38,
  OBJECT_TABLE = 39,
  OBJECT_TABLESPACE = 40,
  OBJECT_TRANSFORM = 41,
  OBJECT_TRIGGER = 42,
  OBJECT_TSCONFIGURATION = 43,
  OBJECT_TSDICTIONARY = 44,
  OBJECT_TSPARSER = 45,
  OBJECT_TSTEMPLATE = 46,
  OBJECT_TYPE = 47,
  OBJECT_USER_MAPPING = 48,
  OBJECT_VIEW = 49,
}
export enum DropBehavior {
  DROP_RESTRICT = 0,
  DROP_CASCADE = 1,
}
export enum AlterTableType {
  AT_AddColumn = 0,
  AT_AddColumnRecurse = 1,
  AT_AddColumnToView = 2,
  AT_ColumnDefault = 3,
  AT_CookedColumnDefault = 4,
  AT_DropNotNull = 5,
  AT_SetNotNull = 6,
  AT_DropExpression = 7,
  AT_CheckNotNull = 8,
  AT_SetStatistics = 9,
  AT_SetOptions = 10,
  AT_ResetOptions = 11,
  AT_SetStorage = 12,
  AT_DropColumn = 13,
  AT_DropColumnRecurse = 14,
  AT_AddIndex = 15,
  AT_ReAddIndex = 16,
  AT_AddConstraint = 17,
  AT_AddConstraintRecurse = 18,
  AT_ReAddConstraint = 19,
  AT_ReAddDomainConstraint = 20,
  AT_AlterConstraint = 21,
  AT_ValidateConstraint = 22,
  AT_ValidateConstraintRecurse = 23,
  AT_AddIndexConstraint = 24,
  AT_DropConstraint = 25,
  AT_DropConstraintRecurse = 26,
  AT_ReAddComment = 27,
  AT_AlterColumnType = 28,
  AT_AlterColumnGenericOptions = 29,
  AT_ChangeOwner = 30,
  AT_ClusterOn = 31,
  AT_DropCluster = 32,
  AT_SetLogged = 33,
  AT_SetUnLogged = 34,
  AT_DropOids = 35,
  AT_SetTableSpace = 36,
  AT_SetRelOptions = 37,
  AT_ResetRelOptions = 38,
  AT_ReplaceRelOptions = 39,
  AT_EnableTrig = 40,
  AT_EnableAlwaysTrig = 41,
  AT_EnableReplicaTrig = 42,
  AT_DisableTrig = 43,
  AT_EnableTrigAll = 44,
  AT_DisableTrigAll = 45,
  AT_EnableTrigUser = 46,
  AT_DisableTrigUser = 47,
  AT_EnableRule = 48,
  AT_EnableAlwaysRule = 49,
  AT_EnableReplicaRule = 50,
  AT_DisableRule = 51,
  AT_AddInherit = 52,
  AT_DropInherit = 53,
  AT_AddOf = 54,
  AT_DropOf = 55,
  AT_ReplicaIdentity = 56,
  AT_EnableRowSecurity = 57,
  AT_DisableRowSecurity = 58,
  AT_ForceRowSecurity = 59,
  AT_NoForceRowSecurity = 60,
  AT_GenericOptions = 61,
  AT_AttachPartition = 62,
  AT_DetachPartition = 63,
  AT_AddIdentity = 64,
  AT_SetIdentity = 65,
  AT_DropIdentity = 66,
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
export enum ClusterOption {
  CLUOPT_RECHECK = 0,
  CLUOPT_VERBOSE = 1,
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
export enum AlterSubscriptionType {
  ALTER_SUBSCRIPTION_OPTIONS = 0,
  ALTER_SUBSCRIPTION_CONNECTION = 1,
  ALTER_SUBSCRIPTION_PUBLICATION = 2,
  ALTER_SUBSCRIPTION_REFRESH = 3,
  ALTER_SUBSCRIPTION_ENABLED = 4,
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
  COERCION_EXPLICIT = 2,
}
export enum CoercionForm {
  COERCE_EXPLICIT_CALL = 0,
  COERCE_EXPLICIT_CAST = 1,
  COERCE_IMPLICIT_CAST = 2,
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
  CMD_UTILITY = 5,
  CMD_NOTHING = 6,
}
export enum JoinType {
  JOIN_INNER = 0,
  JOIN_LEFT = 1,
  JOIN_FULL = 2,
  JOIN_RIGHT = 3,
  JOIN_SEMI = 4,
  JOIN_ANTI = 5,
  JOIN_UNIQUE_OUTER = 6,
  JOIN_UNIQUE_INNER = 7,
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
  ABSOLUTE_P = 278,
  ACCESS = 279,
  ACTION = 280,
  ADD_P = 281,
  ADMIN = 282,
  AFTER = 283,
  AGGREGATE = 284,
  ALL = 285,
  ALSO = 286,
  ALTER = 287,
  ALWAYS = 288,
  ANALYSE = 289,
  ANALYZE = 290,
  AND = 291,
  ANY = 292,
  ARRAY = 293,
  AS = 294,
  ASC = 295,
  ASSERTION = 296,
  ASSIGNMENT = 297,
  ASYMMETRIC = 298,
  AT = 299,
  ATTACH = 300,
  ATTRIBUTE = 301,
  AUTHORIZATION = 302,
  BACKWARD = 303,
  BEFORE = 304,
  BEGIN_P = 305,
  BETWEEN = 306,
  BIGINT = 307,
  BINARY = 308,
  BIT = 309,
  BOOLEAN_P = 310,
  BOTH = 311,
  BY = 312,
  CACHE = 313,
  CALL = 314,
  CALLED = 315,
  CASCADE = 316,
  CASCADED = 317,
  CASE = 318,
  CAST = 319,
  CATALOG_P = 320,
  CHAIN = 321,
  CHAR_P = 322,
  CHARACTER = 323,
  CHARACTERISTICS = 324,
  CHECK = 325,
  CHECKPOINT = 326,
  CLASS = 327,
  CLOSE = 328,
  CLUSTER = 329,
  COALESCE = 330,
  COLLATE = 331,
  COLLATION = 332,
  COLUMN = 333,
  COLUMNS = 334,
  COMMENT = 335,
  COMMENTS = 336,
  COMMIT = 337,
  COMMITTED = 338,
  CONCURRENTLY = 339,
  CONFIGURATION = 340,
  CONFLICT = 341,
  CONNECTION = 342,
  CONSTRAINT = 343,
  CONSTRAINTS = 344,
  CONTENT_P = 345,
  CONTINUE_P = 346,
  CONVERSION_P = 347,
  COPY = 348,
  COST = 349,
  CREATE = 350,
  CROSS = 351,
  CSV = 352,
  CUBE = 353,
  CURRENT_P = 354,
  CURRENT_CATALOG = 355,
  CURRENT_DATE = 356,
  CURRENT_ROLE = 357,
  CURRENT_SCHEMA = 358,
  CURRENT_TIME = 359,
  CURRENT_TIMESTAMP = 360,
  CURRENT_USER = 361,
  CURSOR = 362,
  CYCLE = 363,
  DATA_P = 364,
  DATABASE = 365,
  DAY_P = 366,
  DEALLOCATE = 367,
  DEC = 368,
  DECIMAL_P = 369,
  DECLARE = 370,
  DEFAULT = 371,
  DEFAULTS = 372,
  DEFERRABLE = 373,
  DEFERRED = 374,
  DEFINER = 375,
  DELETE_P = 376,
  DELIMITER = 377,
  DELIMITERS = 378,
  DEPENDS = 379,
  DESC = 380,
  DETACH = 381,
  DICTIONARY = 382,
  DISABLE_P = 383,
  DISCARD = 384,
  DISTINCT = 385,
  DO = 386,
  DOCUMENT_P = 387,
  DOMAIN_P = 388,
  DOUBLE_P = 389,
  DROP = 390,
  EACH = 391,
  ELSE = 392,
  ENABLE_P = 393,
  ENCODING = 394,
  ENCRYPTED = 395,
  END_P = 396,
  ENUM_P = 397,
  ESCAPE = 398,
  EVENT = 399,
  EXCEPT = 400,
  EXCLUDE = 401,
  EXCLUDING = 402,
  EXCLUSIVE = 403,
  EXECUTE = 404,
  EXISTS = 405,
  EXPLAIN = 406,
  EXPRESSION = 407,
  EXTENSION = 408,
  EXTERNAL = 409,
  EXTRACT = 410,
  FALSE_P = 411,
  FAMILY = 412,
  FETCH = 413,
  FILTER = 414,
  FIRST_P = 415,
  FLOAT_P = 416,
  FOLLOWING = 417,
  FOR = 418,
  FORCE = 419,
  FOREIGN = 420,
  FORWARD = 421,
  FREEZE = 422,
  FROM = 423,
  FULL = 424,
  FUNCTION = 425,
  FUNCTIONS = 426,
  GENERATED = 427,
  GLOBAL = 428,
  GRANT = 429,
  GRANTED = 430,
  GREATEST = 431,
  GROUP_P = 432,
  GROUPING = 433,
  GROUPS = 434,
  HANDLER = 435,
  HAVING = 436,
  HEADER_P = 437,
  HOLD = 438,
  HOUR_P = 439,
  IDENTITY_P = 440,
  IF_P = 441,
  ILIKE = 442,
  IMMEDIATE = 443,
  IMMUTABLE = 444,
  IMPLICIT_P = 445,
  IMPORT_P = 446,
  IN_P = 447,
  INCLUDE = 448,
  INCLUDING = 449,
  INCREMENT = 450,
  INDEX = 451,
  INDEXES = 452,
  INHERIT = 453,
  INHERITS = 454,
  INITIALLY = 455,
  INLINE_P = 456,
  INNER_P = 457,
  INOUT = 458,
  INPUT_P = 459,
  INSENSITIVE = 460,
  INSERT = 461,
  INSTEAD = 462,
  INT_P = 463,
  INTEGER = 464,
  INTERSECT = 465,
  INTERVAL = 466,
  INTO = 467,
  INVOKER = 468,
  IS = 469,
  ISNULL = 470,
  ISOLATION = 471,
  JOIN = 472,
  KEY = 473,
  LABEL = 474,
  LANGUAGE = 475,
  LARGE_P = 476,
  LAST_P = 477,
  LATERAL_P = 478,
  LEADING = 479,
  LEAKPROOF = 480,
  LEAST = 481,
  LEFT = 482,
  LEVEL = 483,
  LIKE = 484,
  LIMIT = 485,
  LISTEN = 486,
  LOAD = 487,
  LOCAL = 488,
  LOCALTIME = 489,
  LOCALTIMESTAMP = 490,
  LOCATION = 491,
  LOCK_P = 492,
  LOCKED = 493,
  LOGGED = 494,
  MAPPING = 495,
  MATCH = 496,
  MATERIALIZED = 497,
  MAXVALUE = 498,
  METHOD = 499,
  MINUTE_P = 500,
  MINVALUE = 501,
  MODE = 502,
  MONTH_P = 503,
  MOVE = 504,
  NAME_P = 505,
  NAMES = 506,
  NATIONAL = 507,
  NATURAL = 508,
  NCHAR = 509,
  NEW = 510,
  NEXT = 511,
  NFC = 512,
  NFD = 513,
  NFKC = 514,
  NFKD = 515,
  NO = 516,
  NONE = 517,
  NORMALIZE = 518,
  NORMALIZED = 519,
  NOT = 520,
  NOTHING = 521,
  NOTIFY = 522,
  NOTNULL = 523,
  NOWAIT = 524,
  NULL_P = 525,
  NULLIF = 526,
  NULLS_P = 527,
  NUMERIC = 528,
  OBJECT_P = 529,
  OF = 530,
  OFF = 531,
  OFFSET = 532,
  OIDS = 533,
  OLD = 534,
  ON = 535,
  ONLY = 536,
  OPERATOR = 537,
  OPTION = 538,
  OPTIONS = 539,
  OR = 540,
  ORDER = 541,
  ORDINALITY = 542,
  OTHERS = 543,
  OUT_P = 544,
  OUTER_P = 545,
  OVER = 546,
  OVERLAPS = 547,
  OVERLAY = 548,
  OVERRIDING = 549,
  OWNED = 550,
  OWNER = 551,
  PARALLEL = 552,
  PARSER = 553,
  PARTIAL = 554,
  PARTITION = 555,
  PASSING = 556,
  PASSWORD = 557,
  PLACING = 558,
  PLANS = 559,
  POLICY = 560,
  POSITION = 561,
  PRECEDING = 562,
  PRECISION = 563,
  PRESERVE = 564,
  PREPARE = 565,
  PREPARED = 566,
  PRIMARY = 567,
  PRIOR = 568,
  PRIVILEGES = 569,
  PROCEDURAL = 570,
  PROCEDURE = 571,
  PROCEDURES = 572,
  PROGRAM = 573,
  PUBLICATION = 574,
  QUOTE = 575,
  RANGE = 576,
  READ = 577,
  REAL = 578,
  REASSIGN = 579,
  RECHECK = 580,
  RECURSIVE = 581,
  REF_P = 582,
  REFERENCES = 583,
  REFERENCING = 584,
  REFRESH = 585,
  REINDEX = 586,
  RELATIVE_P = 587,
  RELEASE = 588,
  RENAME = 589,
  REPEATABLE = 590,
  REPLACE = 591,
  REPLICA = 592,
  RESET = 593,
  RESTART = 594,
  RESTRICT = 595,
  RETURNING = 596,
  RETURNS = 597,
  REVOKE = 598,
  RIGHT = 599,
  ROLE = 600,
  ROLLBACK = 601,
  ROLLUP = 602,
  ROUTINE = 603,
  ROUTINES = 604,
  ROW = 605,
  ROWS = 606,
  RULE = 607,
  SAVEPOINT = 608,
  SCHEMA = 609,
  SCHEMAS = 610,
  SCROLL = 611,
  SEARCH = 612,
  SECOND_P = 613,
  SECURITY = 614,
  SELECT = 615,
  SEQUENCE = 616,
  SEQUENCES = 617,
  SERIALIZABLE = 618,
  SERVER = 619,
  SESSION = 620,
  SESSION_USER = 621,
  SET = 622,
  SETS = 623,
  SETOF = 624,
  SHARE = 625,
  SHOW = 626,
  SIMILAR = 627,
  SIMPLE = 628,
  SKIP = 629,
  SMALLINT = 630,
  SNAPSHOT = 631,
  SOME = 632,
  SQL_P = 633,
  STABLE = 634,
  STANDALONE_P = 635,
  START = 636,
  STATEMENT = 637,
  STATISTICS = 638,
  STDIN = 639,
  STDOUT = 640,
  STORAGE = 641,
  STORED = 642,
  STRICT_P = 643,
  STRIP_P = 644,
  SUBSCRIPTION = 645,
  SUBSTRING = 646,
  SUPPORT = 647,
  SYMMETRIC = 648,
  SYSID = 649,
  SYSTEM_P = 650,
  TABLE = 651,
  TABLES = 652,
  TABLESAMPLE = 653,
  TABLESPACE = 654,
  TEMP = 655,
  TEMPLATE = 656,
  TEMPORARY = 657,
  TEXT_P = 658,
  THEN = 659,
  TIES = 660,
  TIME = 661,
  TIMESTAMP = 662,
  TO = 663,
  TRAILING = 664,
  TRANSACTION = 665,
  TRANSFORM = 666,
  TREAT = 667,
  TRIGGER = 668,
  TRIM = 669,
  TRUE_P = 670,
  TRUNCATE = 671,
  TRUSTED = 672,
  TYPE_P = 673,
  TYPES_P = 674,
  UESCAPE = 675,
  UNBOUNDED = 676,
  UNCOMMITTED = 677,
  UNENCRYPTED = 678,
  UNION = 679,
  UNIQUE = 680,
  UNKNOWN = 681,
  UNLISTEN = 682,
  UNLOGGED = 683,
  UNTIL = 684,
  UPDATE = 685,
  USER = 686,
  USING = 687,
  VACUUM = 688,
  VALID = 689,
  VALIDATE = 690,
  VALIDATOR = 691,
  VALUE_P = 692,
  VALUES = 693,
  VARCHAR = 694,
  VARIADIC = 695,
  VARYING = 696,
  VERBOSE = 697,
  VERSION_P = 698,
  VIEW = 699,
  VIEWS = 700,
  VOLATILE = 701,
  WHEN = 702,
  WHERE = 703,
  WHITESPACE_P = 704,
  WINDOW = 705,
  WITH = 706,
  WITHIN = 707,
  WITHOUT = 708,
  WORK = 709,
  WRAPPER = 710,
  WRITE = 711,
  XML_P = 712,
  XMLATTRIBUTES = 713,
  XMLCONCAT = 714,
  XMLELEMENT = 715,
  XMLEXISTS = 716,
  XMLFOREST = 717,
  XMLNAMESPACES = 718,
  XMLPARSE = 719,
  XMLPI = 720,
  XMLROOT = 721,
  XMLSERIALIZE = 722,
  XMLTABLE = 723,
  YEAR_P = 724,
  YES_P = 725,
  ZONE = 726,
  NOT_LA = 727,
  NULLS_LA = 728,
  WITH_LA = 729,
  POSTFIXOP = 730,
  UMINUS = 731,
}