export declare enum OverridingKind {
    OVERRIDING_NOT_SET = 0,
    OVERRIDING_USER_VALUE = 1,
    OVERRIDING_SYSTEM_VALUE = 2
}
export declare enum QuerySource {
    QSRC_ORIGINAL = 0,
    QSRC_PARSER = 1,
    QSRC_INSTEAD_RULE = 2,
    QSRC_QUAL_INSTEAD_RULE = 3,
    QSRC_NON_INSTEAD_RULE = 4
}
export declare enum SortByDir {
    SORTBY_DEFAULT = 0,
    SORTBY_ASC = 1,
    SORTBY_DESC = 2,
    SORTBY_USING = 3
}
export declare enum SortByNulls {
    SORTBY_NULLS_DEFAULT = 0,
    SORTBY_NULLS_FIRST = 1,
    SORTBY_NULLS_LAST = 2
}
export declare enum A_Expr_Kind {
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
    AEXPR_PAREN = 15
}
export declare enum RoleSpecType {
    ROLESPEC_CSTRING = 0,
    ROLESPEC_CURRENT_USER = 1,
    ROLESPEC_SESSION_USER = 2,
    ROLESPEC_PUBLIC = 3
}
export declare enum TableLikeOption {
    CREATE_TABLE_LIKE_COMMENTS = 0,
    CREATE_TABLE_LIKE_CONSTRAINTS = 1,
    CREATE_TABLE_LIKE_DEFAULTS = 2,
    CREATE_TABLE_LIKE_GENERATED = 3,
    CREATE_TABLE_LIKE_IDENTITY = 4,
    CREATE_TABLE_LIKE_INDEXES = 5,
    CREATE_TABLE_LIKE_STATISTICS = 6,
    CREATE_TABLE_LIKE_STORAGE = 7,
    CREATE_TABLE_LIKE_ALL = 8
}
export declare enum DefElemAction {
    DEFELEM_UNSPEC = 0,
    DEFELEM_SET = 1,
    DEFELEM_ADD = 2,
    DEFELEM_DROP = 3
}
export declare enum PartitionRangeDatumKind {
    PARTITION_RANGE_DATUM_MINVALUE = 0,
    PARTITION_RANGE_DATUM_VALUE = 1,
    PARTITION_RANGE_DATUM_MAXVALUE = 2
}
export declare enum RTEKind {
    RTE_RELATION = 0,
    RTE_SUBQUERY = 1,
    RTE_JOIN = 2,
    RTE_FUNCTION = 3,
    RTE_TABLEFUNC = 4,
    RTE_VALUES = 5,
    RTE_CTE = 6,
    RTE_NAMEDTUPLESTORE = 7,
    RTE_RESULT = 8
}
export declare enum WCOKind {
    WCO_VIEW_CHECK = 0,
    WCO_RLS_INSERT_CHECK = 1,
    WCO_RLS_UPDATE_CHECK = 2,
    WCO_RLS_CONFLICT_CHECK = 3
}
export declare enum GroupingSetKind {
    GROUPING_SET_EMPTY = 0,
    GROUPING_SET_SIMPLE = 1,
    GROUPING_SET_ROLLUP = 2,
    GROUPING_SET_CUBE = 3,
    GROUPING_SET_SETS = 4
}
export declare enum CTEMaterialize {
    CTEMaterializeDefault = 0,
    CTEMaterializeAlways = 1,
    CTEMaterializeNever = 2
}
export declare enum SetOperation {
    SETOP_NONE = 0,
    SETOP_UNION = 1,
    SETOP_INTERSECT = 2,
    SETOP_EXCEPT = 3
}
export declare enum ObjectType {
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
    OBJECT_VIEW = 49
}
export declare enum DropBehavior {
    DROP_RESTRICT = 0,
    DROP_CASCADE = 1
}
export declare enum AlterTableType {
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
    AT_DropIdentity = 66
}
export declare enum GrantTargetType {
    ACL_TARGET_OBJECT = 0,
    ACL_TARGET_ALL_IN_SCHEMA = 1,
    ACL_TARGET_DEFAULTS = 2
}
export declare enum VariableSetKind {
    VAR_SET_VALUE = 0,
    VAR_SET_DEFAULT = 1,
    VAR_SET_CURRENT = 2,
    VAR_SET_MULTI = 3,
    VAR_RESET = 4,
    VAR_RESET_ALL = 5
}
export declare enum ConstrType {
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
    CONSTR_ATTR_IMMEDIATE = 13
}
export declare enum ImportForeignSchemaType {
    FDW_IMPORT_SCHEMA_ALL = 0,
    FDW_IMPORT_SCHEMA_LIMIT_TO = 1,
    FDW_IMPORT_SCHEMA_EXCEPT = 2
}
export declare enum RoleStmtType {
    ROLESTMT_ROLE = 0,
    ROLESTMT_USER = 1,
    ROLESTMT_GROUP = 2
}
export declare enum FetchDirection {
    FETCH_FORWARD = 0,
    FETCH_BACKWARD = 1,
    FETCH_ABSOLUTE = 2,
    FETCH_RELATIVE = 3
}
export declare enum FunctionParameterMode {
    FUNC_PARAM_IN = 0,
    FUNC_PARAM_OUT = 1,
    FUNC_PARAM_INOUT = 2,
    FUNC_PARAM_VARIADIC = 3,
    FUNC_PARAM_TABLE = 4
}
export declare enum TransactionStmtKind {
    TRANS_STMT_BEGIN = 0,
    TRANS_STMT_START = 1,
    TRANS_STMT_COMMIT = 2,
    TRANS_STMT_ROLLBACK = 3,
    TRANS_STMT_SAVEPOINT = 4,
    TRANS_STMT_RELEASE = 5,
    TRANS_STMT_ROLLBACK_TO = 6,
    TRANS_STMT_PREPARE = 7,
    TRANS_STMT_COMMIT_PREPARED = 8,
    TRANS_STMT_ROLLBACK_PREPARED = 9
}
export declare enum ViewCheckOption {
    NO_CHECK_OPTION = 0,
    LOCAL_CHECK_OPTION = 1,
    CASCADED_CHECK_OPTION = 2
}
export declare enum ClusterOption {
    CLUOPT_RECHECK = 0,
    CLUOPT_VERBOSE = 1
}
export declare enum DiscardMode {
    DISCARD_ALL = 0,
    DISCARD_PLANS = 1,
    DISCARD_SEQUENCES = 2,
    DISCARD_TEMP = 3
}
export declare enum ReindexObjectType {
    REINDEX_OBJECT_INDEX = 0,
    REINDEX_OBJECT_TABLE = 1,
    REINDEX_OBJECT_SCHEMA = 2,
    REINDEX_OBJECT_SYSTEM = 3,
    REINDEX_OBJECT_DATABASE = 4
}
export declare enum AlterTSConfigType {
    ALTER_TSCONFIG_ADD_MAPPING = 0,
    ALTER_TSCONFIG_ALTER_MAPPING_FOR_TOKEN = 1,
    ALTER_TSCONFIG_REPLACE_DICT = 2,
    ALTER_TSCONFIG_REPLACE_DICT_FOR_TOKEN = 3,
    ALTER_TSCONFIG_DROP_MAPPING = 4
}
export declare enum AlterSubscriptionType {
    ALTER_SUBSCRIPTION_OPTIONS = 0,
    ALTER_SUBSCRIPTION_CONNECTION = 1,
    ALTER_SUBSCRIPTION_PUBLICATION = 2,
    ALTER_SUBSCRIPTION_REFRESH = 3,
    ALTER_SUBSCRIPTION_ENABLED = 4
}
export declare enum OnCommitAction {
    ONCOMMIT_NOOP = 0,
    ONCOMMIT_PRESERVE_ROWS = 1,
    ONCOMMIT_DELETE_ROWS = 2,
    ONCOMMIT_DROP = 3
}
export declare enum ParamKind {
    PARAM_EXTERN = 0,
    PARAM_EXEC = 1,
    PARAM_SUBLINK = 2,
    PARAM_MULTIEXPR = 3
}
export declare enum CoercionContext {
    COERCION_IMPLICIT = 0,
    COERCION_ASSIGNMENT = 1,
    COERCION_EXPLICIT = 2
}
export declare enum CoercionForm {
    COERCE_EXPLICIT_CALL = 0,
    COERCE_EXPLICIT_CAST = 1,
    COERCE_IMPLICIT_CAST = 2
}
export declare enum BoolExprType {
    AND_EXPR = 0,
    OR_EXPR = 1,
    NOT_EXPR = 2
}
export declare enum SubLinkType {
    EXISTS_SUBLINK = 0,
    ALL_SUBLINK = 1,
    ANY_SUBLINK = 2,
    ROWCOMPARE_SUBLINK = 3,
    EXPR_SUBLINK = 4,
    MULTIEXPR_SUBLINK = 5,
    ARRAY_SUBLINK = 6,
    CTE_SUBLINK = 7
}
export declare enum RowCompareType {
    ROWCOMPARE_LT = 0,
    ROWCOMPARE_LE = 1,
    ROWCOMPARE_EQ = 2,
    ROWCOMPARE_GE = 3,
    ROWCOMPARE_GT = 4,
    ROWCOMPARE_NE = 5
}
export declare enum MinMaxOp {
    IS_GREATEST = 0,
    IS_LEAST = 1
}
export declare enum SQLValueFunctionOp {
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
    SVFOP_CURRENT_SCHEMA = 14
}
export declare enum XmlExprOp {
    IS_XMLCONCAT = 0,
    IS_XMLELEMENT = 1,
    IS_XMLFOREST = 2,
    IS_XMLPARSE = 3,
    IS_XMLPI = 4,
    IS_XMLROOT = 5,
    IS_XMLSERIALIZE = 6,
    IS_DOCUMENT = 7
}
export declare enum XmlOptionType {
    XMLOPTION_DOCUMENT = 0,
    XMLOPTION_CONTENT = 1
}
export declare enum NullTestType {
    IS_NULL = 0,
    IS_NOT_NULL = 1
}
export declare enum BoolTestType {
    IS_TRUE = 0,
    IS_NOT_TRUE = 1,
    IS_FALSE = 2,
    IS_NOT_FALSE = 3,
    IS_UNKNOWN = 4,
    IS_NOT_UNKNOWN = 5
}
export declare enum CmdType {
    CMD_UNKNOWN = 0,
    CMD_SELECT = 1,
    CMD_UPDATE = 2,
    CMD_INSERT = 3,
    CMD_DELETE = 4,
    CMD_UTILITY = 5,
    CMD_NOTHING = 6
}
export declare enum JoinType {
    JOIN_INNER = 0,
    JOIN_LEFT = 1,
    JOIN_FULL = 2,
    JOIN_RIGHT = 3,
    JOIN_SEMI = 4,
    JOIN_ANTI = 5,
    JOIN_UNIQUE_OUTER = 6,
    JOIN_UNIQUE_INNER = 7
}
export declare enum AggStrategy {
    AGG_PLAIN = 0,
    AGG_SORTED = 1,
    AGG_HASHED = 2,
    AGG_MIXED = 3
}
export declare enum AggSplit {
    AGGSPLIT_SIMPLE = 0,
    AGGSPLIT_INITIAL_SERIAL = 1,
    AGGSPLIT_FINAL_DESERIAL = 2
}
export declare enum SetOpCmd {
    SETOPCMD_INTERSECT = 0,
    SETOPCMD_INTERSECT_ALL = 1,
    SETOPCMD_EXCEPT = 2,
    SETOPCMD_EXCEPT_ALL = 3
}
export declare enum SetOpStrategy {
    SETOP_SORTED = 0,
    SETOP_HASHED = 1
}
export declare enum OnConflictAction {
    ONCONFLICT_NONE = 0,
    ONCONFLICT_NOTHING = 1,
    ONCONFLICT_UPDATE = 2
}
export declare enum LimitOption {
    LIMIT_OPTION_DEFAULT = 0,
    LIMIT_OPTION_COUNT = 1,
    LIMIT_OPTION_WITH_TIES = 2
}
export declare enum LockClauseStrength {
    LCS_NONE = 0,
    LCS_FORKEYSHARE = 1,
    LCS_FORSHARE = 2,
    LCS_FORNOKEYUPDATE = 3,
    LCS_FORUPDATE = 4
}
export declare enum LockWaitPolicy {
    LockWaitBlock = 0,
    LockWaitSkip = 1,
    LockWaitError = 2
}
export declare enum LockTupleMode {
    LockTupleKeyShare = 0,
    LockTupleShare = 1,
    LockTupleNoKeyExclusive = 2,
    LockTupleExclusive = 3
}
export declare enum KeywordKind {
    NO_KEYWORD = 0,
    UNRESERVED_KEYWORD = 1,
    COL_NAME_KEYWORD = 2,
    TYPE_FUNC_NAME_KEYWORD = 3,
    RESERVED_KEYWORD = 4
}
export declare enum Token {
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
    UMINUS = 731
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
    Expr: Expr;
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
    IntoClause: IntoClause;
    RawStmt: RawStmt;
    Query: Query;
    InsertStmt: InsertStmt;
    DeleteStmt: DeleteStmt;
    UpdateStmt: UpdateStmt;
    SelectStmt: SelectStmt;
    AlterTableStmt: AlterTableStmt;
    AlterTableCmd: AlterTableCmd;
    AlterDomainStmt: AlterDomainStmt;
    SetOperationStmt: SetOperationStmt;
    GrantStmt: GrantStmt;
    GrantRoleStmt: GrantRoleStmt;
    AlterDefaultPrivilegesStmt: AlterDefaultPrivilegesStmt;
    ClosePortalStmt: ClosePortalStmt;
    ClusterStmt: ClusterStmt;
    CopyStmt: CopyStmt;
    CreateStmt: CreateStmt;
    DefineStmt: DefineStmt;
    DropStmt: DropStmt;
    TruncateStmt: TruncateStmt;
    CommentStmt: CommentStmt;
    FetchStmt: FetchStmt;
    IndexStmt: IndexStmt;
    CreateFunctionStmt: CreateFunctionStmt;
    AlterFunctionStmt: AlterFunctionStmt;
    DoStmt: DoStmt;
    RenameStmt: RenameStmt;
    RuleStmt: RuleStmt;
    NotifyStmt: NotifyStmt;
    ListenStmt: ListenStmt;
    UnlistenStmt: UnlistenStmt;
    TransactionStmt: TransactionStmt;
    ViewStmt: ViewStmt;
    LoadStmt: LoadStmt;
    CreateDomainStmt: CreateDomainStmt;
    CreatedbStmt: CreatedbStmt;
    DropdbStmt: DropdbStmt;
    VacuumStmt: VacuumStmt;
    ExplainStmt: ExplainStmt;
    CreateTableAsStmt: CreateTableAsStmt;
    CreateSeqStmt: CreateSeqStmt;
    AlterSeqStmt: AlterSeqStmt;
    VariableSetStmt: VariableSetStmt;
    VariableShowStmt: VariableShowStmt;
    DiscardStmt: DiscardStmt;
    CreateTrigStmt: CreateTrigStmt;
    CreatePLangStmt: CreatePLangStmt;
    CreateRoleStmt: CreateRoleStmt;
    AlterRoleStmt: AlterRoleStmt;
    DropRoleStmt: DropRoleStmt;
    LockStmt: LockStmt;
    ConstraintsSetStmt: ConstraintsSetStmt;
    ReindexStmt: ReindexStmt;
    CheckPointStmt: CheckPointStmt;
    CreateSchemaStmt: CreateSchemaStmt;
    AlterDatabaseStmt: AlterDatabaseStmt;
    AlterDatabaseSetStmt: AlterDatabaseSetStmt;
    AlterRoleSetStmt: AlterRoleSetStmt;
    CreateConversionStmt: CreateConversionStmt;
    CreateCastStmt: CreateCastStmt;
    CreateOpClassStmt: CreateOpClassStmt;
    CreateOpFamilyStmt: CreateOpFamilyStmt;
    AlterOpFamilyStmt: AlterOpFamilyStmt;
    PrepareStmt: PrepareStmt;
    ExecuteStmt: ExecuteStmt;
    DeallocateStmt: DeallocateStmt;
    DeclareCursorStmt: DeclareCursorStmt;
    CreateTableSpaceStmt: CreateTableSpaceStmt;
    DropTableSpaceStmt: DropTableSpaceStmt;
    AlterObjectDependsStmt: AlterObjectDependsStmt;
    AlterObjectSchemaStmt: AlterObjectSchemaStmt;
    AlterOwnerStmt: AlterOwnerStmt;
    AlterOperatorStmt: AlterOperatorStmt;
    AlterTypeStmt: AlterTypeStmt;
    DropOwnedStmt: DropOwnedStmt;
    ReassignOwnedStmt: ReassignOwnedStmt;
    CompositeTypeStmt: CompositeTypeStmt;
    CreateEnumStmt: CreateEnumStmt;
    CreateRangeStmt: CreateRangeStmt;
    AlterEnumStmt: AlterEnumStmt;
    AlterTSDictionaryStmt: AlterTSDictionaryStmt;
    AlterTSConfigurationStmt: AlterTSConfigurationStmt;
    CreateFdwStmt: CreateFdwStmt;
    AlterFdwStmt: AlterFdwStmt;
    CreateForeignServerStmt: CreateForeignServerStmt;
    AlterForeignServerStmt: AlterForeignServerStmt;
    CreateUserMappingStmt: CreateUserMappingStmt;
    AlterUserMappingStmt: AlterUserMappingStmt;
    DropUserMappingStmt: DropUserMappingStmt;
    AlterTableSpaceOptionsStmt: AlterTableSpaceOptionsStmt;
    AlterTableMoveAllStmt: AlterTableMoveAllStmt;
    SecLabelStmt: SecLabelStmt;
    CreateForeignTableStmt: CreateForeignTableStmt;
    ImportForeignSchemaStmt: ImportForeignSchemaStmt;
    CreateExtensionStmt: CreateExtensionStmt;
    AlterExtensionStmt: AlterExtensionStmt;
    AlterExtensionContentsStmt: AlterExtensionContentsStmt;
    CreateEventTrigStmt: CreateEventTrigStmt;
    AlterEventTrigStmt: AlterEventTrigStmt;
    RefreshMatViewStmt: RefreshMatViewStmt;
    ReplicaIdentityStmt: ReplicaIdentityStmt;
    AlterSystemStmt: AlterSystemStmt;
    CreatePolicyStmt: CreatePolicyStmt;
    AlterPolicyStmt: AlterPolicyStmt;
    CreateTransformStmt: CreateTransformStmt;
    CreateAmStmt: CreateAmStmt;
    CreatePublicationStmt: CreatePublicationStmt;
    AlterPublicationStmt: AlterPublicationStmt;
    CreateSubscriptionStmt: CreateSubscriptionStmt;
    AlterSubscriptionStmt: AlterSubscriptionStmt;
    DropSubscriptionStmt: DropSubscriptionStmt;
    CreateStatsStmt: CreateStatsStmt;
    AlterCollationStmt: AlterCollationStmt;
    CallStmt: CallStmt;
    AlterStatsStmt: AlterStatsStmt;
    A_Expr: A_Expr;
    ColumnRef: ColumnRef;
    ParamRef: ParamRef;
    A_Const: A_Const;
    FuncCall: FuncCall;
    A_Star: A_Star;
    A_Indices: A_Indices;
    A_Indirection: A_Indirection;
    A_ArrayExpr: A_ArrayExpr;
    ResTarget: ResTarget;
    MultiAssignRef: MultiAssignRef;
    TypeCast: TypeCast;
    CollateClause: CollateClause;
    SortBy: SortBy;
    WindowDef: WindowDef;
    RangeSubselect: RangeSubselect;
    RangeFunction: RangeFunction;
    RangeTableSample: RangeTableSample;
    RangeTableFunc: RangeTableFunc;
    RangeTableFuncCol: RangeTableFuncCol;
    TypeName: TypeName;
    ColumnDef: ColumnDef;
    IndexElem: IndexElem;
    Constraint: Constraint;
    DefElem: DefElem;
    RangeTblEntry: RangeTblEntry;
    RangeTblFunction: RangeTblFunction;
    TableSampleClause: TableSampleClause;
    WithCheckOption: WithCheckOption;
    SortGroupClause: SortGroupClause;
    GroupingSet: GroupingSet;
    WindowClause: WindowClause;
    ObjectWithArgs: ObjectWithArgs;
    AccessPriv: AccessPriv;
    CreateOpClassItem: CreateOpClassItem;
    TableLikeClause: TableLikeClause;
    FunctionParameter: FunctionParameter;
    LockingClause: LockingClause;
    RowMarkClause: RowMarkClause;
    XmlSerialize: XmlSerialize;
    WithClause: WithClause;
    InferClause: InferClause;
    OnConflictClause: OnConflictClause;
    CommonTableExpr: CommonTableExpr;
    RoleSpec: RoleSpec;
    TriggerTransition: TriggerTransition;
    PartitionElem: PartitionElem;
    PartitionSpec: PartitionSpec;
    PartitionBoundSpec: PartitionBoundSpec;
    PartitionRangeDatum: PartitionRangeDatum;
    PartitionCmd: PartitionCmd;
    VacuumRelation: VacuumRelation;
    InlineCodeBlock: InlineCodeBlock;
    CallContext: CallContext;
    Integer: Integer;
    Float: Float;
    String: String;
    BitString: BitString;
    Null: Null;
    List: List;
    IntList: IntList;
    OidList: OidList;
}
export interface Integer {
    ival: number;
}
export interface Float {
    str: string;
}
export interface String {
    str: string;
}
export interface BitString {
    str: string;
}
export interface Null {
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
export interface Expr {
}
export interface Var {
    xpr: Node;
    varno: number;
    varattno: number;
    vartype: number;
    vartypmod: number;
    varcollid: number;
    varlevelsup: number;
    varnosyn: number;
    varattnosyn: number;
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
    aggtranstype: number;
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
    location: number;
}
export interface GroupingFunc {
    xpr: Node;
    args: Node[];
    refs: Node[];
    cols: Node[];
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
    opfuncid: number;
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
    opfuncid: number;
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
    opfuncid: number;
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
    opfuncid: number;
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
    type: number;
    typmod: number;
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
export interface RawStmt {
    stmt: Node;
    stmt_location: number;
    stmt_len: number;
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
    cteList: Node[];
    rtable: Node[];
    jointree: FromExpr;
    targetList: Node[];
    override: OverridingKind;
    onConflict: OnConflictExpr;
    returningList: Node[];
    groupClause: Node[];
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
export interface SelectStmt {
    distinctClause: Node[];
    intoClause: IntoClause;
    targetList: Node[];
    fromClause: Node[];
    whereClause: Node;
    groupClause: Node[];
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
export interface AlterTableStmt {
    relation: RangeVar;
    cmds: Node[];
    relkind: ObjectType;
    missing_ok: boolean;
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
export interface AlterDomainStmt {
    subtype: string;
    typeName: Node[];
    name: string;
    def: Node;
    behavior: DropBehavior;
    missing_ok: boolean;
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
export interface GrantStmt {
    is_grant: boolean;
    targtype: GrantTargetType;
    objtype: ObjectType;
    objects: Node[];
    privileges: Node[];
    grantees: Node[];
    grant_option: boolean;
    behavior: DropBehavior;
}
export interface GrantRoleStmt {
    granted_roles: Node[];
    grantee_roles: Node[];
    is_grant: boolean;
    admin_opt: boolean;
    grantor: RoleSpec;
    behavior: DropBehavior;
}
export interface AlterDefaultPrivilegesStmt {
    options: Node[];
    action: GrantStmt;
}
export interface ClosePortalStmt {
    portalname: string;
}
export interface ClusterStmt {
    relation: RangeVar;
    indexname: string;
    options: number;
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
export interface DefineStmt {
    kind: ObjectType;
    oldstyle: boolean;
    defnames: Node[];
    args: Node[];
    definition: Node[];
    if_not_exists: boolean;
    replace: boolean;
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
    oldNode: number;
    oldCreateSubid: number;
    oldFirstRelfilenodeSubid: number;
    unique: boolean;
    primary: boolean;
    isconstraint: boolean;
    deferrable: boolean;
    initdeferred: boolean;
    transformed: boolean;
    concurrent: boolean;
    if_not_exists: boolean;
    reset_default_tblspc: boolean;
}
export interface CreateFunctionStmt {
    is_procedure: boolean;
    replace: boolean;
    funcname: Node[];
    parameters: Node[];
    returnType: TypeName;
    options: Node[];
}
export interface AlterFunctionStmt {
    objtype: ObjectType;
    func: ObjectWithArgs;
    actions: Node[];
}
export interface DoStmt {
    args: Node[];
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
export interface CreateDomainStmt {
    domainname: Node[];
    typeName: TypeName;
    collClause: CollateClause;
    constraints: Node[];
}
export interface CreatedbStmt {
    dbname: string;
    options: Node[];
}
export interface DropdbStmt {
    dbname: string;
    missing_ok: boolean;
    options: Node[];
}
export interface VacuumStmt {
    options: Node[];
    rels: Node[];
    is_vacuumcmd: boolean;
}
export interface ExplainStmt {
    query: Node;
    options: Node[];
}
export interface CreateTableAsStmt {
    query: Node;
    into: IntoClause;
    relkind: ObjectType;
    is_select_into: boolean;
    if_not_exists: boolean;
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
export interface VariableSetStmt {
    kind: VariableSetKind;
    name: string;
    args: Node[];
    is_local: boolean;
}
export interface VariableShowStmt {
    name: string;
}
export interface DiscardStmt {
    target: DiscardMode;
}
export interface CreateTrigStmt {
    trigname: string;
    relation: RangeVar;
    funcname: Node[];
    args: Node[];
    row: boolean;
    timing: number;
    events: number;
    columns: Node[];
    whenClause: Node;
    isconstraint: boolean;
    transitionRels: Node[];
    deferrable: boolean;
    initdeferred: boolean;
    constrrel: RangeVar;
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
export interface DropRoleStmt {
    roles: Node[];
    missing_ok: boolean;
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
    options: number;
    concurrent: boolean;
}
export interface CheckPointStmt {
}
export interface CreateSchemaStmt {
    schemaname: string;
    authrole: RoleSpec;
    schemaElts: Node[];
    if_not_exists: boolean;
}
export interface AlterDatabaseStmt {
    dbname: string;
    options: Node[];
}
export interface AlterDatabaseSetStmt {
    dbname: string;
    setstmt: VariableSetStmt;
}
export interface AlterRoleSetStmt {
    role: RoleSpec;
    database: string;
    setstmt: VariableSetStmt;
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
export interface CreateOpClassStmt {
    opclassname: Node[];
    opfamilyname: Node[];
    amname: string;
    datatype: TypeName;
    items: Node[];
    isDefault: boolean;
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
export interface DeclareCursorStmt {
    portalname: string;
    options: number;
    query: Node;
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
export interface AlterObjectDependsStmt {
    objectType: ObjectType;
    relation: RangeVar;
    object: Node;
    extname: Node;
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
export interface DropOwnedStmt {
    roles: Node[];
    behavior: DropBehavior;
}
export interface ReassignOwnedStmt {
    roles: Node[];
    newrole: RoleSpec;
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
export interface SecLabelStmt {
    objtype: ObjectType;
    object: Node;
    provider: string;
    label: string;
}
export interface CreateForeignTableStmt {
    base: CreateStmt;
    servername: string;
    options: Node[];
}
export interface ImportForeignSchemaStmt {
    server_name: string;
    remote_schema: string;
    local_schema: string;
    list_type: ImportForeignSchemaType;
    table_list: Node[];
    options: Node[];
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
export interface RefreshMatViewStmt {
    concurrent: boolean;
    skipData: boolean;
    relation: RangeVar;
}
export interface ReplicaIdentityStmt {
    identity_type: string;
    name: string;
}
export interface AlterSystemStmt {
    setstmt: VariableSetStmt;
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
export interface CreateTransformStmt {
    replace: boolean;
    type_name: TypeName;
    lang: string;
    fromsql: ObjectWithArgs;
    tosql: ObjectWithArgs;
}
export interface CreateAmStmt {
    amname: string;
    handler_name: Node[];
    amtype: string;
}
export interface CreatePublicationStmt {
    pubname: string;
    options: Node[];
    tables: Node[];
    for_all_tables: boolean;
}
export interface AlterPublicationStmt {
    pubname: string;
    options: Node[];
    tables: Node[];
    for_all_tables: boolean;
    tableAction: DefElemAction;
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
export interface CreateStatsStmt {
    defnames: Node[];
    stat_types: Node[];
    exprs: Node[];
    relations: Node[];
    stxcomment: string;
    if_not_exists: boolean;
}
export interface AlterCollationStmt {
    collname: Node[];
}
export interface CallStmt {
    funccall: FuncCall;
    funcexpr: FuncExpr;
}
export interface AlterStatsStmt {
    defnames: Node[];
    stxstattarget: number;
    missing_ok: boolean;
}
export interface A_Expr {
    kind: A_Expr_Kind;
    name: Node[];
    lexpr: Node;
    rexpr: Node;
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
export interface A_Const {
    val: Node;
    location: number;
}
export interface FuncCall {
    funcname: Node[];
    args: Node[];
    agg_order: Node[];
    agg_filter: Node;
    agg_within_group: boolean;
    agg_star: boolean;
    agg_distinct: boolean;
    func_variadic: boolean;
    over: WindowDef;
    location: number;
}
export interface A_Star {
}
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
export interface RangeTableSample {
    relation: Node;
    method: Node[];
    args: Node[];
    repeatable: Node;
    location: number;
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
export interface ColumnDef {
    colname: string;
    typeName: TypeName;
    inhcount: number;
    is_local: boolean;
    is_not_null: boolean;
    is_from_type: boolean;
    storage: string;
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
    old_conpfeqop: Node[];
    old_pktable_oid: number;
    skip_validation: boolean;
    initially_valid: boolean;
}
export interface DefElem {
    defnamespace: string;
    defname: string;
    arg: Node;
    defaction: DefElemAction;
    location: number;
}
export interface RangeTblEntry {
    rtekind: RTEKind;
    relid: number;
    relkind: string;
    rellockmode: number;
    tablesample: TableSampleClause;
    subquery: Query;
    security_barrier: boolean;
    jointype: JoinType;
    joinmergedcols: number;
    joinaliasvars: Node[];
    joinleftcols: Node[];
    joinrightcols: Node[];
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
    requiredPerms: number;
    checkAsUser: number;
    selectedCols: bigint[];
    insertedCols: bigint[];
    updatedCols: bigint[];
    extraUpdatedCols: bigint[];
    securityQuals: Node[];
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
    startInRangeFunc: number;
    endInRangeFunc: number;
    inRangeColl: number;
    inRangeAsc: boolean;
    inRangeNullsFirst: boolean;
    winref: number;
    copiedOrder: boolean;
}
export interface ObjectWithArgs {
    objname: Node[];
    objargs: Node[];
    args_unspecified: boolean;
}
export interface AccessPriv {
    priv_name: string;
    cols: Node[];
}
export interface CreateOpClassItem {
    itemtype: number;
    name: ObjectWithArgs;
    number: number;
    order_family: Node[];
    class_args: Node[];
    storedtype: TypeName;
}
export interface TableLikeClause {
    relation: RangeVar;
    options: number;
    relationOid: number;
}
export interface FunctionParameter {
    name: string;
    argType: TypeName;
    mode: FunctionParameterMode;
    defexpr: Node;
}
export interface LockingClause {
    lockedRels: Node[];
    strength: LockClauseStrength;
    waitPolicy: LockWaitPolicy;
}
export interface RowMarkClause {
    rti: number;
    strength: LockClauseStrength;
    waitPolicy: LockWaitPolicy;
    pushedDown: boolean;
}
export interface XmlSerialize {
    xmloption: XmlOptionType;
    expr: Node;
    typeName: TypeName;
    location: number;
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
export interface CommonTableExpr {
    ctename: string;
    aliascolnames: Node[];
    ctematerialized: CTEMaterialize;
    ctequery: Node;
    location: number;
    cterecursive: boolean;
    cterefcount: number;
    ctecolnames: Node[];
    ctecoltypes: Node[];
    ctecoltypmods: Node[];
    ctecolcollations: Node[];
}
export interface RoleSpec {
    roletype: RoleSpecType;
    rolename: string;
    location: number;
}
export interface TriggerTransition {
    name: string;
    isNew: boolean;
    isTable: boolean;
}
export interface PartitionElem {
    name: string;
    expr: Node;
    collation: Node[];
    opclass: Node[];
    location: number;
}
export interface PartitionSpec {
    strategy: string;
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
}
export interface VacuumRelation {
    relation: RangeVar;
    oid: number;
    va_cols: Node[];
}
export interface InlineCodeBlock {
    source_text: string;
    langOid: number;
    langIsTrusted: boolean;
    atomic: boolean;
}
export interface CallContext {
    atomic: boolean;
}
export interface ScanToken {
    start: number;
    end: number;
    token: Token;
    keywordKind: KeywordKind;
}
