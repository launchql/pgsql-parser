const LIBPG_ENUMS = require('./libpg_enums');

// nodes/parsenodes
// ObjectType
//
// nodes/parsenodes
// VariableSetKind

export const VARIABLE_TYPES = LIBPG_ENUMS['nodes/parsenodes']
  .VariableSetKind.values.reduce((m, v, i) => {
    if (i === 0) {
      return m;
    } // skip first noop
    m[v.name] = i - 1;
    return m;
  }, {});

export const TYPES = LIBPG_ENUMS['nodes/parsenodes']
  .ObjectType.values.reduce((m, v, i) => {
    if (i === 0) {
      return m;
    } // skip first noop
    m[v.name] = i - 1;
    return m;
  }, {});

export const TYPE_NAMES = {
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

const _TYPE_VALUES = Object.values(TYPES);
const _TYPE_KEYS = Object.keys(TYPES);

export const objtypeIs = (objtype, name) =>
  TYPES[name] === objtype;

export const objtypeName = (arg) => {
  if (typeof arg === 'string') {
    return (TYPE_NAMES[arg]);
  }
  return TYPE_NAMES[_TYPE_KEYS[_TYPE_VALUES.indexOf(arg)]];
};