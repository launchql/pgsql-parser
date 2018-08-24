'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getConstraintFromConstrType = exports.objtypeName = exports.objtypeIs = exports.TYPE_NAMES = exports.SORTBYNULLS_TYPES = exports.SORTBYDIR_TYPES = exports.TRANSACTIONSTMT_TYPES = exports.ROLESPEC_TYPES = exports.ROLESTMT_TYPES = exports.CONSTRAINT_TYPES = exports.GRANTOBJECT_TYPES = exports.GRANTTARGET_TYPES = exports.VARIABLESET_TYPES = exports.OBJECT_TYPES = exports.createTypeFromEnums = undefined;

var _util = require('util');

const fail = (type, node) => {
  throw new Error((0, _util.format)('Unhandled %s node: %s', type, JSON.stringify(node)));
};
const LIBPG_ENUMS = require('./libpg_enums');

const createTypeFromEnums = exports.createTypeFromEnums = type => LIBPG_ENUMS['nodes/parsenodes'][type].values.reduce((m, v, i) => {
  if (i === 0) {
    return m;
  } // skip first noop
  m[v.name] = i - 1;
  // m[i - 1] = v.name; // for reverse lookup
  return m;
}, {});

const OBJECT_TYPES = exports.OBJECT_TYPES = createTypeFromEnums('ObjectType');
const VARIABLESET_TYPES = exports.VARIABLESET_TYPES = createTypeFromEnums('VariableSetKind');
const GRANTTARGET_TYPES = exports.GRANTTARGET_TYPES = createTypeFromEnums('GrantTargetType');
const GRANTOBJECT_TYPES = exports.GRANTOBJECT_TYPES = createTypeFromEnums('GrantObjectType');
const CONSTRAINT_TYPES = exports.CONSTRAINT_TYPES = createTypeFromEnums('ConstrType');
const ROLESTMT_TYPES = exports.ROLESTMT_TYPES = createTypeFromEnums('RoleStmtType');
const ROLESPEC_TYPES = exports.ROLESPEC_TYPES = createTypeFromEnums('RoleSpecType');
const TRANSACTIONSTMT_TYPES = exports.TRANSACTIONSTMT_TYPES = createTypeFromEnums('TransactionStmtKind');
const SORTBYDIR_TYPES = exports.SORTBYDIR_TYPES = createTypeFromEnums('SortByDir');
const SORTBYNULLS_TYPES = exports.SORTBYNULLS_TYPES = createTypeFromEnums('SortByNulls');

const TYPE_NAMES = exports.TYPE_NAMES = {
  OBJECT_ACCESS_METHOD: 'ACCESS METHOD',
  OBJECT_AGGREGATE: 'AGGREGATE',
  OBJECT_CAST: 'CAST',
  OBJECT_COLUMN: 'COLUMN',
  OBJECT_COLLATION: 'COLLATION',
  OBJECT_CONVERSION: 'CONVERSION',
  OBJECT_DATABASE: 'DATABASE',
  OBJECT_DOMAIN: 'DOMAIN',
  OBJECT_DOMCONSTRAINT: 'CONSTRAINT',
  OBJECT_EXTENSION: 'EXTENSION',
  OBJECT_FDW: 'FOREIGN DATA WRAPPER',
  OBJECT_FOREIGN_SERVER: 'SERVER',
  OBJECT_FOREIGN_TABLE: 'FOREIGN TABLE',
  OBJECT_FUNCTION: 'FUNCTION',
  OBJECT_INDEX: 'INDEX',
  OBJECT_LANGUAGE: 'LANGUAGE',
  OBJECT_LARGEOBJECT: 'LARGE OBJECT',
  OBJECT_MATVIEW: 'MATERIALIZED VIEW',
  OBJECT_OPCLASS: 'OPERATOR CLASS',
  OBJECT_OPERATOR: 'OPERATOR',
  OBJECT_OPFAMILY: 'OPERATOR FAMILY',
  OBJECT_POLICY: 'POLICY',
  OBJECT_ROLE: 'ROLE',
  OBJECT_RULE: 'RULE',
  OBJECT_SCHEMA: 'SCHEMA',
  OBJECT_SEQUENCE: 'SEQUENCE',
  OBJECT_STATISTIC_EXT: 'STATISTICS',
  OBJECT_TABCONSTRAINT: 'CONSTRAINT',
  OBJECT_TABLE: 'TABLE',
  OBJECT_TABLESPACE: 'TABLESPACE',
  OBJECT_TRANSFORM: 'TRANSFORM',
  OBJECT_TRIGGER: 'TRIGGER',
  OBJECT_TSCONFIGURATION: 'TEXT SEARCH CONFIGURATION',
  OBJECT_TSDICTIONARY: 'TEXT SEARCH DICTIONARY',
  OBJECT_TSPARSER: 'TEXT SEARCH PARSER',
  OBJECT_TSTEMPLATE: 'TEXT SEARCH TEMPLATE',
  OBJECT_TYPE: 'TYPE',
  OBJECT_VIEW: 'VIEW'
};

const _TYPE_VALUES = Object.values(OBJECT_TYPES);
const _TYPE_KEYS = Object.keys(OBJECT_TYPES);

const objtypeIs = exports.objtypeIs = (objtype, name) => OBJECT_TYPES[name] === objtype;

const objtypeName = exports.objtypeName = arg => {
  if (typeof arg === 'string') {
    return TYPE_NAMES[arg];
  }
  return TYPE_NAMES[_TYPE_KEYS[_TYPE_VALUES.indexOf(arg)]];
};

const getConstraintFromConstrType = exports.getConstraintFromConstrType = type => {
  switch (type) {
    case CONSTRAINT_TYPES.CONSTR_NULL:
      return 'NULL';
    case CONSTRAINT_TYPES.CONSTR_NOTNULL:
      return 'NOT NULL';
    case CONSTRAINT_TYPES.CONSTR_DEFAULT:
      return 'DEFAULT';
    case CONSTRAINT_TYPES.CONSTR_CHECK:
      return 'CHECK';
    case CONSTRAINT_TYPES.CONSTR_PRIMARY:
      return 'PRIMARY KEY';
    case CONSTRAINT_TYPES.CONSTR_UNIQUE:
      return 'UNIQUE';
    case CONSTRAINT_TYPES.CONSTR_EXCLUSION:
      return 'EXCLUDE';
    case CONSTRAINT_TYPES.CONSTR_FOREIGN:
      return 'REFERENCES';

    case CONSTRAINT_TYPES.CONSTR_IDENTITY:
    case CONSTRAINT_TYPES.CONSTR_ATTR_DEFERRABLE:
    case CONSTRAINT_TYPES.CONSTR_ATTR_NOT_DEFERRABLE:
    case CONSTRAINT_TYPES.CONSTR_ATTR_DEFERRED:
    case CONSTRAINT_TYPES.CONSTR_ATTR_IMMEDIATE:
    default:
      return fail(type, 'ConstrType');
  }
};
//# sourceMappingURL=types.js.map