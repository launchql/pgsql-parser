// @ts-nocheck
import { format } from 'util';
import { objtypeName, getConstraintFromConstrType } from 'pgsql-enums';
import { 
  A_ArrayExpr, 
  A_Const, 
  A_Expr, 
  A_Indices, 
  A_Indirection, 
  A_Star, 
  AccessPriv, 
  Alias, 
  AlterDefaultPrivilegesStmt, 
  AlterDomainStmt, 
  AlterEnumStmt, 
  AlterObjectSchemaStmt, 
  AlterOwnerStmt, 
  AlterSeqStmt, 
  AlterTableCmd,
  AlterTableStmt,
  BitString,
  BooleanTest,
  BoolExpr,
  CallStmt,
  CaseExpr,
  CaseWhen,
  CoalesceExpr,
  CollateClause,
  ColumnDef,
  ColumnRef,
  CommentStmt,
  CommonTableExpr,
  CompositeTypeStmt,
  Constraint,
  ConstraintsSetStmt,
  CopyStmt,
  CreateDomainStmt,
  CreateEnumStmt,
  CreateExtensionStmt,
  CreateFunctionStmt,
  CreatePolicyStmt,
  CreateRoleStmt,
  CreateSchemaStmt,
  CreateSeqStmt,
  CreateStmt,
  CreateTableAsStmt,
  CreateTrigStmt,
  DefElem,
  DefineStmt,
  DeleteStmt,
  DoStmt,
  DropStmt,
  ExplainStmt,
  Float,
  FuncCall,
  FunctionParameter,
  GrantRoleStmt,
  GrantStmt,
  GroupingFunc,
  GroupingSet,
  IndexElem,
  IndexStmt,
  InsertStmt,
  Integer,
  IntoClause,
  JoinExpr,
  LockingClause,
  LockStmt,
  MinMaxExpr,
  MultiAssignRef,
  NamedArgExpr,
  NullTest,
  ObjectWithArgs,
  ParamRef,
  RangeFunction,
  RangeSubselect,
  RangeTableSample,
  RangeVar,
  RawStmt,
  RenameStmt,
  ResTarget,
  RoleSpec,
  RowExpr,
  RuleStmt,
  SelectStmt,
  SetToDefault,
  SortBy,
  SQLValueFunction,
  String as TString,
  SubLink,
  TransactionStmt,
  TruncateStmt,
  TypeCast,
  TypeName,
  UpdateStmt,
  VariableSetStmt,
  VariableShowStmt,
  ViewStmt,
  WindowDef,
  WithClause,
} from '@pgsql/types';

let TAB_CHAR = '\t';
let NEWLINE_CHAR = '\n';

const isEmptyObject = (obj) => {
  return !obj || (typeof obj === 'object' && !Object.keys(obj).length);
};
const dotty = require('dotty');

const fail = (type, node) => {
  throw new Error(format('Unhandled %s node: %s', type, JSON.stringify(node)));
};

// select word from pg_get_keywords() where catcode = 'R';
const RESERVED_WORDS = new Set([
  'all',
  'analyse',
  'analyze',
  'and',
  'any',
  'array',
  'as',
  'asc',
  'asymmetric',
  'both',
  'case',
  'cast',
  'check',
  'collate',
  'column',
  'constraint',
  'create',
  'current_catalog',
  'current_date',
  'current_role',
  'current_time',
  'current_timestamp',
  'current_user',
  'default',
  'deferrable',
  'desc',
  'distinct',
  'do',
  'else',
  'end',
  'except',
  'false',
  'fetch',
  'for',
  'foreign',
  'from',
  'grant',
  'group',
  'having',
  'in',
  'initially',
  'intersect',
  'into',
  'lateral',
  'leading',
  'limit',
  'localtime',
  'localtimestamp',
  'not',
  'null',
  'offset',
  'on',
  'only',
  'or',
  'order',
  'placing',
  'primary',
  'references',
  'returning',
  'select',
  'session_user',
  'some',
  'symmetric',
  'table',
  'then',
  'to',
  'trailing',
  'true',
  'union',
  'unique',
  'user',
  'using',
  'variadic',
  'when',
  'where',
  'window',
  'with'
]);

// https://github.com/pganalyze/libpg_query/blob/b2790f8140721ff7f047167ecd7d44267b0a3880/src/postgres/include/storage/lockdefs.h
const LOCK_MODES = {
  1: 'ACCESS SHARE',
  2: 'ROW SHARE',
  3: 'ROW EXCLUSIVE',
  4: 'SHARE UPDATE EXCLUSIVE',
  5: 'SHARE',
  6: 'SHARE ROW',
  7: 'EXCLUSIVE',
  8: 'ACCESS EXCLUSIVE'
};

const isReserved = (value) => RESERVED_WORDS.has(value.toLowerCase());

// has uppercase and lowercase, or non word characters
const needsQuotesRegex = /[a-z]+[\W\w]*[A-Z]+|[A-Z]+[\W\w]*[a-z]+|\W/;

// usually the AST lowercases all the things, so if we
// have both, the author most likely used double quotes
const needsQuotes = (value) =>
  needsQuotesRegex.test(value) || isReserved(value);

const compact = (o) =>
  o.filter((e) => {
    const isFalsy = !e;
    return !isFalsy && e.toString().length;
  });

const flatten = (o) => {
  const flattened = [];
  for (let i = 0; i < o.length; i++) {
    if (Array.isArray(o[i])) {
      for (let j = 0; j < o[i].length; j++) {
        flattened.push(o[i][j]);
      }
    } else {
      flattened.push(o[i]);
    }
  }
  return flattened;
};

const inverted = (o) => {
  const objInverted = {};
  const keys = Object.keys(o);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    objInverted[o[key]] = key;
  }
  return objInverted;
};

const parens = (string) => {
  return '(' + string + ')';
};

const indent = (text, count = 1) => text;

const unwrapList = (obj) =>
  obj !== undefined && obj.List !== undefined ? obj.List.items : obj;

export default class Deparser {
  static deparse(query, opts) {
    return new Deparser(query, opts).deparseQuery();
  }

  constructor(tree, opts = {}) {
    this.tree = tree;
    if (opts.hasOwnProperty('newline')) {
      NEWLINE_CHAR = opts.newline;
    }
    if (opts.hasOwnProperty('tab')) {
      TAB_CHAR = opts.tab;
    }
    if (!Array.isArray(this.tree)) this.tree = [this.tree];
  }

  deparseQuery() {
    return this.tree
      .map((node) => this.deparse(node))
      .join(NEWLINE_CHAR + NEWLINE_CHAR);
  }

  deparseNodes(nodes, context) {
    return unwrapList(nodes).map((node) => {
      const unwrapped = unwrapList(node);
      return Array.isArray(unwrapped)
        ? this.list(unwrapped, ', ', '', context)
        : this.deparse(node, context);
    });
  }

  deparseReturningList(list, context) {
    return unwrapList(list)
      .map(
        (returning) =>
          this.deparse(returning.ResTarget.val, context) +
          (returning.ResTarget.name
            ? ' AS ' + this.quote(returning.ResTarget.name)
            : '')
      )
      .join(',');
  }

  list(nodes, separator = ', ', prefix = '', context) {
    if (!nodes) {
      return '';
    }

    return this.deparseNodes(nodes, context)
      .map((l) => `${prefix}${l}`)
      .join(separator);
  }

  listQuotes(nodes, separator = ', ') {
    return this.list(unwrapList(nodes), separator)
      .split(separator)
      .map((a) => this.quote(a.trim()))
      .join(separator);
  }

  quote(value) {
    if (value == null) {
      return null;
    }

    const unwrapped = unwrapList(value);
    if (Array.isArray(unwrapped)) {
      return unwrapped.map((o) => this.quote(o));
    }

    if (needsQuotes(value)) {
      return '"' + value + '"';
    }
    return value;
  }

  // SELECT encode(E'''123\\000\\001', 'base64')
  escape(literal) {
    return "'" + literal.replace(/'/g, "''") + "'";
  }

  getPgCatalogTypeName(typeName, size) {
    switch (typeName) {
      case 'bpchar':
        if (size != null) {
          return 'char';
        }
        // return `pg_catalog.bpchar` below so that the following is symmetric
        // SELECT char 'c' = char 'c' AS true
        return 'pg_catalog.bpchar';
      case 'varchar':
        return 'varchar';
      case 'numeric':
        return 'numeric';
      case 'bool':
        return 'boolean';
      case 'int2':
        return 'smallint';
      case 'int4':
        return 'int';
      case 'int8':
        return 'bigint';
      case 'real':
        return 'pg_catalog.float4';
      case 'time':
        return 'time';
      case 'timestamp':
        return 'timestamp';
      case 'interval':
        return 'interval';
      case 'bit':
        return 'bit';
      default:
        return 'pg_catalog.' + typeName;
    }
  }

  type(names, args) {
    const catalogAndType = unwrapList(names).map((name) => this.deparse(name));
    const catalog = catalogAndType[0];
    const type = catalogAndType[1];

    const mods = (name, size) => {
      if (size != null) {
        return name + '(' + size + ')';
      }

      return name;
    };

    // handle the special "char" (in quotes) type
    if (catalog === 'char' && !type) {
      return mods('"char"', args);
    }
    if (catalog === 'pg_catalog' && type === 'char') {
      return mods('pg_catalog."char"', args);
    }

    if (catalog !== 'pg_catalog') {
      return mods(this.listQuotes(names, '.'), args);
    }

    const res = this.getPgCatalogTypeName(type, args);
    return mods(res, args);
  }

  deparse(item, context) {
    if (item == null) {
      return null;
    }

    if (typeof item === 'number' || item instanceof Number) {
      return item;
    }

    const type = Object.keys(item)[0];
    const node = item[type];

    if (this[type] == null) {
      throw new Error(type + ' is not implemented: ' + JSON.stringify(node));
    }

    return this[type](node, context);
  }

  RawStmt(node: RawStmt, context = {}) {
    if (node.stmt_len) {
      return this.deparse(node.stmt, context) + ';';
    }
    return this.deparse(node.stmt, context);
  }

  RuleStmt(node: RuleStmt, context = {}) {
    const output = [];
    output.push('CREATE');
    output.push('RULE');
    if (node.rulename === '_RETURN') {
      // special rules
      output.push('"_RETURN"');
    } else {
      output.push(node.rulename);
    }
    output.push('AS');
    output.push('ON');
    switch (node.event) {
      case 'CMD_SELECT':
        output.push('SELECT');
        break;
      case 'CMD_UPDATE':
        output.push('UPDATE');
        break;
      case 'CMD_INSERT':
        output.push('INSERT');
        break;
      case 'CMD_DELETE':
        output.push('DELETE');
        break;
      default:
        throw new Error('event type not yet implemented for RuleStmt');
    }
    output.push('TO');
    output.push(this.RangeVar(node.relation, context));
    if (node.whereClause) {
      output.push('WHERE');
      output.push(this.deparse(node.whereClause, context));
    }
    output.push('DO');
    if (node.instead) {
      output.push('INSTEAD');
    }
    const actions = unwrapList(node.actions);
    if (!actions || !actions.length) {
      output.push('NOTHING');
    } else {
      // TODO how do multiple actions happen?
      output.push(this.deparse(actions[0], context));
    }
    return output.join(' ');
  }

  A_Expr(node: A_Expr, context = {}) {
    const output = [];
    const nodeName = unwrapList(node.name);
    switch (node.kind) {
      case 'AEXPR_OP': {
        let operator;

        if (node.lexpr) {
          // PARENS
          if (node.lexpr !== undefined && node.lexpr.A_Expr !== undefined) {
            output.push(parens(this.deparse(node.lexpr, context)));
          } else {
            output.push(this.deparse(node.lexpr, context));
          }
        }

        if (nodeName.length > 1) {
          const schema = this.deparse(nodeName[0], context);
          operator = this.deparse(nodeName[1], context);
          output.push(`OPERATOR(${schema}.${operator})`);
        } else {
          operator = this.deparse(nodeName[0], context);
          output.push(operator);
        }

        if (node.rexpr) {
          // PARENS
          if (node.rexpr !== undefined && node.rexpr.A_Expr !== undefined) {
            output.push(parens(this.deparse(node.rexpr, context)));
          } else {
            output.push(this.deparse(node.rexpr, context));
          }
        }

        if (output.length === 2) {
          return output.join('');
        }

        if (['->', '->>'].includes(operator)) {
          return output.join('');
        }

        return output.join(' ');
      }
      case 'AEXPR_OP_ANY':
        /* scalar op ANY (array) */
        output.push(this.deparse(node.lexpr, context));
        output.push(format('ANY (%s)', this.deparse(node.rexpr, context)));
        return output.join(` ${this.deparse(nodeName[0], context)} `);

      case 'AEXPR_OP_ALL':
        /* scalar op ALL (array) */
        output.push(this.deparse(node.lexpr, context));
        output.push(format('ALL (%s)', this.deparse(node.rexpr, context)));
        return output.join(` ${this.deparse(nodeName[0], context)} `);

      case 'AEXPR_DISTINCT':
        /* IS DISTINCT FROM - name must be "=" */
        return format(
          '%s IS DISTINCT FROM %s',
          this.deparse(node.lexpr, context),
          this.deparse(node.rexpr, context)
        );

      case 'AEXPR_NOT_DISTINCT':
        /* IS NOT DISTINCT FROM - name must be "=" */
        return format(
          '%s IS NOT DISTINCT FROM %s',
          this.deparse(node.lexpr, context),
          this.deparse(node.rexpr, context)
        );

      case 'AEXPR_NULLIF':
        /* NULLIF - name must be "=" */
        return format(
          'NULLIF(%s, %s)',
          this.deparse(node.lexpr, context),
          this.deparse(node.rexpr, context)
        );

      case 'AEXPR_OF': {
        /* IS [NOT] OF - name must be "=" or "<>" */
        const op = nodeName[0].String.str === '=' ? 'IS OF' : 'IS NOT OF';
        return format(
          '%s %s (%s)',
          this.deparse(node.lexpr, context),
          op,
          this.list(node.rexpr, ', ', '', context)
        );
      }

      case 'AEXPR_IN': {
        /* [NOT] IN - name must be "=" or "<>" */
        const operator = nodeName[0].String.str === '=' ? 'IN' : 'NOT IN';

        return format(
          '%s %s (%s)',
          this.deparse(node.lexpr, context),
          operator,
          this.list(node.rexpr, ', ', '', context)
        );
      }

      case 'AEXPR_LIKE':
        /* [NOT] LIKE - name must be "~~" or "!~~" */
        output.push(this.deparse(node.lexpr, context));

        if (nodeName[0].String.str === '!~~') {
          output.push(
            format('NOT LIKE (%s)', this.deparse(node.rexpr, context))
          );
        } else {
          output.push(format('LIKE (%s)', this.deparse(node.rexpr, context)));
        }

        return output.join(' ');

      case 'AEXPR_ILIKE':
        /* [NOT] ILIKE - name must be "~~*" or "!~~*" */
        output.push(this.deparse(node.lexpr, context));

        if (nodeName[0].String.str === '!~~*') {
          output.push(
            format('NOT ILIKE (%s)', this.deparse(node.rexpr, context))
          );
        } else {
          output.push(format('ILIKE (%s)', this.deparse(node.rexpr, context)));
        }

        return output.join(' ');

      case 'AEXPR_SIMILAR':
        // SIMILAR TO emits a similar_escape FuncCall node with the first argument
        output.push(this.deparse(node.lexpr, context));

        if (nodeName[0].String.str === '~') {
          if (unwrapList(node.rexpr.FuncCall.args).length > 1) {
            output.push(
              format(
                'SIMILAR TO %s ESCAPE %s',
                this.deparse(unwrapList(node.rexpr.FuncCall.args)[0], context),
                this.deparse(unwrapList(node.rexpr.FuncCall.args)[1], context)
              )
            );
          } else {
            output.push(
              format(
                'SIMILAR TO %s',
                this.deparse(unwrapList(node.rexpr.FuncCall.args)[0], context)
              )
            );
          }
        } else {
          if (unwrapList(node.rexpr.FuncCall.args).length > 1) {
            output.push(
              format(
                'NOT SIMILAR TO %s ESCAPE %s',
                this.deparse(unwrapList(node.rexpr.FuncCall.args)[0], context),
                this.deparse(unwrapList(node.rexpr.FuncCall.args)[1], context)
              )
            );
          } else {
            output.push(
              format(
                'NOT SIMILAR TO %s',
                this.deparse(unwrapList(node.rexpr.FuncCall.args)[0], context)
              )
            );
          }
        }
        return output.join(' ');

      case 'AEXPR_BETWEEN':
        output.push(this.deparse(node.lexpr, context));
        output.push(
          format(
            'BETWEEN %s AND %s',
            this.deparse(unwrapList(node.rexpr)[0], context),
            this.deparse(unwrapList(node.rexpr)[1], context)
          )
        );
        return output.join(' ');

      case 'AEXPR_NOT_BETWEEN':
        output.push(this.deparse(node.lexpr, context));
        output.push(
          format(
            'NOT BETWEEN %s AND %s',
            this.deparse(unwrapList(node.rexpr)[0], context),
            this.deparse(unwrapList(node.rexpr)[1], context)
          )
        );
        return output.join(' ');

      case 'AEXPR_BETWEEN_SYM':
        output.push(this.deparse(node.lexpr, context));
        output.push(
          format(
            'BETWEEN SYMMETRIC %s AND %s',
            this.deparse(unwrapList(node.rexpr)[0], context),
            this.deparse(unwrapList(node.rexpr)[1], context)
          )
        );
        return output.join(' ');

      case 'AEXPR_NOT_BETWEEN_SYM':
        output.push(this.deparse(node.lexpr, context));
        output.push(
          format(
            'NOT BETWEEN SYMMETRIC %s AND %s',
            this.deparse(unwrapList(node.rexpr)[0], context),
            this.deparse(unwrapList(node.rexpr)[1], context)
          )
        );
        return output.join(' ');

      // case 15:
      // AEXPR_PAREN

      default:
        return fail('A_Expr', node);
    }
  }

  Alias(node: Alias, context = {}) {
    const name = node.aliasname;

    const output = ['AS'];

    if (node.colnames) {
      output.push(this.quote(name) + parens(this.listQuotes(node.colnames)));
    } else {
      output.push(this.quote(name));
    }

    return output.join(' ');
  }

  A_ArrayExpr(node: A_ArrayExpr) {
    return format('ARRAY[%s]', this.list(node.elements));
  }

  A_Const(node: A_Const, context = {}) {
    if (node.val.String) {
      return this.escape(this.deparse(node.val, context));
    }

    return this.deparse(node.val, context);
  }

  A_Indices(node: A_Indices, context = {}) {
    if (node.lidx) {
      return format(
        '[%s:%s]',
        this.deparse(node.lidx, context),
        this.deparse(node.uidx, context)
      );
    }

    return format('[%s]', this.deparse(node.uidx, context));
  }

  A_Indirection(node: A_Indirection, context = {}) {
    const output = [`(${this.deparse(node.arg, context)})`];

    // TODO(zhm) figure out the actual rules for when a '.' is needed
    //
    // select a.b[0] from a;
    // select (select row(1)).*
    // select c2[2].f2 from comptable
    // select c2.a[2].f2[1].f3[0].a1 from comptable

    const indirection = unwrapList(node.indirection);
    for (let i = 0; i < indirection.length; i++) {
      const subnode = indirection[i];

      if (subnode.String || subnode.A_Star) {
        const value = subnode.A_Star ? '*' : this.quote(subnode.String.str);

        output.push(`.${value}`);
      } else {
        output.push(this.deparse(subnode, context));
      }
    }

    return output.join('');
  }

  A_Star(node: A_Star) {
    return '*';
  }

  BitString(node: BitString) {
    const prefix = node.str[0];
    return `${prefix}'${node.str.substring(1)}'`;
  }

  BoolExpr(node: BoolExpr, context = {}) {
    let fmt_str = '%s';
    if (context.bool) {
      fmt_str = '(%s)';
    }
    const ctx = Object.assign({}, context);
    ctx.bool = true;

    switch (node.boolop) {
      case 'AND_EXPR':
        return format(fmt_str, this.list(node.args, ' AND ', '', ctx));
      case 'OR_EXPR':
        return format(fmt_str, this.list(node.args, ' OR ', '', ctx));
      case 'NOT_EXPR':
        return format(
          'NOT (%s)',
          this.deparse(unwrapList(node.args)[0], context)
        );
      default:
        return fail('BoolExpr', node);
    }
  }

  BooleanTest(node: BooleanTest, context = {}) {
    const output = [];

    const ctx = Object.assign({}, context);
    ctx.bool = true;

    output.push(this.deparse(node.arg, ctx));

    switch (node.booltesttype) {
      case 'IS_TRUE':
        output.push('IS TRUE');
        break;
      case 'IS_NOT_TRUE':
        output.push('IS NOT TRUE');
        break;
      case 'IS_FALSE':
        output.push('IS FALSE');
        break;
      case 'IS_NOT_FALSE':
        output.push('IS NOT FALSE');
        break;
      case 'IS_UNKNOWN':
        output.push('IS UNKNOWN');
        break;
      case 'IS_NOT_UNKNOWN':
        output.push('IS NOT UNKNOWN');
        break;
    }

    return output.join(' ');
  }

  CaseExpr(node: CaseExpr, context = {}) {
    const output = ['CASE'];

    if (node.arg) {
      output.push(this.deparse(node.arg, context));
    }

    const args = unwrapList(node.args);
    for (let i = 0; i < args.length; i++) {
      output.push(this.deparse(args[i], context));
    }

    if (node.defresult) {
      output.push('ELSE');
      output.push(this.deparse(node.defresult, context));
    }

    output.push('END');

    return output.join(' ');
  }

  CoalesceExpr(node: CoalesceExpr, context = {}) {
    return format('COALESCE(%s)', this.list(node.args, ', ', '', context));
  }

  CollateClause(node: CollateClause, context = {}) {
    const output = [];

    if (node.arg) {
      output.push(this.deparse(node.arg, context));
    }

    output.push('COLLATE');

    if (node.collname) {
      output.push(this.quote(this.deparseNodes(node.collname, context)));
    }

    return output.join(' ');
  }

  CompositeTypeStmt(node: CompositeTypeStmt, context = {}) {
    const output = [];

    output.push('CREATE TYPE');
    output.push(this.RangeVar(node.typevar, context));
    output.push('AS');
    output.push('(');
    output.push(
      this.list(node.coldeflist, `,${NEWLINE_CHAR}`, TAB_CHAR, context)
    );
    output.push(')');

    return output.join(' ');
  }

  RenameStmt(node: RenameStmt, context = {}) {
    const output = [];

    if (
      node.renameType === 'OBJECT_FUNCTION' ||
      node.renameType === 'OBJECT_FOREIGN_TABLE' ||
      node.renameType === 'OBJECT_FDW' ||
      node.renameType === 'OBJECT_FOREIGN_SERVER'
    ) {
      output.push('ALTER');
      output.push(objtypeName(node.renameType));
      if (node.missing_ok) {
        output.push('IF EXISTS');
      }
      output.push(this.deparse(node.object, context));
      output.push('RENAME');
      output.push('TO');
      output.push(this.quote(node.newname));
    } else if (node.renameType === 'OBJECT_ATTRIBUTE') {
      output.push('ALTER');
      output.push(objtypeName(node.relationType));
      if (node.missing_ok) {
        output.push('IF EXISTS');
      }
      output.push(this.RangeVar(node.relation, context));
      output.push('RENAME');
      output.push(objtypeName(node.renameType));
      output.push(this.quote(node.subname));
      output.push('TO');
      output.push(this.quote(node.newname));
    } else if (
      node.renameType === 'OBJECT_DOMAIN' ||
      node.renameType === 'OBJECT_TYPE'
    ) {
      output.push('ALTER');
      output.push(objtypeName(node.renameType));
      if (node.missing_ok) {
        output.push('IF EXISTS');
      }
      const typObj = {
        TypeName: {
          names: node.object
        }
      };
      output.push(this.deparse(typObj, context));
      output.push('RENAME');
      output.push('TO');
      output.push(this.quote(node.newname));
    } else if (node.renameType === 'OBJECT_SCHEMA') {
      output.push('ALTER');
      output.push(objtypeName(node.renameType));
      if (node.missing_ok) {
        output.push('IF EXISTS');
      }
      output.push(this.quote(node.subname));
      output.push('RENAME');
      output.push('TO');
      output.push(this.quote(node.newname));
    } else if (node.renameType === 'OBJECT_DOMCONSTRAINT') {
      output.push('ALTER');
      output.push('DOMAIN');
      if (node.missing_ok) {
        output.push('IF EXISTS');
      }
      const typObj = {
        TypeName: {
          names: node.object
        }
      };
      output.push(this.deparse(typObj, context));
      output.push('RENAME CONSTRAINT');
      output.push(this.quote(node.subname));
      output.push('TO');
      output.push(this.quote(node.newname));
    } else {
      output.push('ALTER');
      output.push('TABLE');
      if (node.missing_ok) {
        output.push('IF EXISTS');
      }
      output.push(this.RangeVar(node.relation, context));
      output.push('RENAME');
      output.push(this.quote(node.subname));
      output.push('TO');
      output.push(this.quote(node.newname));
    }

    if (node.behavior === 'DROP_CASCADE') {
      output.push('CASCADE');
    }

    return output.join(' ');
  }

  AlterOwnerStmt(node: AlterOwnerStmt, context = {}) {
    const output = [];

    output.push('ALTER');
    output.push(objtypeName(node.objectType));
    const unwrapped = unwrapList(node.object);
    if (Array.isArray(unwrapped)) {
      output.push(this.listQuotes(unwrapped, '.'));
    } else {
      output.push(this.deparse(node.object, context));
    }
    output.push('OWNER TO');
    output.push(this.RoleSpec(node.newowner, context));

    return output.join(' ');
  }

  AlterObjectSchemaStmt(node: AlterObjectSchemaStmt, context = {}) {
    const output = [];

    if (node.objectType === 'OBJECT_TABLE') {
      output.push('ALTER');
      output.push(objtypeName(node.objectType));
      if (node.missing_ok) {
        output.push('IF EXISTS');
      }
      output.push(this.RangeVar(node.relation, context));
      output.push('SET SCHEMA');
      output.push(this.quote(node.newschema));
    } else {
      output.push('ALTER');
      output.push(objtypeName(node.objectType));
      if (node.missing_ok) {
        output.push('IF EXISTS');
      }
      const unwrapped = unwrapList(node.object);
      if (Array.isArray(unwrapped)) {
        output.push(this.listQuotes(unwrapped, '.'));
      } else {
        output.push(this.deparse(node.object, context));
      }
      output.push('SET SCHEMA');
      output.push(this.quote(node.newschema));
    }

    return output.join(' ');
  }

  ColumnDef(node: ColumnDef, context = {}) {
    const output = [this.quote(node.colname)];

    output.push(this.TypeName(node.typeName, context));

    if (node.raw_default) {
      output.push('USING');
      output.push(this.deparse(node.raw_default, context));
    }

    if (node.constraints) {
      output.push(this.list(node.constraints, ' ', '', context));
    }

    if (node.collClause) {
      output.push('COLLATE');
      const str = unwrapList(node.collClause.collname)[0].String.str;
      output.push(this.quote(str));
    }

    return compact(output).join(' ');
  }

  SQLValueFunction(node: SQLValueFunction) {
    if (node.op === 'SVFOP_CURRENT_DATE') {
      return 'CURRENT_DATE';
    }
    if (node.op === 'SVFOP_CURRENT_TIMESTAMP') {
      return 'CURRENT_TIMESTAMP';
    }
    if (node.op === 'SVFOP_CURRENT_USER') {
      return 'CURRENT_USER';
    }
    if (node.op === 'SVFOP_SESSION_USER') {
      return 'SESSION_USER';
    }
    throw new Error(`op=${node.op} SQLValueFunction not implemented`);
  }

  ColumnRef(node: ColumnRef, context = {}) {
    const KEYWORDS = ['old', 'new'];
    const fields = unwrapList(node.fields).map((field) => {
      if (field.String) {
        const value = this.deparse(field, context);
        if (context === 'trigger' && KEYWORDS.includes(value.toLowerCase())) {
          return value.toUpperCase();
        }
        return this.quote(value);
      }

      return this.deparse(field, context);
    });
    return fields.join('.');
  }

  CommentStmt(node: CommentStmt, context = {}) {
    const output = [];

    output.push('COMMENT');
    output.push('ON');
    output.push(objtypeName(node.objtype));

    const object = unwrapList(node.object);

    if (node.objtype === 'OBJECT_CAST') {
      output.push('(');
      output.push(this.deparse(object[0], context));
      output.push('AS');
      output.push(this.deparse(object[1], context));
      output.push(')');
    } else if (node.objtype === 'OBJECT_DOMCONSTRAINT') {
      output.push(this.deparse(object[1], context));
      output.push('ON');
      output.push('DOMAIN');
      output.push(this.deparse(object[0], context));
    } else if (
      node.objtype === 'OBJECT_OPCLASS' ||
      node.objtype === 'OBJECT_OPFAMILY'
    ) {
      output.push(this.deparse(object[1], context));
      output.push('USING');
      output.push(this.deparse(object[0], context));
    } else if (node.objtype === 'OBJECT_OPERATOR') {
      output.push(this.deparse(object, 'noquotes'));
    } else if (node.objtype === 'OBJECT_POLICY') {
      output.push(this.deparse(object[1], context));
      output.push('ON');
      output.push(this.deparse(object[0], context));
    } else if (node.objtype === 'OBJECT_ROLE') {
      output.push(this.deparse(object, context));
    } else if (node.objtype === 'OBJECT_RULE') {
      output.push(this.deparse(object[1], context));
      output.push('ON');
      output.push(this.deparse(object[0], context));
    } else if (node.objtype === 'OBJECT_TABCONSTRAINT') {
      if (object.length === 3) {
        output.push(this.deparse(object[2], context));
        output.push('ON');
        output.push(
          this.deparse(object[0], context) +
            '.' +
            this.deparse(object[1], context)
        );
      } else {
        output.push(this.deparse(object[1], context));
        output.push('ON');
        output.push(this.deparse(object[0], context));
      }
    } else if (node.objtype === 'OBJECT_TRANSFORM') {
      output.push('FOR');
      output.push(this.deparse(object[0], context));
      output.push('LANGUAGE');
      output.push(this.deparse(object[1], context));
    } else if (node.objtype === 'OBJECT_TRIGGER') {
      output.push(this.deparse(object[1], context));
      output.push('ON');
      output.push(this.deparse(object[0], context));
    } else {
      if (node.objtype === 'OBJECT_LARGEOBJECT') {
        output.push(dotty.get(node, 'object.Integer.ival'));
      } else if (object instanceof Array) {
        output.push(this.listQuotes(object, '.'));
      } else {
        output.push(this.deparse(object, context));
      }

      if (node.objargs) {
        output.push('(');
        output.push(this.list(node.objargs, ', ', '', context));
        output.push(')');
      }
    }

    output.push('IS');

    const escapeComment = (str) => {
      return str.replace(/\\/g, '\\');
    };

    if (node.comment) {
      if (/[^a-zA-Z0-9]/.test(node.comment)) {
        // special chars we care about...
        output.push(`E'${escapeComment(node.comment)}'`);
      } else {
        // find a double \\n or \\ something...
        output.push(`'${node.comment}'`);
      }
    } else {
      output.push('NULL');
    }

    return output.join(' ');
  }

  CommonTableExpr(node: CommonTableExpr, context = {}) {
    const output = [];

    output.push(node.ctename);

    if (node.aliascolnames) {
      const colnames = this.quote(
        this.deparseNodes(node.aliascolnames, context)
      );
      output.push(`(${colnames.join(', ')})`);
    }

    output.push('AS');
    if (node.ctematerialized === 'CTEMaterializeAlways') {
      output.push('MATERIALIZED');
    } else if (node.ctematerialized === 'CTEMaterializeNever') {
      output.push('NOT MATERIALIZED');
    }

    output.push(format('(%s)', this.deparse(node.ctequery)));

    return output.join(' ');
  }

  DefineStmt(node: DefineStmt, context = {}) {
    const output = [];
    output.push('CREATE');

    if (node.replace) {
      output.push('OR REPLACE');
    }

    switch (node.kind) {
      case 'OBJECT_AGGREGATE':
        output.push('AGGREGATE');
        break;
      case 'OBJECT_OPERATOR':
        output.push('OPERATOR');
        break;
      case 'OBJECT_TYPE':
        output.push('TYPE');
        break;
      case 'OBJECT_TSPARSER':
        output.push('TEXT SEARCH PARSER');
        break;
      case 'OBJECT_TSDICTIONARY':
        output.push('TEXT SEARCH DICTIONARY');
        break;
      case 'OBJECT_TSTEMPLATE':
        output.push('TEXT SEARCH TEMPLATE');
        break;
      case 'OBJECT_TSCONFIGURATION':
        output.push('TEXT SEARCH CONFIGURATION');
        break;
      case 'OBJECT_COLLATION':
        output.push('COLLATION');
        break;
      default:
        throw new Error('DefineStmt not recognized');
    }

    if (node.if_not_exists) {
      output.push('IF NOT EXISTS');
    }

    switch (node.kind) {
      case 'OBJECT_AGGREGATE':
        // output.push(this.deparse(node.defnames));
        output.push(this.list(node.defnames, '.', '', context));

        break;
      case 'OBJECT_OPERATOR':
        output.push(this.list(node.defnames, '.', '', context));
        // output.push(this.deparse(node.defnames));
        break;
      case 'OBJECT_TYPE':
      case 'OBJECT_TSPARSER':
      case 'OBJECT_TSDICTIONARY':
      case 'OBJECT_TSTEMPLATE':
      case 'OBJECT_TSCONFIGURATION':
      case 'OBJECT_COLLATION':
        output.push(this.deparse(node.defnames));
        break;
      default:
        throw new Error('DefineStmt not recognized');
    }

    if (!node.oldstyle && node.kind == 'OBJECT_AGGREGATE') {
      output.push('(');
      output.push(`${this.listQuotes(node.args[0], ',')}`);
      output.push(')');
    }

    const definition = unwrapList(node.definition);
    if (definition.length > 0) {
      output.push('(');
      for (let n = 0; n < definition.length; n++) {
        const defElement = definition[n].DefElem;
        output.push(defElement.defname);
        if (defElement.arg) {
          output.push('=');
          output.push(this.deparse(defElement.arg));
        }
        if (n !== definition.length - 1) {
          output.push(',');
        }
      }
      output.push(')');
    }

    return output.join(' ');
  }

  DefElem(node: DefElem, context = {}) {
    if (node.defname === 'transaction_isolation') {
      return format(
        'ISOLATION LEVEL %s',
        node.arg.A_Const.val.String.str.toUpperCase()
      );
    }

    if (node.defname === 'transaction_read_only') {
      return node.arg.A_Const.val.Integer.ival === 0
        ? 'READ WRITE'
        : 'READ ONLY';
    }

    if (node.defname === 'transaction_deferrable') {
      return node.arg.A_Const.val.Integer.ival === 0
        ? 'NOT DEFERRABLE'
        : 'DEFERRABLE';
    }

    if (node.defname === 'set') {
      return this.deparse(node.arg, context);
    }

    let name = node.defname;
    if (node.defnamespace) {
      name = `${node.defnamespace}.${node.defname}`;
    }

    if (context === 'generated' || context === 'sequence') {
      switch (name) {
        case 'start': {
          const start = this.deparse(node.arg, context);
          return `START WITH ${start}`;
        }
        case 'increment': {
          const inc = this.deparse(node.arg, context);
          if (context === 'sequence') {
            // we need 'simple' so it doesn't wrap negative numbers in parens
            return `${name} ${this.deparse(node.arg, 'simple')}`;
          }

          return `INCREMENT BY ${inc}`;
        }
        case 'sequence_name': {
          return `SEQUENCE NAME ${this.listQuotes(node.arg, '.')}`;
        }
        case 'cycle': {
          const on = this.deparse(node.arg, context) + '' === '1';
          return on ? 'CYCLE' : 'NO CYCLE';
        }
        case 'minvalue': {
          const off = !node.hasOwnProperty('arg');
          return off
            ? 'NO MINVALUE'
            : `${name} ${this.deparse(node.arg, 'simple')}`;
        }
        case 'maxvalue': {
          const off = !node.hasOwnProperty('arg');
          return off
            ? 'NO MAXVALUE'
            : `${name} ${this.deparse(node.arg, 'simple')}`;
        }
        // alter
        case 'owned_by': {
          const output = [];
          unwrapList(node.arg).forEach((opt) => {
            output.push(this.quote(this.deparse(opt, context)));
          });
          return `OWNED BY ${output.join('.')}`;
        }
        // alter
        case 'restart': {
          if (node.arg) {
            return `RESTART WITH ${this.deparse(node.arg, context)}`;
          }
          return `RESTART`;
        }
        default:
          if (node.arg) {
            // we need 'simple' so it doesn't wrap negative numbers in parens
            return `${name} ${this.deparse(node.arg, 'simple')}`;
          }
      }
    } else if (context === 'explain') {
      if (node.arg) {
        return `${name} ${this.deparse(node.arg)}`;
      }
    } else if (node.arg) {
      return `${name} = ${this.deparse(node.arg, context)}`;
    }

    return name;
  }

  DoStmt(node: DoStmt) {
    return `DO $$${NEWLINE_CHAR}  ${dotty
      .get(node, 'args.0.DefElem.arg.String.str')
      .trim()} $$`;
  }

  Float(node: Float) {
    // wrap negative numbers in parens, SELECT (-2147483648)::int4 * (-1)::int4
    if (node.str[0] === '-') {
      return `(${node.str})`;
    }

    return node.str;
  }

  FuncCall(node: FuncCall, context = {}) {
    const output = [];

    let params = [];

    if (node.args) {
      params = unwrapList(node.args).map((item) => {
        return this.deparse(item, context);
      });
    }

    // COUNT(*)
    if (node.agg_star) {
      params.push('*');
    }

    const name = this.list(node.funcname, '.', '', context);

    const order = [];

    const withinGroup = node.agg_within_group;

    if (node.agg_order) {
      order.push('ORDER BY');
      order.push(this.list(node.agg_order, ', ', '', context));
    }

    const call = [];

    call.push(name + '(');

    if (node.agg_distinct) {
      call.push('DISTINCT ');
    }

    // prepend variadic before the last parameter
    // SELECT CONCAT('|', VARIADIC ARRAY['1','2','3'])
    if (node.func_variadic) {
      params[params.length - 1] = 'VARIADIC ' + params[params.length - 1];
    }

    call.push(params.join(', '));

    if (order.length && !withinGroup) {
      call.push(' ');
      call.push(order.join(' '));
    }

    call.push(')');

    output.push(compact(call).join(''));

    if (order.length && withinGroup) {
      output.push('WITHIN GROUP');
      output.push(parens(order.join(' ')));
    }

    if (node.agg_filter != null) {
      output.push(
        format('FILTER (WHERE %s)', this.deparse(node.agg_filter, context))
      );
    }

    if (node.over != null) {
      output.push(format('OVER %s', this.WindowDef(node.over, context)));
    }

    return output.join(' ');
  }

  GroupingFunc(node: GroupingFunc, context = {}) {
    return 'GROUPING(' + this.list(node.args, ', ', '', context) + ')';
  }

  GroupingSet(node: GroupingSet, context = {}) {
    switch (node.kind) {
      case 'GROUPING_SET_EMPTY':
        return '()';

      case 'GROUPING_SET_SIMPLE':
        return fail('GroupingSet', node);

      case 'GROUPING_SET_ROLLUP':
        return 'ROLLUP (' + this.list(node.content, ', ', '', context) + ')';

      case 'GROUPING_SET_CUBE':
        return 'CUBE (' + this.list(node.content, ', ', '', context) + ')';

      case 'GROUPING_SET_SETS':
        return (
          'GROUPING SETS (' + this.list(node.content, ', ', '', context) + ')'
        );

      default:
        return fail('GroupingSet', node);
    }
  }

  IndexStmt(node: IndexStmt, context = {}) {
    const output = [];
    output.push('CREATE');
    if (node.unique) {
      output.push('UNIQUE');
    }
    output.push('INDEX');
    if (node.concurrent) {
      output.push('CONCURRENTLY');
    }

    if (node.idxname) {
      output.push(node.idxname);
    }
    output.push('ON');
    output.push(this.RangeVar(node.relation, context));

    if (node.accessMethod) {
      const accessMethod = node.accessMethod.toUpperCase();
      if (accessMethod !== 'BTREE') {
        output.push('USING');
        output.push(accessMethod);
      }
    }

    if (node.indexParams) {
      output.push('(');
      output.push(this.list(node.indexParams, ', ', '', context));
      output.push(')');
    }
    if (node.indexIncludingParams) {
      output.push('INCLUDE (');
      output.push(this.list(node.indexIncludingParams, ', ', '', context));
      output.push(')');
    }

    if (node.whereClause) {
      output.push('WHERE');
      output.push(this.deparse(node.whereClause, context));
    }

    return output.join(' ');
  }

  IndexElem(node: IndexElem, context = {}) {
    const output = [];
    if (node.name) {
      output.push(node.name);
      if (node.ordering === 'SORTBY_DESC') {
        output.push('DESC');
      } else if (node.ordering === 'SORTBY_ASC') {
        output.push('ASC');
      }
      return output.join(' ');
    }
    if (node.expr) {
      return this.deparse(node.expr, context);
    }
    return fail('IndexElem', node);
  }

  InsertStmt(node: InsertStmt, context = {}) {
    const output = [];

    if (node.withClause) {
      output.push(this.WithClause(node.withClause, context));
    }

    output.push('INSERT INTO');
    output.push(this.RangeVar(node.relation, context));

    const cols = unwrapList(node.cols);
    if (cols && cols.length) {
      output.push('(');
      output.push(this.list(cols, ', ', '', context));
      output.push(')');
    }

    if (node.selectStmt) {
      output.push(this.deparse(node.selectStmt, context));
    } else {
      output.push('DEFAULT VALUES');
    }

    if (node.onConflictClause) {
      const clause = node.onConflictClause;

      output.push('ON CONFLICT');
      if (clause.infer.indexElems) {
        output.push('(');
        output.push(this.list(clause.infer.indexElems, ', ', '', context));
        output.push(')');
      } else if (clause.infer.conname) {
        output.push('ON CONSTRAINT');
        output.push(clause.infer.conname);
      }

      switch (clause.action) {
        case 'ONCONFLICT_NOTHING':
          output.push('DO NOTHING');
          break;
        case 'ONCONFLICT_UPDATE':
          output.push('DO');
          output.push(this.UpdateStmt(clause, context));
          break;
        default:
          throw new Error('unhandled CONFLICT CLAUSE');
      }
    }

    if (node.returningList) {
      output.push('RETURNING');
      output.push(this.deparseReturningList(node.returningList, context));
    }

    return output.join(' ');
  }

  SetToDefault(node: SetToDefault) {
    return 'DEFAULT';
  }

  MultiAssignRef(node: MultiAssignRef, context = {}) {
    const output = [];
    output.push(this.deparse(node.source, context));
    return output.join(' ');
  }

  DeleteStmt(node: DeleteStmt, context = {}) {
    const output = [''];

    if (node.withClause) {
      output.push(this.WithClause(node.withClause, context));
    }

    output.push('DELETE');
    output.push('FROM');
    output.push(this.RangeVar(node.relation, context));

    if (node.usingClause) {
      output.push('USING');
      output.push(this.list(node.usingClause, ', ', '', context));
    }

    if (node.whereClause) {
      output.push('WHERE');
      output.push(this.deparse(node.whereClause, context));
    }

    if (node.returningList) {
      output.push('RETURNING');
      output.push(this.deparseReturningList(node.returningList, context));
    }
    return output.join(' ');
  }

  UpdateStmt(node: UpdateStmt, context = {}) {
    const output = [];

    if (node.withClause) {
      output.push(this.WithClause(node.withClause, context));
    }

    output.push('UPDATE');
    if (node.relation) {
      // onConflictClause no relation..
      output.push(this.RangeVar(node.relation, context));
    }
    output.push('SET');

    const targetList = unwrapList(node.targetList);
    if (targetList && targetList.length) {
      if (
        targetList[0].ResTarget &&
        targetList[0].ResTarget.val &&
        targetList[0].ResTarget.val.MultiAssignRef
      ) {
        output.push('(');
        output.push(
          targetList.map((target) => target.ResTarget.name).join(',')
        );
        output.push(')');
        output.push('=');
        output.push(this.deparse(targetList[0].ResTarget.val, context));
      } else {
        output.push(
          targetList.map((target) => this.deparse(target, 'update')).join(',')
        );
      }
    }

    if (node.fromClause) {
      output.push('FROM');
      output.push(this.list(node.fromClause, ', ', '', context));
    }

    if (node.whereClause) {
      output.push('WHERE');
      output.push(this.deparse(node.whereClause, context));
    }

    if (node.returningList) {
      output.push('RETURNING');
      output.push(this.deparseReturningList(node.returningList, context));
    }

    return output.join(' ');
  }

  Integer(node: Integer, context = {}) {
    if (node.ival < 0 && context !== 'simple') {
      return `(${node.ival})`;
    }

    return node.ival.toString();
  }

  IntoClause(node: IntoClause, context = {}) {
    return this.RangeVar(node.rel, context);
  }

  JoinExpr(node: JoinExpr, context = {}) {
    const output = [];

    output.push(this.deparse(node.larg, context));

    if (node.isNatural) {
      output.push('NATURAL');
    }

    let join = null;

    switch (true) {
      case node.jointype === 'JOIN_INNER' && node.quals != null:
        join = 'INNER JOIN';
        break;

      case node.jointype === 'JOIN_INNER' &&
        !node.isNatural &&
        !(node.quals != null) &&
        !(node.usingClause != null):
        join = 'CROSS JOIN';
        break;

      case node.jointype === 'JOIN_INNER':
        join = 'JOIN';
        break;

      case node.jointype === 'JOIN_LEFT':
        join = 'LEFT OUTER JOIN';
        break;

      case node.jointype === 'JOIN_FULL':
        join = 'FULL OUTER JOIN';
        break;

      case node.jointype === 'JOIN_RIGHT':
        join = 'RIGHT OUTER JOIN';
        break;

      default:
        fail('JoinExpr', node);
        break;
    }

    output.push(join);

    if (node.rarg) {
      // wrap nested join expressions in parens to make the following symmetric:
      // select * from int8_tbl x cross join (int4_tbl x cross join lateral (select x.f1) ss)
      if (node.rarg.JoinExpr != null && !(node.rarg.JoinExpr.alias != null)) {
        output.push(`(${this.deparse(node.rarg, context)})`);
      } else {
        output.push(this.deparse(node.rarg, context));
      }
    }

    if (node.quals) {
      output.push(`ON ${this.deparse(node.quals, context)}`);
    }

    if (node.usingClause) {
      const using = this.quote(
        this.deparseNodes(node.usingClause, context)
      ).join(', ');

      output.push(`USING (${using})`);
    }

    const wrapped =
      node.rarg.JoinExpr != null || node.alias
        ? '(' + output.join(' ') + ')'
        : output.join(' ');

    if (node.alias) {
      return wrapped + ' ' + this.Alias(node.alias, context);
    }

    return wrapped;
  }

  LockingClause(node: LockingClause, context = {}) {
    const output = [];

    switch (node.strength) {
      case 'LCS_NONE':
        output.push('NONE');
        break;
      case 'LCS_FORKEYSHARE':
        output.push('FOR KEY SHARE');
        break;
      case 'LCS_FORSHARE':
        output.push('FOR SHARE');
        break;
      case 'LCS_FORNOKEYUPDATE':
        output.push('FOR NO KEY UPDATE');
        break;
      case 'LCS_FORUPDATE':
        output.push('FOR UPDATE');
        break;
      default:
        return fail('LockingClause', node);
    }

    if (node.lockedRels) {
      output.push('OF');
      output.push(this.list(node.lockedRels, ', ', '', context));
    }

    return output.join(' ');
  }

  LockStmt(node: LockStmt, context = {}) {
    const output = ['LOCK'];

    output.push(this.list(node.relations, ', ', '', { lock: true }));
    output.push('IN');
    output.push(LOCK_MODES[node.mode]);
    output.push('MODE');
    if (node.nowait) {
      output.push('NOWAIT');
    }
    return output.join(' ');
  }

  MinMaxExpr(node: MinMaxExpr, context = {}) {
    const output = [];

    if (node.op === 'IS_GREATEST') {
      output.push('GREATEST');
    } else {
      output.push('LEAST');
    }

    output.push(parens(this.list(node.args, ', ', '', context)));

    return output.join('');
  }

  NamedArgExpr(node: NamedArgExpr, context = {}) {
    const output = [];

    output.push(node.name);
    output.push(':=');
    output.push(this.deparse(node.arg, context));

    return output.join(' ');
  }

  Null(node) {
    return 'NULL';
  }

  NullTest(node: NullTest, context = {}) {
    const output = [this.deparse(node.arg, context)];

    if (node.nulltesttype === 'IS_NULL') {
      output.push('IS NULL');
    } else if (node.nulltesttype === 'IS_NOT_NULL') {
      output.push('IS NOT NULL');
    }

    return output.join(' ');
  }

  ParamRef(node: ParamRef) {
    if (node.number >= 0) {
      return ['$', node.number].join('');
    }
    return '?';
  }

  RangeFunction(node: RangeFunction, context = {}) {
    const output = [];

    if (node.lateral) {
      output.push('LATERAL');
    }

    const funcs = [];

    const functions = unwrapList(node.functions);
    for (let i = 0; i < functions.length; i++) {
      const funcCall = unwrapList(functions[i]);
      const call = [this.deparse(funcCall[0], context)];

      const secondFuncCall = unwrapList(funcCall[1]);
      if (secondFuncCall && secondFuncCall.length) {
        call.push(
          format('AS (%s)', this.list(secondFuncCall, ', ', '', context))
        );
      }

      funcs.push(call.join(' '));
    }

    const calls = funcs.join(', ');

    if (node.is_rowsfrom) {
      output.push(`ROWS FROM (${calls})`);
    } else {
      output.push(calls);
    }

    if (node.ordinality) {
      output.push('WITH ORDINALITY');
    }

    if (node.alias) {
      output.push(this.Alias(node.alias, context));
    }

    if (node.coldeflist) {
      const defList = this.list(node.coldeflist, ', ', '', context);

      if (!node.alias) {
        output.push(` AS (${defList})`);
      } else {
        output.push(`(${defList})`);
      }
    }

    return output.join(' ');
  }

  RangeSubselect(node: RangeSubselect, context = {}) {
    let output = '';

    if (node.lateral) {
      output += 'LATERAL ';
    }

    output += parens(this.deparse(node.subquery, context));

    if (node.alias) {
      return output + ' ' + this.Alias(node.alias, context);
    }

    return output;
  }

  RangeTableSample(node: RangeTableSample, context = {}) {
    const output = [];

    output.push(this.deparse(node.relation, context));
    output.push('TABLESAMPLE');
    output.push(this.deparse(unwrapList(node.method)[0], context));

    if (node.args) {
      output.push(parens(this.list(node.args, ', ', '', context)));
    }

    if (node.repeatable) {
      output.push('REPEATABLE(' + this.deparse(node.repeatable, context) + ')');
    }

    return output.join(' ');
  }

  RangeVar(node: RangeVar, context = {}) {
    const output = [];
    if (node.inhOpt === 0) {
      output.push('ONLY');
    }

    if (!node.inh && (context.lock || context === 'truncate')) {
      output.push('ONLY');
    }

    if (node.relpersistence === 'u') {
      output.push('UNLOGGED');
    }

    if (node.relpersistence === 't' && context !== 'view') {
      output.push('TEMPORARY TABLE');
    }

    if (node.schemaname != null) {
      output.push(`${this.quote(node.schemaname)}.${this.quote(node.relname)}`);
    } else {
      output.push(this.quote(node.relname));
    }

    if (node.alias) {
      output.push(this.Alias(node.alias, context));
    }

    return output.join(' ');
  }

  ResTarget(node: ResTarget, context = {}) {
    if (context === 'select') {
      return compact([
        this.deparse(node.val, context),
        this.quote(node.name)
      ]).join(' AS ');
    } else if (context === 'update') {
      return compact([node.name, this.deparse(node.val, context)]).join(' = ');
    } else if (!(node.val != null)) {
      return this.quote(node.name);
    }

    return fail('ResTarget', node);
  }

  RowExpr(node: RowExpr, context = {}) {
    if (node.row_format === 'COERCE_IMPLICIT_CAST') {
      return parens(this.list(node.args, ', ', '', context));
    }

    return format('ROW(%s)', this.list(node.args, ', ', '', context));
  }

  ExplainStmt(node: ExplainStmt, context = {}) {
    const output = [];
    output.push('EXPLAIN');
    if (node.options) {
      output.push('(');
      output.push(this.list(node.options, ', ', '', 'explain'));
      output.push(')');
    }
    output.push(this.deparse(node.query, context));
    return output.join(' ');
  }

  SelectStmt(node: SelectStmt, context = {}) {
    const output = [];

    if (node.withClause) {
      output.push(this.WithClause(node.withClause, context));
    }

    if (node.op === 'SETOP_NONE') {
      // VALUES select's don't get SELECT
      if (node.valuesLists == null) {
        output.push('SELECT');
      }
    } else {
      output.push(parens(this.SelectStmt(node.larg, context)));

      switch (node.op) {
        case 'SETOP_NONE':
          output.push('NONE');
          break;
        case 'SETOP_UNION':
          output.push('UNION');
          break;
        case 'SETOP_INTERSECT':
          output.push('INTERSECT');
          break;
        case 'SETOP_EXCEPT':
          output.push('EXCEPT');
          break;
        default:
          throw new Error('bad SelectStmt op');
      }
      if (node.all) {
        output.push('ALL');
      }

      output.push(parens(this.SelectStmt(node.rarg, context)));
    }

    if (node.distinctClause) {
      const distinctClause = unwrapList(node.distinctClause);
      if (
        !isEmptyObject(distinctClause[0])
        // new change distinctClause can be {}
      ) {
        output.push('DISTINCT ON');

        const clause = distinctClause
          .map((e) => this.deparse(e, 'select'))
          .join(`,${NEWLINE_CHAR}`);

        output.push(`(${clause})`);
      } else {
        output.push('DISTINCT');
      }
    }

    if (node.targetList) {
      output.push(
        indent(
          unwrapList(node.targetList)
            .map((e) => this.deparse(e, 'select'))
            .join(`,${NEWLINE_CHAR}`)
        )
      );
    }

    if (node.intoClause) {
      output.push('INTO');
      output.push(indent(this.IntoClause(node.intoClause, context)));
    }

    if (node.fromClause) {
      output.push('FROM');
      output.push(
        indent(
          unwrapList(node.fromClause)
            .map((e) => this.deparse(e, 'from'))
            .join(`,${NEWLINE_CHAR}`)
        )
      );
    }

    if (node.whereClause) {
      output.push('WHERE');
      output.push(indent(this.deparse(node.whereClause, context)));
    }

    if (node.valuesLists) {
      output.push('VALUES');

      const lists = unwrapList(node.valuesLists).map((list) => {
        return `(${this.list(list, ', ', '', context)})`;
      });

      output.push(lists.join(', '));
    }

    if (node.groupClause) {
      output.push('GROUP BY');
      output.push(
        indent(
          unwrapList(node.groupClause)
            .map((e) => this.deparse(e, 'group'))
            .join(`,${NEWLINE_CHAR}`)
        )
      );
    }

    if (node.havingClause) {
      output.push('HAVING');
      output.push(indent(this.deparse(node.havingClause, context)));
    }

    if (node.windowClause) {
      output.push('WINDOW');

      const windows = [];

      const windowClause = unwrapList(node.windowClause);
      for (let i = 0; i < windowClause.length; i++) {
        const w = windowClause[i];
        const window = [];

        if (w.WindowDef.name) {
          window.push(this.quote(w.WindowDef.name) + ' AS');
        }

        window.push(parens(this.deparse(w, 'window')));

        windows.push(window.join(' '));
      }

      output.push(windows.join(', '));
    }

    if (node.sortClause) {
      output.push('ORDER BY');
      output.push(
        indent(
          unwrapList(node.sortClause)
            .map((e) => this.deparse(e, 'sort'))
            .join(`,${NEWLINE_CHAR}`)
        )
      );
    }

    if (node.limitCount) {
      output.push('LIMIT');
      output.push(indent(this.deparse(node.limitCount, context)));
    }

    if (node.limitOffset) {
      output.push('OFFSET');
      output.push(indent(this.deparse(node.limitOffset, context)));
    }

    if (node.lockingClause) {
      node.lockingClause.forEach((item) => {
        return output.push(this.deparse(item, context));
      });
    }

    return output.join(' ');
  }

  TruncateStmt(node: TruncateStmt, context = {}) {
    const output = ['TRUNCATE TABLE'];

    output.push(this.list(node.relations, ', ', '', 'truncate'));

    if (node.restart_seqs) {
      output.push('RESTART IDENTITY');
    }

    if (node.behavior === 'DROP_CASCADE') {
      output.push('CASCADE');
    }

    return output.join(' ');
  }

  AlterDefaultPrivilegesStmt(node: AlterDefaultPrivilegesStmt, context = {}) {
    const output = [];
    output.push('ALTER DEFAULT PRIVILEGES');

    const options = unwrapList(dotty.get(node, 'options'));

    if (options) {
      const elem = options.find((el) => el.hasOwnProperty('DefElem'));

      const elemDefElemArg = unwrapList(elem.DefElem.arg);
      if (elem.DefElem.defname === 'schemas') {
        output.push('IN SCHEMA');
        output.push(elemDefElemArg[0].String.str);
      }
      if (elem.DefElem.defname === 'roles') {
        output.push('FOR ROLE');
        const roleSpec = elemDefElemArg[0];
        output.push(this.deparse(roleSpec, context));
      }
      output.push(NEWLINE_CHAR);
    }
    output.push(this.GrantStmt(node.action, context));

    return output.join(' ');
  }

  AlterTableStmt(node: AlterTableStmt, context = {}) {
    const output = [];
    const ctx = Object.assign({}, context);
    output.push('ALTER');
    if (node.relkind === 'OBJECT_TABLE') {
      output.push('TABLE');
      const inh = dotty.get(node, 'relation.inh');
      if (!inh) {
        output.push('ONLY');
      }
    } else if (node.relkind === 'OBJECT_TYPE') {
      output.push('TYPE');
    } else {
      fail('AlterTableStmt', node);
    }
    if (node.missing_ok) {
      output.push('IF EXISTS');
    }

    ctx.alterType = node.relkind;
    output.push(this.RangeVar(node.relation, ctx));
    output.push(this.list(node.cmds, ', ', '', ctx));

    return output.join(' ');
  }

  AlterTableCmd(node: AlterTableCmd, context = {}) {
    const output = [];

    let subType = 'COLUMN';

    if (context && context.alterType === 'OBJECT_TYPE') {
      subType = 'ATTRIBUTE';
    }

    if (node.subtype === 'AT_AddColumn') {
      output.push('ADD');
      output.push(subType);
      if (node.missing_ok) {
        output.push('IF NOT EXISTS');
      }
      output.push(this.quote(node.name));
      output.push(this.deparse(node.def, context));
    } else if (node.subtype === 'AT_ColumnDefault') {
      output.push('ALTER');
      output.push(subType);
      output.push(this.quote(node.name));
      if (node.def) {
        output.push('SET DEFAULT');
        output.push(this.deparse(node.def, context));
      } else {
        output.push('DROP DEFAULT');
      }
    } else if (node.subtype === 'AT_DropNotNull') {
      output.push('ALTER');
      output.push(subType);
      output.push(this.quote(node.name));
      output.push('DROP NOT NULL');
    } else if (node.subtype === 'AT_SetNotNull') {
      output.push('ALTER');
      output.push(subType);
      output.push(this.quote(node.name));
      output.push('SET NOT NULL');
    } else if (node.subtype === 'AT_SetStatistics') {
      output.push('ALTER');
      output.push(this.quote(node.name));
      output.push('SET STATISTICS');
      output.push(dotty.get(node, 'def.Integer.ival'));
    } else if (node.subtype === 'AT_SetOptions') {
      output.push('ALTER');
      output.push(subType);
      output.push(this.quote(node.name));
      output.push('SET');
      output.push('(');
      output.push(this.list(node.def, ', ', '', context));
      output.push(')');
    } else if (node.subtype === 'AT_SetStorage') {
      output.push('ALTER');
      output.push(this.quote(node.name));
      output.push('SET STORAGE');
      if (node.def) {
        output.push(this.deparse(node.def, context));
      } else {
        output.push('PLAIN');
      }
    } else if (node.subtype === 'AT_DropColumn') {
      output.push('DROP');
      output.push(subType);
      if (node.missing_ok) {
        output.push('IF EXISTS');
      }
      output.push(this.quote(node.name));
    } else if (node.subtype === 'AT_AddConstraint') {
      // output.push('ADD CONSTRAINT');
      output.push('ADD');
      output.push(this.deparse(node.def, context));
    } else if (node.subtype === 'AT_ValidateConstraint') {
      output.push('VALIDATE CONSTRAINT');
      output.push(this.quote(node.name, context));
    } else if (node.subtype === 'AT_DropConstraint') {
      output.push('DROP CONSTRAINT');
      if (node.missing_ok) {
        output.push('IF EXISTS');
      }
      output.push(this.quote(node.name));
    } else if (node.subtype === 'AT_AlterColumnType') {
      output.push('ALTER');
      output.push(subType);
      output.push(this.quote(node.name));
      output.push('TYPE');
      output.push(this.deparse(node.def, context));
    } else if (node.subtype === 'AT_ChangeOwner') {
      output.push('OWNER');
      output.push('TO');
      output.push(this.RoleSpec(node.newowner, context));
    } else if (node.subtype === 'AT_ClusterOn') {
      output.push('CLUSTER ON');
      output.push(this.quote(node.name));
    } else if (node.subtype === 'AT_DropCluster') {
      output.push('SET WITHOUT CLUSTER');
    } else if (node.subtype === 'AT_AddOids') {
      output.push('SET WITH OIDS');
    } else if (node.subtype === 'AT_DropOids') {
      output.push('SET WITHOUT OIDS');
    } else if (node.subtype === 'AT_SetRelOptions') {
      output.push('SET');
      output.push('(');
      output.push(this.list(node.def, ', ', '', context));
      output.push(')');
    } else if (node.subtype === 'AT_ResetRelOptions') {
      output.push('RESET');
      output.push('(');
      output.push(this.list(node.def, ', ', '', context));
      output.push(')');
    } else if (node.subtype === 'AT_AddIdentity') {
      output.push('ALTER COLUMN');
      output.push(this.quote(node.name));
      output.push('ADD');
      output.push(this.deparse(node.def, context));
    } else if (node.subtype === 'AT_AddInherit') {
      output.push('INHERIT');
      output.push(this.deparse(node.def, context));
    } else if (node.subtype === 'AT_DropInherit') {
      output.push('NO INHERIT');
      output.push(this.deparse(node.def, context));
    } else if (node.subtype === 'AT_AddOf') {
      output.push('OF');
      output.push(this.deparse(node.def, context));
    } else if (node.subtype === 'AT_DropOf') {
      output.push('NOT OF');
      //output.push(this.deparse(node.def));
    } else if (node.subtype === 'AT_EnableRowSecurity') {
      output.push('ENABLE ROW LEVEL SECURITY');
    } else if (node.subtype === 'AT_DisableRowSecurity') {
      output.push('DISABLE ROW LEVEL SECURITY');
    } else if (node.subtype === 'AT_ForceRowSecurity') {
      output.push('FORCE ROW SECURITY');
    } else if (node.subtype === 'AT_NoForceRowSecurity') {
      output.push('NO FORCE ROW SECURITY');
    }

    if (node.behavior === 'DROP_CASCADE') {
      output.push('CASCADE');
    }

    return output.join(' ');
  }

  CreateEnumStmt(node: CreateEnumStmt, context = {}) {
    const output = [];
    output.push('CREATE TYPE');
    output.push(this.list(node.typeName, '.', '', context));
    output.push('AS ENUM');
    output.push(`(${NEWLINE_CHAR}`);
    const vals = unwrapList(node.vals).map((val) => {
      return { String: { str: `'${val.String.str}'` } };
    });
    output.push(this.list(vals, `,${NEWLINE_CHAR}`, TAB_CHAR));
    output.push(`${NEWLINE_CHAR})`);
    return output.join(' ');
  }

  AlterEnumStmt(node: AlterEnumStmt, context = {}) {
    const output = [];
    output.push('ALTER TYPE');
    const typObj = {
      TypeName: {
        names: node.typeName
      }
    };
    output.push(this.deparse(typObj, context));

    if (node.newVal) {
      output.push('ADD VALUE');
      const result = node.newVal.replace(/'/g, "''");
      output.push(`'${result}'`);
    }

    if (node.newValNeighbor) {
      if (node.newValIsAfter) {
        output.push('AFTER');
      } else {
        output.push('BEFORE');
      }
      const result = node.newValNeighbor.replace(/'/g, "''");
      output.push(`'${result}'`);
    }

    if (node.behavior === 'DROP_CASCADE') {
      output.push('CASCADE');
    }

    return output.join(' ');
  }

  AlterDomainStmt(node: AlterDomainStmt, context = {}) {
    const output = [];
    output.push('ALTER DOMAIN');

    const typObj = {
      TypeName: {
        names: node.typeName
      }
    };
    output.push(this.deparse(typObj, context));

    if (node.subtype === 'C') {
      output.push('ADD');
      output.push(this.deparse(node.def, context));
    } else if (node.subtype === 'V') {
      output.push('VALIDATE');
      output.push('CONSTRAINT');
      output.push(this.quote(node.name));
    } else if (node.subtype === 'X') {
      output.push('DROP');
      output.push('CONSTRAINT');
      output.push(this.quote(node.name));
    }

    if (node.behavior === 'DROP_CASCADE') {
      output.push('CASCADE');
    }
    return output.join(' ');
  }

  CreateExtensionStmt(node: CreateExtensionStmt) {
    const output = [];
    output.push('CREATE EXTENSION');
    if (node.if_not_exists) {
      output.push('IF NOT EXISTS');
    }
    output.push(this.quote(node.extname));
    if (node.options) {
      node.options.forEach((opt) => {
        if (
          opt.DefElem.defname === 'cascade' &&
          opt.DefElem.arg.Integer.ival === 1
        ) {
          output.push('CASCADE');
        }
        if (opt.DefElem.defname === 'schema') {
          output.push('WITH SCHEMA');
          output.push(this.quote(this.deparse(opt.DefElem.arg)));
        }
      });
    }
    return output.join(' ');
  }

  DropStmt(node: DropStmt, context = {}) {
    const output = [];
    output.push('DROP');
    output.push(objtypeName(node.removeType));
    if (node.missing_ok) {
      output.push('IF EXISTS');
    }

    const stmts = [];
    const objects = unwrapList(node.objects);
    for (let s = 0; s < objects.length; s++) {
      const children = unwrapList(objects[s]);

      const stmt = [];
      if (
        node.removeType === 'OBJECT_TABLE' ||
        node.removeType === 'OBJECT_CONVERSION' ||
        node.removeType === 'OBJECT_COLLATION' ||
        node.removeType === 'OBJECT_MATVIEW' ||
        node.removeType === 'OBJECT_INDEX' ||
        node.removeType === 'OBJECT_FOREIGN_TABLE'
      ) {
        if (children.length === 1) {
          stmt.push(this.quote(this.deparse(children[0])));
        } else if (children.length === 2) {
          stmt.push(this.listQuotes(children, '.'));
        } else {
          throw new Error(
            'bad case 2 drop stmt' + JSON.stringify(node, null, 2)
          );
        }
      } else if (node.removeType === 'OBJECT_SCHEMA') {
        stmt.push(this.quote(this.deparse(children)));
      } else if (node.removeType === 'OBJECT_SEQUENCE') {
        stmt.push(this.listQuotes(children, '.'));
      } else if (node.removeType === 'OBJECT_POLICY') {
        if (children.length === 2) {
          stmt.push(this.quote(this.deparse(children[1], context)));
          stmt.push('ON');
          stmt.push(this.quote(this.deparse(children[0], context)));
        } else if (children.length === 3) {
          stmt.push(this.quote(this.deparse(children[2], context)));
          stmt.push('ON');
          stmt.push(this.listQuotes([children[0], children[1]], '.'));
        } else {
          throw new Error(
            'bad drop policy stmt: ' + JSON.stringify(node, null, 2)
          );
        }
      } else if (node.removeType === 'OBJECT_TRIGGER') {
        if (children.length === 2) {
          stmt.push(this.quote(this.deparse(children[1], context)));
          stmt.push('ON');
          stmt.push(this.quote(this.deparse(children[0], context)));
        } else if (children.length === 3) {
          stmt.push(this.quote(this.deparse(children[2], context)));
          stmt.push('ON');
          stmt.push(this.listQuotes([children[0], children[1]], '.'));
        } else {
          throw new Error(
            'bad drop trigger stmt: ' + JSON.stringify(node, null, 2)
          );
        }
      } else if (node.removeType === 'OBJECT_RULE') {
        if (children.length === 2) {
          stmt.push(this.quote(this.deparse(children[1], context)));
          stmt.push('ON');
          stmt.push(this.quote(this.deparse(children[0], context)));
        } else if (children.length === 3) {
          stmt.push(this.quote(this.deparse(children[2], context)));
          stmt.push('ON');
          stmt.push(this.listQuotes([children[0], children[1]], '.'));
        } else {
          throw new Error(
            'bad drop rule stmt: ' + JSON.stringify(node, null, 2)
          );
        }
      } else if (node.removeType === 'OBJECT_VIEW') {
        if (children.length === 1) {
          stmt.push(this.quote(this.deparse(children[0], context)));
        } else if (children.length === 2) {
          stmt.push(this.listQuotes(children, '.'));
        } else {
          throw new Error(
            'bad drop value stmt: ' + JSON.stringify(node, null, 2)
          );
        }
        // } else if (node.removeType === 'OBJECT_OPERATOR') {
      } else if (node.removeType === 'OBJECT_CAST') {
        stmt.push('(');
        stmt.push(this.deparse(children[0], context));
        stmt.push('AS');
        stmt.push(this.deparse(children[1], context));
        stmt.push(')');
        // } else if (node.removeType === 'OBJECT_OPERATOR') {
        //   stmt.push(this.deparse(children, 'noquotes')); // in this case children is not an array
      } else if (node.removeType === 'OBJECT_AGGREGATE') {
        stmt.push(this.deparse(children, context)); // in this case children is not an array
      } else if (node.removeType === 'OBJECT_FDW') {
        stmt.push(this.deparse(children, context)); // in this case children is not an array
      } else if (node.removeType === 'OBJECT_FOREIGN_SERVER') {
        stmt.push(this.deparse(children, context)); // in this case children is not an array
      } else if (node.removeType === 'OBJECT_EXTENSION') {
        stmt.push(this.deparse(children, context)); // in this case children is not an array
      } else if (node.removeType === 'OBJECT_DOMAIN') {
        stmt.push(this.deparse(children, context)); // in this case children is not an array
      } else if (node.removeType === 'OBJECT_FUNCTION') {
        stmt.push(this.deparse(children, context)); // in this case children is not an array
      } else if (node.removeType === 'OBJECT_TYPE') {
        stmt.push(this.deparse(children, context)); // in this case children is not an array
      } else {
        throw new Error('bad drop stmt: ' + JSON.stringify(node, null, 2));
      }
      stmts.push(stmt.join(' '));
    }
    output.push(stmts.join(','));

    if (node.behavior === 'DROP_CASCADE') {
      output.push('CASCADE');
    }
    return output.join(' ');
  }

  CreatePolicyStmt(node: CreatePolicyStmt, context = {}) {
    const output = [];
    output.push('CREATE POLICY');

    output.push(this.quote(node.policy_name));

    if (node.table) {
      output.push('ON');
      output.push(this.RangeVar(node.table, context));
    }

    if (node.permissive) {
      // permissive is the default!
    } else {
      output.push('AS');
      output.push('RESTRICTIVE');
    }

    if (node.cmd_name) {
      output.push('FOR');
      output.push(node.cmd_name.toUpperCase());
    }
    output.push('TO');
    output.push(this.list(node.roles));

    if (node.qual) {
      output.push('USING');
      output.push('(');
      output.push(this.deparse(node.qual, context));
      output.push(')');
    }

    if (node.with_check) {
      output.push('WITH CHECK');
      output.push('(');
      output.push(this.deparse(node.with_check, context));
      output.push(')');
    }

    return output.join(' ');
  }

  AlterPolicyStmt(node, context = {}) {
    const output = [];
    output.push('ALTER POLICY');

    output.push(this.quote(node.policy_name));

    if (node.table) {
      output.push('ON');
      output.push(this.RangeVar(node.table, context));
    }

    output.push('TO');
    output.push(this.list(node.roles));

    if (node.qual) {
      output.push('USING');
      output.push('(');
      output.push(this.deparse(node.qual, context));
      output.push(')');
    }

    if (node.with_check) {
      output.push('WITH CHECK');
      output.push('(');
      output.push(this.deparse(node.with_check, context));
      output.push(')');
    }

    return output.join(' ');
  }

  ViewStmt(node: ViewStmt, context = {}) {
    const output = [];
    output.push('CREATE');
    if (node.replace) output.push('OR REPLACE');
    if (node.view.relpersistence === 't') {
      output.push('TEMPORARY');
    }
    output.push('VIEW');
    output.push(this.RangeVar(node.view, 'view'));
    if (node.aliases) {
      output.push('(');
      output.push(this.list(node.aliases, ', ', '', context));
      output.push(')');
    }
    output.push('AS');
    output.push(this.deparse(node.query, context));
    if (node.withCheckOption === 'LOCAL_CHECK_OPTION') {
      output.push('WITH LOCAL CHECK OPTION');
    } else if (node.withCheckOption === 'CASCADED_CHECK_OPTION') {
      output.push('WITH CASCADED CHECK OPTION');
    }
    return output.join(' ');
  }

  CreateSeqStmt(node: CreateSeqStmt, context = {}) {
    const output = [];
    output.push('CREATE SEQUENCE');
    output.push(this.RangeVar(node.sequence, context));
    const options = unwrapList(node.options);
    if (options && options.length) {
      options.forEach((opt) => {
        output.push(this.deparse(opt, 'sequence'));
      });
    }
    return output.join(' ');
  }

  AlterSeqStmt(node: AlterSeqStmt, context = {}) {
    const output = [];
    output.push('ALTER SEQUENCE');
    output.push(this.RangeVar(node.sequence, context));
    const options = unwrapList(node.options);
    if (options && options.length) {
      options.forEach((opt) => {
        output.push(this.deparse(opt, 'sequence'));
      });
    }
    return output.join(' ');
  }

  CreateTableAsStmt(node: CreateTableAsStmt, context = {}) {
    const output = ['CREATE'];
    const relpersistence = dotty.get(node, 'into.rel.relpersistence');
    if (node.relkind === 'OBJECT_MATVIEW') {
      output.push('MATERIALIZED VIEW');
    } else if (relpersistence !== 't') {
      output.push('TABLE');
      if (node.if_not_exists) {
        output.push('IF NOT EXISTS');
      }
    }

    output.push(this.IntoClause(node.into, context));
    output.push('AS');
    output.push(this.deparse(node.query, context));
    return output.join(' ');
  }

  CreateTrigStmt(node: CreateTrigStmt, context = {}) {
    const output = [];

    output.push('CREATE');
    if (node.isconstraint) {
      output.push('CONSTRAINT');
    }
    output.push('TRIGGER');
    output.push(this.quote(node.trigname));
    output.push(NEWLINE_CHAR);

    // int16 timing;  BEFORE, AFTER, or INSTEAD

    if (node.timing === 64) {
      output.push('INSTEAD OF');
    } else if (node.timing === 2) {
      output.push('BEFORE');
    } else {
      output.push('AFTER');
    }

    // int16 events;  "OR" of INSERT/UPDATE/DELETE/TRUNCATE

    //  4 = 0b000100 (insert)
    //  8 = 0b001000 (delete)
    // 16 = 0b010000 (update)
    // 32 = 0b100000 (TRUNCATE)

    const TRIGGER_EVENTS = {
      INSERT: 4,
      DELETE: 8,
      UPDATE: 16,
      TRUNCATE: 32
    };

    const events = [];
    if ((TRIGGER_EVENTS.INSERT & node.events) === TRIGGER_EVENTS.INSERT) {
      events.push('INSERT');
    }
    if ((TRIGGER_EVENTS.UPDATE & node.events) === TRIGGER_EVENTS.UPDATE) {
      events.push('UPDATE');
    }
    if ((TRIGGER_EVENTS.DELETE & node.events) === TRIGGER_EVENTS.DELETE) {
      events.push('DELETE');
    }
    if ((TRIGGER_EVENTS.TRUNCATE & node.events) === TRIGGER_EVENTS.TRUNCATE) {
      events.push('TRUNCATE');
    }

    // events
    output.push(events.join(' OR '));

    // columns
    if (node.columns) {
      output.push('OF');
      output.push(this.list(node.columns, ', ', '', context));
    }

    // ON
    output.push('ON');
    output.push(this.RangeVar(node.relation, context));
    output.push(NEWLINE_CHAR);

    if (node.transitionRels) {
      output.push('REFERENCING');
      node.transitionRels.forEach(({ TriggerTransition }) => {
        if (
          TriggerTransition.isNew === true &&
          TriggerTransition.isTable === true
        ) {
          output.push(`NEW TABLE AS ${TriggerTransition.name}`);
        } else if (
          TriggerTransition.isNew !== true &&
          TriggerTransition.isTable === true
        ) {
          output.push(`OLD TABLE AS ${TriggerTransition.name}`);
        }
      });
    }

    // opts
    if (node.deferrable || node.initdeferred) {
      if (node.deferrable) {
        output.push('DEFERRABLE');
      }
      if (node.deferrable) {
        output.push('INITIALLY DEFERRED');
      }
      output.push(NEWLINE_CHAR);
    }

    if (node.row) {
      output.push(`FOR EACH ROW${NEWLINE_CHAR}`);
    } else {
      output.push(`FOR EACH STATEMENT${NEWLINE_CHAR}`);
    }

    if (node.whenClause) {
      output.push('WHEN');
      output.push('(');
      output.push(this.deparse(node.whenClause, 'trigger'));
      output.push(')');
      output.push(NEWLINE_CHAR);
    }

    output.push('EXECUTE PROCEDURE');
    output.push(this.listQuotes(node.funcname).split(',').join('.'));
    output.push('(');
    let args = [];
    if (node.args) {
      args = unwrapList(node.args);
    }
    // seems that it's only parsing strings?
    args = args
      .map((arg) => {
        if (arg.String !== undefined && arg.String.str !== undefined) {
          return `'${arg.String.str}'`;
        }
        return this.deparse(arg, context);
      })
      .filter((a) => a);
    output.push(args.join(','));
    output.push(')');

    return output.join(' ');
  }

  CreateDomainStmt(node: CreateDomainStmt, context = {}) {
    const output = [];
    output.push('CREATE DOMAIN');
    output.push(this.list(node.domainname, '.', '', context));
    output.push('AS');
    output.push(this.TypeName(node.typeName, context));
    if (node.constraints) {
      output.push(this.list(node.constraints, ', ', '', context));
    }
    return output.join(' ');
  }

  CreateStmt(node: CreateStmt, context = {}) {
    const output = [];
    const relpersistence = dotty.get(node, 'relation.relpersistence');
    if (relpersistence === 't') {
      output.push('CREATE');
    } else {
      output.push('CREATE TABLE');
      if (node.if_not_exists) {
        output.push('IF NOT EXISTS');
      }
    }

    output.push(this.RangeVar(node.relation, context));
    output.push(`(${NEWLINE_CHAR}`);
    output.push(
      this.list(node.tableElts, `,${NEWLINE_CHAR}`, TAB_CHAR, context)
    );
    output.push(`${NEWLINE_CHAR})`);

    if (node.hasOwnProperty('inhRelations')) {
      output.push('INHERITS');
      output.push('(');
      output.push(this.list(node.inhRelations, ', ', '', context));
      output.push(')');
    }

    if (node.options) {
      // TODO was this deprecated?
      node.options.forEach((opt) => {
        if (dotty.get(opt, 'DefElem.defname') === 'oids') {
          if (Number(dotty.get(opt, 'DefElem.arg.Integer.ival')) === 1) {
            output.push('WITH OIDS');
          } else {
            output.push('WITHOUT OIDS');
          }
        }
      });
    }
    return output.join(' ');
  }

  ConstraintStmt(node) {
    const output = [];
    const constraint = getConstraintFromConstrType(node.contype);

    if (node.conname) {
      output.push('CONSTRAINT');
      output.push(node.conname);
      if (!node.pktable) {
        output.push(constraint);
      }
    } else if (node.contype === 'CONSTR_IDENTITY') {
      // IDENTITY
      output.push('GENERATED');
      if (node.generated_when == 'a') {
        output.push('ALWAYS AS');
      } else {
        output.push('BY DEFAULT AS');
      }
      output.push('IDENTITY');
      const options = unwrapList(node.options);
      if (options && options.length) {
        output.push('(');
        output.push(this.list(options, ' ', '', 'generated'));
        output.push(')');
      }
    } else if (node.contype === 'CONSTR_GENERATED') {
      output.push('GENERATED');
      if (node.generated_when == 'a') {
        output.push('ALWAYS AS');
      }
    } else {
      output.push(constraint);
    }
    return output.join(' ');
  }

  ReferenceConstraint(node, context = {}) {
    const output = [];
    if (node.pk_attrs && node.fk_attrs) {
      if (node.conname) {
        output.push('CONSTRAINT');
        output.push(node.conname);
      }
      output.push('FOREIGN KEY');
      output.push('(');
      output.push(this.listQuotes(node.fk_attrs));
      output.push(')');
      output.push('REFERENCES');
      output.push(this.RangeVar(node.pktable, context));
      output.push('(');
      output.push(this.listQuotes(node.pk_attrs));
      output.push(')');
    } else if (node.pk_attrs) {
      output.push(this.ConstraintStmt(node, context));
      output.push(this.RangeVar(node.pktable, context));
      output.push('(');
      output.push(this.listQuotes(node.pk_attrs));
      output.push(')');
    } else if (node.fk_attrs) {
      if (node.conname) {
        output.push('CONSTRAINT');
        output.push(node.conname);
      }
      output.push('FOREIGN KEY');
      output.push('(');
      output.push(this.listQuotes(node.fk_attrs));
      output.push(')');
      output.push('REFERENCES');
      output.push(this.RangeVar(node.pktable, context));
    } else {
      output.push(this.ConstraintStmt(node, context));
      output.push(this.RangeVar(node.pktable, context));
    }
    return output.join(' ');
  }

  ExclusionConstraint(node, context = {}) {
    const output = [];
    function getExclusionGroup(nde) {
      const exclusions = unwrapList(nde.exclusions);
      const a = exclusions.map((excl) => {
        const firstExcl = unwrapList(excl)[0];
        if (firstExcl.IndexElem.name) {
          return firstExcl.IndexElem.name;
        }
        return firstExcl.IndexElem.expr
          ? this.deparse(firstExcl.IndexElem.expr, context)
          : null;
      });

      const b = exclusions.map((excl) =>
        this.deparse(unwrapList(unwrapList(excl)[1])[0], context)
      );

      const stmts = a.map((_v, i) => `${a[i]} WITH ${b[i]}`);
      return stmts.join(', ');
    }

    if (node.exclusions && node.access_method) {
      output.push('USING');
      output.push(node.access_method);
      output.push('(');
      output.push(getExclusionGroup.call(this, node));
      output.push(')');
    }

    return output.join(' ');
  }

  Constraint(node: Constraint, context = {}) {
    const output = [];

    if (node.contype === 'CONSTR_FOREIGN') {
      output.push(this.ReferenceConstraint(node, context));
    } else {
      output.push(this.ConstraintStmt(node, context));
    }

    if (node.keys) {
      output.push('(');
      output.push(this.listQuotes(node.keys));
      output.push(')');
    }

    if (node.raw_expr) {
      output.push('(');
      output.push(this.deparse(node.raw_expr, context));
      output.push(')');
      if (node.contype == 'CONSTR_GENERATED') {
        output.push('STORED');
      }
    }

    if (node.fk_del_action) {
      switch (node.fk_del_action) {
        case 'r':
          output.push('ON DELETE RESTRICT');
          break;
        case 'c':
          output.push('ON DELETE CASCADE');
          break;
        case 'n':
          output.push('ON DELETE SET NULL');
          break;
        case 'd':
          output.push('ON DELETE SET DEFAULT');
          break;
        case 'a':
          // output.push('ON DELETE NO ACTION');
          break;
        default:
      }
    }

    if (node.fk_upd_action) {
      switch (node.fk_upd_action) {
        case 'r':
          output.push('ON UPDATE RESTRICT');
          break;
        case 'c':
          output.push('ON UPDATE CASCADE');
          break;
        case 'n':
          output.push('ON UPDATE SET NULL');
          break;
        case 'd':
          output.push('ON UPDATE SET DEFAULT');
          break;
        case 'a':
          // output.push('ON UPDATE NO ACTION');
          break;
        default:
      }
    }

    if (node.fk_matchtype === 'f') {
      output.push('MATCH FULL');
    }

    if (node.is_no_inherit === true) {
      output.push('NO INHERIT');
    }

    if (node.skip_validation === true) {
      output.push('NOT VALID');
    }

    if (node.contype === 'CONSTR_EXCLUSION') {
      output.push(this.ExclusionConstraint(node, context));
    }

    if (node.deferrable) {
      output.push('deferrable');
    }

    return output.join(' ');
  }

  AccessPriv(node: AccessPriv) {
    const output = [];
    if (node.priv_name) {
      output.push(node.priv_name.toUpperCase());
    } else {
      output.push('ALL');
    }
    if (node.cols) {
      output.push('(');
      output.push(this.listQuotes(node.cols));
      output.push(')');
    }
    return output.join(' ');
  }

  VariableSetStmt(node: VariableSetStmt) {
    switch (node.kind) {
      case 'VAR_SET_VALUE':
        return format(
          'SET %s%s = %s',
          node.is_local ? 'LOCAL ' : '',
          node.name,
          this.deparseNodes(node.args, 'simple').join(', ')
        );
      case 'VAR_SET_DEFAULT':
        return format('SET %s TO DEFAULT', node.name);
      case 'VAR_SET_CURRENT':
        return format('SET %s FROM CURRENT', node.name);
      case 'VAR_SET_MULTI': {
        const name = {
          TRANSACTION: 'TRANSACTION',
          'SESSION CHARACTERISTICS': 'SESSION CHARACTERISTICS AS TRANSACTION'
        }[node.name];

        return format(
          'SET %s %s',
          name,
          this.deparseNodes(node.args, 'simple').join(', ')
        );
      }
      case 'VAR_RESET':
        return format('RESET %s', node.name);
      case 'VAR_RESET_ALL':
        return 'RESET ALL';
      default:
        return fail('VariableSetKind', node);
    }
  }

  VariableShowStmt(node: VariableShowStmt) {
    return format('SHOW %s', node.name);
  }

  FuncWithArgs(node, context = {}) {
    const output = [];
    output.push(this.deparse(unwrapList(node.funcname)[0], context));
    output.push('(');
    output.push(this.list(node.funcargs, ', ', '', context));
    output.push(')');
    return output.join(' ');
  }

  FunctionParameter(node: FunctionParameter, context = {}) {
    const output = [];

    if (node.mode === 'FUNC_PARAM_VARIADIC') {
      output.push('VARIADIC');
    }

    if (node.mode === 'FUNC_PARAM_OUT') {
      output.push('OUT');
    }

    if (node.mode === 'FUNC_PARAM_INOUT') {
      output.push('INOUT');
    }

    output.push(node.name);
    output.push(this.TypeName(node.argType, context));

    if (node.defexpr) {
      output.push('DEFAULT');
      output.push(this.deparse(node.defexpr, context));
    }

    return output.join(' ');
  }

  CreateFunctionStmt(node: CreateFunctionStmt, context = {}) {
    const output = [];

    output.push('CREATE');
    if (node.replace) {
      output.push('OR REPLACE');
    }
    output.push('FUNCTION');

    output.push(
      unwrapList(node.funcname)
        .map((name) => this.deparse(name, context))
        .join('.')
    );
    output.push('(');
    let parameters = [];
    if (node.parameters) {
      parameters = unwrapList(node.parameters);
    }
    const parametersList = parameters.filter(
      ({ FunctionParameter }) =>
        FunctionParameter.mode === 'FUNC_PARAM_VARIADIC' ||
        FunctionParameter.mode === 'FUNC_PARAM_OUT' ||
        FunctionParameter.mode === 'FUNC_PARAM_INOUT' ||
        FunctionParameter.mode === 'FUNC_PARAM_IN'
    );
    output.push(this.list(parametersList));
    output.push(')');

    const returns = parameters.filter(
      ({ FunctionParameter }) => FunctionParameter.mode === 'FUNC_PARAM_TABLE'
    );

    if (returns.length > 0) {
      output.push('RETURNS');
      output.push('TABLE');
      output.push('(');
      output.push(this.list(returns, ', ', '', context));
      output.push(')');
    } else if (node.returnType) {
      output.push('RETURNS');
      output.push(this.TypeName(node.returnType, context));
    }

    node.options.forEach((option, i) => {
      if (option && option.DefElem) {
        let value = '';
        switch (option.DefElem.defname) {
          case 'as':
            value = this.deparse(unwrapList(option.DefElem.arg)[0], context);
            output.push(`AS $EOFCODE$${value}$EOFCODE$`);
            break;

          case 'language':
            value = this.deparse(option.DefElem.arg, context);
            output.push('LANGUAGE');
            output.push(value);
            break;

          case 'security':
            output.push('SECURITY');
            value = Number(option.DefElem.arg.Integer.ival);
            if (value > 0) {
              output.push('DEFINER');
            } else {
              output.push('INVOKER');
            }
            break;

          case 'leakproof':
            value = Number(option.DefElem.arg.Integer.ival);
            if (value > 0) {
              output.push('LEAKPROOF');
            }
            break;

          case 'window':
            value = Number(option.DefElem.arg.Integer.ival);
            if (value > 0) {
              output.push('WINDOW');
            }
            break;

          case 'strict':
            value = Number(option.DefElem.arg.Integer.ival);
            if (value > 0) {
              output.push('STRICT');
            } else {
              output.push('CALLED ON NULL INPUT');
            }
            break;

          case 'set':
            output.push(this.deparse(option, context));
            break;

          case 'volatility':
            value = this.deparse(option.DefElem.arg, context);
            output.push(value.toUpperCase());
            break;

          default:
        }
      }
    });
    return output.join(' ');
  }
  CreateSchemaStmt(node: CreateSchemaStmt) {
    const output = [];

    output.push('CREATE');
    if (node.replace) {
      output.push('OR REPLACE');
    }

    output.push('SCHEMA');

    if (node.if_not_exists) {
      output.push('IF NOT EXISTS');
    }

    output.push(node.schemaname);
    return output.join(' ');
  }

  RoleSpec(node: RoleSpec) {
    switch (node.roletype) {
      case 'ROLESPEC_CSTRING':
        return this.quote(node.rolename);
      case 'ROLESPEC_CURRENT_USER':
        return 'CURRENT_USER';
      case 'ROLESPEC_SESSION_USER':
        return 'SESSION_USER';
      case 'ROLESPEC_PUBLIC':
        return 'PUBLIC';
      default:
        return fail('RoleSpec', node);
    }
  }

  GrantStmt(node: GrantStmt) {
    const output = [];

    const getTypeFromNode = (nodeObj) => {
      switch (nodeObj.objtype) {
        case 'OBJECT_TABLE':
          if (nodeObj.targtype === 'ACL_TARGET_ALL_IN_SCHEMA') {
            return 'ALL TABLES IN SCHEMA';
          }
          if (nodeObj.targtype === 'ACL_TARGET_DEFAULTS') {
            return 'TABLES';
          }
          // todo could be view
          return 'TABLE';
        case 'OBJECT_SEQUENCE':
          if (nodeObj.targtype === 'ACL_TARGET_ALL_IN_SCHEMA') {
            return 'ALL SEQUENCES IN SCHEMA';
          }
          if (nodeObj.targtype === 'ACL_TARGET_DEFAULTS') {
            return 'SEQUENCES';
          }
          return 'SEQUENCE';
        case 'OBJECT_DATABASE':
          return 'DATABASE';
        case 'OBJECT_DOMAIN':
          return 'DOMAIN';
        case 'OBJECT_FDW':
          return 'FOREIGN DATA WRAPPER';
        case 'OBJECT_FOREIGN_SERVER':
          return 'FOREIGN SERVER';
        case 'OBJECT_FUNCTION':
          if (nodeObj.targtype === 'ACL_TARGET_ALL_IN_SCHEMA') {
            return 'ALL FUNCTIONS IN SCHEMA';
          }
          if (nodeObj.targtype === 'ACL_TARGET_DEFAULTS') {
            return 'FUNCTIONS';
          }
          return 'FUNCTION';
        case 'OBJECT_LANGUAGE':
          return 'LANGUAGE';
        case 'OBJECT_LARGEOBJECT':
          return 'LARGE OBJECT';
        case 'OBJECT_SCHEMA':
          return 'SCHEMA';
        case 'OBJECT_TABLESPACE':
          return 'TABLESPACE';
        case 'OBJECT_TYPE':
          return 'TYPE';
        default:
      }
      return fail('GrantStmt', node);
    };

    if (node.objtype !== 'OBJECT_COLUMN') {
      if (!node.is_grant) {
        output.push('REVOKE');
        if (node.grant_option) {
          output.push('GRANT OPTION');
          output.push('FOR');
        }
        if (node.privileges) {
          output.push(this.list(node.privileges));
        } else {
          output.push('ALL');
        }
        output.push('ON');
        output.push(getTypeFromNode(node));
        output.push(this.list(node.objects));
        output.push('FROM');
        output.push(this.list(node.grantees));
      } else {
        output.push('GRANT');
        if (node.privileges) {
          output.push(this.list(node.privileges));
        } else {
          output.push('ALL');
        }
        output.push('ON');
        output.push(getTypeFromNode(node));
        output.push(this.list(node.objects));
        output.push('TO');
        output.push(this.list(node.grantees));
        if (node.grant_option) {
          output.push('WITH GRANT OPTION');
        }
      }
      if (node.behavior === 'DROP_CASCADE') {
        output.push('CASCADE');
      }
    }

    return output.join(' ');
  }

  GrantRoleStmt(node: GrantRoleStmt, context = {}) {
    const output = [];

    if (!node.is_grant) {
      output.push('REVOKE');
      output.push(this.list(node.granted_roles, ', ', '', context));
      output.push('FROM');
      output.push(this.list(node.grantee_roles, ', ', '', context));
    } else {
      output.push('GRANT');
      output.push(this.list(node.granted_roles, ', ', '', context));
      output.push('TO');
      output.push(this.list(node.grantee_roles, ', ', '', context));
    }
    if (node.admin_opt) {
      output.push('WITH ADMIN OPTION');
    }

    return output.join(' ');
  }

  CreateRoleStmt(node: CreateRoleStmt, context = {}) {
    const output = [];

    const roleOption = (nodeObj, i, val1, val2) => {
      const val = Number(
        dotty.get(unwrapList(nodeObj.options), `${i}.DefElem.arg.Integer.ival`)
      );
      if (val > 0) {
        output.push(val1);
      } else {
        output.push(val2);
      }
    };

    output.push('CREATE');
    switch (node.stmt_type) {
      case 'ROLESTMT_USER':
        output.push('USER');
        break;
      case 'ROLESTMT_GROUP':
        output.push('GROUP');
        break;
      default:
        output.push('ROLE');
    }

    output.push(`"${node.role}"`);

    if (node.options) {
      const options = unwrapList(node.options);
      const opts = dotty.search(options, '*.DefElem.defname');

      if (opts.length === 1 && opts[0] === 'addroleto') {
        // only one case
      } else {
        output.push('WITH');
      }

      opts.forEach((option, i) => {
        let value = '';
        switch (option) {
          case 'canlogin':
            roleOption(node, i, 'LOGIN', 'NOLOGIN');
            break;
          case 'addroleto':
            output.push('IN ROLE');
            output.push(
              dotty
                .search(
                  flatten(
                    dotty.search(options, `${i}.DefElem.arg`).map(unwrapList)
                  ),
                  '*.RoleSpec.rolename'
                )
                .join(',')
            );
            break;
          case 'password':
            output.push('PASSWORD');
            value = dotty.get(options, `${i}.DefElem.arg.String.str`);
            output.push(`'${value}'`);
            break;
          case 'adminmembers':
            output.push('ADMIN');
            output.push(this.list(options[i].DefElem.arg, ', ', '', context));
            break;
          case 'rolemembers':
            output.push('USER');
            output.push(this.list(options[i].DefElem.arg, ', ', '', context));
            break;
          case 'createdb':
            roleOption(node, i, 'CREATEDB', 'NOCREATEDB');
            break;
          case 'isreplication':
            roleOption(node, i, 'REPLICATION', 'NOREPLICATION');
            break;
          case 'bypassrls':
            roleOption(node, i, 'BYPASSRLS', 'NOBYPASSRLS');
            break;
          case 'inherit':
            roleOption(node, i, 'INHERIT', 'NOINHERIT');
            break;
          case 'superuser':
            roleOption(node, i, 'SUPERUSER', 'NOSUPERUSER');
            break;
          case 'createrole':
            roleOption(node, i, 'CREATEROLE', 'NOCREATEROLE');
            break;
          case 'validUntil':
            output.push('VALID UNTIL');
            value = dotty.get(options[i], `DefElem.arg.String.str`);
            output.push(`'${value}'`);
            break;
          default:
        }
      });
    }
    return output.join(' ');
  }

  TransactionStmt(node: TransactionStmt, context = {}) {
    const output = [];

    const begin = (nodeOpts) => {
      const options = unwrapList(nodeOpts.options);
      const opts = options ? dotty.search(options, '*.DefElem.defname') : [];
      if (opts.includes('transaction_read_only')) {
        const index = opts.indexOf('transaction_read_only');
        const obj = options[index];
        let set = false;
        const flag = Number(
          this.deparse(dotty.get(obj, 'DefElem.arg'), context)
        );
        if (flag > 0) {
          set = true;
        }
        if (set) {
          return 'BEGIN TRANSACTION READ ONLY';
        }
        return 'BEGIN TRANSACTION READ WRITE';
      }
      if (opts.includes('transaction_isolation')) {
        const index = opts.indexOf('transaction_isolation');
        const obj = options[index];
        const lopts = this.deparse(
          dotty.get(obj, 'DefElem.arg'),
          context
        ).replace(/['"]+/g, '');
        return `BEGIN TRANSACTION ISOLATION LEVEL ${lopts.toUpperCase()}`;
      }
      return 'BEGIN';
    };

    const start = (nodeOpts) => {
      const options = unwrapList(nodeOpts.options);
      const opts = options ? dotty.search(options, '*.DefElem.defname') : [];
      if (opts.includes('transaction_read_only')) {
        const index = opts.indexOf('transaction_read_only');
        const obj = options[index];
        let set = false;
        const flag = Number(
          this.deparse(dotty.get(obj, 'DefElem.arg'), context)
        );
        if (flag > 0) {
          set = true;
        }
        if (set) {
          return 'START TRANSACTION READ ONLY';
        }
        return 'START TRANSACTION READ WRITE';
      }

      return 'START TRANSACTION';
    };

    const nodeOptions = unwrapList(node.options);
    switch (node.kind) {
      case 'TRANS_STMT_BEGIN':
        return begin(node);
      case 'TRANS_STMT_START':
        return start(node);
      case 'TRANS_STMT_COMMIT':
        return 'COMMIT';
      case 'TRANS_STMT_ROLLBACK':
        return 'ROLLBACK';
      case 'TRANS_STMT_SAVEPOINT':
        output.push('SAVEPOINT');
        output.push(this.deparse(nodeOptions[0].DefElem.arg, context));
        break;
      case 'TRANS_STMT_RELEASE':
        output.push('RELEASE SAVEPOINT');
        output.push(this.deparse(nodeOptions[0].DefElem.arg, context));
        break;
      case 'TRANS_STMT_ROLLBACK_TO':
        output.push('ROLLBACK TO');
        output.push(this.deparse(nodeOptions[0].DefElem.arg, context));
        break;
      case 'TRANS_STMT_PREPARE':
        output.push('PREPARE TRANSACTION');
        output.push(`'${node.gid}'`);
        break;
      case 'TRANS_STMT_COMMIT_PREPARED':
        output.push('COMMIT PREPARED');
        output.push(`'${node.gid}'`);
        break;
      case 'TRANS_STMT_ROLLBACK_PREPARED':
        output.push('ROLLBACK PREPARED');
        output.push(`'${node.gid}'`);
        break;
      default:
    }
    return output.join(' ');
  }

  SortBy(node: SortBy, context = {}) {
    const output = [];

    output.push(this.deparse(node.node, context));

    switch (node.sortby_dir) {
      case 'SORTBY_ASC':
        output.push('ASC');
        break;
      case 'SORTBY_DESC':
        output.push('DESC');
        break;
      case 'SORTBY_USING':
        output.push(`USING ${this.deparseNodes(node.useOp, context)}`);
        break;
      case 'SORTBY_DEFAULT':
        break;
      default:
        return fail('SortBy', node);
    }

    if (node.sortby_nulls === 'SORTBY_NULLS_FIRST') {
      output.push('NULLS FIRST');
    }

    if (node.sortby_nulls === 'SORTBY_NULLS_LAST') {
      output.push('NULLS LAST');
    }

    return output.join(' ');
  }

  ObjectWithArgs(node: ObjectWithArgs, context = {}) {
    const output = [];

    if (context === 'noquotes') {
      output.push(this.list(node.objname, ', ', '', context));
    } else {
      output.push(this.listQuotes(node.objname, '.'));
    }
    const objargs = unwrapList(node.objargs);
    if (objargs && objargs.length) {
      output.push('(');
      output.push(
        objargs
          .map((arg) => {
            if (isEmptyObject(arg)) {
              return 'NONE';
            }
            return this.deparse(arg, context);
          })
          .join(',')
      );
      output.push(')');
    } else if (!node.args_unspecified) {
      output.push('()');
    }

    return output.join(' ');
  }

  String(node: TString) {
    return node.str;
  }

  SubLink(node: SubLink, context = {}) {
    switch (true) {
      case node.subLinkType === 'EXISTS_SUBLINK':
        return format('EXISTS (%s)', this.deparse(node.subselect, context));
      case node.subLinkType === 'ALL_SUBLINK':
        return format(
          '%s %s ALL (%s)',
          this.deparse(node.testexpr, context),
          this.deparse(node.operName[0], context),
          this.deparse(node.subselect, context)
        );
      case node.subLinkType === 'ANY_SUBLINK' && !(node.operName != null):
        return format(
          '%s IN (%s)',
          this.deparse(node.testexpr, context),
          this.deparse(node.subselect, context)
        );
      case node.subLinkType === 'ANY_SUBLINK':
        return format(
          '%s %s ANY (%s)',
          this.deparse(node.testexpr, context),
          this.deparse(node.operName[0], context),
          this.deparse(node.subselect, context)
        );
      case node.subLinkType === 'ROWCOMPARE_SUBLINK':
        return format(
          '%s %s (%s)',
          this.deparse(node.testexpr, context),
          this.deparse(node.operName[0], context),
          this.deparse(node.subselect, context)
        );
      case node.subLinkType === 'EXPR_SUBLINK':
        return format('(%s)', this.deparse(node.subselect, context));
      case node.subLinkType === 'MULTIEXPR_SUBLINK':
        // TODO(zhm) what is this?
        return fail('SubLink', node);
      // MULTIEXPR_SUBLINK
      // format('(%s)', @deparse(node.subselect))
      case node.subLinkType === 'ARRAY_SUBLINK':
        return format('ARRAY (%s)', this.deparse(node.subselect, context));
      default:
        return fail('SubLink', node);
    }
  }

  TypeCast(node: TypeCast, context = {}) {
    const type = this.TypeName(node.typeName, context);
    let arg = this.deparse(node.arg, context);

    if (node.arg !== undefined && node.arg.A_Expr !== undefined) {
      arg = format('(%s)', arg);
    }

    if (type === 'boolean') {
      const value = dotty.get(node, 'arg.A_Const.val.String.str');
      if (value === 'f') {
        return 'FALSE';
      }
      if (value === 't') {
        return 'TRUE';
      }
    }
    return format('%s::%s', arg, type);
  }

  TypeName(node: TypeName, context = {}) {
    const names = unwrapList(node.names);
    if (names[names.length - 1].String.str === 'interval') {
      return this.deparseInterval(node);
    }

    const output = [];

    if (node.setof) {
      output.push('SETOF');
    }

    let args = null;

    if (node.typmods != null) {
      args = unwrapList(node.typmods).map((item) => {
        return this.deparse(item, context);
      });
    }

    const type = [];

    type.push(this.type(names, args && args.join(', ')));

    if (node.arrayBounds != null) {
      type.push('[]');
    }

    output.push(type.join(''));

    return output.join(' ');
  }

  CaseWhen(node: CaseWhen, context = {}) {
    const output = ['WHEN'];

    output.push(this.deparse(node.expr, context));
    output.push('THEN');
    output.push(this.deparse(node.result, context));

    return output.join(' ');
  }

  WindowDef(node: WindowDef, context = {}) {
    const output = [];

    if (context !== 'window') {
      if (node.name) {
        output.push(node.name);
      }
    }

    const empty =
      !(node.partitionClause != null) && !(node.orderClause != null);

    const frameOptions = this.deparseFrameOptions(
      node.frameOptions,
      node.refname,
      node.startOffset,
      node.endOffset
    );

    if (
      empty &&
      context !== 'window' &&
      !(node.name != null) &&
      frameOptions.length === 0
    ) {
      return '()';
    }

    const windowParts = [];

    let useParens = false;

    if (node.partitionClause) {
      const partition = ['PARTITION BY'];

      const clause = unwrapList(node.partitionClause).map((item) =>
        this.deparse(item, context)
      );

      partition.push(clause.join(', '));

      windowParts.push(partition.join(' '));
      useParens = true;
    }

    if (node.orderClause) {
      windowParts.push('ORDER BY');

      const orders = unwrapList(node.orderClause).map((item) => {
        return this.deparse(item);
      });

      windowParts.push(orders.join(', '));

      useParens = true;
    }

    if (frameOptions.length) {
      useParens = true;
      windowParts.push(frameOptions);
    }

    if (useParens && context !== 'window') {
      return output.join(' ') + ' (' + windowParts.join(' ') + ')';
    }

    return output.join(' ') + windowParts.join(' ');
  }

  WithClause(node: WithClause, context = {}) {
    const output = ['WITH'];

    if (node.recursive) {
      output.push('RECURSIVE');
    }

    output.push(this.list(node.ctes, ', ', '', context));

    return output.join(' ');
  }

  CopyStmt(node: CopyStmt, context = {}) {
    const output = ['COPY'];

    output.push('(' + this.deparse(node.query, context) + ')');

    output.push('TO');
    output.push(`'${node.filename}'`);

    const options = unwrapList(node.options);
    if (options?.length > 0 && options[0].DefElem.defname === 'format') {
      output.push(`(FORMAT '${this.deparse(options[0].DefElem.arg)}')`);
    }

    return output.join(' ');
  }

  CallStmt(node: CallStmt, context = {}) {
    const output = ['CALL'];

    output.push(this.deparse(unwrapList(node.funccall.funcname)[0]));

    const funccallArgs = unwrapList(node.funccall.args);
    if (funccallArgs && funccallArgs.length) {
      // we have arguments
      output.push('(' + this.list(funccallArgs, ', ', '', context) + ')');
    } else {
      // just close parens
      output.push('()');
    }

    return output.join(' ');
  }

  deparseFrameOptions(options, refName, startOffset, endOffset) {
    // https://github.com/pganalyze/libpg_query/blob/442b1748d06364ecd3779bc558899176c02efaf0/src/postgres/include/nodes/parsenodes.h#L505-L522
    const FRAMEOPTION_NONDEFAULT = 0x00001; /* any specified? */
    const FRAMEOPTION_RANGE = 0x00002; /* RANGE behavior */
    const FRAMEOPTION_ROWS = 0x00004; /* ROWS behavior */
    const FRAMEOPTION_GROUPS = 0x00008; /* GROUPS behavior */
    const FRAMEOPTION_BETWEEN = 0x00010; /* BETWEEN given? */
    const FRAMEOPTION_START_UNBOUNDED_PRECEDING = 0x00020; /* start is U. P. */
    const FRAMEOPTION_END_UNBOUNDED_PRECEDING = 0x00040; /* (disallowed) */
    const FRAMEOPTION_START_UNBOUNDED_FOLLOWING = 0x00080; /* (disallowed) */
    const FRAMEOPTION_END_UNBOUNDED_FOLLOWING = 0x00100; /* end is U. F. */
    const FRAMEOPTION_START_CURRENT_ROW = 0x00200; /* start is C. R. */
    const FRAMEOPTION_END_CURRENT_ROW = 0x00400; /* end is C. R. */
    const FRAMEOPTION_START_OFFSET_PRECEDING = 0x00800; /* start is O. P. */
    const FRAMEOPTION_END_OFFSET_PRECEDING = 0x01000; /* end is O. P. */
    const FRAMEOPTION_START_OFFSET_FOLLOWING = 0x02000; /* start is O. F. */
    const FRAMEOPTION_END_OFFSET_FOLLOWING = 0x04000; /* end is O. F. */
    const FRAMEOPTION_EXCLUDE_CURRENT_ROW = 0x08000; /* omit C.R. */
    const FRAMEOPTION_EXCLUDE_GROUP = 0x10000; /* omit C.R. & peers */
    const FRAMEOPTION_EXCLUDE_TIES = 0x20000; /* omit C.R.'s peers */

    // const FRAMEOPTION_START_OFFSET =
    //   FRAMEOPTION_START_OFFSET_PRECEDING | FRAMEOPTION_START_OFFSET_FOLLOWING;
    // const FRAMEOPTION_END_OFFSET =
    //   FRAMEOPTION_END_OFFSET_PRECEDING | FRAMEOPTION_END_OFFSET_FOLLOWING;
    // const FRAMEOPTION_EXCLUSION =
    //   FRAMEOPTION_EXCLUDE_CURRENT_ROW |
    //   FRAMEOPTION_EXCLUDE_GROUP |
    //   FRAMEOPTION_EXCLUDE_TIES;

    // const FRAMEOPTION_DEFAULTS =
    //   FRAMEOPTION_RANGE |
    //   FRAMEOPTION_START_UNBOUNDED_PRECEDING |
    //   FRAMEOPTION_END_CURRENT_ROW;

    if (!(options & FRAMEOPTION_NONDEFAULT)) {
      return '';
    }

    const output = [];

    if (refName != null) {
      output.push(refName);
    }

    if (options & FRAMEOPTION_RANGE) {
      output.push('RANGE');
    }

    if (options & FRAMEOPTION_ROWS) {
      output.push('ROWS');
    }

    const between = options & FRAMEOPTION_BETWEEN;

    if (between) {
      output.push('BETWEEN');
    }

    if (options & FRAMEOPTION_START_UNBOUNDED_PRECEDING) {
      output.push('UNBOUNDED PRECEDING');
    }

    if (options & FRAMEOPTION_START_UNBOUNDED_FOLLOWING) {
      output.push('UNBOUNDED FOLLOWING');
    }

    if (options & FRAMEOPTION_START_CURRENT_ROW) {
      output.push('CURRENT ROW');
    }

    if (options & FRAMEOPTION_START_OFFSET_PRECEDING) {
      output.push(this.deparse(startOffset) + ' PRECEDING');
    }

    if (options & FRAMEOPTION_START_OFFSET_FOLLOWING) {
      output.push(this.deparse(startOffset) + ' FOLLOWING');
    }

    if (between) {
      output.push('AND');

      if (options & FRAMEOPTION_END_UNBOUNDED_PRECEDING) {
        output.push('UNBOUNDED PRECEDING');
      }

      if (options & FRAMEOPTION_END_UNBOUNDED_FOLLOWING) {
        output.push('UNBOUNDED FOLLOWING');
      }

      if (options & FRAMEOPTION_END_CURRENT_ROW) {
        output.push('CURRENT ROW');
      }

      if (options & FRAMEOPTION_END_OFFSET_PRECEDING) {
        output.push(this.deparse(endOffset) + ' PRECEDING');
      }

      if (options & FRAMEOPTION_END_OFFSET_FOLLOWING) {
        output.push(this.deparse(endOffset) + ' FOLLOWING');
      }
    }

    return output.join(' ');
  }

  deparseInterval(node: TypeName) {
    const type = ['interval'];

    if (node.arrayBounds != null) {
      type.push('[]');
    }

    if (node.typmods) {
      const nodeTypmods = unwrapList(node.typmods);
      const typmods = nodeTypmods.map((item) => this.deparse(item));

      let intervals = this.interval(typmods[0]);

      // SELECT interval(0) '1 day 01:23:45.6789'
      if (
        nodeTypmods[0] &&
        nodeTypmods[0].A_Const &&
        nodeTypmods[0].A_Const.val.Integer.ival === 32767 &&
        nodeTypmods[1] &&
        nodeTypmods[1].A_Const != null
      ) {
        intervals = [`(${nodeTypmods[1].A_Const.val.Integer.ival})`];
      } else {
        intervals = unwrapList(intervals).map((part) => {
          if (part === 'second' && typmods.length === 2) {
            return 'second(' + typmods[typmods.length - 1] + ')';
          }

          return part;
        });
      }

      type.push(intervals.join(' to '));
    }

    return type.join(' ');
  }

  interval(mask) {
    // ported from https://github.com/lfittl/pg_query/blob/master/lib/pg_query/deparse/interval.rb
    if (this.MASKS == null) {
      this.MASKS = {
        0: 'RESERV',
        1: 'MONTH',
        2: 'YEAR',
        3: 'DAY',
        4: 'JULIAN',
        5: 'TZ',
        6: 'DTZ',
        7: 'DYNTZ',
        8: 'IGNORE_DTF',
        9: 'AMPM',
        10: 'HOUR',
        11: 'MINUTE',
        12: 'SECOND',
        13: 'MILLISECOND',
        14: 'MICROSECOND',
        15: 'DOY',
        16: 'DOW',
        17: 'UNITS',
        18: 'ADBC',
        19: 'AGO',
        20: 'ABS_BEFORE',
        21: 'ABS_AFTER',
        22: 'ISODATE',
        23: 'ISOTIME',
        24: 'WEEK',
        25: 'DECADE',
        26: 'CENTURY',
        27: 'MILLENNIUM',
        28: 'DTZMOD'
      };
    }

    if (this.BITS == null) {
      this.BITS = inverted(this.MASKS);
    }

    if (this.INTERVALS == null) {
      this.INTERVALS = {};
      this.INTERVALS[1 << this.BITS.YEAR] = ['year'];
      this.INTERVALS[1 << this.BITS.MONTH] = ['month'];
      this.INTERVALS[1 << this.BITS.DAY] = ['day'];
      this.INTERVALS[1 << this.BITS.HOUR] = ['hour'];
      this.INTERVALS[1 << this.BITS.MINUTE] = ['minute'];
      this.INTERVALS[1 << this.BITS.SECOND] = ['second'];
      this.INTERVALS[(1 << this.BITS.YEAR) | (1 << this.BITS.MONTH)] = [
        'year',
        'month'
      ];
      this.INTERVALS[(1 << this.BITS.DAY) | (1 << this.BITS.HOUR)] = [
        'day',
        'hour'
      ];
      this.INTERVALS[
        (1 << this.BITS.DAY) | (1 << this.BITS.HOUR) | (1 << this.BITS.MINUTE)
      ] = ['day', 'minute'];
      this.INTERVALS[
        (1 << this.BITS.DAY) |
          (1 << this.BITS.HOUR) |
          (1 << this.BITS.MINUTE) |
          (1 << this.BITS.SECOND)
      ] = ['day', 'second'];
      this.INTERVALS[(1 << this.BITS.HOUR) | (1 << this.BITS.MINUTE)] = [
        'hour',
        'minute'
      ];
      this.INTERVALS[
        (1 << this.BITS.HOUR) |
          (1 << this.BITS.MINUTE) |
          (1 << this.BITS.SECOND)
      ] = ['hour', 'second'];
      this.INTERVALS[(1 << this.BITS.MINUTE) | (1 << this.BITS.SECOND)] = [
        'minute',
        'second'
      ];

      // utils/timestamp.h
      // #define INTERVAL_FULL_RANGE (0x7FFF)
      this.INTERVALS[(this.INTERVAL_FULL_RANGE = '32767')] = [];
    }

    return this.INTERVALS[mask.toString()];
  }
}
