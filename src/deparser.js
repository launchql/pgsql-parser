import _ from 'lodash';
import { format } from 'util';

let { contains } = _;
let { keys } = _;
let { first } = _;

let compact = o =>
  _.select(_.compact(o), function(p) {
    if (p == null) { return false; }
    return p.toString().length;
  })
;

let fk = value => _.first(_.keys(value));
let fv = value => _.first(_.values(value));

let fail = function(msg) { throw new Error(msg); };

let indent = (text, count=1) => text;

export default class Deparser {
  static deparse(query) {
    return new Deparser(query).deparseQuery();
  }

  constructor(tree) {
    this.tree = tree;
  }

  deparseQuery() {
    return (this.tree.map(node => this.deparse(node))).join("\n\n");
  }

  deparseNodes(nodes) {
    return nodes.map(node => this.deparse(node));
  }

  quote(value) {
    if (value == null) { return; }
    if (_.isArray(value)) {
      return value.map(o => this.quote(o));
    } else {
      return `"${value}"`;
    }
  }

  // SELECT encode(E'''123\\000\\001', 'base64')
  escape(literal) {
    return `'${literal.replace(/'/g, "''")}'`;
  }

  type(names, args) {
    let [catalog, type] = names.map(name => this.deparse(name));

    let mods = function(name, args) {
      if (args != null) {
        return name + '(' + args + ')';
      } else {
        return name;
      }
    };

    // handle the special "char" (in quotes) type
    if (names[0].String.str === 'char') { names[0].String.str = '"char"'; }

    if (catalog !== 'pg_catalog') { return mods(this.deparseNodes(names).join('.'), args); }

    let res =
      (() => { switch (type) {
        case 'bpchar':
          if (args != null) {
            return 'char';
          } else {
            // return `pg_catalog.bpchar` below so that the following is symmetric
            // SELECT char 'c' = char 'c' AS true
            return 'pg_catalog.bpchar';
          }
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
        default:
          return fail(format("Can't deparse type: %s", type));
      } })();

    return mods(res, args);
  }

  deparse(item, context) {
    if (item == null) { return; }
    if (_.isNumber(item)) { return item; }

    let type = keys(item)[0];
    let node = _.values(item)[0];

    if (this[type] == null) { throw new Error(type + " is not implemented"); }

    let func = this[type];

    return func.call(this, node, context);
  }

  ['A_Expr'](node, context) {
    let output = [];

    switch (node.kind) {
      case 0: // AEXPR_OP
        if (node.lexpr) {
          output.push(`(${this.deparse(node.lexpr)})`);
        }

        if (node.name.length > 1) {
          let arg1 = this.deparse(node.name[0]);
          let arg2 = this.deparse(node.name[1]);
          output.push(`OPERATOR(${arg1}.${arg2})`);
        } else {
          output.push(this.deparse(node.name[0]));
        }

        if (node.rexpr) {
          output.push(`(${this.deparse(node.rexpr)})`);
        }

        if (output.length === 2) {
          return `(${output.join('')})`;
        } else {
          return `(${output.join(' ')})`;
        }
        break;

      case 1: // AEXPR_OP_ANY
        output.push(this.deparse(node.lexpr));
        output.push(format('ANY (%s)', this.deparse(node.rexpr)));
        return output.join(` ${this.deparse(node.name[0])} `);
        break;

      case 2: // AEXPR_OP_ALL
        output.push(this.deparse(node.lexpr));
        output.push(format('ALL (%s)', this.deparse(node.rexpr)));
        return output.join(` ${this.deparse(node.name[0])} `);
        break;

      case 3: // AEXPR_DISTINCT
        return format('%s IS DISTINCT FROM %s', this.deparse(node.lexpr), this.deparse(node.rexpr));
        break;

      case 4: // AEXPR_NULLIF
        return format('NULLIF(%s, %s)', this.deparse(node.lexpr), this.deparse(node.rexpr));
        break;

      case 5: // AEXPR_OF
        let op = node.name[0].String.str === '=' ? 'IS OF' : 'IS NOT OF';
        let list = node.rexpr.map(node => this.deparse(node));
        return format('%s %s (%s)', this.deparse(node.lexpr), op, list.join(', '));
        break;

      case 6: // AEXPR_IN
        let rexpr = node.rexpr.map(node => this.deparse(node));

        let operator =
          node.name[0].String.str === '=' ?
            'IN'
          :
            'NOT IN';

        return format('%s %s (%s)', this.deparse(node.lexpr), operator, rexpr.join(', '));
        break;

      case 7: // AEXPR_LIKE
        output.push(this.deparse(node.lexpr));

        if (node.name[0].String.str === '!~~') {
          output.push(format('NOT LIKE (%s)', this.deparse(node.rexpr)));
        } else {
          output.push(format('LIKE (%s)', this.deparse(node.rexpr)));
        }

        return output.join(' ');
        break;

      case 8: // AEXPR_ILIKE
        output.push(this.deparse(node.lexpr));

        if (node.name[0].String.str === '!~~*') {
          output.push(format('NOT ILIKE (%s)', this.deparse(node.rexpr)));
        } else {
          output.push(format('ILIKE (%s)', this.deparse(node.rexpr)));
        }

        return output.join(' ');
        break;

      case 9: // AEXPR_SIMILAR TODO(zhm) untested
        output.push(this.deparse(node.lexpr));
        output.push(format('SIMILAR TO %s', this.deparse(node.rexpr)));
        return output.join(' ');
        break;

      case 10: // AEXPR_BETWEEN TODO(zhm) untested
        output.push(this.deparse(node.lexpr));
        output.push(format('BETWEEN %s AND %s', this.deparse(node.rexpr[0]),  this.deparse(node.rexpr[1])));
        return output.join(' ');
        break;

      case 11: // AEXPR_NOT_BETWEEN TODO(zhm) untested
        output.push(this.deparse(node.lexpr));
        output.push(format('NOT BETWEEN %s AND %s', this.deparse(node.rexpr[0]),  this.deparse(node.rexpr[1])));
        return output.join(' ');
        break;
    }


    if (node.lexpr) {
      if (node.lexpr.A_Const != null) {
        output.push(this.deparse(node.lexpr, context || true));
      } else {
        output.push(`(${this.deparse(node.lexpr, context || true)})`);
      }
    }

    return `(${output})`;
  }

  ['Alias'](node, context) {
    let name = node.aliasname;

    let output = [ 'AS' ];

    if (node.colnames) {
      output.push(name + '(' + this.deparseNodes(node.colnames).join(', ') + ')');
    } else {
      output.push(this.quote(name));
    }

    return output.join(' ');
  }

  ['A_ArrayExpr'](node) {
    let output = [ 'ARRAY[' ];

    let list = [];

    if (node.elements) {
      list = node.elements.map(e => this.deparse(e));
    }
      // list = (@deparse(element) for element in node.elements)

    output.push(list.join(', '));
    output.push(']');

    return output.join('');
  }

  ['A_Const'](node, context) {
    if (node.val.String) {
      return this.escape(this.deparse(node.val));
    } else {
      return this.deparse(node.val);
    }
  }

  ['A_Indices'](node) {
    if (node.lidx) {
      return format('[%s:%s]', this.deparse(node.lidx), this.deparse(node.uidx));
    } else {
      return format('[%s]', this.deparse(node.uidx));
    }
  }

  ['A_Indirection'](node) {
    let output = [ `(${this.deparse(node.arg)})` ];

    // TODO(zhm) figure out the actual rules for when a '.' is needed
    //
    // select a.b[0] from a;
    // select (select row(1)).*
    // select c2[2].f2 from comptable
    // select c2.a[2].f2[1].f3[0].a1 from comptable

    let parts = [];

    for (let i = 0; i < node.indirection.length; i++) {
      let subnode = node.indirection[i];
      if (subnode.String || subnode.A_Star) {
        let value =
          subnode.A_Star ?
            '*'
          :
            this.quote(subnode.String.str);

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
    let prefix = node.str[0];
    return `${prefix}'${node.str.substring(1)}'`;
  }

  ['BoolExpr'](node) {
    switch (node.boolop) {
      case 0:
        return `(${this.deparseNodes(node.args).join(' AND ')})`;
      case 1:
        return `(${this.deparseNodes(node.args).join(' OR ')})`;
      case 2:
        return format('NOT (%s)', this.deparseNodes(node.args));
      default:
        return fail(format('Unhandled BoolExpr: %s', JSON.stringify(node)));
    }
  }

  ['BooleanTest'](node) {
    let output = [];
    output.push(this.deparse(node.arg));

    let tests = [
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
    let output = ['CASE'];

    if (node.arg) { output.push(this.deparse(node.arg)); }

    for (let i = 0; i < node.args.length; i++) { let arg = node.args[i];     output.push(this.deparse(arg)); }

    if (node['defresult']) {
      output.push('ELSE');
      output.push(this.deparse(node.defresult));
    }

    output.push('END');
    return output.join(' ');
  }

  ['CoalesceExpr'](node) {
    let output = [];

    let args = [];
    for (let i = 0; i < node.args.length; i++) { let arg = node.args[i];     args.push(this.deparse(arg)); }

    return format('COALESCE(%s)', args.join(', '));
  }

  ['CollateClause'](node) {
    let output = [];
    if (node.arg != null) { output.push(this.deparse(node.arg)); }
    output.push('COLLATE');
    if (node.collname != null) { output.push(this.quote(this.deparseNodes(node.collname))); }
    return output.join(' ');
  }

  ['ColumnDef'](node) {
    let output = [ this.quote(node.colname) ];

    output.push(this.deparse(node.typeName));

    if (node.raw_default) {
      output.push('USING');
      output.push(this.deparse(node.raw_default));
    }

    if (node.constraints) {
      for (let i = 0; i < node.constraints.length; i++) { let item = node.constraints[i];       output.push(this.deparse(item)); }
    }

    return _.compact(output).join(' ');
  }

  ['ColumnRef'](node) {
    let fields = node.fields.map(field => {
      if (field.String) {
        return this.quote(this.deparse(field));
      } else {
        return this.deparse(field);
      }
    });

    return fields.join('.');
  }

  ['CommonTableExpr'](node) {
    let output = [];
    output.push(node.ctename);
    if (node.aliascolnames) { output.push(format('(%s)', this.quote(this.deparseNodes(node.aliascolnames)))); }
    output.push(format('AS (%s)', this.deparse(node.ctequery)));
    return output.join(' ');
  }

  ['Float'](node) {
    // wrap negative numbers in parens, SELECT (-2147483648)::int4 * (-1)::int4
    if (node.str[0] === '-') {
      return `(${node.str})`;
    } else {
      return node.str;
    }
  }

  ['FuncCall'](node, context) {
    let output = [];

    let params = [];

    if (node.args) {
      params = node.args.map(item => {
        return this.deparse(item);
      });
    }

    // COUNT(*)
    if (node.agg_star) { params.push('*'); }

    let name = this.deparseNodes(node.funcname).join('.');

    let order = [];

    let withinGroup = node.agg_within_group;

    if (node.agg_order) {
      order.push('ORDER BY');
      order.push((node.agg_order.map(node => this.deparse(node, context))).join(", "));
    }

    let call = [];
    call.push(name + '(');
    if (node.agg_distinct) { call.push('DISTINCT '); }

    // prepend variadic before the last parameter
    // SELECT CONCAT('|', VARIADIC ARRAY['1','2','3'])
    if (node.func_variadic) {
      params[params.length - 1] = `VARIADIC ${params[params.length - 1]}`;
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
      output.push(`(${order.join(' ')})`);
    }

    if (node.agg_filter != null) {
      output.push(format('FILTER (WHERE %s)', this.deparse(node.agg_filter)));
    }

    if (node.over != null) {
      output.push(format('OVER %s', this.deparse(node.over, 'function')));
    }

    return output.join(' ');
  }

  ['Integer'](node) {
    if (node.ival < 0) {
      return `(${node.ival})`;
    } else {
      return node.ival.toString();
    }
  }

  ['IntoClause'](node) {
    let output = [];
    output.push(this.deparse(node.rel));
    return output.join('');
  }

  ['JoinExpr'](node, context) {
    let output = [];

    output.push(this.deparse(node.larg));

    if (node.isNatural) {
      output.push('NATURAL');
    }

    let join =
      (() => { switch (true) {
        case node.jointype === 0 && (node.quals != null): return 'INNER JOIN';
        case node.jointype === 0 && !node.isNatural && !(node.quals != null) && !(node.usingClause != null): return 'CROSS JOIN';
        case node.jointype === 0: return 'JOIN';
        case node.jointype === 1: return 'LEFT OUTER JOIN';
        case node.jointype === 2: return 'FULL OUTER JOIN';
        case node.jointype === 3: return 'RIGHT OUTER JOIN';
        default: return fail(format('unhandled join type %s', node.jointype));
      } })();

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
      output.push(`USING (${this.quote(this.deparseNodes(node.usingClause)).join(", ")})`);
    }

    let wrapped =
      (node.rarg.JOINEXPR != null) || node.alias ?
        `(${output.join(' ')})`
      :
        output.join(' ');

    if (node.alias) {
      return wrapped + ' ' + this.deparse(node.alias);
    } else {
      return wrapped;
    }
  }

  ['LockingClause'](node) {
    let strengths = [
      'NONE', // LCS_NONE
      'FOR KEY SHARE',
      'FOR SHARE',
      'FOR NO KEY UPDATE',
      'FOR UPDATE'
    ];

    let output = [];

    output.push(strengths[node.strength]);

    if (node.lockedRels) {
      output.push('OF');
      output.push((node.lockedRels.map(item => this.deparse(item))).join(', '));
    }

    return output.join(' ');
  }

  ['MinMaxExpr'](node) {
    let output = [];

    if (node.op === 0) {
      output.push('GREATEST');
    } else {
      output.push('LEAST');
    }


    let args = [];
    for (let i = 0; i < node.args.length; i++) { let arg = node.args[i];     args.push(this.deparse(arg)); }

    output.push(`(${args.join(', ')})`);
    return output.join('');
  }

  ['NamedArgExpr'](node) {
    let output = [];
    output.push(node.name);
    output.push(':=');
    output.push(this.deparse(node.arg));
    return output.join(' ');
  }

  ['Null'](node) {
    return 'NULL';
  }

  ['NullTest'](node) {
    let output = [ this.deparse(node.arg) ];
    if (node.nulltesttype === 0) {
      output.push('IS NULL');
    } else if (node.nulltesttype === 1) {
      output.push('IS NOT NULL');
    }
    return output.join(' ');
  }

  ['RangeFunction'](node) {
    let output = [];
    if (node.lateral) { output.push('LATERAL'); }

    let funcs = [];

    for (let i = 0; i < node.functions.length; i++) {
      let funcCall = node.functions[i];
      let call = [ this.deparse(funcCall[0]) ];

      if (funcCall[1] && funcCall[1].length) {
        call.push(`AS (${(funcCall[1].map(def => this.deparse(def))).join(', ')})`);
      }

      funcs.push(call.join(' '));
    }

    let calls = funcs.join(', ');

    if (node.is_rowsfrom) {
      output.push(`ROWS FROM (${calls})`);
    } else {
      output.push(calls);
    }

    if (node.ordinality) {
      output.push('WITH ORDINALITY');
    }

    if (node.alias) { output.push(this.deparse(node.alias)); }

    if (node.coldeflist) {
      if (!node.alias) {
        output.push(` AS (${(node.coldeflist.map(col => this.deparse(col))).join(", ")})`);
      } else {
        output.push(`(${(node.coldeflist.map(col => this.deparse(col))).join(", ")})`);
      }
    }

    return output.join(' ');
  }

  ['RangeSubselect'](node, context) {
    let output = '';

    if (node.lateral) {
      output += 'LATERAL ';
    }

    output += `(${this.deparse(node.subquery)})`;

    if (node.alias) {
      return output + ' ' + this.deparse(node.alias);
    } else {
      return output;
    }
  }

  ['RangeVar'](node, context) {
    let output = [];
    if (node.inhOpt === 0) { output.push('ONLY'); }

    if (node.relpersistence === 'u') {
      output.push('UNLOGGED');
    }

    if (node.relpersistence === 't') {
      output.push('TEMPORARY');
    }

    if (node.schemaname != null) {
      output.push(this.quote(node.schemaname));
      output.push('.');
    }

    output.push(this.quote(node.relname));
    if (node.alias) { output.push(this.deparse(node.alias)); }

    return output.join(' ');
  }

  ['ResTarget'](node, context) {
    if (context === 'select') {
      return compact([ this.deparse(node.val), this.quote(node.name) ]).join(' AS ');
    } else if (context === 'update') {
      return compact([ node.name, this.deparse(node.val) ]).join(' = ');
    } else if (!(node.val != null)) {
      return this.quote(node.name);
    } else {
      return fail(format("Can't deparse %s in context %s", JSON.stringify(node), context));
    }
  }

  ['RowExpr'](node) {
    let args = node.args || [];
    if (node.row_format === 2) {
      return `(${args.map(arg => this.deparse(arg)).join(', ')})`;
    } else {
      return `ROW(${args.map(arg => this.deparse(arg)).join(', ')})`;
    }
  }

  ['SelectStmt'](node, context) {
    let output = [];

    if (node.withClause) { output.push(this.deparse(node.withClause)); }

    if (node.op === 0) {
      // VALUES select's don't get SELECT
      if (node.valuesLists == null) {
        output.push('SELECT');
      }
    } else {
      output.push(`(${this.deparse(node.larg)})`);

      let sets = [
        'NONE',
        'UNION',
        'INTERSECT',
        'EXCEPT'
      ];

      output.push(sets[node.op]);

      if (node.all) {
        output.push('ALL');
      }

      output.push(`(${this.deparse(node.rarg)})`);
    }

    if (node.distinctClause) {
      if (node.distinctClause[0] != null) {
        output.push('DISTINCT ON');
        output.push(`(${indent((node.distinctClause.map(node => this.deparse(node, 'select'))).join(",\n"))})`);
      } else {
        output.push('DISTINCT');
      }
    }

    if (node.targetList) {
      output.push(indent((node.targetList.map(node => this.deparse(node, 'select'))).join(",\n")));
    }

    if (node.intoClause) {
      output.push("INTO");
      output.push(indent(this.deparse(node.intoClause)));
    }

    if (node.fromClause) {
      output.push("FROM");
      output.push(indent((node.fromClause.map(node => this.deparse(node, 'from'))).join(",\n")));
    }

    if (node.whereClause) {
      output.push("WHERE");
      output.push(indent(this.deparse(node.whereClause)));
    }

    if (node.valuesLists) {
      output.push('VALUES');

      let lists = node.valuesLists.map(list => {
        return `(${(list.map(v => this.deparse(v))).join(', ')})`;
      });

      output.push(lists.join(', '));
    }

    if (node.groupClause) {
      output.push('GROUP BY');
      output.push(indent((node.groupClause.map(node => this.deparse(node, 'group'))).join(",\n")));
    }

    if (node.havingClause) {
      output.push('HAVING');
      output.push(indent(this.deparse(node.havingClause)));
    }

    if (node.windowClause) {
      output.push('WINDOW');

      let windows = [];

      for (let i = 0; i < node.windowClause.length; i++) {
        let w = node.windowClause[i];
        let window = [];
        if (w.WindowDef.name) { window.push(this.quote(w.WindowDef.name) + ' AS'); }
        window.push(`(${this.deparse(w, 'window')})`);
        windows.push(window.join(' '));
      }

      output.push(windows.join(', '));
    }

    if (node.sortClause) {
      output.push('ORDER BY');
      output.push(indent((node.sortClause.map(node => this.deparse(node, 'sort'))).join(",\n")));
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

    return output.join(" ");
  }

  ['SortBy'](node) {
    let output = [];
    output.push(this.deparse(node.node));

    if (node.sortby_dir === 1) { output.push('ASC'); }
    if (node.sortby_dir === 2) { output.push('DESC'); }

    if (node.sortby_dir === 3) {
      output.push(`USING ${this.deparseNodes(node.useOp)}`);
    }

    if (node.sortby_nulls === 1) { output.push('NULLS FIRST'); }
    if (node.sortby_nulls === 2) { output.push('NULLS LAST'); }

    return output.join(' ');
  }

  ['String'](node) {
    return node.str;
  }

  ['SubLink'](node) {
    // if node.subLinkType is 2 and not node.operName?
    //   node.operName = ['=']

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
        return fail('Encountered MULTIEXPR_SUBLINK', JSON.stringify(node));
        // MULTIEXPR_SUBLINK
        // format('(%s)', @deparse(node.subselect))
      case node.subLinkType === 6:
        return format('ARRAY (%s)', this.deparse(node.subselect));
    }
  }

  ['TypeCast'](node) {
    return this.deparse(node.arg) + '::' + this.deparse(node['typeName']);
  }

  ['TypeName'](node) {
    if (_.last(node.names).String.str === 'interval') { return this.deparseInterval(node); }

    let output = [];
    if (node['setof']) { output.push('SETOF'); }

    let args = null;

    if (node.typmods != null) {
      args = node.typmods.map(item => {
        return this.deparse(item);
      });
    }

    let type = [];
    type.push(this.type(node['names'], args && args.join(', ')));
    if (node.arrayBounds != null) { type.push('[]'); }

    output.push(type.join(''));

    return output.join(' ');
  }

  ['CaseWhen'](node) {
    let output = [ 'WHEN' ];
    output.push(this.deparse(node.expr));
    output.push('THEN');
    output.push(this.deparse(node.result));
    return output.join(' ');
  }

  ['WindowDef'](node, context) {
    let output = [];

    if (context !== 'window') {
      if (node.name) { output.push(node.name); }
    }

    let empty = (!(node.partitionClause != null) && !(node.orderClause != null));

    let frameOptions = this.deparseFrameOptions(node.frameOptions, node.refname, node.startOffset, node.endOffset);

    if (empty && context !== 'window' && !(node.name != null) && frameOptions.length === 0) {
      return '()';
    }

    let windowParts = [];

    let parens = false;

    if (node.partitionClause) {
      let partition = [ 'PARTITION BY' ];

      let clause = node.partitionClause.map(item => this.deparse(item));

      partition.push(clause.join(', '));

      windowParts.push(partition.join(' '));
      parens = true;
    }

    if (node.orderClause) {
      windowParts.push('ORDER BY');

      let orders = node.orderClause.map(item => {
        return this.deparse(item);
      });

      windowParts.push(orders.join(', '));

      parens = true;
    }

    if (frameOptions.length) {
      parens = true;
      windowParts.push(frameOptions);
    }

    if (parens && context !== 'window') {
      return output.join(' ') + ' (' + windowParts.join(' ') + ')';
    } else {
      return output.join(' ') + windowParts.join(' ');
    }
  }

  ['WithClause'](node) {
    let output = [ 'WITH' ];

    if (node.recursive) { output.push('RECURSIVE'); }

    let ctes = [];
    for (let i = 0; i < node.ctes.length; i++) { let cte = node.ctes[i];     ctes.push(this.deparse(cte)); }

    output.push(ctes.join(', '));
    return output.join(' ');
  }

  deparseFrameOptions(options, refName, startOffset, endOffset) {
    let FRAMEOPTION_NONDEFAULT = 0x00001; ///* any specified? */
    let FRAMEOPTION_RANGE = 0x00002; ///* RANGE behavior */
    let FRAMEOPTION_ROWS = 0x00004; ///* ROWS behavior */
    let FRAMEOPTION_BETWEEN = 0x00008; ///* BETWEEN given? */
    let FRAMEOPTION_START_UNBOUNDED_PRECEDING = 0x00010; ///* start is U. P. */
    let FRAMEOPTION_END_UNBOUNDED_PRECEDING = 0x00020; ///* (disallowed) */
    let FRAMEOPTION_START_UNBOUNDED_FOLLOWING = 0x00040; ///* (disallowed) */
    let FRAMEOPTION_END_UNBOUNDED_FOLLOWING = 0x00080; ///* end is U. F. */
    let FRAMEOPTION_START_CURRENT_ROW = 0x00100; ///* start is C. R. */
    let FRAMEOPTION_END_CURRENT_ROW = 0x00200; ///* end is C. R. */
    let FRAMEOPTION_START_VALUE_PRECEDING = 0x00400; ///* start is V. P. */
    let FRAMEOPTION_END_VALUE_PRECEDING = 0x00800; ///* end is V. P. */
    let FRAMEOPTION_START_VALUE_FOLLOWING = 0x01000; ///* start is V. F. */
    let FRAMEOPTION_END_VALUE_FOLLOWING = 0x02000; ///* end is V. F. */

    if (!(options & FRAMEOPTION_NONDEFAULT)) { return ''; }

    let output = [];

    if (refName != null) { output.push(refName); }

    if (options & FRAMEOPTION_RANGE) {
      output.push('RANGE');
    }

    if (options & FRAMEOPTION_ROWS) {
      output.push('ROWS');
    }

    let between = options & FRAMEOPTION_BETWEEN;

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
    let type = [ 'interval' ];
    if (node.arrayBounds != null) { type.push('[]'); }

    if (node.typmods) {
      let typmods = node.typmods.map(item => this.deparse(item));

      let intervals = this.interval(typmods[0]);

      // SELECT interval(0) '1 day 01:23:45.6789'
      if (node.typmods[0] && node.typmods[0].A_Const && node.typmods[0].A_Const.val.Integer.ival === 32767 && node.typmods[1] && (node.typmods[1].A_Const != null)) {
        intervals = [`(${node.typmods[1].A_Const.val.Integer.ival})`];

      } else {
        intervals = intervals.map(part => {
          if (part === 'second' && typmods.length === 2) {
            return 'second(' + _.last(typmods) + ')';
          } else {
            return part;
          }
        });
      }

      type.push(intervals.join(' to '));
    }

    return type.join(' ');
  }

  interval(mask) {
    // ported from https://github.com/lfittl/pg_query/blob/master/lib/pg_query/deparse/interval.rb
    if (this.MASKS == null) { this.MASKS = {
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
    }; }

    if (this.BITS == null) { this.BITS = _.invert(this.MASKS); }

    let results = [];

    if (this.INTERVALS == null) {
      this.INTERVALS = {};
      this.INTERVALS[(1 << this.BITS['YEAR'])] = ['year'];
      this.INTERVALS[(1 << this.BITS['MONTH'])] = ['month'];
      this.INTERVALS[(1 << this.BITS['DAY'])] = ['day'];
      this.INTERVALS[(1 << this.BITS['HOUR'])] = ['hour'];
      this.INTERVALS[(1 << this.BITS['MINUTE'])] = ['minute'];
      this.INTERVALS[(1 << this.BITS['SECOND'])] = ['second'];
      this.INTERVALS[(1 << this.BITS['YEAR'] | 1 << this.BITS['MONTH'])] = ['year', 'month'];
      this.INTERVALS[(1 << this.BITS['DAY'] | 1 << this.BITS['HOUR'])] = ['day', 'hour'];
      this.INTERVALS[(1 << this.BITS['DAY'] | 1 << this.BITS['HOUR'] | 1 << this.BITS['MINUTE'])] = ['day', 'minute'];
      this.INTERVALS[(1 << this.BITS['DAY'] | 1 << this.BITS['HOUR'] | 1 << this.BITS['MINUTE'] | 1 << this.BITS['SECOND'])] = ['day', 'second'];
      this.INTERVALS[(1 << this.BITS['HOUR'] | 1 << this.BITS['MINUTE'])] = ['hour', 'minute'];
      this.INTERVALS[(1 << this.BITS['HOUR'] | 1 << this.BITS['MINUTE'] | 1 << this.BITS['SECOND'])] = ['hour', 'second'];
      this.INTERVALS[(1 << this.BITS['MINUTE'] | 1 << this.BITS['SECOND'])] = ['minute', 'second'];

      // utils/timestamp.h
      // #define INTERVAL_FULL_RANGE (0x7FFF)
      this.INTERVALS[this.INTERVAL_FULL_RANGE = '32767'] = [];
    }

    return this.INTERVALS[mask.toString()];
  }
};
