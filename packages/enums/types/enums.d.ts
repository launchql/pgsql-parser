/**
* This file was automatically generated by pg-proto-parser@1.24.0.
* DO NOT MODIFY IT BY HAND. Instead, modify the source proto file,
* and run the pg-proto-parser generate command to regenerate this file.
*/
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
export declare enum SetQuantifier {
    SET_QUANTIFIER_DEFAULT = 0,
    SET_QUANTIFIER_ALL = 1,
    SET_QUANTIFIER_DISTINCT = 2
}
export declare enum A_Expr_Kind {
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
    AEXPR_NOT_BETWEEN_SYM = 13
}
export declare enum RoleSpecType {
    ROLESPEC_CSTRING = 0,
    ROLESPEC_CURRENT_ROLE = 1,
    ROLESPEC_CURRENT_USER = 2,
    ROLESPEC_SESSION_USER = 3,
    ROLESPEC_PUBLIC = 4
}
export declare enum TableLikeOption {
    CREATE_TABLE_LIKE_COMMENTS = 0,
    CREATE_TABLE_LIKE_COMPRESSION = 1,
    CREATE_TABLE_LIKE_CONSTRAINTS = 2,
    CREATE_TABLE_LIKE_DEFAULTS = 3,
    CREATE_TABLE_LIKE_GENERATED = 4,
    CREATE_TABLE_LIKE_IDENTITY = 5,
    CREATE_TABLE_LIKE_INDEXES = 6,
    CREATE_TABLE_LIKE_STATISTICS = 7,
    CREATE_TABLE_LIKE_STORAGE = 8,
    CREATE_TABLE_LIKE_ALL = 9
}
export declare enum DefElemAction {
    DEFELEM_UNSPEC = 0,
    DEFELEM_SET = 1,
    DEFELEM_ADD = 2,
    DEFELEM_DROP = 3
}
export declare enum PartitionStrategy {
    PARTITION_STRATEGY_LIST = 0,
    PARTITION_STRATEGY_RANGE = 1,
    PARTITION_STRATEGY_HASH = 2
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
    WCO_RLS_CONFLICT_CHECK = 3,
    WCO_RLS_MERGE_UPDATE_CHECK = 4,
    WCO_RLS_MERGE_DELETE_CHECK = 5
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
    OBJECT_VIEW = 51
}
export declare enum DropBehavior {
    DROP_RESTRICT = 0,
    DROP_CASCADE = 1
}
export declare enum AlterTableType {
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
    AT_ReAddStatistics = 65
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
    FUNC_PARAM_TABLE = 4,
    FUNC_PARAM_DEFAULT = 5
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
export declare enum PublicationObjSpecType {
    PUBLICATIONOBJ_TABLE = 0,
    PUBLICATIONOBJ_TABLES_IN_SCHEMA = 1,
    PUBLICATIONOBJ_TABLES_IN_CUR_SCHEMA = 2,
    PUBLICATIONOBJ_CONTINUATION = 3
}
export declare enum AlterPublicationAction {
    AP_AddObjects = 0,
    AP_DropObjects = 1,
    AP_SetObjects = 2
}
export declare enum AlterSubscriptionType {
    ALTER_SUBSCRIPTION_OPTIONS = 0,
    ALTER_SUBSCRIPTION_CONNECTION = 1,
    ALTER_SUBSCRIPTION_SET_PUBLICATION = 2,
    ALTER_SUBSCRIPTION_ADD_PUBLICATION = 3,
    ALTER_SUBSCRIPTION_DROP_PUBLICATION = 4,
    ALTER_SUBSCRIPTION_REFRESH = 5,
    ALTER_SUBSCRIPTION_ENABLED = 6,
    ALTER_SUBSCRIPTION_SKIP = 7
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
    COERCION_PLPGSQL = 2,
    COERCION_EXPLICIT = 3
}
export declare enum CoercionForm {
    COERCE_EXPLICIT_CALL = 0,
    COERCE_EXPLICIT_CAST = 1,
    COERCE_IMPLICIT_CAST = 2,
    COERCE_SQL_SYNTAX = 3
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
export declare enum JsonEncoding {
    JS_ENC_DEFAULT = 0,
    JS_ENC_UTF8 = 1,
    JS_ENC_UTF16 = 2,
    JS_ENC_UTF32 = 3
}
export declare enum JsonFormatType {
    JS_FORMAT_DEFAULT = 0,
    JS_FORMAT_JSON = 1,
    JS_FORMAT_JSONB = 2
}
export declare enum JsonConstructorType {
    JSCTOR_JSON_OBJECT = 0,
    JSCTOR_JSON_ARRAY = 1,
    JSCTOR_JSON_OBJECTAGG = 2,
    JSCTOR_JSON_ARRAYAGG = 3
}
export declare enum JsonValueType {
    JS_TYPE_ANY = 0,
    JS_TYPE_OBJECT = 1,
    JS_TYPE_ARRAY = 2,
    JS_TYPE_SCALAR = 3
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
    CMD_MERGE = 5,
    CMD_UTILITY = 6,
    CMD_NOTHING = 7
}
export declare enum JoinType {
    JOIN_INNER = 0,
    JOIN_LEFT = 1,
    JOIN_FULL = 2,
    JOIN_RIGHT = 3,
    JOIN_SEMI = 4,
    JOIN_ANTI = 5,
    JOIN_RIGHT_ANTI = 6,
    JOIN_UNIQUE_OUTER = 7,
    JOIN_UNIQUE_INNER = 8
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
    UMINUS = 758
}
