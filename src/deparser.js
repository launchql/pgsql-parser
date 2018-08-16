import _ from 'lodash';
import { format } from 'util';
import { objtypeName, objtypeIs } from './types';
const dotty = require('dotty');

const CONSTRAINT_TYPES = [
  'NULL',
  'NOT NULL',
  'DEFAULT',
  null,
  'CHECK',
  'PRIMARY KEY',
  'UNIQUE',
  'EXCLUDE',
  'REFERENCES'
];

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

const isReserved = (value) =>
  RESERVED_WORDS.includes(value.toLowerCase());

// usually the AST lowercases all the things, so if we
// have both, the author most likely used double quotes
const needsQuotes = (value) =>
  value.match(/([a-z]+[A-Z]+|[A-Z]+[a-z]+)/);

const { keys } = _;

const compact = o => {
  return _.filter(_.compact(o), (p) => {
    if (p == null) {
      return false;
    }

    return p.toString().length;
  });
};

const fail = (type, node) => {
  throw new Error(format('Unhandled %s node: %s', type, JSON.stringify(node)));
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
    return (this.tree.map(node => `${this.deparse(node)};`)).join('\n\n');
  }

  deparseNodes(nodes, context) {
    return nodes.map(node => {
      return _.isArray(node) ? this.list(node) : this.deparse(node, context);
    });
  }

  list(nodes, separator = ', ') {
    if (!nodes) {
      return '';
    }

    return this.deparseNodes(nodes).join(separator);
  }

  listQuotes(nodes, separator = ', ') {
    return this.list(nodes, separator).split(separator).map(a => this.quote(a.trim())).join(separator);
  }

  quote(value) {
    if (value == null) {
      return null;
    }

    if (_.isArray(value)) {
      return value.map(o => this.quote(o));
    }

    return '"' + value + '"';
  }

  quoteIfNeeded(value) {
    if (value == null) {
      return null;
    }

    if (_.isArray(value)) {
      return value.map(o => this.quoteIfNeeded(o));
    }

    if (isReserved(value)) {
      return '"' + value + '"';
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

  convertTypeName(typeName, size) {
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
      case 'real': case 'float4':
        return 'real';
      case 'float8':
        return 'pg_catalog.float8';
      case 'text':
        // SELECT EXTRACT(CENTURY FROM CURRENT_DATE)>=21 AS True
        return 'pg_catalog.text';
      case 'date':
        return 'pg_catalog.date';
      case 'time':
        return 'time';
      case 'timetz':
        return 'pg_catalog.timetz';
      case 'timestamp':
        return 'timestamp';
      case 'timestamptz':
        return 'pg_catalog.timestamptz';
      case 'interval':
        return 'interval';
      case 'bit':
        return 'bit';
      default:
        throw new Error(format('Unhandled data type: %s', typeName));
    }
  }

  type(names, args) {
    const [ catalog, type ] = names.map(name => this.deparse(name));

    const mods = (name, size) => {
      if (size != null) {
        return name + '(' + size + ')';
      }

      return name;
    };

    // handle the special "char" (in quotes) type
    if (names[0].String.str === 'char') {
      names[0].String.str = '"char"';
    }

    if (catalog !== 'pg_catalog') {
      return mods(this.list(names, '.'), args);
    }

    const res = this.convertTypeName(type, args);

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

  ['RawStmt'](node) {
    return this.deparse(node.stmt);
  }

  ['A_Expr'](node, context) {
    const output = [];

    switch (node.kind) {
      case 0: // AEXPR_OP
        if (node.lexpr) {
          output.push(parens(this.deparse(node.lexpr)));
        }

        if (node.name.length > 1) {
          const schema = this.deparse(node.name[0]);
          const operator = this.deparse(node.name[1]);
          output.push(`OPERATOR(${schema}.${operator})`);
        } else {
          output.push(this.deparse(node.name[0], context));
        }

        if (node.rexpr) {
          output.push(parens(this.deparse(node.rexpr, context)));
        }

        if (output.length === 2) {
          return parens(output.join(''));
        }

        return parens(output.join(' '));

      case 1: // AEXPR_OP_ANY
        output.push(this.deparse(node.lexpr));
        output.push(format('ANY (%s)', this.deparse(node.rexpr, context)));
        return output.join(` ${this.deparse(node.name[0], context)} `);

      case 2: // AEXPR_OP_ALL
        output.push(this.deparse(node.lexpr, context));
        output.push(format('ALL (%s)', this.deparse(node.rexpr, context)));
        return output.join(` ${this.deparse(node.name[0], context)} `);

      case 3: // AEXPR_DISTINCT
        return format('%s IS DISTINCT FROM %s', this.deparse(node.lexpr, context), this.deparse(node.rexpr, context));

      case 4: // AEXPR_NULLIF
        return format('NULLIF(%s, %s)', this.deparse(node.lexpr, context), this.deparse(node.rexpr, context));

      case 5: { // AEXPR_OF
        const op = node.name[0].String.str === '=' ? 'IS OF' : 'IS NOT OF';
        return format('%s %s (%s)', this.deparse(node.lexpr, context), op, this.list(node.rexpr, context));
      }

      case 6: { // AEXPR_IN
        const operator = node.name[0].String.str === '=' ? 'IN' : 'NOT IN';

        return format('%s %s (%s)', this.deparse(node.lexpr, context), operator, this.list(node.rexpr, context));
      }

      case 7:
        return fail('A_Expr', node);

      case 8:
        output.push(this.deparse(node.lexpr, context));

        if (node.name[0].String.str === '!~~') {
          output.push(format('NOT LIKE (%s)', this.deparse(node.rexpr, context)));
        } else {
          output.push(format('LIKE (%s)', this.deparse(node.rexpr, context)));
        }

        return output.join(' ');

      case 9:

        output.push(this.deparse(node.lexpr, context));

        if (node.name[0].String.str === '!~~*') {
          output.push(format('NOT ILIKE (%s)', this.deparse(node.rexpr, context)));
        } else {
          output.push(format('ILIKE (%s)', this.deparse(node.rexpr, context)));
        }

        return output.join(' ');

      case 10:
        // SIMILAR TO emits a similar_escape FuncCall node with the first argument
        output.push(this.deparse(node.lexpr, context));

        if (node.name[0].String.str === '!~') {
          if (this.deparse(node.rexpr.FuncCall.args[1].Null, context)) {
            output.push(format('NOT SIMILAR TO %s', this.deparse(node.rexpr.FuncCall.args[0], context)));
          } else {
            output.push(format('NOT SIMILAR TO %s ESCAPE %s',
                               this.deparse(node.rexpr.FuncCall.args[0], context),
                               this.deparse(node.rexpr.FuncCall.args[1], context)));
          }
        } else if (this.deparse(node.rexpr.FuncCall.args[1].Null, context)) {
          output.push(format('SIMILAR TO %s', this.deparse(node.rexpr.FuncCall.args[0], context)));
        } else {
          output.push(format('SIMILAR TO %s ESCAPE %s',
                             this.deparse(node.rexpr.FuncCall.args[0], context),
                             this.deparse(node.rexpr.FuncCall.args[1], context)));
        }

        return output.join(' ');

      case 11:
        output.push(this.deparse(node.lexpr, context));
        output.push(format('BETWEEN %s AND %s', this.deparse(node.rexpr[0], context), this.deparse(node.rexpr[1], context)));
        return output.join(' ');

      case 12:
        output.push(this.deparse(node.lexpr, context));
        output.push(format('NOT BETWEEN %s AND %s', this.deparse(node.rexpr[0], context), this.deparse(node.rexpr[1], context)));
        return output.join(' ');

      default:
        return fail('A_Expr', node);
    }
  }

  ['Alias'](node, context) {
    const name = node.aliasname;

    const output = [ 'AS' ];

    if (node.colnames) {
      output.push(name + parens(this.list(node.colnames)));
    } else {
      output.push(this.quote(name));
    }

    return output.join(' ');
  }

  ['A_ArrayExpr'](node) {
    return format('ARRAY[%s]', this.list(node.elements));
  }

  ['A_Const'](node, context) {
    if (node.val.String) {
      return this.escape(this.deparse(node.val, context));
    }

    return this.deparse(node.val, context);
  }

  ['A_Indices'](node) {
    if (node.lidx) {
      return format('[%s:%s]', this.deparse(node.lidx), this.deparse(node.uidx));
    }

    return format('[%s]', this.deparse(node.uidx));
  }

  ['A_Indirection'](node) {
    const output = [ `(${this.deparse(node.arg)})` ];

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
        output.push(this.deparse(subnode));
      }
    }

    return output.join('');
  }

  ['A_Star'](node, context) {
    return '*';
  }

  ['BitString'](node) {
    const prefix = node.str[0];
    return `${prefix}'${node.str.substring(1)}'`;
  }

  ['BoolExpr'](node) {
    switch (node.boolop) {
      case 0:
        return parens(this.list(node.args, ' AND '));
      case 1:
        return parens(this.list(node.args, ' OR '));
      case 2:
        return format('NOT (%s)', this.deparse(node.args[0]));
      default:
        return fail('BoolExpr', node);
    }
  }

  ['BooleanTest'](node) {
    const output = [];

    output.push(this.deparse(node.arg));

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

  ['CaseExpr'](node) {
    const output = [ 'CASE' ];

    if (node.arg) {
      output.push(this.deparse(node.arg));
    }

    for (let i = 0; i < node.args.length; i++) {
      output.push(this.deparse(node.args[i]));
    }

    if (node.defresult) {
      output.push('ELSE');
      output.push(this.deparse(node.defresult));
    }

    output.push('END');

    return output.join(' ');
  }

  ['CoalesceExpr'](node) {
    return format('COALESCE(%s)', this.list(node.args));
  }

  ['CollateClause'](node) {
    const output = [];

    if (node.arg) {
      output.push(this.deparse(node.arg));
    }

    output.push('COLLATE');

    if (node.collname) {
      output.push(this.quote(this.deparseNodes(node.collname)));
    }

    return output.join(' ');
  }

  ['CompositeTypeStmt'](node) {
    const output = [ ];

    output.push('CREATE TYPE');
    output.push(this.deparse(node.typevar));
    output.push('AS');
    output.push('(');
    output.push(this.list(node.coldeflist));
    output.push(')');

    return output.join(' ');
  }

  ['RenameStmt'](node) {
    const output = [ ];

    if (!objtypeIs(node.renameType, 'OBJECT_COLUMN')) {
      throw new Error('renameType not yet implemented');
    }
    if (!objtypeIs(node.relationType, 'OBJECT_TABLE')) {
      throw new Error('relationType not yet implemented');
    }

    output.push('ALTER');
    output.push('TABLE');
    output.push(this.deparse(node.relation));
    output.push('RENAME');
    output.push('COLUMN');
    output.push(node.subname);
    output.push('TO');
    output.push(node.newname);

    return output.join(' ');
  }

  ['ColumnDef'](node) {
    const output = [ this.quote(node.colname) ];

    output.push(this.deparse(node.typeName));

    if (node.raw_default) {
      output.push('USING');
      output.push(this.deparse(node.raw_default));
    }

    if (node.constraints) {
      output.push(this.list(node.constraints, ' '));
    }

    if (node.collClause) {
      output.push('COLLATE');
      const str = dotty.get(node, 'collClause.CollateClause.collname.0.String.str');
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

  ['ColumnRef'](node, context) {
    const KEYWORDS = [ 'old', 'new' ];
    const fields = node.fields.map(field => {
      if (field.String) {
        const value = this.deparse(field);
        if (context === 'trigger' && KEYWORDS.includes(value.toLowerCase())) {
          return value.toUpperCase();
        }
        return this.quote(value);
      }

      return this.deparse(field);
    });
    return fields.join('.');
  }

  ['CommentStmt'](node) {
    const output = [];

    output.push('COMMENT');
    output.push('ON');
    output.push(objtypeName(node.objtype));

    if (objtypeIs(node.objtype, 'OBJECT_CAST')) {
      output.push('(');
      output.push(this.deparse(node.object[0]));
      output.push('AS');
      output.push(this.deparse(node.object[1]));
      output.push(')');
    } else if (objtypeIs(node.objtype, 'OBJECT_DOMCONSTRAINT')) {
      output.push(this.deparse(node.object[1]));
      output.push('ON');
      output.push('DOMAIN');
      output.push(this.deparse(node.object[0]));
    } else if (objtypeIs(node.objtype, 'OBJECT_OPCLASS') || objtypeIs(node.objtype, 'OBJECT_OPFAMILY')) {
      output.push(this.deparse(node.object[1]));
      output.push('USING');
      output.push(this.deparse(node.object[0]));
    } else if (objtypeIs(node.objtype, 'OBJECT_OPERATOR')) {
      output.push(this.deparse(node.object, 'noquotes'));
    } else if (objtypeIs(node.objtype, 'OBJECT_POLICY')) {
      output.push(this.deparse(node.object[1]));
      output.push('ON');
      output.push(this.deparse(node.object[0]));
    } else if (objtypeIs(node.objtype, 'OBJECT_ROLE')) {
      output.push(this.deparse(node.object));
    } else if (objtypeIs(node.objtype, 'OBJECT_RULE')) {
      output.push(this.deparse(node.object[1]));
      output.push('ON');
      output.push(this.deparse(node.object[0]));
    } else if (objtypeIs(node.objtype, 'OBJECT_TABCONSTRAINT')) {
      output.push(this.deparse(node.object[1]));
      output.push('ON');
      output.push(this.deparse(node.object[0]));
    } else if (objtypeIs(node.objtype, 'OBJECT_TRANSFORM')) {
      output.push('FOR');
      output.push(this.deparse(node.object[0]));
      output.push('LANGUAGE');
      output.push(this.deparse(node.object[1]));
    } else if (objtypeIs(node.objtype, 'OBJECT_TRIGGER')) {
      output.push(this.deparse(node.object[1]));
      output.push('ON');
      output.push(this.deparse(node.object[0]));
    } else {
      if (objtypeIs(node.objtype, 'OBJECT_LARGEOBJECT')) {
        output.push(dotty.get(node, 'object.Integer.ival'));
      } else if (node.object instanceof Array) {
        output.push(this.listQuotes(node.object, '.'));
      } else {
        output.push(this.deparse(node.object));
      }

      if (node.objargs) {
        output.push('(');
        output.push(this.list(node.objargs));
        output.push(')');
      }
    }

    output.push('IS');

    if (node.comment) {
      output.push(`E'${node.comment}'`);
    } else {
      output.push('NULL');
    }

    return output.join(' ');
  }

  ['CommonTableExpr'](node) {
    const output = [];

    output.push(node.ctename);

    if (node.aliascolnames) {
      output.push(format('(%s)', this.quote(this.deparseNodes(node.aliascolnames))));
    }

    output.push(format('AS (%s)', this.deparse(node.ctequery)));

    return output.join(' ');
  }

  ['DefElem'](node) {
    if (node.defname === 'transaction_isolation') {
      return format('ISOLATION LEVEL %s', node.arg.A_Const.val.String.str.toUpperCase());
    }

    if (node.defname === 'transaction_read_only') {
      return node.arg.A_Const.val.Integer.ival === 0 ? 'READ WRITE' : 'READ ONLY';
    }

    if (node.defname === 'transaction_deferrable') {
      return node.arg.A_Const.val.Integer.ival === 0 ? 'NOT DEFERRABLE' : 'DEFERRABLE';
    }

    if (node.defname === 'set') {
      return this.deparse(node.arg);
    }

    let name = node.defname;
    if (node.defnamespace) {
      name = `${node.defnamespace}.${node.defname}`;
    }

    if (node.arg) {
      return `${name} = ${this.deparse(node.arg)}`;
    }
    return name;
  }

  ['DoStmt'](node) {
    return `DO $$\n  ${dotty.get(node, 'args.0.DefElem.arg.String.str').trim()} $$`;
  }

  ['Float'](node) {
    // wrap negative numbers in parens, SELECT (-2147483648)::int4 * (-1)::int4
    if (node.str[0] === '-') {
      return `(${node.str})`;
    }

    return node.str;
  }

  ['FuncCall'](node, context) {
    const output = [];

    let params = [];

    if (node.args) {
      params = node.args.map(item => {
        return this.deparse(item);
      });
    }

    // COUNT(*)
    if (node.agg_star) {
      params.push('*');
    }

    const name = this.list(node.funcname, '.');

    const order = [];

    const withinGroup = node.agg_within_group;

    if (node.agg_order) {
      order.push('ORDER BY');
      order.push(this.list(node.agg_order, ', '));
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
      output.push(format('FILTER (WHERE %s)', this.deparse(node.agg_filter)));
    }

    if (node.over != null) {
      output.push(format('OVER %s', this.deparse(node.over)));
    }

    return output.join(' ');
  }

  ['GroupingFunc'](node) {
    return 'GROUPING(' + this.list(node.args) + ')';
  }

  ['GroupingSet'](node) {
    switch (node.kind) {
      case 0: // GROUPING_SET_EMPTY
        return '()';

      case 1: // GROUPING_SET_SIMPLE
        return fail('GroupingSet', node);

      case 2: // GROUPING_SET_ROLLUP
        return 'ROLLUP (' + this.list(node.content) + ')';

      case 3: // GROUPING_SET_CUBE
        return 'CUBE (' + this.list(node.content) + ')';

      case 4: // GROUPING_SET_SETS
        return 'GROUPING SETS (' + this.list(node.content) + ')';

      default:
        return fail('GroupingSet', node);
    }
  }

  ['Integer'](node, context) {
    if (node.ival < 0 && context !== 'simple') {
      return `(${node.ival})`;
    }

    return node.ival.toString();
  }

  ['IntoClause'](node) {
    return this.deparse(node.rel);
  }

  ['JoinExpr'](node, context) {
    const output = [];

    output.push(this.deparse(node.larg));

    if (node.isNatural) {
      output.push('NATURAL');
    }

    let join = null;

    switch (true) {
      case node.jointype === 0 && (node.quals != null):
        join = 'INNER JOIN';
        break;

      case node.jointype === 0 && !node.isNatural && !(node.quals != null) && !(node.usingClause != null):
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
      if ((node.rarg.JoinExpr != null) && !(node.rarg.JoinExpr.alias != null)) {
        output.push(`(${this.deparse(node.rarg)})`);
      } else {
        output.push(this.deparse(node.rarg));
      }
    }

    if (node.quals) {
      output.push(`ON ${this.deparse(node.quals)}`);
    }

    if (node.usingClause) {
      const using = this.quote(this.deparseNodes(node.usingClause)).join(', ');

      output.push(`USING (${using})`);
    }

    const wrapped =
      (node.rarg.JoinExpr != null) || node.alias ? '(' + output.join(' ') + ')' : output.join(' ');

    if (node.alias) {
      return wrapped + ' ' + this.deparse(node.alias);
    }

    return wrapped;
  }

  ['LockingClause'](node) {
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
      output.push(this.list(node.lockedRels));
    }

    return output.join(' ');
  }

  ['MinMaxExpr'](node) {
    const output = [];

    if (node.op === 0) {
      output.push('GREATEST');
    } else {
      output.push('LEAST');
    }

    output.push(parens(this.list(node.args)));

    return output.join('');
  }

  ['NamedArgExpr'](node) {
    const output = [];

    output.push(node.name);
    output.push(':=');
    output.push(this.deparse(node.arg));

    return output.join(' ');
  }

  ['Null'](node) {
    return 'NULL';
  }

  ['NullTest'](node) {
    const output = [ this.deparse(node.arg) ];

    if (node.nulltesttype === 0) {
      output.push('IS NULL');
    } else if (node.nulltesttype === 1) {
      output.push('IS NOT NULL');
    }

    return output.join(' ');
  }

  ['ParamRef'](node) {
    if (node.number >= 0) {
      return [ '$', node.number ].join('');
    }
    return '?';
  }

  ['RangeFunction'](node) {
    const output = [];

    if (node.lateral) {
      output.push('LATERAL');
    }

    const funcs = [];

    for (let i = 0; i < node.functions.length; i++) {
      const funcCall = node.functions[i];
      const call = [ this.deparse(funcCall[0]) ];

      if (funcCall[1] && funcCall[1].length) {
        call.push(format('AS (%s)', this.list(funcCall[1])));
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
      output.push(this.deparse(node.alias));
    }

    if (node.coldeflist) {
      const defList = this.list(node.coldeflist);

      if (!node.alias) {
        output.push(` AS (${defList})`);
      } else {
        output.push(`(${defList})`);
      }
    }

    return output.join(' ');
  }

  ['RangeSubselect'](node, context) {
    let output = '';

    if (node.lateral) {
      output += 'LATERAL ';
    }

    output += parens(this.deparse(node.subquery));

    if (node.alias) {
      return output + ' ' + this.deparse(node.alias);
    }

    return output;
  }

  ['RangeTableSample'](node) {
    const output = [];

    output.push(this.deparse(node.relation));
    output.push('TABLESAMPLE');
    output.push(this.deparse(node.method[0]));

    if (node.args) {
      output.push(parens(this.list(node.args)));
    }

    if (node.repeatable) {
      output.push('REPEATABLE(' + this.deparse(node.repeatable) + ')');
    }

    return output.join(' ');
  }

  ['RangeVar'](node, context) {
    const output = [];

    if (node.inhOpt === 0) {
      output.push('ONLY');
    }

    if (node.relpersistence === 'u') {
      output.push('UNLOGGED');
    }

    if (node.relpersistence === 't') {
      output.push('TEMPORARY TABLE');
    }

    if (node.schemaname != null) {
      output.push(`${this.quoteIfNeeded(node.schemaname)}.${this.quoteIfNeeded(node.relname)}`);
    } else {
      output.push(this.quoteIfNeeded(node.relname));
    }

    if (node.alias) {
      output.push(this.deparse(node.alias));
    }

    return output.join(' ');
  }

  ['ResTarget'](node, context) {
    if (context === 'select') {
      return compact([ this.deparse(node.val), this.quote(node.name) ]).join(' AS ');
    } else if (context === 'update') {
      return compact([ node.name, this.deparse(node.val) ]).join(' = ');
    } else if (!(node.val != null)) {
      return this.quote(node.name);
    }

    return fail('ResTarget', node);
  }

  ['RowExpr'](node) {
    if (node.row_format === 2) {
      return parens(this.list(node.args));
    }

    return format('ROW(%s)', this.list(node.args));
  }

  ['SelectStmt'](node, context) {
    const output = [];

    if (node.withClause) {
      output.push(this.deparse(node.withClause));
    }

    if (node.op === 0) {
      // VALUES select's don't get SELECT
      if (node.valuesLists == null) {
        output.push('SELECT');
      }
    } else {
      output.push(parens(this.deparse(node.larg)));

      const sets = [
        'NONE',
        'UNION',
        'INTERSECT',
        'EXCEPT'
      ];

      output.push(sets[node.op]);

      if (node.all) {
        output.push('ALL');
      }

      output.push(parens(this.deparse(node.rarg)));
    }

    if (node.distinctClause) {
      if (node.distinctClause[0] != null) {
        output.push('DISTINCT ON');

        const clause = (node.distinctClause.map(e => this.deparse(e, 'select'))).join(',\n');

        output.push(`(${clause})`);
      } else {
        output.push('DISTINCT');
      }
    }

    if (node.targetList) {
      output.push(indent((node.targetList.map(e => this.deparse(e, 'select'))).join(',\n')));
    }

    if (node.intoClause) {
      output.push('INTO');
      output.push(indent(this.deparse(node.intoClause)));
    }

    if (node.fromClause) {
      output.push('FROM');
      output.push(indent((node.fromClause.map(e => this.deparse(e, 'from'))).join(',\n')));
    }

    if (node.whereClause) {
      output.push('WHERE');
      output.push(indent(this.deparse(node.whereClause)));
    }

    if (node.valuesLists) {
      output.push('VALUES');

      const lists = node.valuesLists.map(list => {
        return `(${(list.map(v => this.deparse(v))).join(', ')})`;
      });

      output.push(lists.join(', '));
    }

    if (node.groupClause) {
      output.push('GROUP BY');
      output.push(indent((node.groupClause.map(e => this.deparse(e, 'group'))).join(',\n')));
    }

    if (node.havingClause) {
      output.push('HAVING');
      output.push(indent(this.deparse(node.havingClause)));
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
      output.push(indent((node.sortClause.map(e => this.deparse(e, 'sort'))).join(',\n')));
    }

    if (node.limitCount) {
      output.push('LIMIT');
      output.push(indent(this.deparse(node.limitCount)));
    }

    if (node.limitOffset) {
      output.push('OFFSET');
      output.push(indent(this.deparse(node.limitOffset)));
    }

    if (node.lockingClause) {
      node.lockingClause.forEach(item => {
        return output.push(this.deparse(item));
      });
    }

    return output.join(' ');
  }

  ['AlterTableStmt'](node) {
    const output = [];
    output.push('ALTER');
    if (node.relkind === 32) {
      output.push('TABLE');
    } else if (node.relkind === 42) {
      output.push('VIEW');
    } else if (node.relkind === 40) {
      output.push('TYPE');
    } else {
      output.push('TABLE');
    }
    if (node.missing_ok) {
      output.push('IF EXISTS');
    }
    output.push(this.deparse(node.relation));
    output.push(this.list(node.cmds));

    return output.join(' ');
  }

  ['AlterTableCmd'](node) {
    const output = [];

    if (node.subtype === 0) {
      output.push('ADD COLUMN');
      output.push(this.quote(node.name));
      output.push(this.deparse(node.def));
    }

    if (node.subtype === 3) {
      output.push('ALTER COLUMN');
      output.push(this.quote(node.name));
      if (node.def) {
        output.push('SET DEFAULT');
        output.push(this.deparse(node.def));
      } else {
        output.push('DROP DEFAULT');
      }
    }

    if (node.subtype === 4) {
      output.push('ALTER COLUMN');
      output.push(this.quote(node.name));
      output.push('DROP NOT NULL');
    }

    if (node.subtype === 5) {
      output.push('ALTER COLUMN');
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
      output.push('ALTER COLUMN');
      output.push(this.quote(node.name));
      output.push('SET');
      output.push('(');
      output.push(this.list(node.def));
      output.push(')');
    }

    if (node.subtype === 9) {
      output.push('ALTER');
      output.push(this.quote(node.name));
      output.push('SET STORAGE');
      if (node.def) {
        output.push(this.deparse(node.def));
      } else {
        output.push('PLAIN');
      }
    }

    if (node.subtype === 10) {
      output.push('DROP');
      if (node.missing_ok) {
        output.push('IF EXISTS');
      }
      output.push(this.quote(node.name));
    }

    if (node.subtype === 14) {
      // output.push('ADD CONSTRAINT');
      output.push('ADD');
      output.push(this.deparse(node.def));
    }

    if (node.subtype === 18) {
      output.push('VALIDATE CONSTRAINT');
      output.push(this.quote(node.name));
    }

    if (node.subtype === 22) {
      output.push('DROP CONSTRAINT');
      if (node.missing_ok) {
        output.push('IF EXISTS');
      }
      output.push(this.quote(node.name));
    }

    if (node.subtype === 25) {
      output.push('ALTER COLUMN');
      output.push(this.quote(node.name));
      output.push('TYPE');
      output.push(this.deparse(node.def));
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
      output.push(this.list(node.def));
      output.push(')');
    }

    if (node.subtype === 37) {
      output.push('RESET');
      output.push('(');
      output.push(this.list(node.def));
      output.push(')');
    }

    if (node.subtype === 51) {
      output.push('INHERIT');
      output.push(this.deparse(node.def));
    }

    if (node.subtype === 52) {
      output.push('NO INHERIT');
      output.push(this.deparse(node.def));
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
      node.options.forEach(opt => {
        if (opt.DefElem.defname === 'cascade' && opt.DefElem.arg.Integer.ival === 1) {
          output.push('CASCADE');
        }
      });
    }
    return output.join(' ');
  }

  ['DropStmt'](node) {
    const output = [];
    output.push('DROP');
    output.push(objtypeName(node.removeType));
    if (node.missing_ok) {
      output.push('IF EXISTS');
    }
    output.push(this.listQuotes(node.objects));
    if (node.behavior) {
      output.push('CASCADE');
    }
    return output.join(' ');
  }

  ['CreatePolicyStmt'](node) {
    const output = [];
    output.push('CREATE POLICY');
    output.push(this.quote(node.policy_name));
    if (node.table) {
      output.push('ON');
      output.push(this.deparse(node.table));
    }
    if (node.cmd_name) {
      output.push('FOR');
      output.push(node.cmd_name.toUpperCase());
    }
    output.push('TO');
    output.push(this.list(node.roles));
    output.push('USING');
    output.push(this.deparse(node.qual));
    return output.join(' ');
  }

  ['CreateTrigStmt'](node) {
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
      output.push(this.list(node.columns));
    }

    // ON
    output.push('ON');
    output.push(this.deparse(node.relation));
    output.push('\n');

    if (node.transitionRels) {
      output.push('REFERENCING');
      node.transitionRels.forEach(({TriggerTransition}) => {
        if (TriggerTransition.isNew === true && TriggerTransition.isTable === true) {
          output.push(`NEW TABLE AS ${TriggerTransition.name}`);
        } else if (TriggerTransition.isNew !== true && TriggerTransition.isTable === true) {
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
    args = args.map(arg => {
      if (dotty.exists(arg, 'String.str')) {
        return `'${dotty.get(arg, 'String.str')}'`;
      }
      return this.deparse(arg);
    }).filter(a => a);
    output.push(args.join(','));
    output.push(')');

    return output.join(' ');
  }

  ['CreateStmt'](node) {
    const output = [];
    const relpersistence = dotty.get(node, 'relation.RangeVar.relpersistence');
    if (relpersistence === 't') {
      output.push('CREATE');
    } else {
      output.push('CREATE TABLE');
    }

    output.push(this.deparse(node.relation));
    output.push('(');
    output.push(this.list(node.tableElts));
    output.push(')');

    if (relpersistence === 'p' && node.hasOwnProperty('inhRelations')) {
      output.push('INHERITS');
      output.push('(');
      output.push(this.list(node.inhRelations));
      output.push(')');
    }

    if (node.options) {
      node.options.forEach(opt => {
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
    const constraint = CONSTRAINT_TYPES[node.contype];
    if (node.conname) {
      output.push('CONSTRAINT');
      output.push(node.conname);
      if (!node.pktable) {
        output.push(constraint);
      }
    } else {
      output.push(constraint);
    }
    return output.join(' ');
  }

  ['ReferenceConstraint'](node) {
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
      output.push(this.deparse(node.pktable));
      output.push('(');
      output.push(this.listQuotes(node.pk_attrs));
      output.push(')');
    } else if (node.pk_attrs) {
      output.push(this.ConstraintStmt(node));
      output.push(this.deparse(node.pktable));
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
      output.push(this.deparse(node.pktable));
    } else {
      output.push(this.ConstraintStmt(node));
      output.push(this.deparse(node.pktable));
    }
    return output.join(' ');
  }

  ['ExclusionConstraint'](node) {
    const output = [];
    function getExclusionGroup(nde) {
      const out = [];
      const a = nde.exclusions.map(excl => {
        if (excl[0].IndexElem.name) {
          return excl[0].IndexElem.name;
        }
        return excl[0].IndexElem.expr ? this.deparse(excl[0].IndexElem.expr) : null;
      });

      const b = nde.exclusions.map(excl => this.deparse(excl[1][0]));

      for (let i = 0; i < a.length; i++) {
        out.push(`${a[i]} WITH ${b[i]}`);
        if (i !== a.length - 1) {
          out.push(',');
        }
      }

      return out.join(' ');
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

  ['Constraint'](node) {
    const output = [];

    const constraint = CONSTRAINT_TYPES[node.contype];
    if (!constraint) {
      throw new Error('contraint type not implemented: ' + node.contype);
    }

    if (constraint === 'REFERENCES') {
      output.push(this.ReferenceConstraint(node));
    } else {
      output.push(this.ConstraintStmt(node));
    }

    if (node.keys) {
      output.push('(');
      output.push(this.listQuotes(node.keys));
      output.push(')');
    }

    if (node.raw_expr) {
      output.push('(');
      output.push(this.deparse(node.raw_expr));
      output.push(')');
    }

    if (node.fk_del_action) {
      switch (node.fk_del_action) {
        case 'r':
          output.push('ON DELETE RESTRICT');
          break;
        case 'c':
          output.push('ON DELETE CASCADE');
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

    if (constraint === 'EXCLUDE') {
      output.push(this.ExclusionConstraint(node));
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
      output.push(this.list(node.cols));
      output.push(')');
    }
    return output.join(' ');
  }

  ['VariableSetStmt'](node) {
    if (node.kind === 4) {
      return format('RESET %s', node.name);
    }

    if (node.kind === 3) {
      const name = {
        'TRANSACTION': 'TRANSACTION',
        'SESSION CHARACTERISTICS': 'SESSION CHARACTERISTICS AS TRANSACTION'
      }[node.name];

      return format('SET %s %s',
                    name,
                    this.deparseNodes(node.args, 'simple').join(', '));
    }

    if (node.kind === 1) {
      return format('SET %s TO DEFAULT', node.name);
    }

    return format('SET %s%s = %s',
                  node.is_local ? 'LOCAL ' : '',
                  node.name,
                  this.deparseNodes(node.args, 'simple').join(', '));
  }

  ['VariableShowStmt'](node) {
    return format('SHOW %s', node.name);
  }

  ['FuncWithArgs'](node) {
    const output = [];
    output.push(this.deparse(node.funcname[0]));
    output.push('(');
    output.push(this.list(node.funcargs));
    output.push(')');
    return output.join(' ');
  }

  ['FunctionParameter'](node) {
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
    output.push(this.deparse(node.argType));

    if (node.defexpr) {
      output.push('DEFAULT');
      output.push(this.deparse(node.defexpr));
    }

    return output.join(' ');
  }

  ['CreateFunctionStmt'](node) {
    const output = [];

    output.push('CREATE');
    if (node.replace) {
      output.push('OR REPLACE');
    }
    output.push('FUNCTION');

    output.push(node.funcname.map(name => this.deparse(name)).join('.'));
    output.push('(');
    let parameters = [];
    if (node.parameters) {
      parameters = [ ...node.parameters ];
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
      output.push(this.list(returns));
      output.push(')');
    } else if (node.returnType) {
      output.push('RETURNS');
      output.push(this.deparse(node.returnType));
    }

    node.options.forEach((option, i) => {
      if (option && option.DefElem) {
        let value = '';
        switch (option.DefElem.defname) {
          case 'as':
            value = this.deparse(option.DefElem.arg[0]);
            output.push(`AS $EOFCODE$${value}$EOFCODE$`);
            break;

          case 'language':
            value = this.deparse(option.DefElem.arg);
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
            if (
              dotty.get(option, 'DefElem.arg.VariableSetStmt.kind') === 2 &&
              dotty.get(option, 'DefElem.arg.VariableSetStmt.name') === 'search_path'
            ) {
              output.push('SET search_path FROM CURRENT');
            } else {
              output.push(this.deparse(option));
            }
            break;

          case 'volatility':
            value = this.deparse(option.DefElem.arg);
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
    if (node.roletype === 0) {
      return `"${node.rolename}"`;
    }
    if (node.roletype === 1) {
      return 'CURRENT_USER';
    }
    if (node.roletype === 2) {
      return 'SESSION_USER';
    }
    if (node.roletype === 3) {
      return 'PUBLIC';
    }
    return '';
  }

  ['GrantStmt'](node) {
    const output = [];

    const getTypeFromNode = (nodeObj) => {
      switch (nodeObj.objtype) {
        case 1:
          if (nodeObj.targtype === 1) {
            return 'ALL TABLES IN SCHEMA';
          }
          return 'TABLE';
        case 3:
          return 'DATABASE';
        case 4:
          return 'DOMAIN';
        case 5:
          return 'FOREIGN DATA WRAPPER';
        case 6:
          return 'FOREIGN SERVER';
        case 7:
          if (nodeObj.targtype === 1) {
            return 'ALL FUNCTIONS IN SCHEMA';
          }
          return 'FUNCTION';
        case 8:
          return 'LANGUAGE';
        case 9:
          return 'LARGE OBJECT';
        case 10:
          return 'SCHEMA';
        case 12:
          return 'TYPE';
        default:
      }
      return '';
    };

    if ([ 1, 3, 4, 5, 6, 7, 8, 9, 10, 12 ].includes(node.objtype)) {
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

  ['GrantRoleStmt'](node) {
    const output = [];

    if (!node.is_grant) {
      output.push('REVOKE');
      output.push(this.list(node.granted_roles));
      output.push('FROM');
      output.push(this.list(node.grantee_roles));
    } else {
      output.push('GRANT');
      output.push(this.list(node.granted_roles));
      output.push('TO');
      output.push(this.list(node.grantee_roles));
    }
    if (node.admin_opt) {
      output.push('WITH ADMIN OPTION');
    }

    return output.join(' ');
  }

  ['CreateRoleStmt'](node) {
    const output = [];

    const roleOption = (nodeObj, i, val1, val2) => {
      const val = Number(dotty.get(nodeObj, `options.${i}.DefElem.arg.Integer.ival`));
      if (val > 0) {
        output.push(val1);
      } else {
        output.push(val2);
      }
    };

    output.push('CREATE');
    if (Number(node.stmt_type) === 1) {
      output.push('USER');
    } else if (Number(node.stmt_type) === 2) {
      output.push('GROUP');
    } else {
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
            output.push(dotty.search(node, `options.${i}.DefElem.arg.*.RoleSpec.rolename`).join(','));
            break;
          case 'password':
            output.push('PASSWORD');
            value = dotty.get(node, `options.${i}.DefElem.arg.A_Const.val.String.str`);
            output.push(`'${value}'`);
            break;
          case 'adminmembers':
            output.push('ADMIN');
            output.push(this.list(node.options[i].DefElem.arg));
            break;
          case 'rolemembers':
            output.push('USER');
            output.push(this.list(node.options[i].DefElem.arg));
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

  ['TransactionStmt'](node) {
    const output = [];

    const begin = (nodeOpts) => {
      const opts = dotty.search(nodeOpts, 'options.*.DefElem.defname');
      if (opts.includes('transaction_read_only')) {
        const index = opts.indexOf('transaction_read_only');
        const obj = nodeOpts.options[index];
        let set = false;
        const flag = Number(this.deparse(dotty.get(obj, 'DefElem.arg')));
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
        const lopts = this.deparse(dotty.get(obj, 'DefElem.arg')).replace(/['"]+/g, '');
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
        const flag = Number(this.deparse(dotty.get(obj, 'DefElem.arg')));
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
      case 0:
        return begin(node);
      case 1:
        return start(node);
      case 2:
        return 'COMMIT';
      case 3:
        return 'ROLLBACK';
      case 4:
        output.push('SAVEPOINT');
        output.push(this.deparse(node.options[0].DefElem.arg));
        break;
      case 5:
        output.push('RELEASE SAVEPOINT');
        output.push(this.deparse(node.options[0].DefElem.arg));
        break;
      case 6:
        output.push('ROLLBACK TO');
        output.push(this.deparse(node.options[0].DefElem.arg));
        break;
      case 7:
        output.push('PREPARE TRANSACTION');
        output.push(`'${node.gid}'`);
        break;
      case 8:
        output.push('COMMIT PREPARED');
        output.push(`'${node.gid}'`);
        break;
      case 9:
        output.push('ROLLBACK PREPARED');
        output.push(`'${node.gid}'`);
        break;
      default:
    }
    return output.join(' ');
  }

  ['SortBy'](node) {
    const output = [];

    output.push(this.deparse(node.node));

    if (node.sortby_dir === 1) {
      output.push('ASC');
    }

    if (node.sortby_dir === 2) {
      output.push('DESC');
    }

    if (node.sortby_dir === 3) {
      output.push(`USING ${this.deparseNodes(node.useOp)}`);
    }

    if (node.sortby_nulls === 1) {
      output.push('NULLS FIRST');
    }

    if (node.sortby_nulls === 2) {
      output.push('NULLS LAST');
    }

    return output.join(' ');
  }

  ['ObjectWithArgs'](node, context) {
    const output = [];

    if (context === 'noquotes') {
      output.push(this.list(node.objname));
    } else {
      output.push(this.listQuotes(node.objname, '.'));
    }
    if (node.objargs && node.objargs.length) {
      output.push('(');
      output.push(node.objargs.map(arg => {
        if (arg === null) {
          return 'NONE';
        }
        return this.deparse(arg);
      }).join(','));
      output.push(')');
    }

    return output.join(' ');
  }

  ['String'](node) {
    return node.str;
  }

  ['SubLink'](node) {
    switch (true) {
      case node.subLinkType === 0:
        return format('EXISTS (%s)', this.deparse(node.subselect));
      case node.subLinkType === 1:
        return format('%s %s ALL (%s)', this.deparse(node.testexpr), this.deparse(node.operName[0]), this.deparse(node.subselect));
      case node.subLinkType === 2 && !(node.operName != null):
        return format('%s IN (%s)', this.deparse(node.testexpr), this.deparse(node.subselect));
      case node.subLinkType === 2:
        return format('%s %s ANY (%s)', this.deparse(node.testexpr), this.deparse(node.operName[0]), this.deparse(node.subselect));
      case node.subLinkType === 3:
        return format('%s %s (%s)', this.deparse(node.testexpr), this.deparse(node.operName[0]), this.deparse(node.subselect));
      case node.subLinkType === 4:
        return format('(%s)', this.deparse(node.subselect));
      case node.subLinkType === 5:
        // TODO(zhm) what is this?
        return fail('SubLink', node);
        // MULTIEXPR_SUBLINK
        // format('(%s)', @deparse(node.subselect))
      case node.subLinkType === 6:
        return format('ARRAY (%s)', this.deparse(node.subselect));
      default:
        return fail('SubLink', node);
    }
  }

  ['TypeCast'](node) {
    const type = this.deparse(node.typeName);
    if (type === 'boolean' && dotty.exists(node, 'arg.A_Const.val.String.str')) {
      const value = dotty.get(node, 'arg.A_Const.val.String.str');
      if (value === 'f') {
        return '(FALSE)';
      }
      if (value === 't') {
        return '(TRUE)';
      }
    }
    return this.deparse(node.arg) + '::' + this.deparse(node.typeName);
  }

  ['TypeName'](node) {
    if (_.last(node.names).String.str === 'interval') {
      return this.deparseInterval(node);
    }

    const output = [];

    if (node.setof) {
      output.push('SETOF');
    }

    let args = null;

    if (node.typmods != null) {
      args = node.typmods.map(item => {
        return this.deparse(item);
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

  ['CaseWhen'](node) {
    const output = [ 'WHEN' ];

    output.push(this.deparse(node.expr));
    output.push('THEN');
    output.push(this.deparse(node.result));

    return output.join(' ');
  }

  ['WindowDef'](node, context) {
    const output = [];

    if (context !== 'window') {
      if (node.name) {
        output.push(node.name);
      }
    }

    const empty = (!(node.partitionClause != null) && !(node.orderClause != null));

    const frameOptions = this.deparseFrameOptions(node.frameOptions, node.refname, node.startOffset, node.endOffset);

    if (empty && context !== 'window' && !(node.name != null) && frameOptions.length === 0) {
      return '()';
    }

    const windowParts = [];

    let useParens = false;

    if (node.partitionClause) {
      const partition = [ 'PARTITION BY' ];

      const clause = node.partitionClause.map(item => this.deparse(item));

      partition.push(clause.join(', '));

      windowParts.push(partition.join(' '));
      useParens = true;
    }

    if (node.orderClause) {
      windowParts.push('ORDER BY');

      const orders = node.orderClause.map(item => {
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

  ['WithClause'](node) {
    const output = [ 'WITH' ];

    if (node.recursive) {
      output.push('RECURSIVE');
    }

    output.push(this.list(node.ctes));

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
    const type = [ 'interval' ];

    if (node.arrayBounds != null) {
      type.push('[]');
    }

    if (node.typmods) {
      const typmods = node.typmods.map(item => this.deparse(item));

      let intervals = this.interval(typmods[0]);

      // SELECT interval(0) '1 day 01:23:45.6789'
      if (node.typmods[0] && node.typmods[0].A_Const && node.typmods[0].A_Const.val.Integer.ival === 32767 && node.typmods[1] && (node.typmods[1].A_Const != null)) {
        intervals = [ `(${node.typmods[1].A_Const.val.Integer.ival})` ];
      } else {
        intervals = intervals.map(part => {
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
      this.INTERVALS[(1 << this.BITS.YEAR)] = [ 'year' ];
      this.INTERVALS[(1 << this.BITS.MONTH)] = [ 'month' ];
      this.INTERVALS[(1 << this.BITS.DAY)] = [ 'day' ];
      this.INTERVALS[(1 << this.BITS.HOUR)] = [ 'hour' ];
      this.INTERVALS[(1 << this.BITS.MINUTE)] = [ 'minute' ];
      this.INTERVALS[(1 << this.BITS.SECOND)] = [ 'second' ];
      this.INTERVALS[((1 << this.BITS.YEAR) | (1 << this.BITS.MONTH))] = [ 'year', 'month' ];
      this.INTERVALS[((1 << this.BITS.DAY) | (1 << this.BITS.HOUR))] = [ 'day', 'hour' ];
      this.INTERVALS[((1 << this.BITS.DAY) | (1 << this.BITS.HOUR) | (1 << this.BITS.MINUTE))] = [ 'day', 'minute' ];
      this.INTERVALS[((1 << this.BITS.DAY) | (1 << this.BITS.HOUR) | (1 << this.BITS.MINUTE) | (1 << this.BITS.SECOND))] = [ 'day', 'second' ];
      this.INTERVALS[((1 << this.BITS.HOUR) | (1 << this.BITS.MINUTE))] = [ 'hour', 'minute' ];
      this.INTERVALS[((1 << this.BITS.HOUR) | (1 << this.BITS.MINUTE) | (1 << this.BITS.SECOND))] = [ 'hour', 'second' ];
      this.INTERVALS[((1 << this.BITS.MINUTE) | (1 << this.BITS.SECOND))] = [ 'minute', 'second' ];

      // utils/timestamp.h
      // #define INTERVAL_FULL_RANGE (0x7FFF)
      this.INTERVALS[this.INTERVAL_FULL_RANGE = '32767'] = [];
    }

    return this.INTERVALS[mask.toString()];
  }
}
