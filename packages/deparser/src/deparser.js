import _ from 'lodash';
import { format } from 'util';
import {
  objtypeName,
  objtypeIs,
  getObjectType,
  getConstraintFromConstrType,
  ROLESPEC_TYPES,
  GRANTTARGET_TYPES,
  GRANTOBJECT_TYPES,
  CONSTRAINT_TYPES,
  VARIABLESET_TYPES,
  ROLESTMT_TYPES,
  TRANSACTIONSTMT_TYPES,
  SORTBYDIR_TYPES,
  SORTBYNULLS_TYPES
} from 'pgsql-enums';

const dotty = require('dotty');

const fail = (type, node) => {
  throw new Error(format('Unhandled %s node: %s', type, JSON.stringify(node)));
};

// select word from pg_get_keywords() where catcode = 'R';
const RESERVED_WORDS = [
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
];

const isReserved = (value) => RESERVED_WORDS.includes(value.toLowerCase());

// usually the AST lowercases all the things, so if we
// have both, the author most likely used double quotes
const needsQuotes = (value) =>
  value.match(/[a-z]+[\W\w]*[A-Z]+|[A-Z]+[\W\w]*[a-z]+/) ||
  value.match(/\W/) ||
  isReserved(value);

const { keys } = _;

const compact = (o) => {
  return _.filter(_.compact(o), (p) => {
    if (p == null) {
      return false;
    }

    return p.toString().length;
  });
};

const parens = (string) => {
  return '(' + string + ')';
};

const indent = (text, count = 1) => text;

export default class Deparser {
  static deparse(query) {
    return new Deparser(query).deparseQuery();
  }

  constructor(tree) {
    this.tree = tree;
  }

  deparseQuery() {
    return this.tree.map((node) => this.deparse(node)).join('\n\n');
  }

  deparseNodes(nodes, context) {
    return nodes.map((node) => {
      return _.isArray(node)
        ? this.list(node, ', ', '', context)
        : this.deparse(node, context);
    });
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
    return this.list(nodes, separator)
      .split(separator)
      .map((a) => this.quote(a.trim()))
      .join(separator);
  }

  quote(value) {
    if (value == null) {
      return null;
    }

    if (_.isArray(value)) {
      return value.map((o) => this.quote(o));
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
    const [catalog, type] = names.map((name) => this.deparse(name));

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

    if (_.isNumber(item)) {
      return item;
    }

    const type = keys(item)[0];
    const node = _.values(item)[0];

    if (this[type] == null) {
      throw new Error(type + ' is not implemented');
    }

    return this[type](node, context);
  }

  ['RawStmt'](node, context = {}) {
    if (node.stmt_len) {
      return this.deparse(node.stmt, context) + ';';
    }
    return this.deparse(node.stmt, context);
  }

  ['RuleStmt'](node, context = {}) {
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
      case 1:
        output.push('SELECT');
        break;
      case 2:
        output.push('UPDATE');
        break;
      case 3:
        output.push('INSERT');
        break;
      case 4:
        output.push('DELETE');
        break;
      default:
        throw new Error('event type not yet implemented for RuleStmt');
    }
    output.push('TO');
    output.push(this.deparse(node.relation, context));
    if (node.instead) {
      output.push('DO');
      output.push('INSTEAD');
    }
    if (node.whereClause) {
      output.push('WHERE');
      output.push(this.deparse(node.whereClause, context));
      output.push('DO');
    }
    if (!node.actions || !node.actions.length) {
      output.push('NOTHING');
    } else {
      // TODO how do multiple actions happen?
      output.push(this.deparse(node.actions[0], context));
    }
    return output.join(' ');
  }

  ['A_Expr'](node, context = {}) {
    const output = [];
    switch (node.kind) {
      case 0: {
        // AEXPR_OP

        let operator;

        if (node.lexpr) {
          // PARENS
          if (dotty.exists(node, 'lexpr.A_Expr')) {
            output.push(parens(this.deparse(node.lexpr, context)));
          } else {
            output.push(this.deparse(node.lexpr, context));
          }
        }

        if (node.name.length > 1) {
          const schema = this.deparse(node.name[0], context);
          operator = this.deparse(node.name[1], context);
          output.push(`OPERATOR(${schema}.${operator})`);
        } else {
          operator = this.deparse(node.name[0], context);
          output.push(operator);
        }

        if (node.rexpr) {
          // PARENS
          if (dotty.exists(node, 'rexpr.A_Expr')) {
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
      case 1:
        // AEXPR_OP_ANY
        /* scalar op ANY (array) */
        output.push(this.deparse(node.lexpr, context));
        output.push(format('ANY (%s)', this.deparse(node.rexpr, context)));
        return output.join(` ${this.deparse(node.name[0], context)} `);

      case 2:
        // AEXPR_OP_ALL
        /* scalar op ALL (array) */
        output.push(this.deparse(node.lexpr, context));
        output.push(format('ALL (%s)', this.deparse(node.rexpr, context)));
        return output.join(` ${this.deparse(node.name[0], context)} `);

      case 3:
        // AEXPR_DISTINCT
        /* IS DISTINCT FROM - name must be "=" */
        return format(
          '%s IS DISTINCT FROM %s',
          this.deparse(node.lexpr, context),
          this.deparse(node.rexpr, context)
        );

      case 4:
        // AEXPR_NOT_DISTINCT
        /* IS NOT DISTINCT FROM - name must be "=" */
        return format(
          '%s IS NOT DISTINCT FROM %s',
          this.deparse(node.lexpr, context),
          this.deparse(node.rexpr, context)
        );

      case 5:
        // AEXPR_NULLIF
        /* NULLIF - name must be "=" */
        return format(
          'NULLIF(%s, %s)',
          this.deparse(node.lexpr, context),
          this.deparse(node.rexpr, context)
        );

      case 6: {
        // AEXPR_OF
        /* IS [NOT] OF - name must be "=" or "<>" */
        const op = node.name[0].String.str === '=' ? 'IS OF' : 'IS NOT OF';
        return format(
          '%s %s (%s)',
          this.deparse(node.lexpr, context),
          op,
          this.list(node.rexpr, ', ', '', context)
        );
      }

      case 7: {
        // AEXPR_IN
        /* [NOT] IN - name must be "=" or "<>" */
        const operator = node.name[0].String.str === '=' ? 'IN' : 'NOT IN';

        return format(
          '%s %s (%s)',
          this.deparse(node.lexpr, context),
          operator,
          this.list(node.rexpr, ', ', '', context)
        );
      }

      case 8:
        // AEXPR_LIKE
        /* [NOT] LIKE - name must be "~~" or "!~~" */
        output.push(this.deparse(node.lexpr, context));

        if (node.name[0].String.str === '!~~') {
          output.push(
            format('NOT LIKE (%s)', this.deparse(node.rexpr, context))
          );
        } else {
          output.push(format('LIKE (%s)', this.deparse(node.rexpr, context)));
        }

        return output.join(' ');

      case 9:
        // AEXPR_ILIKE
        /* [NOT] ILIKE - name must be "~~*" or "!~~*" */
        output.push(this.deparse(node.lexpr, context));

        if (node.name[0].String.str === '!~~*') {
          output.push(
            format('NOT ILIKE (%s)', this.deparse(node.rexpr, context))
          );
        } else {
          output.push(format('ILIKE (%s)', this.deparse(node.rexpr, context)));
        }

        return output.join(' ');

      case 10:
        // AEXPR_SIMILAR
        // SIMILAR TO emits a similar_escape FuncCall node with the first argument
        output.push(this.deparse(node.lexpr, context));

        if (node.name[0].String.str === '!~') {
          if (this.deparse(node.rexpr.FuncCall.args[1].Null, context)) {
            output.push(
              format(
                'NOT SIMILAR TO %s',
                this.deparse(node.rexpr.FuncCall.args[0], context)
              )
            );
          } else {
            output.push(
              format(
                'NOT SIMILAR TO %s ESCAPE %s',
                this.deparse(node.rexpr.FuncCall.args[0], context),
                this.deparse(node.rexpr.FuncCall.args[1], context)
              )
            );
          }
        } else if (this.deparse(node.rexpr.FuncCall.args[1].Null, context)) {
          output.push(
            format(
              'SIMILAR TO %s',
              this.deparse(node.rexpr.FuncCall.args[0], context)
            )
          );
        } else {
          output.push(
            format(
              'SIMILAR TO %s ESCAPE %s',
              this.deparse(node.rexpr.FuncCall.args[0], context),
              this.deparse(node.rexpr.FuncCall.args[1], context)
            )
          );
        }

        return output.join(' ');

      case 11:
        // AEXPR_BETWEEN
        output.push(this.deparse(node.lexpr, context));
        output.push(
          format(
            'BETWEEN %s AND %s',
            this.deparse(node.rexpr[0], context),
            this.deparse(node.rexpr[1], context)
          )
        );
        return output.join(' ');

      case 12:
        // AEXPR_NOT_BETWEEN
        output.push(this.deparse(node.lexpr, context));
        output.push(
          format(
            'NOT BETWEEN %s AND %s',
            this.deparse(node.rexpr[0], context),
            this.deparse(node.rexpr[1], context)
          )
        );
        return output.join(' ');

      case 13:
        // AEXPR_BETWEEN_SYM
        output.push(this.deparse(node.lexpr, context));
        output.push(
          format(
            'BETWEEN SYMMETRIC %s AND %s',
            this.deparse(node.rexpr[0], context),
            this.deparse(node.rexpr[1], context)
          )
        );
        return output.join(' ');

      case 14:
        // AEXPR_NOT_BETWEEN_SYM
        output.push(this.deparse(node.lexpr, context));
        output.push(
          format(
            'NOT BETWEEN SYMMETRIC %s AND %s',
            this.deparse(node.rexpr[0], context),
            this.deparse(node.rexpr[1], context)
          )
        );
        return output.join(' ');

      // case 15:
      // AEXPR_PAREN

      default:
        return fail('A_Expr', node);
    }
  }

  ['Alias'](node, context = {}) {
    const name = node.aliasname;

    const output = ['AS'];

    if (node.colnames) {
      output.push(this.quote(name) + parens(this.listQuotes(node.colnames)));
    } else {
      output.push(this.quote(name));
    }

    return output.join(' ');
  }

  ['A_ArrayExpr'](node) {
    return format('ARRAY[%s]', this.list(node.elements));
  }

  ['A_Const'](node, context = {}) {
    if (node.val.String) {
      return this.escape(this.deparse(node.val, context));
    }

    return this.deparse(node.val, context);
  }

  ['A_Indices'](node, context = {}) {
    if (node.lidx) {
      return format(
        '[%s:%s]',
        this.deparse(node.lidx, context),
        this.deparse(node.uidx, context)
      );
    }

    return format('[%s]', this.deparse(node.uidx, context));
  }

  ['A_Indirection'](node, context = {}) {
    const output = [`(${this.deparse(node.arg, context)})`];

    // TODO(zhm) figure out the actual rules for when a '.' is needed
    //
    // select a.b[0] from a;
    // select (select row(1)).*
    // select c2[2].f2 from comptable
    // select c2.a[2].f2[1].f3[0].a1 from comptable

    for (let i = 0; i < node.indirection.length; i++) {
      const subnode = node.indirection[i];

      if (subnode.String || subnode.A_Star) {
        const value = subnode.A_Star ? '*' : this.quote(subnode.String.str);

        output.push(`.${value}`);
      } else {
        output.push(this.deparse(subnode, context));
      }
    }

    return output.join('');
  }

  ['A_Star'](node) {
    return '*';
  }

  ['BitString'](node) {
    const prefix = node.str[0];
    return `${prefix}'${node.str.substring(1)}'`;
  }

  ['BoolExpr'](node, context = {}) {
    let fmt_str = '%s';
    if (context.bool) {
      fmt_str = '(%s)';
    }
    const ctx = { ...context };
    ctx.bool = true;

    switch (node.boolop) {
      case 0:
        return format(fmt_str, this.list(node.args, ' AND ', '', ctx));
      case 1:
        return format(fmt_str, this.list(node.args, ' OR ', '', ctx));
      case 2:
        return format('NOT (%s)', this.deparse(node.args[0], context));
      default:
        return fail('BoolExpr', node);
    }
  }

  ['BooleanTest'](node, context = {}) {
    const output = [];

    output.push(this.deparse(node.arg, context));

    const tests = [
      'IS TRUE',
      'IS NOT TRUE',
      'IS FALSE',
      'IS NOT FALSE',
      'IS UNKNOWN',
      'IS NOT UNKNOWN'
    ];

    output.push(tests[node.booltesttype]);

    return output.join(' ');
  }

  ['CaseExpr'](node, context = {}) {
    const output = ['CASE'];

    if (node.arg) {
      output.push(this.deparse(node.arg, context));
    }

    for (let i = 0; i < node.args.length; i++) {
      output.push(this.deparse(node.args[i], context));
    }

    if (node.defresult) {
      output.push('ELSE');
      output.push(this.deparse(node.defresult, context));
    }

    output.push('END');

    return output.join(' ');
  }

  ['CoalesceExpr'](node, context = {}) {
    return format('COALESCE(%s)', this.list(node.args, ', ', '', context));
  }

  ['CollateClause'](node, context = {}) {
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

  ['CompositeTypeStmt'](node, context = {}) {
    const output = [];

    output.push('CREATE TYPE');
    output.push(this.deparse(node.typevar, context));
    output.push('AS');
    output.push('(');
    output.push(this.list(node.coldeflist, ',\n', '\t', context));
    output.push(')');

    return output.join(' ');
  }

  ['RenameStmt'](node, context = {}) {
    const output = [];

    if (
      getObjectType(node.renameType) === 'OBJECT_FUNCTION' ||
      getObjectType(node.renameType) === 'OBJECT_FOREIGN_TABLE' ||
      getObjectType(node.renameType) === 'OBJECT_FDW' ||
      getObjectType(node.renameType) === 'OBJECT_FOREIGN_SERVER'
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
    } else if (getObjectType(node.renameType) === 'OBJECT_ATTRIBUTE') {
      output.push('ALTER');
      output.push(objtypeName(node.relationType));
      if (node.missing_ok) {
        output.push('IF EXISTS');
      }
      output.push(this.deparse(node.relation, context));
      output.push('RENAME');
      output.push(objtypeName(node.renameType));
      output.push(this.quote(node.subname));
      output.push('TO');
      output.push(this.quote(node.newname));
    } else if (
      getObjectType(node.renameType) === 'OBJECT_DOMAIN' ||
      getObjectType(node.renameType) === 'OBJECT_TYPE'
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
    } else if (getObjectType(node.renameType) === 'OBJECT_DOMCONSTRAINT') {
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
      output.push(this.deparse(node.relation, context));
      output.push('RENAME');
      output.push(this.quote(node.subname));
      output.push('TO');
      output.push(this.quote(node.newname));
    }

    if (node.behavior === 1) {
      output.push('CASCADE');
    }

    return output.join(' ');
  }

  ['AlterOwnerStmt'](node, context = {}) {
    const output = [];

    if (
      getObjectType(node.objectType) === 'OBJECT_FUNCTION' ||
      getObjectType(node.objectType) === 'OBJECT_FOREIGN_TABLE' ||
      getObjectType(node.objectType) === 'OBJECT_FDW' ||
      getObjectType(node.objectType) === 'OBJECT_FOREIGN_SERVER'
    ) {
      output.push('ALTER');
      output.push(objtypeName(node.objectType));
      output.push(this.deparse(node.object, context));
      output.push('OWNER');
      output.push('TO');
      output.push(this.deparse(node.newowner, context));
    } else {
      throw new Error('AlterOwnerStmt needs implementation');
    }

    return output.join(' ');
  }

  ['AlterObjectSchemaStmt'](node, context = {}) {
    const output = [];

    if (getObjectType(node.objectType) === 'OBJECT_TABLE') {
      output.push('ALTER');
      output.push(objtypeName(node.objectType));
      if (node.missing_ok) {
        output.push('IF EXISTS');
      }
      output.push(this.deparse(node.relation, context));
      output.push('SET SCHEMA');
      output.push(this.quote(node.newschema));
    } else {
      output.push('ALTER');
      output.push(objtypeName(node.objectType));
      if (node.missing_ok) {
        output.push('IF EXISTS');
      }
      output.push(this.deparse(node.object, context));
      output.push('SET SCHEMA');
      output.push(this.quote(node.newschema));
    }

    return output.join(' ');
  }

  ['ColumnDef'](node, context = {}) {
    const output = [this.quote(node.colname)];

    output.push(this.deparse(node.typeName, context));

    if (node.raw_default) {
      output.push('USING');
      output.push(this.deparse(node.raw_default, context));
    }

    if (node.constraints) {
      output.push(this.list(node.constraints, ' ', '', context));
    }

    if (node.collClause) {
      output.push('COLLATE');
      const str = dotty.get(
        node,
        'collClause.CollateClause.collname.0.String.str'
      );
      output.push(this.quote(str));
    }

    return _.compact(output).join(' ');
  }

  ['SQLValueFunction'](node) {
    if (node.op === 0) {
      return 'CURRENT_DATE';
    }
    if (node.op === 3) {
      return 'CURRENT_TIMESTAMP';
    }
    if (node.op === 10) {
      return 'CURRENT_USER';
    }
    if (node.op === 12) {
      return 'SESSION_USER';
    }
    throw new Error(`op=${node.op} SQLValueFunction not implemented`);
  }

  ['ColumnRef'](node, context = {}) {
    const KEYWORDS = ['old', 'new'];
    const fields = node.fields.map((field) => {
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

  ['CommentStmt'](node, context = {}) {
    const output = [];

    output.push('COMMENT');
    output.push('ON');
    output.push(objtypeName(node.objtype));

    if (objtypeIs(node.objtype, 'OBJECT_CAST')) {
      output.push('(');
      output.push(this.deparse(node.object[0], context));
      output.push('AS');
      output.push(this.deparse(node.object[1], context));
      output.push(')');
    } else if (objtypeIs(node.objtype, 'OBJECT_DOMCONSTRAINT')) {
      output.push(this.deparse(node.object[1], context));
      output.push('ON');
      output.push('DOMAIN');
      output.push(this.deparse(node.object[0], context));
    } else if (
      objtypeIs(node.objtype, 'OBJECT_OPCLASS') ||
      objtypeIs(node.objtype, 'OBJECT_OPFAMILY')
    ) {
      output.push(this.deparse(node.object[1], context));
      output.push('USING');
      output.push(this.deparse(node.object[0], context));
    } else if (objtypeIs(node.objtype, 'OBJECT_OPERATOR')) {
      output.push(this.deparse(node.object, 'noquotes'));
    } else if (objtypeIs(node.objtype, 'OBJECT_POLICY')) {
      output.push(this.deparse(node.object[1], context));
      output.push('ON');
      output.push(this.deparse(node.object[0], context));
    } else if (objtypeIs(node.objtype, 'OBJECT_ROLE')) {
      output.push(this.deparse(node.object, context));
    } else if (objtypeIs(node.objtype, 'OBJECT_RULE')) {
      output.push(this.deparse(node.object[1], context));
      output.push('ON');
      output.push(this.deparse(node.object[0], context));
    } else if (objtypeIs(node.objtype, 'OBJECT_TABCONSTRAINT')) {
      if (node.object.length === 3) {
        output.push(this.deparse(node.object[2], context));
        output.push('ON');
        output.push(
          this.deparse(node.object[0], context) +
            '.' +
            this.deparse(node.object[1], context)
        );
      } else {
        output.push(this.deparse(node.object[1], context));
        output.push('ON');
        output.push(this.deparse(node.object[0], context));
      }
    } else if (objtypeIs(node.objtype, 'OBJECT_TRANSFORM')) {
      output.push('FOR');
      output.push(this.deparse(node.object[0], context));
      output.push('LANGUAGE');
      output.push(this.deparse(node.object[1], context));
    } else if (objtypeIs(node.objtype, 'OBJECT_TRIGGER')) {
      output.push(this.deparse(node.object[1], context));
      output.push('ON');
      output.push(this.deparse(node.object[0], context));
    } else {
      if (objtypeIs(node.objtype, 'OBJECT_LARGEOBJECT')) {
        output.push(dotty.get(node, 'object.Integer.ival'));
      } else if (node.object instanceof Array) {
        output.push(this.listQuotes(node.object, '.'));
      } else {
        output.push(this.deparse(node.object, context));
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

  ['CommonTableExpr'](node, context = {}) {
    const output = [];

    output.push(node.ctename);

    if (node.aliascolnames) {
      output.push(
        format(
          '(%s)',
          this.quote(this.deparseNodes(node.aliascolnames, context))
        )
      );
    }

    output.push(format('AS (%s)', this.deparse(node.ctequery)));

    return output.join(' ');
  }

  ['DefElem'](node, context = {}) {
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

    if (context === 'generated') {
      switch (name) {
        case 'start': {
          const start = this.deparse(node.arg, context);
          return `START WITH ${start}`;
        }
        case 'increment': {
          const inc = this.deparse(node.arg, context);
          return `INCREMENT BY ${inc}`;
        }
        default:
          throw new Error('NOT_IMPLEMENTED');
      }
    }

    if (context === 'sequence') {
      switch (name) {
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
        default:
          if (node.arg) {
            // we need 'simple' so it doesn't wrap negative numbers in parens
            return `${name} ${this.deparse(node.arg, 'simple')}`;
          }
      }
    } else if (node.arg) {
      return `${name} = ${this.deparse(node.arg, context)}`;
    }

    return name;
  }

  ['DoStmt'](node) {
    return `DO $$\n  ${dotty
      .get(node, 'args.0.DefElem.arg.String.str')
      .trim()} $$`;
  }

  ['Float'](node) {
    // wrap negative numbers in parens, SELECT (-2147483648)::int4 * (-1)::int4
    if (node.str[0] === '-') {
      return `(${node.str})`;
    }

    return node.str;
  }

  ['FuncCall'](node, context = {}) {
    const output = [];

    let params = [];

    if (node.args) {
      params = node.args.map((item) => {
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
      output.push(format('OVER %s', this.deparse(node.over, context)));
    }

    return output.join(' ');
  }

  ['GroupingFunc'](node, context = {}) {
    return 'GROUPING(' + this.list(node.args, ', ', '', context) + ')';
  }

  ['GroupingSet'](node, context = {}) {
    switch (node.kind) {
      case 0: // GROUPING_SET_EMPTY
        return '()';

      case 1: // GROUPING_SET_SIMPLE
        return fail('GroupingSet', node);

      case 2: // GROUPING_SET_ROLLUP
        return 'ROLLUP (' + this.list(node.content, ', ', '', context) + ')';

      case 3: // GROUPING_SET_CUBE
        return 'CUBE (' + this.list(node.content, ', ', '', context) + ')';

      case 4: // GROUPING_SET_SETS
        return (
          'GROUPING SETS (' + this.list(node.content, ', ', '', context) + ')'
        );

      default:
        return fail('GroupingSet', node);
    }
  }

  ['IndexStmt'](node, context = {}) {
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
    output.push(this.deparse(node.relation, context));

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

  ['IndexElem'](node, context = {}) {
    if (node.name) {
      return node.name;
    }
    if (node.expr) {
      return this.deparse(node.expr, context);
    }
    return fail('IndexElem', node);
  }

  ['InsertStmt'](node, context = {}) {
    const output = [];

    output.push('INSERT INTO');
    output.push(this.deparse(node.relation, context));

    if (node.cols && node.cols.length) {
      output.push('(');
      output.push(this.list(node.cols, ', ', '', context));
      output.push(')');
    }

    if (node.selectStmt) {
      output.push(this.deparse(node.selectStmt, context));
    } else {
      output.push('DEFAULT VALUES');
    }

    if (node.onConflictClause) {
      const clause = node.onConflictClause.OnConflictClause;

      output.push('ON CONFLICT');
      if (clause.infer.InferClause.indexElems) {
        output.push('(');
        output.push(
          this.list(clause.infer.InferClause.indexElems, ', ', '', context)
        );
        output.push(')');
      } else if (clause.infer.InferClause.conname) {
        output.push('ON CONSTRAINT');
        output.push(clause.infer.InferClause.conname);
      }

      switch (clause.action) {
        case 1:
          output.push('DO NOTHING');
          break;
        case 2:
          output.push('DO');
          output.push(this.UpdateStmt(clause, context));
          break;
        default:
          throw new Error('unhandled CONFLICT CLAUSE');
      }
    }

    if (node.returningList) {
      output.push('RETURNING');
      output.push(
        node.returningList
          .map(
            (returning) =>
              this.deparse(returning.ResTarget.val, context) +
              (returning.ResTarget.name
                ? ' AS ' + this.quote(returning.ResTarget.name)
                : '')
          )
          .join(',')
      );
    }

    return output.join(' ');
  }

  ['SetToDefault'](node) {
    return 'DEFAULT';
  }

  ['MultiAssignRef'](node, context = {}) {
    const output = [];
    output.push(this.deparse(node.source, context));
    return output.join(' ');
  }

  ['DeleteStmt'](node, context = {}) {
    const output = [''];
    output.push('DELETE');
    output.push('FROM');
    output.push(this.deparse(node.relation, context));
    if (node.whereClause) {
      output.push('WHERE');
      output.push(this.deparse(node.whereClause, context));
    }
    return output.join(' ');
  }

  ['UpdateStmt'](node, context = {}) {
    const output = [];
    output.push('UPDATE');
    output.push(this.deparse(node.relation, context));
    output.push('SET');

    if (node.targetList && node.targetList.length) {
      if (
        node.targetList[0].ResTarget &&
        node.targetList[0].ResTarget.val &&
        node.targetList[0].ResTarget.val.MultiAssignRef
      ) {
        output.push('(');
        output.push(
          node.targetList.map((target) => target.ResTarget.name).join(',')
        );
        output.push(')');
        output.push('=');
        output.push(this.deparse(node.targetList[0].ResTarget.val, context));
      } else {
        output.push(
          node.targetList
            .map((target) => this.deparse(target, 'update'))
            .join(',')
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
      output.push(
        node.returningList
          .map(
            (returning) =>
              this.deparse(returning.ResTarget.val, context) +
              (returning.ResTarget.name
                ? ' AS ' + this.quote(returning.ResTarget.name)
                : '')
          )
          .join(',')
      );
    }

    return output.join(' ');
  }

  ['Integer'](node, context = {}) {
    if (node.ival < 0 && context !== 'simple') {
      return `(${node.ival})`;
    }

    return node.ival.toString();
  }

  ['IntoClause'](node, context = {}) {
    return this.deparse(node.rel, context);
  }

  ['JoinExpr'](node, context = {}) {
    const output = [];

    output.push(this.deparse(node.larg, context));

    if (node.isNatural) {
      output.push('NATURAL');
    }

    let join = null;

    switch (true) {
      case node.jointype === 0 && node.quals != null:
        join = 'INNER JOIN';
        break;

      case node.jointype === 0 &&
        !node.isNatural &&
        !(node.quals != null) &&
        !(node.usingClause != null):
        join = 'CROSS JOIN';
        break;

      case node.jointype === 0:
        join = 'JOIN';
        break;

      case node.jointype === 1:
        join = 'LEFT OUTER JOIN';
        break;

      case node.jointype === 2:
        join = 'FULL OUTER JOIN';
        break;

      case node.jointype === 3:
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
      return wrapped + ' ' + this.deparse(node.alias, context);
    }

    return wrapped;
  }

  ['LockingClause'](node, context = {}) {
    const strengths = [
      'NONE', // LCS_NONE
      'FOR KEY SHARE',
      'FOR SHARE',
      'FOR NO KEY UPDATE',
      'FOR UPDATE'
    ];

    const output = [];

    output.push(strengths[node.strength]);

    if (node.lockedRels) {
      output.push('OF');
      output.push(this.list(node.lockedRels, ', ', '', context));
    }

    return output.join(' ');
  }

  ['MinMaxExpr'](node, context = {}) {
    const output = [];

    if (node.op === 0) {
      output.push('GREATEST');
    } else {
      output.push('LEAST');
    }

    output.push(parens(this.list(node.args, ', ', '', context)));

    return output.join('');
  }

  ['NamedArgExpr'](node, context = {}) {
    const output = [];

    output.push(node.name);
    output.push(':=');
    output.push(this.deparse(node.arg, context));

    return output.join(' ');
  }

  ['Null'](node) {
    return 'NULL';
  }

  ['NullTest'](node, context = {}) {
    const output = [this.deparse(node.arg, context)];

    if (node.nulltesttype === 0) {
      output.push('IS NULL');
    } else if (node.nulltesttype === 1) {
      output.push('IS NOT NULL');
    }

    return output.join(' ');
  }

  ['ParamRef'](node) {
    if (node.number >= 0) {
      return ['$', node.number].join('');
    }
    return '?';
  }

  ['RangeFunction'](node, context = {}) {
    const output = [];

    if (node.lateral) {
      output.push('LATERAL');
    }

    const funcs = [];

    for (let i = 0; i < node.functions.length; i++) {
      const funcCall = node.functions[i];
      const call = [this.deparse(funcCall[0], context)];

      if (funcCall[1] && funcCall[1].length) {
        call.push(format('AS (%s)', this.list(funcCall[1], ', ', '', context)));
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
      output.push(this.deparse(node.alias, context));
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

  ['RangeSubselect'](node, context = {}) {
    let output = '';

    if (node.lateral) {
      output += 'LATERAL ';
    }

    output += parens(this.deparse(node.subquery, context));

    if (node.alias) {
      return output + ' ' + this.deparse(node.alias, context);
    }

    return output;
  }

  ['RangeTableSample'](node, context = {}) {
    const output = [];

    output.push(this.deparse(node.relation, context));
    output.push('TABLESAMPLE');
    output.push(this.deparse(node.method[0], context));

    if (node.args) {
      output.push(parens(this.list(node.args, ', ', '', context)));
    }

    if (node.repeatable) {
      output.push('REPEATABLE(' + this.deparse(node.repeatable, context) + ')');
    }

    return output.join(' ');
  }

  ['RangeVar'](node, context = {}) {
    const output = [];

    if (node.inhOpt === 0) {
      output.push('ONLY');
    }

    // TODO why does this seem to be what we really need vs the above?
    // if (!node.inh) {
    //   output.push('ONLY');
    // }

    if (node.relpersistence === 'u') {
      output.push('UNLOGGED');
    }

    if (node.relpersistence === 't') {
      output.push('TEMPORARY TABLE');
    }

    if (node.schemaname != null) {
      output.push(`${this.quote(node.schemaname)}.${this.quote(node.relname)}`);
    } else {
      output.push(this.quote(node.relname));
    }

    if (node.alias) {
      output.push(this.deparse(node.alias, context));
    }

    return output.join(' ');
  }

  ['ResTarget'](node, context = {}) {
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

  ['RowExpr'](node, context = {}) {
    if (node.row_format === 2) {
      return parens(this.list(node.args, ', ', '', context));
    }

    return format('ROW(%s)', this.list(node.args, ', ', '', context));
  }

  ['ExplainStmt'](node, context = {}) {
    const output = [];
    output.push('EXPLAIN');
    output.push(this.deparse(node.query, context));
    return output.join(' ');
  }

  ['SelectStmt'](node, context = {}) {
    const output = [];

    if (node.withClause) {
      output.push(this.deparse(node.withClause, context));
    }

    if (node.op === 0) {
      // VALUES select's don't get SELECT
      if (node.valuesLists == null) {
        output.push('SELECT');
      }
    } else {
      output.push(parens(this.deparse(node.larg, context)));

      const sets = ['NONE', 'UNION', 'INTERSECT', 'EXCEPT'];

      output.push(sets[node.op]);

      if (node.all) {
        output.push('ALL');
      }

      output.push(parens(this.deparse(node.rarg, context)));
    }

    if (node.distinctClause) {
      if (node.distinctClause[0] != null) {
        output.push('DISTINCT ON');

        const clause = node.distinctClause
          .map((e) => this.deparse(e, 'select'))
          .join(',\n');

        output.push(`(${clause})`);
      } else {
        output.push('DISTINCT');
      }
    }

    if (node.targetList) {
      output.push(
        indent(
          node.targetList.map((e) => this.deparse(e, 'select')).join(',\n')
        )
      );
    }

    if (node.intoClause) {
      output.push('INTO');
      output.push(indent(this.deparse(node.intoClause, context)));
    }

    if (node.fromClause) {
      output.push('FROM');
      output.push(
        indent(node.fromClause.map((e) => this.deparse(e, 'from')).join(',\n'))
      );
    }

    if (node.whereClause) {
      output.push('WHERE');
      output.push(indent(this.deparse(node.whereClause, context)));
    }

    if (node.valuesLists) {
      output.push('VALUES');

      const lists = node.valuesLists.map((list) => {
        return `(${this.list(list, ', ', '', context)})`;
      });

      output.push(lists.join(', '));
    }

    if (node.groupClause) {
      output.push('GROUP BY');
      output.push(
        indent(
          node.groupClause.map((e) => this.deparse(e, 'group')).join(',\n')
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

      for (let i = 0; i < node.windowClause.length; i++) {
        const w = node.windowClause[i];
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
        indent(node.sortClause.map((e) => this.deparse(e, 'sort')).join(',\n'))
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

  ['AlterDefaultPrivilegesStmt'](node, context = {}) {
    const output = [];
    output.push('ALTER DEFAULT PRIVILEGES');

    const options = dotty.get(node, 'options');

    if (options) {
      const elem = node.options.find((el) => el.hasOwnProperty('DefElem'));

      if (elem.DefElem.defname === 'schemas') {
        output.push('IN SCHEMA');
        output.push(dotty.get(elem, 'DefElem.arg.0.String.str'));
      }
      if (elem.DefElem.defname === 'roles') {
        output.push('FOR ROLE');
        const roleSpec = dotty.get(elem, 'DefElem.arg.0');
        output.push(this.deparse(roleSpec, context));
      }
      output.push('\n');
    }
    output.push(this.deparse(node.action, context));

    return output.join(' ');
  }

  ['AlterTableStmt'](node, context = {}) {
    const output = [];
    const ctx = { ...context };
    output.push('ALTER');
    if (getObjectType(node.relkind) === 'OBJECT_TABLE') {
      output.push('TABLE');
      const inh = dotty.get(node, 'relation.RangeVar.inh');
      if (!inh) {
        output.push('ONLY');
      }
    } else if (getObjectType(node.relkind) === 'OBJECT_TYPE') {
      output.push('TYPE');
    } else {
      throw new Error('for now throw');
    }
    if (node.missing_ok) {
      output.push('IF EXISTS');
    }

    ctx.alterType = getObjectType(node.relkind);
    output.push(this.deparse(node.relation, ctx));
    output.push(this.list(node.cmds, ', ', '', ctx));

    return output.join(' ');
  }

  ['AlterTableCmd'](node, context = {}) {
    const output = [];

    let subType = 'COLUMN';

    if (context && context.alterType === 'OBJECT_TYPE') {
      subType = 'ATTRIBUTE';
    }

    if (node.subtype === 0) {
      output.push('ADD');
      output.push(subType);
      if (node.missing_ok) {
        output.push('IF NOT EXISTS');
      }
      output.push(this.quote(node.name));
      output.push(this.deparse(node.def, context));
    }

    if (node.subtype === 3) {
      output.push('ALTER');
      output.push(subType);
      output.push(this.quote(node.name));
      if (node.def) {
        output.push('SET DEFAULT');
        output.push(this.deparse(node.def, context));
      } else {
        output.push('DROP DEFAULT');
      }
    }

    if (node.subtype === 4) {
      output.push('ALTER');
      output.push(subType);
      output.push(this.quote(node.name));
      output.push('DROP NOT NULL');
    }

    if (node.subtype === 5) {
      output.push('ALTER');
      output.push(subType);
      output.push(this.quote(node.name));
      output.push('SET NOT NULL');
    }

    if (node.subtype === 6) {
      output.push('ALTER');
      output.push(this.quote(node.name));
      output.push('SET STATISTICS');
      output.push(dotty.get(node, 'def.Integer.ival'));
    }

    if (node.subtype === 7) {
      output.push('ALTER');
      output.push(subType);
      output.push(this.quote(node.name));
      output.push('SET');
      output.push('(');
      output.push(this.list(node.def, ', ', '', context));
      output.push(')');
    }

    if (node.subtype === 9) {
      output.push('ALTER');
      output.push(this.quote(node.name));
      output.push('SET STORAGE');
      if (node.def) {
        output.push(this.deparse(node.def, context));
      } else {
        output.push('PLAIN');
      }
    }

    if (node.subtype === 10) {
      output.push('DROP');
      output.push(subType);
      if (node.missing_ok) {
        output.push('IF EXISTS');
      }
      output.push(this.quote(node.name));
    }

    if (node.subtype === 14) {
      // output.push('ADD CONSTRAINT');
      output.push('ADD');
      output.push(this.deparse(node.def, context));
    }

    if (node.subtype === 18) {
      output.push('VALIDATE CONSTRAINT');
      output.push(this.quote(node.name, context));
    }

    if (node.subtype === 22) {
      output.push('DROP CONSTRAINT');
      if (node.missing_ok) {
        output.push('IF EXISTS');
      }
      output.push(this.quote(node.name));
    }

    if (node.subtype === 25) {
      output.push('ALTER');
      output.push(subType);
      output.push(this.quote(node.name));
      output.push('TYPE');
      output.push(this.deparse(node.def, context));
    }

    if (node.subtype === 27) {
      output.push('OWNER');
      output.push('TO');
      output.push(this.deparse(node.newowner, context));
    }

    if (node.subtype === 28) {
      output.push('CLUSTER ON');
      output.push(this.quote(node.name));
    }

    if (node.subtype === 29) {
      output.push('SET WITHOUT CLUSTER');
    }

    if (node.subtype === 32) {
      output.push('SET WITH OIDS');
    }

    if (node.subtype === 34) {
      output.push('SET WITHOUT OIDS');
    }

    if (node.subtype === 36) {
      output.push('SET');
      output.push('(');
      output.push(this.list(node.def, ', ', '', context));
      output.push(')');
    }

    if (node.subtype === 37) {
      output.push('RESET');
      output.push('(');
      output.push(this.list(node.def, ', ', '', context));
      output.push(')');
    }

    if (node.subtype === 51) {
      output.push('INHERIT');
      output.push(this.deparse(node.def, context));
    }

    if (node.subtype === 52) {
      output.push('NO INHERIT');
      output.push(this.deparse(node.def, context));
    }

    if (node.subtype === 53) {
      output.push('OF');
      output.push(this.deparse(node.def, context));
    }

    if (node.subtype === 54) {
      output.push('NOT OF');
      //output.push(this.deparse(node.def));
    }

    if (node.subtype === 56) {
      output.push('ENABLE ROW LEVEL SECURITY');
    }
    if (node.subtype === 57) {
      output.push('DISABLE ROW LEVEL SECURITY');
    }
    if (node.subtype === 58) {
      output.push('FORCE ROW SECURITY');
    }
    if (node.subtype === 59) {
      output.push('NO FORCE ROW SECURITY');
    }

    if (node.behavior === 1) {
      output.push('CASCADE');
    }

    return output.join(' ');
  }

  ['CreateEnumStmt'](node, context = {}) {
    const output = [];
    output.push('CREATE TYPE');
    output.push(this.list(node.typeName, '.', '', context));
    output.push('AS ENUM');
    output.push('(\n');
    const vals = node.vals.map((val) => {
      return { String: { str: `'${val.String.str}'` } };
    });
    output.push(this.list(vals, ',\n', '\t'));
    output.push('\n)');
    return output.join(' ');
  }

  ['AlterEnumStmt'](node, context = {}) {
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

    if (node.behavior === 1) {
      output.push('CASCADE');
    }

    return output.join(' ');
  }

  ['AlterDomainStmt'](node, context = {}) {
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

    if (node.behavior === 1) {
      output.push('CASCADE');
    }
    return output.join(' ');
  }

  ['CreateExtensionStmt'](node) {
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
      });
    }
    return output.join(' ');
  }

  ['DropStmt'](node, context = {}) {
    const output = [];
    output.push('DROP');
    output.push(objtypeName(node.removeType));
    if (node.missing_ok) {
      output.push('IF EXISTS');
    }

    const stmts = [];
    for (let s = 0; s < node.objects.length; s++) {
      const children = node.objects[s];

      const stmt = [];
      if (
        objtypeIs(node.removeType, 'OBJECT_TABLE') ||
        objtypeIs(node.removeType, 'OBJECT_CONVERSION') ||
        objtypeIs(node.removeType, 'OBJECT_COLLATION') ||
        objtypeIs(node.removeType, 'OBJECT_MATVIEW') ||
        objtypeIs(node.removeType, 'OBJECT_INDEX') ||
        objtypeIs(node.removeType, 'OBJECT_FOREIGN_TABLE')
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
      } else if (objtypeIs(node.removeType, 'OBJECT_SCHEMA')) {
        stmt.push(this.quote(this.deparse(children)));
      } else if (objtypeIs(node.removeType, 'OBJECT_SEQUENCE')) {
        stmt.push(this.listQuotes(children, '.'));
      } else if (objtypeIs(node.removeType, 'OBJECT_POLICY')) {
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
      } else if (objtypeIs(node.removeType, 'OBJECT_TRIGGER')) {
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
      } else if (objtypeIs(node.removeType, 'OBJECT_RULE')) {
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
      } else if (objtypeIs(node.removeType, 'OBJECT_VIEW')) {
        if (children.length === 1) {
          stmt.push(this.quote(this.deparse(children[0], context)));
        } else if (children.length === 2) {
          stmt.push(this.listQuotes(children, '.'));
        } else {
          throw new Error(
            'bad drop value stmt: ' + JSON.stringify(node, null, 2)
          );
        }
        // } else if (objtypeIs(node.removeType, 'OBJECT_OPERATOR')) {
      } else if (objtypeIs(node.removeType, 'OBJECT_CAST')) {
        stmt.push('(');
        stmt.push(this.deparse(children[0], context));
        stmt.push('AS');
        stmt.push(this.deparse(children[1], context));
        stmt.push(')');
        // } else if (objtypeIs(node.removeType, 'OBJECT_OPERATOR')) {
        //   stmt.push(this.deparse(children, 'noquotes')); // in this case children is not an array
      } else if (objtypeIs(node.removeType, 'OBJECT_AGGREGATE')) {
        stmt.push(this.deparse(children, context)); // in this case children is not an array
      } else if (objtypeIs(node.removeType, 'OBJECT_FDW')) {
        stmt.push(this.deparse(children, context)); // in this case children is not an array
      } else if (objtypeIs(node.removeType, 'OBJECT_FOREIGN_SERVER')) {
        stmt.push(this.deparse(children, context)); // in this case children is not an array
      } else if (objtypeIs(node.removeType, 'OBJECT_EXTENSION')) {
        stmt.push(this.deparse(children, context)); // in this case children is not an array
      } else if (objtypeIs(node.removeType, 'OBJECT_DOMAIN')) {
        stmt.push(this.deparse(children, context)); // in this case children is not an array
      } else if (objtypeIs(node.removeType, 'OBJECT_FUNCTION')) {
        stmt.push(this.deparse(children, context)); // in this case children is not an array
      } else if (objtypeIs(node.removeType, 'OBJECT_TYPE')) {
        stmt.push(this.deparse(children, context)); // in this case children is not an array
      } else {
        throw new Error('bad drop stmt: ' + JSON.stringify(node, null, 2));
      }
      stmts.push(stmt.join(' '));
    }
    output.push(stmts.join(','));

    if (node.behavior === 1) {
      output.push('CASCADE');
    }
    return output.join(' ');
  }

  ['CreatePolicyStmt'](node, context = {}) {
    const output = [];
    output.push('CREATE POLICY');

    output.push(this.quote(node.policy_name));

    if (node.table) {
      output.push('ON');
      output.push(this.deparse(node.table, context));
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

  ['AlterPolicyStmt'](node, context = {}) {
    const output = [];
    output.push('ALTER POLICY');

    output.push(this.quote(node.policy_name));

    if (node.table) {
      output.push('ON');
      output.push(this.deparse(node.table, context));
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

  ['ViewStmt'](node, context = {}) {
    const output = [];
    output.push('CREATE VIEW');
    output.push(this.deparse(node.view, context));
    output.push('AS');
    output.push(this.deparse(node.query, context));
    return output.join(' ');
  }

  ['CreateSeqStmt'](node, context = {}) {
    const output = [];
    output.push('CREATE SEQUENCE');
    output.push(this.deparse(node.sequence, context));
    if (node.options && node.options.length) {
      node.options.forEach((opt) => {
        output.push(this.deparse(opt, 'sequence'));
      });
    }
    return output.join(' ');
  }

  ['CreateTableAsStmt'](node, context = {}) {
    const output = [];
    output.push('CREATE MATERIALIZED VIEW');
    output.push(this.deparse(node.into, context));
    output.push('AS');
    output.push(this.deparse(node.query, context));
    return output.join(' ');
  }

  ['CreateTrigStmt'](node, context = {}) {
    const output = [];

    output.push('CREATE');
    if (node.isconstraint) {
      output.push('CONSTRAINT');
    }
    output.push('TRIGGER');
    output.push(this.quote(node.trigname));
    output.push('\n');

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
    output.push(this.deparse(node.relation, context));
    output.push('\n');

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
      output.push('\n');
    }

    if (node.row) {
      output.push('FOR EACH ROW\n');
    } else {
      output.push('FOR EACH STATEMENT\n');
    }

    if (node.whenClause) {
      output.push('WHEN');
      output.push('(');
      output.push(this.deparse(node.whenClause, 'trigger'));
      output.push(')');
      output.push('\n');
    }

    output.push('EXECUTE PROCEDURE');
    output.push(this.listQuotes(node.funcname).split(',').join('.'));
    output.push('(');
    let args = [];
    if (node.args) {
      args = node.args;
    }
    // seems that it's only parsing strings?
    args = args
      .map((arg) => {
        if (dotty.exists(arg, 'String.str')) {
          return `'${dotty.get(arg, 'String.str')}'`;
        }
        return this.deparse(arg, context);
      })
      .filter((a) => a);
    output.push(args.join(','));
    output.push(')');

    return output.join(' ');
  }

  ['CreateDomainStmt'](node, context = {}) {
    const output = [];
    output.push('CREATE DOMAIN');
    output.push(this.list(node.domainname, '.', '', context));
    output.push('AS');
    output.push(this.deparse(node.typeName, context));
    if (node.constraints) {
      output.push(this.list(node.constraints, ', ', '', context));
    }
    return output.join(' ');
  }

  ['CreateStmt'](node, context = {}) {
    const output = [];
    const relpersistence = dotty.get(node, 'relation.RangeVar.relpersistence');
    if (relpersistence === 't') {
      output.push('CREATE');
    } else {
      output.push('CREATE TABLE');
    }

    output.push(this.deparse(node.relation, context));
    output.push('(\n');
    output.push(this.list(node.tableElts, ',\n', '\t', context));
    output.push('\n)');

    if (relpersistence === 'p' && node.hasOwnProperty('inhRelations')) {
      output.push('INHERITS');
      output.push('(');
      output.push(this.list(node.inhRelations, ', ', '', context));
      output.push(')');
    }

    if (node.options) {
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

  ['ConstraintStmt'](node) {
    const output = [];
    const constraint = getConstraintFromConstrType(node.contype);

    if (node.conname) {
      output.push('CONSTRAINT');
      output.push(node.conname);
      if (!node.pktable) {
        output.push(constraint);
      }
    } else if (node.contype === 3) {
      // IDENTITY
      output.push('GENERATED');
      if (node.generated_when == 'a') {
        output.push('ALWAYS AS');
      } else {
        output.push('BY DEFAULT AS');
      }
      output.push('IDENTITY');
      if (node.options && node.options.length) {
        output.push('(');
        output.push(this.list(node.options, ' ', '', 'generated'));
        output.push(')');
      }
    } else if (node.contype === 13) {
      // 13 IS NOT the real contype, this is to include the future in the past...
      // GENERATED
      output.push('GENERATED');
      if (node.generated_when == 'a') {
        output.push('ALWAYS AS');
      }
    } else {
      output.push(constraint);
    }
    return output.join(' ');
  }

  ['ReferenceConstraint'](node, context = {}) {
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
      output.push(this.deparse(node.pktable, context));
      output.push('(');
      output.push(this.listQuotes(node.pk_attrs));
      output.push(')');
    } else if (node.pk_attrs) {
      output.push(this.ConstraintStmt(node, context));
      output.push(this.deparse(node.pktable, context));
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
      output.push(this.deparse(node.pktable, context));
    } else {
      output.push(this.ConstraintStmt(node, context));
      output.push(this.deparse(node.pktable, context));
    }
    return output.join(' ');
  }

  ['ExclusionConstraint'](node, context = {}) {
    const output = [];
    function getExclusionGroup(nde) {
      const a = nde.exclusions.map((excl) => {
        if (excl[0].IndexElem.name) {
          return excl[0].IndexElem.name;
        }
        return excl[0].IndexElem.expr
          ? this.deparse(excl[0].IndexElem.expr, context)
          : null;
      });

      const b = nde.exclusions.map((excl) => this.deparse(excl[1][0], context));

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

  ['Constraint'](node, context = {}) {
    const output = [];

    if (node.contype === CONSTRAINT_TYPES.CONSTR_FOREIGN) {
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
      if (node.contype == 13) {
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

    if (node.contype === CONSTRAINT_TYPES.CONSTR_EXCLUSION) {
      output.push(this.ExclusionConstraint(node, context));
    }

    if (node.deferrable) {
      output.push('deferrable');
    }

    return output.join(' ');
  }

  ['AccessPriv'](node) {
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

  ['VariableSetStmt'](node) {
    switch (node.kind) {
      case VARIABLESET_TYPES.VAR_SET_VALUE:
        return format(
          'SET %s%s = %s',
          node.is_local ? 'LOCAL ' : '',
          node.name,
          this.deparseNodes(node.args, 'simple').join(', ')
        );
      case VARIABLESET_TYPES.VAR_SET_DEFAULT:
        return format('SET %s TO DEFAULT', node.name);
      case VARIABLESET_TYPES.VAR_SET_CURRENT:
        return format('SET %s FROM CURRENT', node.name);
      case VARIABLESET_TYPES.VAR_SET_MULTI: {
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
      case VARIABLESET_TYPES.VAR_RESET:
        return format('RESET %s', node.name);
      case VARIABLESET_TYPES.VAR_RESET_ALL:
        return 'RESET ALL';
      default:
        return fail('VariableSetKind', node);
    }
  }

  ['VariableShowStmt'](node) {
    return format('SHOW %s', node.name);
  }

  ['FuncWithArgs'](node, context = {}) {
    const output = [];
    output.push(this.deparse(node.funcname[0], context));
    output.push('(');
    output.push(this.list(node.funcargs, ', ', '', context));
    output.push(')');
    return output.join(' ');
  }

  ['FunctionParameter'](node, context = {}) {
    const output = [];

    if (node.mode === 118) {
      output.push('VARIADIC');
    }

    if (node.mode === 111) {
      output.push('OUT');
    }

    if (node.mode === 98) {
      output.push('INOUT');
    }

    output.push(node.name);
    output.push(this.deparse(node.argType, context));

    if (node.defexpr) {
      output.push('DEFAULT');
      output.push(this.deparse(node.defexpr, context));
    }

    return output.join(' ');
  }

  ['CreateFunctionStmt'](node, context = {}) {
    const output = [];

    output.push('CREATE');
    if (node.replace) {
      output.push('OR REPLACE');
    }
    output.push('FUNCTION');

    output.push(
      node.funcname.map((name) => this.deparse(name, context)).join('.')
    );
    output.push('(');
    let parameters = [];
    if (node.parameters) {
      parameters = [...node.parameters];
    }
    const parametersList = parameters.filter(
      ({ FunctionParameter }) =>
        FunctionParameter.mode === 118 ||
        FunctionParameter.mode === 111 ||
        FunctionParameter.mode === 98 ||
        FunctionParameter.mode === 105
    );
    output.push(this.list(parametersList));
    output.push(')');

    const returns = parameters.filter(
      ({ FunctionParameter }) => FunctionParameter.mode === 116
    );

    // const outs = parameters.filter(
    //   ({ FunctionParameter }) => FunctionParameter.mode === 111
    // );

    // var setof = node.parameters.filter(
    //   ({ FunctionParameter }) => FunctionParameter.mode === 109
    // );

    if (returns.length > 0) {
      output.push('RETURNS');
      output.push('TABLE');
      output.push('(');
      output.push(this.list(returns, ', ', '', context));
      output.push(')');
    } else if (node.returnType) {
      output.push('RETURNS');
      output.push(this.deparse(node.returnType, context));
    }

    node.options.forEach((option, i) => {
      if (option && option.DefElem) {
        let value = '';
        switch (option.DefElem.defname) {
          case 'as':
            value = this.deparse(option.DefElem.arg[0], context);
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
  ['CreateSchemaStmt'](node) {
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

  ['RoleSpec'](node) {
    switch (node.roletype) {
      case ROLESPEC_TYPES.ROLESPEC_CSTRING:
        return this.quote(node.rolename);
      case ROLESPEC_TYPES.ROLESPEC_CURRENT_USER:
        return 'CURRENT_USER';
      case ROLESPEC_TYPES.ROLESPEC_SESSION_USER:
        return 'SESSION_USER';
      case ROLESPEC_TYPES.ROLESPEC_PUBLIC:
        return 'PUBLIC';
      default:
        return fail('RoleSpec', node);
    }
  }

  ['GrantStmt'](node) {
    const output = [];

    const getTypeFromNode = (nodeObj) => {
      switch (nodeObj.objtype) {
        case GRANTOBJECT_TYPES.ACL_OBJECT_RELATION:
          if (nodeObj.targtype === GRANTTARGET_TYPES.ACL_TARGET_ALL_IN_SCHEMA) {
            return 'ALL TABLES IN SCHEMA';
          }
          if (nodeObj.targtype === GRANTTARGET_TYPES.ACL_TARGET_DEFAULTS) {
            return 'TABLES';
          }
          // todo could be view
          return 'TABLE';
        case GRANTOBJECT_TYPES.ACL_OBJECT_SEQUENCE:
          return 'SEQUENCE';
        case GRANTOBJECT_TYPES.ACL_OBJECT_DATABASE:
          return 'DATABASE';
        case GRANTOBJECT_TYPES.ACL_OBJECT_DOMAIN:
          return 'DOMAIN';
        case GRANTOBJECT_TYPES.ACL_OBJECT_FDW:
          return 'FOREIGN DATA WRAPPER';
        case GRANTOBJECT_TYPES.ACL_OBJECT_FOREIGN_SERVER:
          return 'FOREIGN SERVER';
        case GRANTOBJECT_TYPES.ACL_OBJECT_FUNCTION:
          if (nodeObj.targtype === GRANTTARGET_TYPES.ACL_TARGET_ALL_IN_SCHEMA) {
            return 'ALL FUNCTIONS IN SCHEMA';
          }
          if (nodeObj.targtype === GRANTTARGET_TYPES.ACL_TARGET_DEFAULTS) {
            return 'FUNCTIONS';
          }
          return 'FUNCTION';
        case GRANTOBJECT_TYPES.ACL_OBJECT_LANGUAGE:
          return 'LANGUAGE';
        case GRANTOBJECT_TYPES.ACL_OBJECT_LARGEOBJECT:
          return 'LARGE OBJECT';
        case GRANTOBJECT_TYPES.ACL_OBJECT_NAMESPACE:
          return 'SCHEMA';
        case GRANTOBJECT_TYPES.ACL_OBJECT_TABLESPACE:
          return 'TABLESPACE';
        case GRANTOBJECT_TYPES.ACL_OBJECT_TYPE:
          return 'TYPE';
        default:
      }
      return fail('GrantStmt', node);
    };

    if (node.objtype !== GRANTOBJECT_TYPES.ACL_OBJECT_COLUMN) {
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
      if (Number(node.behavior) === 1) {
        output.push('CASCADE');
      }
    }

    return output.join(' ');
  }

  ['GrantRoleStmt'](node, context = {}) {
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

  ['CreateRoleStmt'](node, context = {}) {
    const output = [];

    const roleOption = (nodeObj, i, val1, val2) => {
      const val = Number(
        dotty.get(nodeObj, `options.${i}.DefElem.arg.Integer.ival`)
      );
      if (val > 0) {
        output.push(val1);
      } else {
        output.push(val2);
      }
    };

    output.push('CREATE');
    switch (node.stmt_type) {
      case ROLESTMT_TYPES.ROLESTMT_USER:
        output.push('USER');
        break;
      case ROLESTMT_TYPES.ROLESTMT_GROUP:
        output.push('GROUP');
        break;
      default:
        output.push('ROLE');
    }

    output.push(`"${node.role}"`);

    if (node.options) {
      const opts = dotty.search(node, 'options.*.DefElem.defname');

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
                .search(node, `options.${i}.DefElem.arg.*.RoleSpec.rolename`)
                .join(',')
            );
            break;
          case 'password':
            output.push('PASSWORD');
            value = dotty.get(
              node,
              `options.${i}.DefElem.arg.A_Const.val.String.str`
            );
            output.push(`'${value}'`);
            break;
          case 'adminmembers':
            output.push('ADMIN');
            output.push(
              this.list(node.options[i].DefElem.arg, ', ', '', context)
            );
            break;
          case 'rolemembers':
            output.push('USER');
            output.push(
              this.list(node.options[i].DefElem.arg, ', ', '', context)
            );
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
            value = dotty.get(node, `options.${i}.DefElem.arg.String.str`);
            output.push(`'${value}'`);
            break;
          default:
        }
      });
    }
    return output.join(' ');
  }

  ['TransactionStmt'](node, context = {}) {
    const output = [];

    const begin = (nodeOpts) => {
      const opts = dotty.search(nodeOpts, 'options.*.DefElem.defname');
      if (opts.includes('transaction_read_only')) {
        const index = opts.indexOf('transaction_read_only');
        const obj = nodeOpts.options[index];
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
        const obj = nodeOpts.options[index];
        const lopts = this.deparse(
          dotty.get(obj, 'DefElem.arg'),
          context
        ).replace(/['"]+/g, '');
        return `BEGIN TRANSACTION ISOLATION LEVEL ${lopts.toUpperCase()}`;
      }
      return 'BEGIN';
    };

    const start = (nodeOpts) => {
      const opts = dotty.search(nodeOpts, 'options.*.DefElem.defname');
      if (opts.includes('transaction_read_only')) {
        const index = opts.indexOf('transaction_read_only');
        const obj = nodeOpts.options[index];
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

    switch (node.kind) {
      case TRANSACTIONSTMT_TYPES.TRANS_STMT_BEGIN:
        return begin(node);
      case TRANSACTIONSTMT_TYPES.TRANS_STMT_START:
        return start(node);
      case TRANSACTIONSTMT_TYPES.TRANS_STMT_COMMIT:
        return 'COMMIT';
      case TRANSACTIONSTMT_TYPES.TRANS_STMT_ROLLBACK:
        return 'ROLLBACK';
      case TRANSACTIONSTMT_TYPES.TRANS_STMT_SAVEPOINT:
        output.push('SAVEPOINT');
        output.push(this.deparse(node.options[0].DefElem.arg, context));
        break;
      case TRANSACTIONSTMT_TYPES.TRANS_STMT_RELEASE:
        output.push('RELEASE SAVEPOINT');
        output.push(this.deparse(node.options[0].DefElem.arg, context));
        break;
      case TRANSACTIONSTMT_TYPES.TRANS_STMT_ROLLBACK_TO:
        output.push('ROLLBACK TO');
        output.push(this.deparse(node.options[0].DefElem.arg, context));
        break;
      case TRANSACTIONSTMT_TYPES.TRANS_STMT_PREPARE:
        output.push('PREPARE TRANSACTION');
        output.push(`'${node.gid}'`);
        break;
      case TRANSACTIONSTMT_TYPES.TRANS_STMT_COMMIT_PREPARED:
        output.push('COMMIT PREPARED');
        output.push(`'${node.gid}'`);
        break;
      case TRANSACTIONSTMT_TYPES.TRANS_STMT_ROLLBACK_PREPARED:
        output.push('ROLLBACK PREPARED');
        output.push(`'${node.gid}'`);
        break;
      default:
    }
    return output.join(' ');
  }

  ['SortBy'](node, context = {}) {
    const output = [];

    output.push(this.deparse(node.node, context));

    switch (node.sortby_dir) {
      case SORTBYDIR_TYPES.SORTBY_ASC:
        output.push('ASC');
        break;
      case SORTBYDIR_TYPES.SORTBY_DESC:
        output.push('DESC');
        break;
      case SORTBYDIR_TYPES.SORTBY_USING:
        output.push(`USING ${this.deparseNodes(node.useOp, context)}`);
        break;
      case SORTBYDIR_TYPES.SORTBY_DEFAULT:
        break;
      default:
        return fail('SortBy', node);
    }

    if (node.sortby_nulls === SORTBYNULLS_TYPES.SORTBY_NULLS_FIRST) {
      output.push('NULLS FIRST');
    }

    if (node.sortby_nulls === SORTBYNULLS_TYPES.SORTBY_NULLS_LAST) {
      output.push('NULLS LAST');
    }

    return output.join(' ');
  }

  ['ObjectWithArgs'](node, context = {}) {
    const output = [];

    if (context === 'noquotes') {
      output.push(this.list(node.objname, ', ', '', context));
    } else {
      output.push(this.listQuotes(node.objname, '.'));
    }
    if (node.objargs && node.objargs.length) {
      output.push('(');
      output.push(
        node.objargs
          .map((arg) => {
            if (arg === null) {
              return 'NONE';
            }
            return this.deparse(arg, context);
          })
          .join(',')
      );
      output.push(')');
    }

    return output.join(' ');
  }

  ['String'](node) {
    return node.str;
  }

  ['SubLink'](node, context = {}) {
    switch (true) {
      case node.subLinkType === 0:
        return format('EXISTS (%s)', this.deparse(node.subselect, context));
      case node.subLinkType === 1:
        return format(
          '%s %s ALL (%s)',
          this.deparse(node.testexpr, context),
          this.deparse(node.operName[0], context),
          this.deparse(node.subselect, context)
        );
      case node.subLinkType === 2 && !(node.operName != null):
        return format(
          '%s IN (%s)',
          this.deparse(node.testexpr, context),
          this.deparse(node.subselect, context)
        );
      case node.subLinkType === 2:
        return format(
          '%s %s ANY (%s)',
          this.deparse(node.testexpr, context),
          this.deparse(node.operName[0], context),
          this.deparse(node.subselect, context)
        );
      case node.subLinkType === 3:
        return format(
          '%s %s (%s)',
          this.deparse(node.testexpr, context),
          this.deparse(node.operName[0], context),
          this.deparse(node.subselect, context)
        );
      case node.subLinkType === 4:
        return format('(%s)', this.deparse(node.subselect, context));
      case node.subLinkType === 5:
        // TODO(zhm) what is this?
        return fail('SubLink', node);
      // MULTIEXPR_SUBLINK
      // format('(%s)', @deparse(node.subselect))
      case node.subLinkType === 6:
        return format('ARRAY (%s)', this.deparse(node.subselect, context));
      default:
        return fail('SubLink', node);
    }
  }

  ['TypeCast'](node, context = {}) {
    const type = this.deparse(node.typeName, context);
    let arg = this.deparse(node.arg, context);

    if (dotty.exists(node, 'arg.A_Expr')) {
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

  ['TypeName'](node, context = {}) {
    if (_.last(node.names).String.str === 'interval') {
      return this.deparseInterval(node);
    }

    const output = [];

    if (node.setof) {
      output.push('SETOF');
    }

    let args = null;

    if (node.typmods != null) {
      args = node.typmods.map((item) => {
        return this.deparse(item, context);
      });
    }

    const type = [];

    type.push(this.type(node.names, args && args.join(', ')));

    if (node.arrayBounds != null) {
      type.push('[]');
    }

    output.push(type.join(''));

    return output.join(' ');
  }

  ['CaseWhen'](node, context = {}) {
    const output = ['WHEN'];

    output.push(this.deparse(node.expr, context));
    output.push('THEN');
    output.push(this.deparse(node.result, context));

    return output.join(' ');
  }

  ['WindowDef'](node, context = {}) {
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

      const clause = node.partitionClause.map((item) =>
        this.deparse(item, context)
      );

      partition.push(clause.join(', '));

      windowParts.push(partition.join(' '));
      useParens = true;
    }

    if (node.orderClause) {
      windowParts.push('ORDER BY');

      const orders = node.orderClause.map((item) => {
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

  ['WithClause'](node, context = {}) {
    const output = ['WITH'];

    if (node.recursive) {
      output.push('RECURSIVE');
    }

    output.push(this.list(node.ctes, ', ', '', context));

    return output.join(' ');
  }

  deparseFrameOptions(options, refName, startOffset, endOffset) {
    const FRAMEOPTION_NONDEFAULT = 0x00001; // any specified?
    const FRAMEOPTION_RANGE = 0x00002; // RANGE behavior
    const FRAMEOPTION_ROWS = 0x00004; // ROWS behavior
    const FRAMEOPTION_BETWEEN = 0x00008; // BETWEEN given?
    const FRAMEOPTION_START_UNBOUNDED_PRECEDING = 0x00010; // start is U. P.
    const FRAMEOPTION_END_UNBOUNDED_PRECEDING = 0x00020; // (disallowed)
    const FRAMEOPTION_START_UNBOUNDED_FOLLOWING = 0x00040; // (disallowed)
    const FRAMEOPTION_END_UNBOUNDED_FOLLOWING = 0x00080; // end is U. F.
    const FRAMEOPTION_START_CURRENT_ROW = 0x00100; // start is C. R.
    const FRAMEOPTION_END_CURRENT_ROW = 0x00200; // end is C. R.
    const FRAMEOPTION_START_VALUE_PRECEDING = 0x00400; // start is V. P.
    const FRAMEOPTION_END_VALUE_PRECEDING = 0x00800; // end is V. P.
    const FRAMEOPTION_START_VALUE_FOLLOWING = 0x01000; // start is V. F.
    const FRAMEOPTION_END_VALUE_FOLLOWING = 0x02000; // end is V. F.

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

    if (options & FRAMEOPTION_START_VALUE_PRECEDING) {
      output.push(this.deparse(startOffset) + ' PRECEDING');
    }

    if (options & FRAMEOPTION_START_VALUE_FOLLOWING) {
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

      if (options & FRAMEOPTION_END_VALUE_PRECEDING) {
        output.push(this.deparse(endOffset) + ' PRECEDING');
      }

      if (options & FRAMEOPTION_END_VALUE_FOLLOWING) {
        output.push(this.deparse(endOffset) + ' FOLLOWING');
      }
    }

    return output.join(' ');
  }

  deparseInterval(node) {
    const type = ['interval'];

    if (node.arrayBounds != null) {
      type.push('[]');
    }

    if (node.typmods) {
      const typmods = node.typmods.map((item) => this.deparse(item));

      let intervals = this.interval(typmods[0]);

      // SELECT interval(0) '1 day 01:23:45.6789'
      if (
        node.typmods[0] &&
        node.typmods[0].A_Const &&
        node.typmods[0].A_Const.val.Integer.ival === 32767 &&
        node.typmods[1] &&
        node.typmods[1].A_Const != null
      ) {
        intervals = [`(${node.typmods[1].A_Const.val.Integer.ival})`];
      } else {
        intervals = intervals.map((part) => {
          if (part === 'second' && typmods.length === 2) {
            return 'second(' + _.last(typmods) + ')';
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
      this.BITS = _.invert(this.MASKS);
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
