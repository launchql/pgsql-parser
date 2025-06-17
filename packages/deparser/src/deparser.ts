import { Node } from '@pgsql/types';
import { SqlFormatter } from './utils/sql-formatter';
import { DeparserContext, DeparserVisitor } from './visitors/base';
import { QuoteUtils } from './utils/quote-utils';
import { ListUtils } from './utils/list-utils';
import * as t from '@pgsql/types';

export interface DeparserOptions {
  newline?: string;
  tab?: string;
}

export class Deparser implements DeparserVisitor {
  private formatter: SqlFormatter;
  private tree: Node[];

  constructor(tree: Node | Node[], opts: DeparserOptions = {}) {
    this.formatter = new SqlFormatter(opts.newline, opts.tab);
    this.tree = Array.isArray(tree) ? tree : [tree];
  }

  static deparse(query: Node | Node[], opts: DeparserOptions = {}): string {
    return new Deparser(query, opts).deparseQuery();
  }

  deparseQuery(): string {
    return this.tree
      .map(node => this.deparse(node))
      .join(this.formatter.newline() + this.formatter.newline());
  }

  deparse(node: Node, context: DeparserContext = {}): string | null {
    if (node == null) {
      return null;
    }

    if (typeof node === 'number' || node instanceof Number) {
      return node.toString();
    }

    try {
      return this.visit(node, context);
    } catch (error) {
      const nodeType = Object.keys(node)[0];
      throw new Error(`Error deparsing ${nodeType}: ${(error as Error).message}`);
    }
  }

  visit(node: Node, context: DeparserContext = {}): string {
    const nodeType = this.getNodeType(node);
    const nodeData = this.getNodeData(node);

    const methodName = nodeType as keyof this;
    if (typeof this[methodName] === 'function') {
      return (this[methodName] as any)(nodeData, context);
    }
    
    throw new Error(`Deparser does not handle node type: ${nodeType}`);
  }

  getNodeType(node: Node): string {
    return Object.keys(node)[0];
  }

  getNodeData(node: Node): any {
    const type = this.getNodeType(node);
    return (node as any)[type];
  }

  RawStmt(node: t.RawStmt, context: DeparserContext): string {
    if (node.stmt_len) {
      return this.deparse(node.stmt, context) + ';';
    }
    return this.deparse(node.stmt, context);
  }

  SelectStmt(node: t.SelectStmt, context: DeparserContext): string {
    const output: string[] = [];

    if (node.withClause) {
      output.push(this.visit(node.withClause as Node, context));
    }

    if (!node.op || node.op === 'SETOP_NONE') {
      if (node.valuesLists == null) {
        output.push('SELECT');
      }
    } else {
      output.push(this.formatter.parens(this.SelectStmt(node.larg as t.SelectStmt, context)));

      switch (node.op) {
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
          throw new Error(`Bad SelectStmt op: ${node.op}`);
      }

      if (node.all) {
        output.push('ALL');
      }

      output.push(this.formatter.parens(this.SelectStmt(node.rarg as t.SelectStmt, context)));
    }

    if (node.distinctClause) {
      const distinctClause = ListUtils.unwrapList(node.distinctClause);
      if (distinctClause.length > 0 && Object.keys(distinctClause[0]).length > 0) {
        output.push('DISTINCT ON');
        const clause = distinctClause
          .map(e => this.visit(e as Node, { ...context, select: true }))
          .join(', ');
        output.push(this.formatter.parens(clause));
      } else {
        output.push('DISTINCT');
      }
    }

    if (node.targetList) {
      const targetList = ListUtils.unwrapList(node.targetList);
      const targets = targetList
        .map(e => this.visit(e as Node, { ...context, select: true }))
        .join(', ');
      output.push(targets);
    }

    if (node.intoClause) {
      output.push('INTO');
      output.push(this.visit(node.intoClause as Node, context));
    }

    if (node.fromClause) {
      output.push('FROM');
      const fromList = ListUtils.unwrapList(node.fromClause);
      const fromItems = fromList
        .map(e => this.deparse(e as Node, { ...context, from: true }))
        .join(', ');
      output.push(fromItems);
    }

    if (node.whereClause) {
      output.push('WHERE');
      output.push(this.visit(node.whereClause as Node, context));
    }

    if (node.valuesLists) {
      output.push('VALUES');
      const lists = ListUtils.unwrapList(node.valuesLists).map(list => {
        const values = ListUtils.unwrapList(list).map(val => this.visit(val as Node, context));
        return this.formatter.parens(values.join(', '));
      });
      output.push(lists.join(', '));
    }

    if (node.groupClause) {
      output.push('GROUP BY');
      const groupList = ListUtils.unwrapList(node.groupClause);
      const groupItems = groupList
        .map(e => this.visit(e as Node, { ...context, group: true }))
        .join(', ');
      output.push(groupItems);
    }

    if (node.havingClause) {
      output.push('HAVING');
      output.push(this.visit(node.havingClause as Node, context));
    }

    if (node.sortClause) {
      output.push('ORDER BY');
      const sortList = ListUtils.unwrapList(node.sortClause);
      const sortItems = sortList
        .map(e => this.visit(e as Node, { ...context, sort: true }))
        .join(', ');
      output.push(sortItems);
    }

    if (node.limitCount) {
      output.push('LIMIT');
      output.push(this.visit(node.limitCount as Node, context));
    }

    if (node.limitOffset) {
      output.push('OFFSET');
      output.push(this.visit(node.limitOffset as Node, context));
    }

    return output.join(' ');
  }

  A_Expr(node: t.A_Expr, context: DeparserContext): string {
    const kind = node.kind as string;
    const name = ListUtils.unwrapList(node.name);
    const lexpr = node.lexpr;
    const rexpr = node.rexpr;

    switch (kind) {
      case 'AEXPR_OP':
        if (lexpr && rexpr) {
          return this.formatter.format([
            this.visit(lexpr, context),
            this.deparseOperatorName(name),
            this.visit(rexpr, context)
          ]);
        } else if (rexpr) {
          return this.formatter.format([
            this.deparseOperatorName(name),
            this.visit(rexpr, context)
          ]);
        }
        break;
      case 'AEXPR_OP_ANY':
        return this.formatter.format([
          this.visit(lexpr, context),
          this.deparseOperatorName(name),
          'ANY',
          this.formatter.parens(this.visit(rexpr, context))
        ]);
      case 'AEXPR_OP_ALL':
        return this.formatter.format([
          this.visit(lexpr, context),
          this.deparseOperatorName(name),
          'ALL',
          this.formatter.parens(this.visit(rexpr, context))
        ]);
      case 'AEXPR_DISTINCT':
        return this.formatter.format([
          this.visit(lexpr, context),
          'IS DISTINCT FROM',
          this.visit(rexpr, context)
        ]);
      case 'AEXPR_NOT_DISTINCT':
        return this.formatter.format([
          this.visit(lexpr, context),
          'IS NOT DISTINCT FROM',
          this.visit(rexpr, context)
        ]);
      case 'AEXPR_NULLIF':
        return this.formatter.format([
          'NULLIF',
          this.formatter.parens([
            this.visit(lexpr, context),
            this.visit(rexpr, context)
          ].join(', '))
        ]);
      case 'AEXPR_IN':
        return this.formatter.format([
          this.visit(lexpr, context),
          'IN',
          this.formatter.parens(this.visit(rexpr, context))
        ]);
      case 'AEXPR_LIKE':
        const likeOp = this.deparseOperatorName(name);
        if (likeOp === '!~~') {
          return this.formatter.format([
            this.visit(lexpr, context),
            'NOT LIKE',
            this.visit(rexpr, context)
          ]);
        } else {
          return this.formatter.format([
            this.visit(lexpr, context),
            'LIKE',
            this.visit(rexpr, context)
          ]);
        }
      case 'AEXPR_ILIKE':
        const ilikeOp = this.deparseOperatorName(name);
        if (ilikeOp === '!~~*') {
          return this.formatter.format([
            this.visit(lexpr, context),
            'NOT ILIKE',
            this.visit(rexpr, context)
          ]);
        } else {
          return this.formatter.format([
            this.visit(lexpr, context),
            'ILIKE',
            this.visit(rexpr, context)
          ]);
        }
      case 'AEXPR_SIMILAR':
        const similarOp = this.deparseOperatorName(name);
        if (similarOp === '!~') {
          return this.formatter.format([
            this.visit(lexpr, context),
            'NOT SIMILAR TO',
            this.visit(rexpr, context)
          ]);
        } else {
          return this.formatter.format([
            this.visit(lexpr, context),
            'SIMILAR TO',
            this.visit(rexpr, context)
          ]);
        }
      case 'AEXPR_BETWEEN':
        return this.formatter.format([
          this.visit(lexpr, context),
          'BETWEEN',
          this.visit(rexpr, context)
        ]);
      case 'AEXPR_NOT_BETWEEN':
        return this.formatter.format([
          this.visit(lexpr, context),
          'NOT BETWEEN',
          this.visit(rexpr, context)
        ]);
      case 'AEXPR_BETWEEN_SYM':
        return this.formatter.format([
          this.visit(lexpr, context),
          'BETWEEN SYMMETRIC',
          this.visit(rexpr, context)
        ]);
      case 'AEXPR_NOT_BETWEEN_SYM':
        return this.formatter.format([
          this.visit(lexpr, context),
          'NOT BETWEEN SYMMETRIC',
          this.visit(rexpr, context)
        ]);
    }

    throw new Error(`Unhandled A_Expr kind: ${kind}`);
  }

  deparseOperatorName(name: t.Node[]): string {
    if (!name || name.length === 0) {
      return '';
    }
    
    return name.map((n: any) => {
      if (n.String) {
        return n.String.sval || n.String.str;
      }
      return this.visit(n, {});
    }).join('.');
  }

  InsertStmt(node: t.InsertStmt, context: DeparserContext): string {
    const output: string[] = [];

    if (node.withClause) {
      output.push(this.visit(node.withClause as Node, context));
    }

    output.push('INSERT INTO');
    output.push(this.RangeVar(node.relation, context));

    if (node.cols) {
      const cols = ListUtils.unwrapList(node.cols);
      const columnNames = cols.map(col => this.visit(col as Node, context));
      output.push(this.formatter.parens(columnNames.join(', ')));
    }

    if (node.selectStmt) {
      output.push(this.visit(node.selectStmt as Node, context));
    }

    if (node.onConflictClause) {
      output.push('ON CONFLICT');
      if (node.onConflictClause.infer) {
        const infer = node.onConflictClause.infer;
        if (infer.indexElems) {
          const elems = ListUtils.unwrapList(infer.indexElems);
          const indexElems = elems.map(elem => this.visit(elem as Node, context));
          output.push(this.formatter.parens(indexElems.join(', ')));
        }
      }
      
      if (node.onConflictClause.action === 'ONCONFLICT_UPDATE') {
        output.push('DO UPDATE SET');
        const targetList = ListUtils.unwrapList(node.onConflictClause.targetList);
        const targets = targetList.map(target => this.visit(target as Node, context));
        output.push(targets.join(', '));
      } else if (node.onConflictClause.action === 'ONCONFLICT_NOTHING') {
        output.push('DO NOTHING');
      }
    }

    if (node.returningList) {
      output.push('RETURNING');
      const returningList = ListUtils.unwrapList(node.returningList);
      const returns = returningList.map(ret => this.visit(ret as Node, context));
      output.push(returns.join(', '));
    }

    return output.join(' ');
  }

  UpdateStmt(node: t.UpdateStmt, context: DeparserContext): string {
    const output: string[] = [];

    if (node.withClause) {
      output.push(this.visit(node.withClause as Node, context));
    }

    output.push('UPDATE');
    if (node.relation) {
      output.push(this.RangeVar(node.relation, context));
    }
    output.push('SET');

    const targetList = ListUtils.unwrapList(node.targetList);
    if (targetList && targetList.length) {
      const firstTarget = targetList[0];
      if (firstTarget.val?.MultiAssignRef) {
        const names = targetList.map(target => target.name);
        output.push(this.formatter.parens(names.join(',')));
        output.push('=');
        output.push(this.visit(firstTarget.val, context));
      } else {
        const assignments = targetList.map(target => 
          this.visit(target, { ...context, update: true })
        );
        output.push(assignments.join(','));
      }
    }

    if (node.fromClause) {
      output.push('FROM');
      const fromList = ListUtils.unwrapList(node.fromClause);
      const fromItems = fromList.map(item => this.visit(item, context));
      output.push(fromItems.join(', '));
    }

    if (node.whereClause) {
      output.push('WHERE');
      output.push(this.visit(node.whereClause, context));
    }

    if (node.returningList) {
      output.push('RETURNING');
      output.push(this.deparseReturningList(node.returningList, context));
    }

    return output.join(' ');
  }

  DeleteStmt(node: t.DeleteStmt, context: DeparserContext): string {
    const output: string[] = [];

    if (node.withClause) {
      output.push(this.WithClause(node.withClause, context));
    }

    output.push('DELETE');
    output.push('FROM');
    output.push(this.RangeVar(node.relation, context));

    if (node.usingClause) {
      output.push('USING');
      const usingList = ListUtils.unwrapList(node.usingClause);
      const usingItems = usingList.map(item => this.visit(item, context));
      output.push(usingItems.join(', '));
    }

    if (node.whereClause) {
      output.push('WHERE');
      output.push(this.visit(node.whereClause, context));
    }

    if (node.returningList) {
      output.push('RETURNING');
      output.push(this.deparseReturningList(node.returningList, context));
    }

    return output.join(' ');
  }

  WithClause(node: t.WithClause, context: DeparserContext): string {
    const output: string[] = ['WITH'];
    
    if (node.recursive) {
      output.push('RECURSIVE');
    }
    
    const ctes = ListUtils.unwrapList(node.ctes);
    const cteStrs = ctes.map(cte => this.visit(cte, context));
    output.push(cteStrs.join(', '));
    
    return output.join(' ');
  }

  ResTarget(node: t.ResTarget, context: DeparserContext): string {
    const output: string[] = [];
    
    if (context.update && node.name) {
      output.push(QuoteUtils.quote(node.name));
      output.push('=');
      if (node.val) {
        output.push(this.deparse(node.val, context));
      }
    } else {
      if (node.val) {
        output.push(this.deparse(node.val, context));
      }
      
      if (node.name) {
        output.push('AS');
        output.push(QuoteUtils.quote(node.name));
      }
    }
    
    return output.join(' ');
  }

  deparseReturningList(list: t.Node[], context: DeparserContext): string {
    return ListUtils.unwrapList(list)
      .map(returning => {
        const val = this.visit(returning.val, context);
        const alias = returning.name ? ` AS ${QuoteUtils.quote(returning.name)}` : '';
        return val + alias;
      })
      .join(',');
  }

  BoolExpr(node: t.BoolExpr, context: DeparserContext): string {
    const boolop = node.boolop as string;
    const args = ListUtils.unwrapList(node.args);
    
    let formatStr = '%s';
    if (context.bool) {
      formatStr = '(%s)';
    }
    
    const boolContext = { ...context, bool: true };

    switch (boolop) {
      case 'AND_EXPR':
        const andArgs = args.map(arg => this.visit(arg, boolContext)).join(' AND ');
        return formatStr.replace('%s', andArgs);
      case 'OR_EXPR':
        const orArgs = args.map(arg => this.visit(arg, boolContext)).join(' OR ');
        return formatStr.replace('%s', orArgs);
      case 'NOT_EXPR':
        return `NOT (${this.visit(args[0], context)})`;
      default:
        throw new Error(`Unhandled BoolExpr boolop: ${boolop}`);
    }
  }

  FuncCall(node: t.FuncCall, context: DeparserContext): string {
    const funcname = ListUtils.unwrapList(node.funcname);
    const args = ListUtils.unwrapList(node.args);
    const name = funcname.map(n => this.visit(n, context)).join('.');

    const params: string[] = [];
    
    if (node.agg_distinct) {
      params.push('DISTINCT');
    }
    
    if (node.agg_star) {
      params.push('*');
    } else {
      params.push(...args.map(arg => this.visit(arg, context)));
    }

    let result = `${name}(${params.join(', ')})`;

    if (node.agg_filter) {
      result += ` FILTER (WHERE ${this.visit(node.agg_filter, context)})`;
    }

    if (node.over) {
      result += ` OVER ${this.WindowDef(node.over, context)}`;
    }

    return result;
  }

  FuncExpr(node: t.FuncExpr, context: DeparserContext): string {
    const funcName = `func_${node.funcid}`;
    const args = node.args ? ListUtils.unwrapList(node.args).map(arg => this.visit(arg, context)).join(', ') : '';
    return `${funcName}(${args})`;
  }

  A_Const(node: t.A_Const, context: DeparserContext): string {
    const nodeAny = node as any;
    
    if (nodeAny.ival !== undefined) {
      if (typeof nodeAny.ival === 'object' && nodeAny.ival.ival !== undefined) {
        return nodeAny.ival.ival.toString();
      } else {
        return nodeAny.ival.toString();
      }
    } else if (nodeAny.fval !== undefined) {
      if (typeof nodeAny.fval === 'object' && nodeAny.fval.fval !== undefined) {
        return nodeAny.fval.fval;
      } else {
        return nodeAny.fval;
      }
    } else if (nodeAny.sval !== undefined) {
      if (typeof nodeAny.sval === 'object' && nodeAny.sval.sval !== undefined) {
        return QuoteUtils.escape(nodeAny.sval.sval);
      } else if (typeof nodeAny.sval === 'object' && nodeAny.sval.String && nodeAny.sval.String.sval !== undefined) {
        return QuoteUtils.escape(nodeAny.sval.String.sval);
      } else {
        return QuoteUtils.escape(nodeAny.sval);
      }
    }else if (nodeAny.boolval !== undefined) {
      if (typeof nodeAny.boolval === 'object' && nodeAny.boolval.boolval !== undefined) {
        return nodeAny.boolval.boolval ? 'true' : 'false';
      } else {
        return nodeAny.boolval ? 'true' : 'false';
      }
    } else if (nodeAny.bsval !== undefined) {
      if (typeof nodeAny.bsval === 'object' && nodeAny.bsval.bsval !== undefined) {
        return nodeAny.bsval.bsval;
      } else {
        return nodeAny.bsval;
      }
    }
    
    if (nodeAny.val) {
      if (nodeAny.val.Integer?.ival !== undefined) {
        return nodeAny.val.Integer.ival.toString();
      } else if (nodeAny.val.Float?.fval !== undefined) {
        return nodeAny.val.Float.fval;
      } else if (nodeAny.val.String?.sval !== undefined) {
        return QuoteUtils.escape(nodeAny.val.String.sval);
      } else if (nodeAny.val.Boolean?.boolval !== undefined) {
        return nodeAny.val.Boolean.boolval ? 'true' : 'false';
      } else if (nodeAny.val.BitString?.bsval !== undefined) {
        return nodeAny.val.BitString.bsval;
      }
    }
    
    return 'NULL';
  }

  ColumnRef(node: t.ColumnRef, context: DeparserContext): string {
    const fields = ListUtils.unwrapList(node.fields);
    return fields.map(field => {
      if (field.String) {
        return QuoteUtils.quote(field.String.sval || field.String.str);
      } else if (field.A_Star) {
        return '*';
      }
      return this.visit(field, context);
    }).join('.');
  }

  TypeName(node: t.TypeName, context: DeparserContext): string {
    if (!node.names) {
      return '';
    }

    const names = node.names.map((name: any) => {
      if (name.String) {
        return name.String.sval || name.String.str;
      }
      return '';
    }).filter(Boolean);

    if (names.length === 0) {
      return '';
    }

    let args: string | null = null;
    if (node.typmods) {
      args = this.formatTypeMods(node.typmods, context);
    } else if (node.typemod && node.typemod !== -1) {
      args = this.formatSingleTypeMod(node.typemod, names[0]);
    }

    const mods = (name: string, size: string | null) => {
      if (size != null) {
        return `${name}(${size})`;
      }
      return name;
    };

    if (names.length === 1) {
      const typeName = names[0];
      
      if (typeName === 'char') {
        return mods('"char"', args);
      }
      
      let result = mods(typeName, args);
      
      if (node.arrayBounds && node.arrayBounds.length > 0) {
        result += '[]';
      }
      
      return result;
    }

    if (names.length === 2) {
      const [catalog, type] = names;
      
      if (catalog === 'pg_catalog' && type === 'char') {
        return mods('pg_catalog."char"', args);
      }
      
      if (catalog === 'pg_catalog') {
        const pgTypeName = this.getPgCatalogTypeName(type, args);
        let result = mods(pgTypeName, args);
        
        if (node.arrayBounds && node.arrayBounds.length > 0) {
          result += '[]';
        }
        
        return result;
      }
    }

    const quotedNames = names.map((name: string) => QuoteUtils.quote(name));
    let result = mods(quotedNames.join('.'), args);
    
    if (node.arrayBounds && node.arrayBounds.length > 0) {
      result += '[]';
    }
    
    return result;
  }

  Alias(node: t.Alias, context: DeparserContext): string {
    const name = node.aliasname;
    const output: string[] = ['AS'];

    if (node.colnames) {
      const colnames = ListUtils.unwrapList(node.colnames);
      const quotedColnames = colnames.map(col => {
        const colStr = this.deparse(col, context);
        return QuoteUtils.quote(colStr);
      });
      output.push(QuoteUtils.quote(name) + this.formatter.parens(quotedColnames.join(', ')));
    } else {
      output.push(QuoteUtils.quote(name));
    }

    return output.join(' ');
  }

  RangeVar(node: t.RangeVar, context: DeparserContext): string {
    const output: string[] = [];

    let tableName = '';
    if (node.schemaname) {
      tableName = QuoteUtils.quote(node.schemaname) + '.' + QuoteUtils.quote(node.relname);
    } else {
      tableName = QuoteUtils.quote(node.relname);
    }
    output.push(tableName);

    if (node.alias) {
      const aliasStr = this.Alias(node.alias, context);
      output.push(aliasStr);
    }

    return output.join(' ');
  }

  formatTypeMods(typmods: t.Node[], context: DeparserContext): string | null {
    if (!typmods || typmods.length === 0) {
      return null;
    }

    const mods = ListUtils.unwrapList(typmods);
    return mods.map(mod => {
      return this.deparse(mod, context);
    }).join(', ');
  }

  formatSingleTypeMod(typemod: number, typeName: string): string | null {
    
    switch (typeName) {
      case 'varchar':
      case 'bpchar':
      case 'char':
        if (typemod > 4) {
          return (typemod - 64).toString();
        }
        break;
      case 'numeric':
      case 'decimal':
        if (typemod > 4) {
          const modValue = typemod - 4;
          const precision = (modValue >> 16) & 0xFFFF;
          const scale = modValue & 0xFFFF;
          if (scale > 0) {
            return `${precision},${scale}`;
          } else {
            return precision.toString();
          }
        }
        break;
      case 'time':
      case 'timetz':
      case 'timestamp':
      case 'timestamptz':
      case 'interval':
        if (typemod >= 0) {
          return typemod.toString();
        }
        break;
    }
    
    return null;
  }

  getPgCatalogTypeName(typeName: string, size: string | null): string {
    switch (typeName) {
      case 'bpchar':
        if (size != null) {
          return 'char';
        }
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
        return `pg_catalog.${typeName}`;
    }
  }

  A_ArrayExpr(node: t.A_ArrayExpr, context: DeparserContext): string {
    const elements = ListUtils.unwrapList(node.elements);
    const elementStrs = elements.map(el => this.visit(el, context));
    return `ARRAY[${elementStrs.join(', ')}]`;
  }

  A_Indices(node: t.A_Indices, context: DeparserContext): string {
    const output: string[] = [];

    if (node.is_slice) {
      if (node.lidx) {
        output.push(this.visit(node.lidx, context));
      }
      output.push(':');
      if (node.uidx) {
        output.push(this.visit(node.uidx, context));
      }
    } else {
      if (node.uidx) {
        output.push(this.visit(node.uidx, context));
      }
    }

    return `[${output.join('')}]`;
  }

  A_Indirection(node: t.A_Indirection, context: DeparserContext): string {
    const output = [this.visit(node.arg, context)];
    const indirection = ListUtils.unwrapList(node.indirection);
    
    for (const subnode of indirection) {
      if (subnode.String || subnode.A_Star) {
        const value = subnode.A_Star ? '*' : QuoteUtils.quote(subnode.String.sval || subnode.String.str);
        output.push(`.${value}`);
      } else {
        output.push(this.visit(subnode, context));
      }
    }
    
    return output.join('');
  }

  A_Star(node: t.A_Star, context: DeparserContext): string { 
    return '*'; 
  }

  CaseExpr(node: t.CaseExpr, context: DeparserContext): string {
    const output: string[] = ['CASE'];

    if (node.arg) {
      output.push(this.visit(node.arg, context));
    }

    const args = ListUtils.unwrapList(node.args);
    for (const arg of args) {
      output.push(this.visit(arg, context));
    }

    if (node.defresult) {
      output.push('ELSE');
      output.push(this.visit(node.defresult, context));
    }

    output.push('END');
    return output.join(' ');
  }

  CoalesceExpr(node: t.CoalesceExpr, context: DeparserContext): string {
    const args = ListUtils.unwrapList(node.args);
    const argStrs = args.map(arg => this.visit(arg, context));
    return `COALESCE(${argStrs.join(', ')})`;
  }

  TypeCast(node: t.TypeCast, context: DeparserContext): string {
    return this.formatter.format([
      this.visit(node.arg, context),
      '::',
      this.TypeName(node.typeName, context)
    ]);
  }

  CollateClause(node: t.CollateClause, context: DeparserContext): string {
    const output: string[] = [];
    
    if (node.arg) {
      output.push(this.visit(node.arg, context));
    }
    
    output.push('COLLATE');
    
    if (node.collname) {
      const collname = ListUtils.unwrapList(node.collname);
      output.push(QuoteUtils.quote(collname.map(n => this.visit(n, context))));
    }
    
    return output.join(' ');
  }

  BooleanTest(node: t.BooleanTest, context: DeparserContext): string {
    const output: string[] = [];
    const boolContext = { ...context, bool: true };
    
    output.push(this.visit(node.arg, boolContext));
    
    switch (node.booltesttype as string) {
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

  NullTest(node: t.NullTest, context: DeparserContext): string {
    const output: string[] = [];
    
    output.push(this.visit(node.arg, context));
    
    switch (node.nulltesttype as string) {
      case 'IS_NULL':
        output.push('IS NULL');
        break;
      case 'IS_NOT_NULL':
        output.push('IS NOT NULL');
        break;
    }
    
    return output.join(' ');
  }

  String(node: t.String, context: DeparserContext): string { 
    if (context.isStringLiteral) {
      return `'${node.sval || ''}'`;
    }
    return node.sval || ''; 
  }
  
  Integer(node: t.Integer, context: DeparserContext): string { 
    return node.ival?.toString() || '0'; 
  }
  
  Float(node: t.Float, context: DeparserContext): string { 
    return node.fval || '0.0'; 
  }
  
  Boolean(node: t.Boolean, context: DeparserContext): string { 
    return node.boolval ? 'true' : 'false'; 
  }
  
  BitString(node: t.BitString, context: DeparserContext): string { 
    return `B'${node.bsval}'`; 
  }
  
  Null(node: t.Node, context: DeparserContext): string { 
    return 'NULL'; 
  }

  List(node: t.List, context: DeparserContext): string {
    if (!node.items || node.items.length === 0) {
      return '';
    }
    return node.items.map((item: any) => this.visit(item, context)).join(', ');
  }

  CreateStmt(node: t.CreateStmt, context: DeparserContext): string {
    const output: string[] = ['CREATE'];

    if (node.relation && node.relation.relpersistence === 't') {
      output.push('TEMPORARY');
    }

    if (node.if_not_exists) {
      output.push('TABLE IF NOT EXISTS');
    } else {
      output.push('TABLE');
    }

    output.push(this.RangeVar(node.relation, context));

    if (node.tableElts) {
      const elements = ListUtils.unwrapList(node.tableElts);
      const elementStrs = elements.map(el => {
        return this.deparse(el, context);
      });
      output.push(this.formatter.parens(elementStrs.join(', ')));
    }

    if (node.inhRelations) {
      output.push('INHERITS');
      const inherits = ListUtils.unwrapList(node.inhRelations);
      const inheritStrs = inherits.map(rel => this.visit(rel, context));
      output.push(this.formatter.parens(inheritStrs.join(', ')));
    }

    return output.join(' ');
  }

  ColumnDef(node: t.ColumnDef, context: DeparserContext): string {
    const output: string[] = [];

    if (node.colname) {
      output.push(QuoteUtils.quote(node.colname));
    }

    if (node.typeName) {
      output.push(this.TypeName(node.typeName, context));
    }

    if (node.constraints) {
      const constraints = ListUtils.unwrapList(node.constraints);
      const constraintStrs = constraints.map(constraint => {
        return this.visit(constraint, context);
      });
      output.push(...constraintStrs);
    }

    if (node.raw_default) {
      output.push('DEFAULT');
      output.push(this.visit(node.raw_default, context));
    }

    if (node.is_not_null) {
      output.push('NOT NULL');
    }

    return output.join(' ');
  }

  Constraint(node: t.Constraint, context: DeparserContext): string {
    const output: string[] = [];

    switch (node.contype) {
      case 'CONSTR_NULL':
        output.push('NULL');
        break;
      case 'CONSTR_NOTNULL':
        output.push('NOT NULL');
        break;
      case 'CONSTR_DEFAULT':
        output.push('DEFAULT');
        if (node.raw_expr) {
          output.push(this.visit(node.raw_expr, context));
        }
        break;
      case 'CONSTR_CHECK':
        output.push('CHECK');
        if (node.raw_expr) {
          output.push(this.formatter.parens(this.visit(node.raw_expr, context)));
        }
        break;
      case 'CONSTR_PRIMARY':
        output.push('PRIMARY KEY');
        if (node.keys && node.keys.length > 0) {
          const keyList = ListUtils.unwrapList(node.keys)
            .map(key => this.visit(key, context))
            .join(', ');
          output.push(`(${keyList})`);
        }
        break;
      case 'CONSTR_UNIQUE':
        output.push('UNIQUE');
        if (node.keys && node.keys.length > 0) {
          const keyList = ListUtils.unwrapList(node.keys)
            .map(key => this.visit(key, context))
            .join(', ');
          output.push(`(${keyList})`);
        }
        break;
      case 'CONSTR_FOREIGN':
        if (node.conname) {
          output.push('CONSTRAINT');
          output.push(QuoteUtils.quote(node.conname));
        }
        output.push('FOREIGN KEY');
        if (node.fk_attrs && node.fk_attrs.length > 0) {
          const fkAttrs = ListUtils.unwrapList(node.fk_attrs)
            .map(attr => this.visit(attr, context))
            .join(', ');
          output.push(`(${fkAttrs})`);
        }
        output.push('REFERENCES');
        if (node.pktable) {
          output.push(this.RangeVar(node.pktable, context));
        }
        if (node.pk_attrs && node.pk_attrs.length > 0) {
          const pkAttrs = ListUtils.unwrapList(node.pk_attrs)
            .map(attr => this.visit(attr, context))
            .join(', ');
          output.push(`(${pkAttrs})`);
        }
        if (node.fk_matchtype && node.fk_matchtype !== 's') {
          switch (node.fk_matchtype) {
            case 'f':
              output.push('MATCH FULL');
              break;
            case 'p':
              output.push('MATCH PARTIAL');
              break;
          }
        }
        if (node.fk_upd_action && node.fk_upd_action !== 'a') {
          output.push('ON UPDATE');
          switch (node.fk_upd_action) {
            case 'r':
              output.push('RESTRICT');
              break;
            case 'c':
              output.push('CASCADE');
              break;
            case 'n':
              output.push('SET NULL');
              break;
            case 'd':
              output.push('SET DEFAULT');
              break;
          }
        }
        if (node.fk_del_action && node.fk_del_action !== 'a') {
          output.push('ON DELETE');
          switch (node.fk_del_action) {
            case 'r':
              output.push('RESTRICT');
              break;
            case 'c':
              output.push('CASCADE');
              break;
            case 'n':
              output.push('SET NULL');
              break;
            case 'd':
              output.push('SET DEFAULT');
              break;
          }
        }
        break;
    }

    return output.join(' ');
  }

  SubLink(node: t.SubLink, context: DeparserContext): string {
    return this.formatter.parens(this.visit(node.subselect, context));
  }

  CaseWhen(node: t.CaseWhen, context: DeparserContext): string {
    const output: string[] = ['WHEN'];
    
    if (node.expr) {
      output.push(this.visit(node.expr, context));
    }
    
    output.push('THEN');
    
    if (node.result) {
      output.push(this.visit(node.result, context));
    }
    
    return output.join(' ');
  }

  WindowDef(node: t.WindowDef, context: DeparserContext): string {
    const output: string[] = [];
    
    if (node.name) {
      output.push(node.name);
    }
    
    const windowParts: string[] = [];
    
    if (node.partitionClause) {
      const partitions = ListUtils.unwrapList(node.partitionClause);
      const partitionStrs = partitions.map(p => this.visit(p, context));
      windowParts.push(`PARTITION BY ${partitionStrs.join(', ')}`);
    }
    
    if (node.orderClause) {
      const orders = ListUtils.unwrapList(node.orderClause);
      const orderStrs = orders.map(o => this.visit(o, context));
      windowParts.push(`ORDER BY ${orderStrs.join(', ')}`);
    }
    
    if (windowParts.length > 0) {
      output.push(windowParts.join(' '));
    }
    
    return output.join(' ');
  }

  SortBy(node: t.SortBy, context: DeparserContext): string {
    const output: string[] = [];
    
    if (node.node) {
      output.push(this.visit(node.node, context));
    }
    
    if (node.sortby_dir === 'SORTBY_USING' && node.useOp) {
      output.push('USING');
      const useOp = ListUtils.unwrapList(node.useOp);
      output.push(useOp.map(op => this.visit(op, context)).join('.'));
    } else if (node.sortby_dir === 'SORTBY_ASC') {
      output.push('ASC');
    } else if (node.sortby_dir === 'SORTBY_DESC') {
      output.push('DESC');
    }
    
    if (node.sortby_nulls === 'SORTBY_NULLS_FIRST') {
      output.push('NULLS FIRST');
    } else if (node.sortby_nulls === 'SORTBY_NULLS_LAST') {
      output.push('NULLS LAST');
    }
    
    return output.join(' ');
  }

  GroupingSet(node: t.GroupingSet, context: DeparserContext): string {
    switch (node.kind) {
      case 'GROUPING_SET_EMPTY':
        return '()';
      case 'GROUPING_SET_SIMPLE':
        // Not present in raw parse trees
        return '';
      case 'GROUPING_SET_ROLLUP':
        const rollupContent = ListUtils.unwrapList(node.content);
        const rollupStrs = rollupContent.map(c => this.visit(c, context));
        return `ROLLUP (${rollupStrs.join(', ')})`;
      case 'GROUPING_SET_CUBE':
        const cubeContent = ListUtils.unwrapList(node.content);
        const cubeStrs = cubeContent.map(c => this.visit(c, context));
        return `CUBE (${cubeStrs.join(', ')})`;
      case 'GROUPING_SET_SETS':
        const setsContent = ListUtils.unwrapList(node.content);
        const setsStrs = setsContent.map(c => this.visit(c, context));
        return `GROUPING SETS (${setsStrs.join(', ')})`;
      default:
        return '';
    }
  }

  CommonTableExpr(node: t.CommonTableExpr, context: DeparserContext): string {
    const output: string[] = [];
    
    if (node.ctename) {
      output.push(node.ctename);
    }
    
    if (node.aliascolnames) {
      const colnames = ListUtils.unwrapList(node.aliascolnames);
      const colnameStrs = colnames.map(col => this.visit(col, context));
      output.push(this.formatter.parens(colnameStrs.join(', ')));
    }
    
    output.push('AS');
    
    if (node.ctequery) {
      output.push(this.formatter.parens(this.visit(node.ctequery, context)));
    }
    
    return output.join(' ');
  }

  ParamRef(node: t.ParamRef, context: DeparserContext): string {
    return `$${node.number}`;
  }

  MinMaxExpr(node: t.MinMaxExpr, context: DeparserContext): string {
    const args = ListUtils.unwrapList(node.args);
    const argStrs = args.map(arg => this.visit(arg, context));
    
    if (node.op === 'IS_GREATEST') {
      return `GREATEST(${argStrs.join(', ')})`;
    } else {
      return `LEAST(${argStrs.join(', ')})`;
    }
  }

  RowExpr(node: t.RowExpr, context: DeparserContext): string {
    const args = ListUtils.unwrapList(node.args);
    const argStrs = args.map(arg => this.visit(arg, context));
    return `ROW(${argStrs.join(', ')})`;
  }

  OpExpr(node: t.OpExpr, context: DeparserContext): string {
    const args = ListUtils.unwrapList(node.args);
    if (args.length === 2) {
      const left = this.visit(args[0], context);
      const right = this.visit(args[1], context);
      const opname = this.getOperatorName(node.opno);
      return `${left} ${opname} ${right}`;
    } else if (args.length === 1) {
      const arg = this.visit(args[0], context);
      const opname = this.getOperatorName(node.opno);
      return `${opname} ${arg}`;
    }
    throw new Error(`Unsupported OpExpr with ${args.length} arguments`);
  }

  DistinctExpr(node: t.DistinctExpr, context: DeparserContext): string {
    const args = ListUtils.unwrapList(node.args);
    if (args.length === 2) {
      const literalContext = { ...context, isStringLiteral: true };
      const left = this.visit(args[0], literalContext);
      const right = this.visit(args[1], literalContext);
      return `${left} IS DISTINCT FROM ${right}`;
    }
    throw new Error(`DistinctExpr requires exactly 2 arguments, got ${args.length}`);
  }

  NullIfExpr(node: t.NullIfExpr, context: DeparserContext): string {
    const args = ListUtils.unwrapList(node.args);
    if (args.length === 2) {
      const literalContext = { ...context, isStringLiteral: true };
      const left = this.visit(args[0], literalContext);
      const right = this.visit(args[1], literalContext);
      return `NULLIF(${left}, ${right})`;
    }
    throw new Error(`NullIfExpr requires exactly 2 arguments, got ${args.length}`);
  }

  ScalarArrayOpExpr(node: t.ScalarArrayOpExpr, context: DeparserContext): string {
    const args = ListUtils.unwrapList(node.args);
    if (args.length === 2) {
      const left = this.visit(args[0], context);
      const right = this.visit(args[1], context);
      const operator = node.useOr ? 'ANY' : 'ALL';
      const opname = this.getOperatorName(node.opno);
      return `${left} ${opname} ${operator}(${right})`;
    }
    throw new Error(`ScalarArrayOpExpr requires exactly 2 arguments, got ${args.length}`);
  }

  Aggref(node: t.Aggref, context: DeparserContext): string {
    const funcName = this.getAggFunctionName(node.aggfnoid);
    let result = funcName + '(';

    if (node.aggdistinct && node.aggdistinct.length > 0) {
      result += 'DISTINCT ';
    }

    if (node.args && node.args.length > 0) {
      const args = ListUtils.unwrapList(node.args);
      const argStrs = args.map(arg => this.visit(arg, context));
      result += argStrs.join(', ');
    } else if (funcName.toUpperCase() === 'COUNT') {
      result += '*';
    }

    result += ')';

    if (node.aggorder && node.aggorder.length > 0) {
      result += ' ORDER BY ';
      const orderItems = ListUtils.unwrapList(node.aggorder);
      const orderStrs = orderItems.map(item => this.visit(item, context));
      result += orderStrs.join(', ');
    }

    return result;
  }

  WindowFunc(node: t.WindowFunc, context: DeparserContext): string {
    const funcName = this.getWindowFunctionName(node.winfnoid);
    let result = funcName + '(';

    if (node.args && node.args.length > 0) {
      const args = ListUtils.unwrapList(node.args);
      const argStrs = args.map(arg => this.visit(arg, context));
      result += argStrs.join(', ');
    }

    result += ') OVER ';

    if (node.winref && typeof node.winref === 'object') {
      result += '(' + this.visit(node.winref as any, context) + ')';
    } else if (node.winref) {
      result += '(ORDER BY created_at ASC)';
    } else {
      result += '()';
    }

    return result;
  }



  FieldSelect(node: t.FieldSelect, context: DeparserContext): string {
    const output: string[] = [];
    
    if (node.arg) {
      output.push(this.visit(node.arg, context));
    }

    if (node.fieldnum !== undefined) {
      output.push(`.field_${node.fieldnum}`);
    }

    return output.join('');
  }

  RelabelType(node: t.RelabelType, context: DeparserContext): string {
    if (node.arg) {
      const literalContext = { ...context, isStringLiteral: true };
      return this.visit(node.arg, literalContext);
    }
    return '';
  }

  CoerceViaIO(node: t.CoerceViaIO, context: DeparserContext): string {
    if (node.arg) {
      return this.visit(node.arg, context);
    }
    return '';
  }

  ArrayCoerceExpr(node: t.ArrayCoerceExpr, context: DeparserContext): string {
    if (node.arg) {
      return this.visit(node.arg, context);
    }
    return '';
  }

  ConvertRowtypeExpr(node: t.ConvertRowtypeExpr, context: DeparserContext): string {
    if (node.arg) {
      const literalContext = { ...context, isStringLiteral: true };
      return this.visit(node.arg, literalContext);
    }
    return '';
  }

  NamedArgExpr(node: t.NamedArgExpr, context: DeparserContext): string {
    const output: string[] = [];
    
    if (node.name) {
      output.push(node.name);
      output.push('=>');
    }
    
    if (node.arg) {
      output.push(this.visit(node.arg, context));
    }
    
    return output.join(' ');
  }

  ViewStmt(node: t.ViewStmt, context: DeparserContext): string {
    const output: string[] = [];
    
    output.push('CREATE');
    
    if (node.replace) {
      output.push('OR REPLACE');
    }
    
    output.push('VIEW');
    
    if (node.view) {
      output.push(this.RangeVar(node.view, context));
    }
    
    if (node.aliases && node.aliases.length > 0) {
      const aliasStrs = ListUtils.unwrapList(node.aliases).map(alias => this.visit(alias, context));
      output.push(this.formatter.parens(aliasStrs.join(', ')));
    }
    
    output.push('AS');
    
    if (node.query) {
      output.push(this.visit(node.query, context));
    }
    
    if (node.withCheckOption) {
      switch (node.withCheckOption) {
        case 'CASCADED_CHECK_OPTION':
          output.push('WITH CASCADED CHECK OPTION');
          break;
        case 'LOCAL_CHECK_OPTION':
          output.push('WITH LOCAL CHECK OPTION');
          break;
      }
    }
    
    return output.join(' ');
  }

  IndexStmt(node: t.IndexStmt, context: DeparserContext): string {
    const output: string[] = [];
    
    output.push('CREATE');
    
    if (node.unique) {
      output.push('UNIQUE');
    }
    
    output.push('INDEX');
    
    if (node.concurrent) {
      output.push('CONCURRENTLY');
    }
    
    if (node.if_not_exists) {
      output.push('IF NOT EXISTS');
    }
    
    if (node.idxname) {
      output.push(QuoteUtils.quote(node.idxname));
    }
    
    output.push('ON');
    
    if (node.relation) {
      output.push(this.RangeVar(node.relation, context));
    }
    
    if (node.accessMethod && node.accessMethod !== 'btree') {
      output.push('USING');
      output.push(node.accessMethod);
    }
    
    if (node.indexParams && node.indexParams.length > 0) {
      const paramStrs = ListUtils.unwrapList(node.indexParams).map(param => this.visit(param, context));
      output.push(this.formatter.parens(paramStrs.join(', ')));
    }
    
    if (node.indexIncludingParams && node.indexIncludingParams.length > 0) {
      const includeStrs = ListUtils.unwrapList(node.indexIncludingParams).map(param => this.visit(param, context));
      output.push('INCLUDE');
      output.push(this.formatter.parens(includeStrs.join(', ')));
    }
    
    if (node.whereClause) {
      output.push('WHERE');
      output.push(this.visit(node.whereClause, context));
    }
    
    if (node.tableSpace) {
      output.push('TABLESPACE');
      output.push(QuoteUtils.quote(node.tableSpace));
    }
    
    return output.join(' ');
  }

  IndexElem(node: t.IndexElem, context: DeparserContext): string {
    const output: string[] = [];
    
    if (node.name) {
      output.push(node.name);
    } else if (node.expr) {
      output.push(this.formatter.parens(this.visit(node.expr, context)));
    }
    
    if (node.collation && node.collation.length > 0) {
      const collationStrs = ListUtils.unwrapList(node.collation).map(coll => this.visit(coll, context));
      output.push('COLLATE');
      output.push(collationStrs.join('.'));
    }
    
    if (node.opclass && node.opclass.length > 0) {
      const opclassStrs = ListUtils.unwrapList(node.opclass).map(op => this.visit(op, context));
      output.push(opclassStrs.join('.'));
    }
    
    if (node.ordering) {
      switch (node.ordering) {
        case 'SORTBY_ASC':
          output.push('ASC');
          break;
        case 'SORTBY_DESC':
          output.push('DESC');
          break;
      }
    }
    
    if (node.nulls_ordering) {
      switch (node.nulls_ordering) {
        case 'SORTBY_NULLS_FIRST':
          output.push('NULLS FIRST');
          break;
        case 'SORTBY_NULLS_LAST':
          output.push('NULLS LAST');
          break;
      }
    }
    
    return output.join(' ');
  }

  private getAggFunctionName(aggfnoid?: number): string {
    const commonAggFunctions: { [key: number]: string } = {
      2100: 'avg',
      2101: 'count',
      2102: 'max',
      2103: 'min',
      2104: 'sum',
      2105: 'stddev',
      2106: 'variance',
      2107: 'array_agg',
      2108: 'string_agg'
    };
    
    return commonAggFunctions[aggfnoid || 0] || 'unknown_agg';
  }

  private getWindowFunctionName(winfnoid?: number): string {
    const commonWindowFunctions: { [key: number]: string } = {
      3100: 'row_number',
      3101: 'rank',
      3102: 'dense_rank',
      3103: 'percent_rank',
      3104: 'cume_dist',
      3105: 'ntile',
      3106: 'lag',
      3107: 'lead',
      3108: 'first_value',
      3109: 'last_value'
    };
    
    return commonWindowFunctions[winfnoid || 0] || 'unknown_window_func';
  }

  private getOperatorName(opno?: number): string {
    const commonOperators: { [key: number]: string } = {
      96: '=',
      518: '<>',
      97: '<',
      521: '>',
      523: '<=',
      525: '>=',
      551: '+',
      552: '-',
      553: '*',
      554: '/',
      555: '%',
      484: '-', // unary minus
      1752: '~~', // LIKE
      1753: '!~~', // NOT LIKE
      1754: '~~*', // ILIKE
      1755: '!~~*', // NOT ILIKE
      15: '=', // int4eq
      58: '<', // int4lt
      59: '<=', // int4le
      61: '>', // int4gt
      62: '>=', // int4ge
    };
    
    return commonOperators[opno || 0] || '=';
  }

  JoinExpr(node: t.JoinExpr, context: DeparserContext): string {
    const output: string[] = [];
    
    if (node.larg) {
      output.push(this.visit(node.larg, context));
    }
    
    switch (node.jointype) {
      case 'JOIN_INNER':
        output.push('INNER JOIN');
        break;
      case 'JOIN_LEFT':
        output.push('LEFT JOIN');
        break;
      case 'JOIN_FULL':
        output.push('FULL JOIN');
        break;
      case 'JOIN_RIGHT':
        output.push('RIGHT JOIN');
        break;
      default:
        output.push('JOIN');
    }
    
    if (node.rarg) {
      output.push(this.visit(node.rarg, context));
    }
    
    if (node.quals) {
      output.push('ON');
      output.push(this.visit(node.quals, context));
    }
    
    return output.join(' ');
  }

  FromExpr(node: t.FromExpr, context: DeparserContext): string {
    const fromlist = ListUtils.unwrapList(node.fromlist);
    const fromStrs = fromlist.map(item => this.visit(item, context));
    
    let result = fromStrs.join(', ');
    
    if (node.quals) {
      result += ` WHERE ${this.visit(node.quals, context)}`;
    }
    
    return result;
  }

  TransactionStmt(node: t.TransactionStmt, context: DeparserContext): string {
    const output: string[] = [];
    
    switch (node.kind) {
      case 'TRANS_STMT_BEGIN':
        output.push('BEGIN');
        break;
      case 'TRANS_STMT_START':
        output.push('START TRANSACTION');
        break;
      case 'TRANS_STMT_COMMIT':
        output.push('COMMIT');
        break;
      case 'TRANS_STMT_ROLLBACK':
        output.push('ROLLBACK');
        break;
      case 'TRANS_STMT_SAVEPOINT':
        output.push('SAVEPOINT');
        if (node.savepoint_name) {
          output.push(QuoteUtils.quote(node.savepoint_name));
        }
        break;
      case 'TRANS_STMT_RELEASE':
        output.push('RELEASE SAVEPOINT');
        if (node.savepoint_name) {
          output.push(QuoteUtils.quote(node.savepoint_name));
        }
        break;
      case 'TRANS_STMT_ROLLBACK_TO':
        output.push('ROLLBACK TO');
        if (node.savepoint_name) {
          output.push(QuoteUtils.quote(node.savepoint_name));
        }
        break;
      case 'TRANS_STMT_PREPARE':
        output.push('PREPARE TRANSACTION');
        if (node.gid) {
          output.push(`'${node.gid}'`);
        }
        break;
      case 'TRANS_STMT_COMMIT_PREPARED':
        output.push('COMMIT PREPARED');
        if (node.gid) {
          output.push(`'${node.gid}'`);
        }
        break;
      case 'TRANS_STMT_ROLLBACK_PREPARED':
        output.push('ROLLBACK PREPARED');
        if (node.gid) {
          output.push(`'${node.gid}'`);
        }
        break;
      default:
        throw new Error(`Unsupported TransactionStmt kind: ${node.kind}`);
    }
    
    // Handle transaction options (e.g., READ ONLY, ISOLATION LEVEL)
    if (node.options && node.options.length > 0) {
      const options = ListUtils.unwrapList(node.options).map(option => {
        if (option.DefElem) {
          const defElem = option.DefElem;
          if (defElem.defname === 'transaction_read_only') {
            return 'READ ONLY';
          } else if (defElem.defname === 'transaction_isolation') {
            if (defElem.arg && defElem.arg.A_Const && defElem.arg.A_Const.sval) {
              return `ISOLATION LEVEL ${defElem.arg.A_Const.sval.String.sval.toUpperCase()}`;
            }
          } else if (defElem.defname === 'transaction_deferrable') {
            return 'DEFERRABLE';
          }
        }
        return this.visit(option, context);
      }).filter(Boolean);
      
      if (options.length > 0) {
        output.push(options.join(', '));
      }
    }
    
    return output.join(' ');
  }

  VariableSetStmt(node: t.VariableSetStmt, context: DeparserContext): string {
    switch (node.kind) {
      case 'VAR_SET_VALUE':
        const localPrefix = node.is_local ? 'LOCAL ' : '';
        const args = node.args ? ListUtils.unwrapList(node.args).map(arg => this.visit(arg, context)).join(', ') : '';
        return `SET ${localPrefix}${node.name} = ${args}`;
      case 'VAR_SET_DEFAULT':
        return `SET ${node.name} TO DEFAULT`;
      case 'VAR_SET_CURRENT':
        return `SET ${node.name} FROM CURRENT`;
      case 'VAR_SET_MULTI':
        const assignments = node.args ? ListUtils.unwrapList(node.args).map(arg => {
          if (arg.VariableSetStmt) {
            return this.VariableSetStmt(arg.VariableSetStmt, context);
          }
          return this.visit(arg, context);
        }).join(', ') : '';
        return `SET ${assignments}`;
      case 'VAR_RESET':
        return `RESET ${node.name}`;
      case 'VAR_RESET_ALL':
        return 'RESET ALL';
      default:
        throw new Error(`Unsupported VariableSetStmt kind: ${node.kind}`);
    }
  }

  VariableShowStmt(node: t.VariableShowStmt, context: DeparserContext): string {
    if (node.name === 'ALL') {
      return 'SHOW ALL';
    }
    return `SHOW ${node.name}`;
  }

  CreateSchemaStmt(node: t.CreateSchemaStmt, context: DeparserContext): string {
    const output: string[] = ['CREATE SCHEMA'];

    if (node.if_not_exists) {
      output.push('IF NOT EXISTS');
    }

    if (node.schemaname) {
      output.push(node.schemaname);
    }

    if (node.authrole) {
      output.push('AUTHORIZATION');
      output.push(this.RoleSpec(node.authrole, context));
    }

    if (node.schemaElts && node.schemaElts.length > 0) {
      const elements = ListUtils.unwrapList(node.schemaElts)
        .map(element => this.visit(element, context))
        .join('; ');
      output.push(elements);
    }

    return output.join(' ');
  }

  RoleSpec(node: t.RoleSpec, context: DeparserContext): string {
    if (node.rolename) {
      return node.rolename;
    }
    return '';
  }

  roletype(node: any, context: DeparserContext): string {
    if (node.rolename) {
      return node.rolename;
    }
    return '';
  }

  DropStmt(node: t.DropStmt, context: DeparserContext): string {
    const output: string[] = ['DROP'];

    if (node.removeType) {
      switch (node.removeType) {
        case 'OBJECT_TABLE':
          output.push('TABLE');
          break;
        case 'OBJECT_VIEW':
          output.push('VIEW');
          break;
        case 'OBJECT_INDEX':
          output.push('INDEX');
          break;
        case 'OBJECT_SEQUENCE':
          output.push('SEQUENCE');
          break;
        case 'OBJECT_SCHEMA':
          output.push('SCHEMA');
          break;
        case 'OBJECT_FUNCTION':
          output.push('FUNCTION');
          break;
        case 'OBJECT_PROCEDURE':
          output.push('PROCEDURE');
          break;
        case 'OBJECT_DATABASE':
          output.push('DATABASE');
          break;
        case 'OBJECT_EXTENSION':
          output.push('EXTENSION');
          break;
        case 'OBJECT_TYPE':
          output.push('TYPE');
          break;
        case 'OBJECT_DOMAIN':
          output.push('DOMAIN');
          break;
        case 'OBJECT_TRIGGER':
          output.push('TRIGGER');
          break;
        case 'OBJECT_RULE':
          output.push('RULE');
          break;
        case 'OBJECT_POLICY':
          output.push('POLICY');
          break;
        case 'OBJECT_ROLE':
          output.push('ROLE');
          break;

        case 'OBJECT_TABLESPACE':
          output.push('TABLESPACE');
          break;
        case 'OBJECT_FOREIGN_SERVER':
          output.push('SERVER');
          break;
        case 'OBJECT_FDW':
          output.push('FOREIGN DATA WRAPPER');
          break;
        case 'OBJECT_PUBLICATION':
          output.push('PUBLICATION');
          break;
        case 'OBJECT_SUBSCRIPTION':
          output.push('SUBSCRIPTION');
          break;
        case 'OBJECT_CAST':
          output.push('CAST');
          break;
        case 'OBJECT_TRANSFORM':
          output.push('TRANSFORM');
          break;
        case 'OBJECT_ACCESS_METHOD':
          output.push('ACCESS METHOD');
          break;
        case 'OBJECT_OPERATOR':
          output.push('OPERATOR');
          break;
        case 'OBJECT_FOREIGN_TABLE':
          output.push('FOREIGN TABLE');
          break;
        case 'OBJECT_MATVIEW':
          output.push('MATERIALIZED VIEW');
          break;
        case 'OBJECT_OPCLASS':
          output.push('OPERATOR CLASS');
          break;
        case 'OBJECT_OPFAMILY':
          output.push('OPERATOR FAMILY');
          break;
        case 'OBJECT_COLLATION':
          output.push('COLLATION');
          break;
        case 'OBJECT_CONVERSION':
          output.push('CONVERSION');
          break;
        case 'OBJECT_LANGUAGE':
          output.push('LANGUAGE');
          break;
        case 'OBJECT_LARGEOBJECT':
          output.push('LARGE OBJECT');
          break;
        case 'OBJECT_AGGREGATE':
          output.push('AGGREGATE');
          break;
        case 'OBJECT_STATISTIC_EXT':
          output.push('STATISTICS');
          break;
        case 'OBJECT_EVENT_TRIGGER':
          output.push('EVENT TRIGGER');
          break;
        default:
          throw new Error(`Unsupported DROP object type: ${node.removeType}`);
      }
    }

    if (node.concurrent) {
      output.push('CONCURRENTLY');
    }

    if (node.missing_ok) {
      output.push('IF EXISTS');
    }

    if (node.objects && node.objects.length > 0) {
      const objects = node.objects.map((objList: any) => {
        if (Array.isArray(objList)) {
          const objName = objList.map(obj => this.visit(obj, context)).filter(name => name && name.trim()).join('.');
          return objName;
        }
        const objName = this.visit(objList, context);
        return objName;
      }).filter(name => name && name.trim()).join(', ');
      if (objects) {
        output.push(objects);
      }
    }

    if (node.behavior === 'DROP_CASCADE') {
      output.push('CASCADE');
    } else if (node.behavior === 'DROP_RESTRICT') {
      output.push('RESTRICT');
    }

    return output.join(' ');
  }

  TruncateStmt(node: t.TruncateStmt, context: DeparserContext): string {
    const output: string[] = ['TRUNCATE'];

    if (node.relations && node.relations.length > 0) {
      const relations = node.relations
        .map((relation: any) => this.visit(relation, context))
        .join(', ');
      output.push(relations);
    }

    if (node.restart_seqs) {
      output.push('RESTART IDENTITY');
    }

    if (node.behavior === 'DROP_CASCADE') {
      output.push('CASCADE');
    }

    return output.join(' ');
  }

  ReturnStmt(node: t.ReturnStmt, context: DeparserContext): string {
    const output: string[] = ['RETURN'];

    if (node.returnval) {
      const returnValue = this.visit(node.returnval, context);
      output.push(returnValue);
    }

    return output.join(' ');
  }

  PLAssignStmt(node: t.PLAssignStmt, context: DeparserContext): string {
    const output: string[] = [];

    if (node.name) {
      let nameWithIndirection = QuoteUtils.quote(node.name);

      if (node.indirection && node.indirection.length > 0) {
        const indirectionStr = node.indirection
          .map((ind: any) => this.visit(ind, context))
          .join('');
        nameWithIndirection += indirectionStr;
      }

      output.push(nameWithIndirection);
    }

    output.push(':=');

    if (node.val) {
      const valAny = node.val as any;
      if (valAny.targetList) {
        output.push('SELECT');
        const targets = this.targetList(valAny.targetList, context);
        output.push(targets);
      } else {
        const valueStr = this.visit(node.val as any, context);
        output.push(valueStr);
      }
    }

    return output.join(' ');
  }

  CopyStmt(node: t.CopyStmt, context: DeparserContext): string {
    const output: string[] = ['COPY'];

    if (node.relation) {
      const relationStr = this.RangeVar(node.relation, context);
      output.push(relationStr);
    } else if (node.query) {
      const queryStr = this.visit(node.query, context);
      output.push(`(${queryStr})`);
    }

    if (node.attlist && node.attlist.length > 0) {
      const columnList = ListUtils.unwrapList(node.attlist)
        .map(col => this.visit(col, context))
        .join(', ');
      output.push(`(${columnList})`);
    }

    if (node.is_from) {
      output.push('FROM');
    } else {
      output.push('TO');
    }

    if (node.is_program) {
      output.push('PROGRAM');
    }

    if (node.filename) {
      output.push(`'${node.filename}'`);
    } else {
      output.push('STDIN');
    }

    if (node.options && node.options.length > 0) {
      output.push('WITH');
      const optionsStr = ListUtils.unwrapList(node.options)
        .map(opt => this.visit(opt, context))
        .join(', ');
      output.push(`(${optionsStr})`);
    }

    if (node.whereClause) {
      output.push('WHERE');
      const whereStr = this.visit(node.whereClause, context);
      output.push(whereStr);
    }

    return output.join(' ');
  }

  AlterTableStmt(node: t.AlterTableStmt, context: DeparserContext): string {
    const output: string[] = ['ALTER'];

    if (node.objtype) {
      switch (node.objtype) {
        case 'OBJECT_TABLE':
          output.push('TABLE');
          break;
        case 'OBJECT_INDEX':
          output.push('INDEX');
          break;
        case 'OBJECT_SEQUENCE':
          output.push('SEQUENCE');
          break;
        case 'OBJECT_VIEW':
          output.push('VIEW');
          break;
        case 'OBJECT_MATVIEW':
          output.push('MATERIALIZED VIEW');
          break;
        case 'OBJECT_FOREIGN_TABLE':
          output.push('FOREIGN TABLE');
          break;
        default:
          output.push('TABLE');
      }
    } else {
      output.push('TABLE');
    }

    if (node.missing_ok) {
      output.push('IF EXISTS');
    }

    if (node.relation) {
      const relationStr = this.RangeVar(node.relation, context);
      output.push(relationStr);
    }

    if (node.cmds && node.cmds.length > 0) {
      const commandsStr = ListUtils.unwrapList(node.cmds)
        .map(cmd => this.visit(cmd, context))
        .join(', ');
      output.push(commandsStr);
    }

    return output.join(' ');
  }

  AlterTableCmd(node: t.AlterTableCmd, context: DeparserContext): string {
    const output: string[] = [];

    if (node.subtype) {
      switch (node.subtype) {
        case 'AT_AddColumn':
          output.push('ADD COLUMN');
          if (node.def) {
            const columnDef = this.visit(node.def, context);
            output.push(columnDef);
          }
          break;
        case 'AT_DropColumn':
          output.push('DROP COLUMN');
          if (node.name) {
            output.push(QuoteUtils.quote(node.name));
          }
          if (node.behavior === 'DROP_CASCADE') {
            output.push('CASCADE');
          } else if (node.behavior === 'DROP_RESTRICT') {
            output.push('RESTRICT');
          }
          break;
        case 'AT_AlterColumnType':
          output.push('ALTER COLUMN');
          if (node.name) {
            output.push(QuoteUtils.quote(node.name));
          }
          output.push('TYPE');
          if (node.def) {
            const typeDef = this.visit(node.def, context);
            output.push(typeDef);
          }
          break;
        case 'AT_SetTableSpace':
          output.push('SET TABLESPACE');
          if (node.name) {
            output.push(QuoteUtils.quote(node.name));
          }
          break;
        case 'AT_AddConstraint':
          output.push('ADD');
          if (node.def) {
            const constraintDef = this.visit(node.def, context);
            output.push(constraintDef);
          }
          break;
        case 'AT_DropConstraint':
          output.push('DROP CONSTRAINT');
          if (node.name) {
            output.push(QuoteUtils.quote(node.name));
          }
          if (node.behavior === 'DROP_CASCADE') {
            output.push('CASCADE');
          } else if (node.behavior === 'DROP_RESTRICT') {
            output.push('RESTRICT');
          }
          break;
        case 'AT_SetRelOptions':
          output.push('SET');
          if (node.def && Array.isArray(node.def)) {
            const options = ListUtils.unwrapList(node.def)
              .map(option => this.visit(option, context))
              .join(', ');
            output.push(`(${options})`);
          } else {
            output.push('()');
          }
          break;
        case 'AT_ResetRelOptions':
          output.push('RESET');
          if (node.def && Array.isArray(node.def)) {
            const options = ListUtils.unwrapList(node.def)
              .map(option => this.visit(option, context))
              .join(', ');
            output.push(`(${options})`);
          } else {
            output.push('()');
          }
          break;
        case 'AT_ColumnDefault':
          output.push('ALTER COLUMN');
          if (node.name) {
            output.push(QuoteUtils.quote(node.name));
          }
          if (node.def) {
            output.push('SET DEFAULT');
            output.push(this.visit(node.def, context));
          } else {
            output.push('DROP DEFAULT');
          }
          break;
        case 'AT_SetStorage':
          output.push('ALTER COLUMN');
          if (node.name) {
            output.push(QuoteUtils.quote(node.name));
          }
          output.push('SET STORAGE');
          if (node.def) {
            const storageType = this.visit(node.def, context);
            output.push(storageType);
          }
          break;
        case 'AT_ClusterOn':
          output.push('CLUSTER ON');
          if (node.name) {
            output.push(QuoteUtils.quote(node.name));
          }
          break;
        case 'AT_DropCluster':
          output.push('SET WITHOUT CLUSTER');
          break;
        case 'AT_ChangeOwner':
          output.push('OWNER TO');
          if (node.newowner) {
            output.push(this.RoleSpec(node.newowner, context));
          }
          break;
        case 'AT_AddInherit':
          output.push('INHERIT');
          if (node.def) {
            output.push(this.visit(node.def, context));
          }
          break;
        case 'AT_DropInherit':
          output.push('NO INHERIT');
          if (node.def) {
            output.push(this.visit(node.def, context));
          }
          break;
        case 'AT_SetNotNull':
          output.push('ALTER COLUMN');
          if (node.name) {
            output.push(QuoteUtils.quote(node.name));
          }
          output.push('SET NOT NULL');
          break;
        case 'AT_DropNotNull':
          output.push('ALTER COLUMN');
          if (node.name) {
            output.push(QuoteUtils.quote(node.name));
          }
          output.push('DROP NOT NULL');
          break;
        case 'AT_SetStatistics':
          output.push('ALTER COLUMN');
          if (node.name) {
            output.push(QuoteUtils.quote(node.name));
          }
          output.push('SET STATISTICS');
          if (node.def) {
            output.push(this.visit(node.def, context));
          }
          break;
        case 'AT_SetOptions':
          output.push('ALTER COLUMN');
          if (node.name) {
            output.push(QuoteUtils.quote(node.name));
          }
          output.push('SET');
          if (node.def && Array.isArray(node.def)) {
            const options = ListUtils.unwrapList(node.def)
              .map(option => this.visit(option, context))
              .join(', ');
            output.push(`(${options})`);
          }
          break;
        case 'AT_ResetOptions':
          output.push('ALTER COLUMN');
          if (node.name) {
            output.push(QuoteUtils.quote(node.name));
          }
          output.push('RESET');
          if (node.def && Array.isArray(node.def)) {
            const options = ListUtils.unwrapList(node.def)
              .map(option => this.visit(option, context))
              .join(', ');
            output.push(`(${options})`);
          }
          break;
        case 'AT_SetCompression':
          output.push('ALTER COLUMN');
          if (node.name) {
            output.push(QuoteUtils.quote(node.name));
          }
          output.push('SET COMPRESSION');
          if (node.def) {
            output.push(this.visit(node.def, context));
          }
          break;
        case 'AT_ValidateConstraint':
          output.push('VALIDATE CONSTRAINT');
          if (node.name) {
            output.push(QuoteUtils.quote(node.name));
          }
          break;
        case 'AT_EnableTrig':
          output.push('ENABLE TRIGGER');
          if (node.name) {
            output.push(QuoteUtils.quote(node.name));
          }
          break;
        case 'AT_EnableAlwaysTrig':
          output.push('ENABLE ALWAYS TRIGGER');
          if (node.name) {
            output.push(QuoteUtils.quote(node.name));
          }
          break;
        case 'AT_EnableReplicaTrig':
          output.push('ENABLE REPLICA TRIGGER');
          if (node.name) {
            output.push(QuoteUtils.quote(node.name));
          }
          break;
        case 'AT_DisableTrig':
          output.push('DISABLE TRIGGER');
          if (node.name) {
            output.push(QuoteUtils.quote(node.name));
          }
          break;
        case 'AT_EnableTrigAll':
          output.push('ENABLE TRIGGER ALL');
          break;
        case 'AT_DisableTrigAll':
          output.push('DISABLE TRIGGER ALL');
          break;
        case 'AT_EnableTrigUser':
          output.push('ENABLE TRIGGER USER');
          break;
        case 'AT_DisableTrigUser':
          output.push('DISABLE TRIGGER USER');
          break;
        case 'AT_EnableRule':
          output.push('ENABLE RULE');
          if (node.name) {
            output.push(QuoteUtils.quote(node.name));
          }
          break;
        case 'AT_EnableAlwaysRule':
          output.push('ENABLE ALWAYS RULE');
          if (node.name) {
            output.push(QuoteUtils.quote(node.name));
          }
          break;
        case 'AT_EnableReplicaRule':
          output.push('ENABLE REPLICA RULE');
          if (node.name) {
            output.push(QuoteUtils.quote(node.name));
          }
          break;
        case 'AT_DisableRule':
          output.push('DISABLE RULE');
          if (node.name) {
            output.push(QuoteUtils.quote(node.name));
          }
          break;
        case 'AT_SetAccessMethod':
          output.push('SET ACCESS METHOD');
          if (node.name) {
            output.push(QuoteUtils.quote(node.name));
          }
          break;
        case 'AT_EnableRowSecurity':
          output.push('ENABLE ROW LEVEL SECURITY');
          break;
        case 'AT_DisableRowSecurity':
          output.push('DISABLE ROW LEVEL SECURITY');
          break;
        case 'AT_ForceRowSecurity':
          output.push('FORCE ROW LEVEL SECURITY');
          break;
        case 'AT_NoForceRowSecurity':
          output.push('NO FORCE ROW LEVEL SECURITY');
          break;
        case 'AT_AttachPartition':
          output.push('ATTACH PARTITION');
          if (node.def) {
            output.push(this.visit(node.def, context));
          }
          break;
        case 'AT_DetachPartition':
          output.push('DETACH PARTITION');
          if (node.def) {
            output.push(this.visit(node.def, context));
          }
          break;
        case 'AT_DetachPartitionFinalize':
          output.push('DETACH PARTITION');
          if (node.def) {
            output.push(this.visit(node.def, context));
          }
          output.push('FINALIZE');
          break;
        case 'AT_SetLogged':
          output.push('SET LOGGED');
          break;
        case 'AT_SetUnLogged':
          output.push('SET UNLOGGED');
          break;
        default:
          throw new Error(`Unsupported AlterTableCmd subtype: ${node.subtype}`);
      }
    }

    return output.join(' ');
  }

  CreateFunctionStmt(node: t.CreateFunctionStmt, context: DeparserContext): string {
    const output: string[] = ['CREATE'];
    
    if (node.replace) {
      output.push('OR REPLACE');
    }
    
    if (node.is_procedure) {
      output.push('PROCEDURE');
    } else {
      output.push('FUNCTION');
    }
    
    if (node.funcname && node.funcname.length > 0) {
      const funcName = node.funcname.map((name: any) => this.visit(name, context)).join('.');
      output.push(funcName);
    }
    
    output.push('(');
    
    if (node.parameters && node.parameters.length > 0) {
      const params = node.parameters
        .filter((param: any) => {
          const paramData = this.getNodeData(param);
          return paramData.mode !== 'FUNC_PARAM_TABLE';
        })
        .map((param: any) => this.visit(param, context));
      output.push(params.join(' , '));
    }
    
    output.push(')');
    
    const hasTableParams = node.parameters && node.parameters.some((param: any) => {
      const paramData = this.getNodeData(param);
      return paramData.mode === 'FUNC_PARAM_TABLE';
    });
    
    if (hasTableParams) {
      output.push('RETURNS TABLE (');
      const tableParams = node.parameters
        .filter((param: any) => {
          const paramData = this.getNodeData(param);
          return paramData.mode === 'FUNC_PARAM_TABLE';
        })
        .map((param: any) => this.visit(param, context));
      output.push(tableParams.join(', '));
      output.push(')');
    } else if (node.returnType) {
      output.push('RETURNS');
      output.push(this.TypeName(node.returnType as any, context));
    }
    
    if (node.options && node.options.length > 0) {
      const options = node.options.map((opt: any) => this.visit(opt, context));
      output.push(...options);
    }
    
    if (node.sql_body) {
      const bodyType = this.getNodeType(node.sql_body);
      if (bodyType === 'ReturnStmt') {
        output.push(this.visit(node.sql_body, context));
      } else {
        output.push('BEGIN ATOMIC');
        output.push(this.visit(node.sql_body, context));
        output.push('END');
      }
    }
    
    return output.join(' ');
  }

  FunctionParameter(node: t.FunctionParameter, context: DeparserContext): string {
    const output: string[] = [];
    
    if (node.mode) {
      switch (node.mode) {
        case 'FUNC_PARAM_IN':
          output.push('IN');
          break;
        case 'FUNC_PARAM_OUT':
          output.push('OUT');
          break;
        case 'FUNC_PARAM_INOUT':
          output.push('INOUT');
          break;
        case 'FUNC_PARAM_VARIADIC':
          output.push('VARIADIC');
          break;
      }
    }
    
    if (node.name) {
      output.push(QuoteUtils.quote(node.name));
    }
    
    if (node.argType) {
      output.push(this.TypeName(node.argType as any, context));
    }
    
    if (node.defexpr) {
      output.push('DEFAULT');
      output.push(this.visit(node.defexpr, context));
    }
    
    return output.join(' ');
  }

  CreateEnumStmt(node: t.CreateEnumStmt, context: DeparserContext): string {
    const output: string[] = ['CREATE', 'TYPE'];
    
    if (node.typeName) {
      const typeName = ListUtils.unwrapList(node.typeName)
        .map(name => this.visit(name, context))
        .join('.');
      output.push(typeName);
    }
    
    output.push('AS', 'ENUM');
    
    if (node.vals && node.vals.length > 0) {
      const values = ListUtils.unwrapList(node.vals)
        .map(val => `'${this.visit(val, context)}'`)
        .join(', ');
      output.push(`(${values})`);
    } else {
      output.push('()');
    }
    
    return output.join(' ');
  }

  CreateDomainStmt(node: t.CreateDomainStmt, context: DeparserContext): string {
    const output: string[] = ['CREATE', 'DOMAIN'];
    
    if (node.domainname) {
      const domainName = ListUtils.unwrapList(node.domainname)
        .map(name => this.visit(name, context))
        .join('.');
      output.push(domainName);
    }
    
    if (node.typeName) {
      output.push('AS');
      output.push(this.TypeName(node.typeName, context));
    }
    
    if (node.collClause) {
      output.push(this.CollateClause(node.collClause, context));
    }
    
    if (node.constraints) {
      const constraints = ListUtils.unwrapList(node.constraints)
        .map(constraint => this.visit(constraint, context))
        .join(' ');
      if (constraints) {
        output.push(constraints);
      }
    }
    
    return output.join(' ');
  }

  CreateRoleStmt(node: t.CreateRoleStmt, context: DeparserContext): string {
    const output: string[] = ['CREATE'];
    
    if (node.stmt_type === 'ROLESTMT_ROLE') {
      output.push('ROLE');
    } else if (node.stmt_type === 'ROLESTMT_USER') {
      output.push('USER');
    } else if (node.stmt_type === 'ROLESTMT_GROUP') {
      output.push('GROUP');
    } else {
      output.push('ROLE');
    }
    
    if (node.role) {
      output.push(node.role);
    }
    
    if (node.options) {
      const roleContext = { ...context, parentNodeType: 'CreateRoleStmt' };
      const options = ListUtils.unwrapList(node.options)
        .map(option => this.visit(option, roleContext))
        .join(' ');
      if (options) {
        output.push(options);
      }
    }
    
    return output.join(' ');
  }

  DefElem(node: t.DefElem, context: DeparserContext): string {
    if (!node.defname) {
      return '';
    }
    
    if (node.arg) {
      const argValue = this.visit(node.arg, context);
      
      const parentContext = context.parentNodeType;
      
      if (parentContext === 'CreatedbStmt' || parentContext === 'DropdbStmt') {
        const quotedValue = typeof argValue === 'string' 
          ? QuoteUtils.escape(argValue) 
          : argValue;
        return `${node.defname} = ${quotedValue}`;
      }
      
      if (parentContext === 'CreateRoleStmt' || parentContext === 'AlterRoleStmt') {
        if (argValue === 'true') {
          return node.defname.toUpperCase();
        } else if (argValue === 'false') {
          return `NO${node.defname.toUpperCase()}`;
        }
      }
      
      if (parentContext === 'CreateSeqStmt' || parentContext === 'AlterSeqStmt') {
        return `${node.defname.toUpperCase()} ${argValue}`;
      }
      
      if (parentContext === 'CreateTableSpaceStmt' || parentContext === 'AlterTableSpaceOptionsStmt') {
        return `${node.defname.toUpperCase()} ${argValue}`;
      }
      
      if (parentContext === 'CreateExtensionStmt' || parentContext === 'AlterExtensionStmt' || parentContext === 'CreateFdwStmt') {
        // AlterExtensionStmt specific cases
        if (parentContext === 'AlterExtensionStmt') {
          if (node.defname === 'to') {
            return `TO ${argValue}`;
          }
          if (node.defname === 'schema') {
            return `SCHEMA ${argValue}`;
          }
        }
        
        // CreateFdwStmt specific cases
        if (parentContext === 'CreateFdwStmt') {
          if (['handler', 'validator'].includes(node.defname)) {
            return `${node.defname.toUpperCase()} ${argValue}`;
          }
          return `${node.defname.toUpperCase()} ${argValue}`;
        }
        
        // CreateExtensionStmt cases (schema, version, etc.)
        return `${node.defname.toUpperCase()} ${argValue}`;
      }
      
      const quotedValue = typeof argValue === 'string' 
        ? QuoteUtils.escape(argValue) 
        : argValue;
      return `${node.defname} = ${quotedValue}`;
    }
    
    return node.defname.toUpperCase();
  }

  CreateTableSpaceStmt(node: t.CreateTableSpaceStmt, context: DeparserContext): string {
    const output: string[] = ['CREATE', 'TABLESPACE'];
    
    if (node.tablespacename) {
      output.push(node.tablespacename);
    }
    
    if (node.owner) {
      output.push('OWNER');
      output.push(this.RoleSpec(node.owner, context));
    }
    
    if (node.location) {
      output.push('LOCATION');
      output.push(`'${node.location}'`);
    }
    
    if (node.options && node.options.length > 0) {
      output.push('WITH');
      const tsContext = { ...context, parentNodeType: 'CreateTableSpaceStmt' };
      const options = ListUtils.unwrapList(node.options)
        .map(option => this.visit(option, tsContext))
        .join(', ');
      output.push(`(${options})`);
    }
    
    return output.join(' ');
  }

  DropTableSpaceStmt(node: t.DropTableSpaceStmt, context: DeparserContext): string {
    const output: string[] = ['DROP', 'TABLESPACE'];
    
    if (node.missing_ok) {
      output.push('IF', 'EXISTS');
    }
    
    if (node.tablespacename) {
      output.push(node.tablespacename);
    }
    
    return output.join(' ');
  }

  AlterTableSpaceOptionsStmt(node: t.AlterTableSpaceOptionsStmt, context: DeparserContext): string {
    const output: string[] = ['ALTER', 'TABLESPACE'];
    
    if (node.tablespacename) {
      output.push(node.tablespacename);
    }
    
    if (node.isReset) {
      output.push('RESET');
    } else {
      output.push('SET');
    }
    
    if (node.options && node.options.length > 0) {
      const tablespaceContext = { ...context, parentNodeType: 'AlterTableSpaceOptionsStmt' };
      const options = ListUtils.unwrapList(node.options)
        .map(option => this.visit(option, tablespaceContext))
        .join(', ');
      output.push(`(${options})`);
    }
    
    return output.join(' ');
  }

  CreateExtensionStmt(node: t.CreateExtensionStmt, context: DeparserContext): string {
    const output: string[] = ['CREATE', 'EXTENSION'];
    
    if (node.if_not_exists) {
      output.push('IF', 'NOT', 'EXISTS');
    }
    
    if (node.extname) {
      output.push(node.extname);
    }
    
    if (node.options && node.options.length > 0) {
      const extContext = { ...context, parentNodeType: 'CreateExtensionStmt' };
      const options = ListUtils.unwrapList(node.options)
        .map(option => this.visit(option, extContext))
        .join(' ');
      output.push(options);
    }
    
    return output.join(' ');
  }

  AlterExtensionStmt(node: t.AlterExtensionStmt, context: DeparserContext): string {
    const output: string[] = ['ALTER', 'EXTENSION'];
    
    if (node.extname) {
      output.push(node.extname);
    }
    
    if (node.options && node.options.length > 0) {
      const extContext = { ...context, parentNodeType: 'AlterExtensionStmt' };
      const options = ListUtils.unwrapList(node.options)
        .map(option => this.visit(option, extContext))
        .join(' ');
      output.push(options);
    }
    
    return output.join(' ');
  }

  CreateFdwStmt(node: t.CreateFdwStmt, context: DeparserContext): string {
    const output: string[] = ['CREATE', 'FOREIGN', 'DATA', 'WRAPPER'];
    
    if (node.fdwname) {
      output.push(node.fdwname);
    }
    
    if (node.func_options && node.func_options.length > 0) {
      const fdwContext = { ...context, parentNodeType: 'CreateFdwStmt' };
      const funcOptions = ListUtils.unwrapList(node.func_options)
        .map(option => this.visit(option, fdwContext))
        .join(' ');
      output.push(funcOptions);
    }
    
    if (node.options && node.options.length > 0) {
      output.push('OPTIONS');
      const fdwContext = { ...context, parentNodeType: 'CreateFdwStmt' };
      const options = ListUtils.unwrapList(node.options)
        .map(option => this.visit(option, fdwContext))
        .join(', ');
      output.push(`(${options})`);
    }
    
    return output.join(' ');
  }

  SetOperationStmt(node: t.SetOperationStmt, context: DeparserContext): string {
    const output: string[] = [];
    
    if (node.larg) {
      output.push(this.visit(node.larg, context));
    }
    
    if (node.op) {
      switch (node.op) {
        case 'SETOP_UNION':
          output.push(node.all ? 'UNION ALL' : 'UNION');
          break;
        case 'SETOP_INTERSECT':
          output.push(node.all ? 'INTERSECT ALL' : 'INTERSECT');
          break;
        case 'SETOP_EXCEPT':
          output.push(node.all ? 'EXCEPT ALL' : 'EXCEPT');
          break;
        default:
          throw new Error(`Unsupported SetOperation: ${node.op}`);
      }
    }
    
    if (node.rarg) {
      output.push(this.visit(node.rarg, context));
    }
    
    return output.join(' ');
  }

  ReplicaIdentityStmt(node: t.ReplicaIdentityStmt, context: DeparserContext): string {
    const output: string[] = ['ALTER', 'TABLE'];
    
    if (node.identity_type) {
      switch (node.identity_type) {
        case 'REPLICA_IDENTITY_DEFAULT':
          output.push('REPLICA', 'IDENTITY', 'DEFAULT');
          break;
        case 'REPLICA_IDENTITY_FULL':
          output.push('REPLICA', 'IDENTITY', 'FULL');
          break;
        case 'REPLICA_IDENTITY_NOTHING':
          output.push('REPLICA', 'IDENTITY', 'NOTHING');
          break;
        case 'REPLICA_IDENTITY_INDEX':
          output.push('REPLICA', 'IDENTITY', 'USING', 'INDEX');
          if (node.name) {
            output.push(QuoteUtils.quote(node.name));
          }
          break;
        default:
          throw new Error(`Unsupported replica identity type: ${node.identity_type}`);
      }
    }
    
    return output.join(' ');
  }

  AlterCollationStmt(node: t.AlterCollationStmt, context: DeparserContext): string {
    const output: string[] = ['ALTER', 'COLLATION'];
    
    if (node.collname && node.collname.length > 0) {
      const collationName = ListUtils.unwrapList(node.collname)
        .map(name => this.visit(name, context))
        .join('.');
      output.push(collationName);
    }
    
    output.push('REFRESH', 'VERSION');
    
    return output.join(' ');
  }

  AlterDomainStmt(node: t.AlterDomainStmt, context: DeparserContext): string {
    const output: string[] = ['ALTER', 'DOMAIN'];
    
    if (node.typeName && node.typeName.length > 0) {
      const domainName = ListUtils.unwrapList(node.typeName)
        .map(name => this.visit(name, context))
        .join('.');
      output.push(domainName);
    }
    
    if (node.subtype) {
      switch (node.subtype) {
        case 'AT_SetNotNull':
          output.push('SET', 'NOT', 'NULL');
          break;
        case 'AT_DropNotNull':
          output.push('DROP', 'NOT', 'NULL');
          break;
        case 'AT_SetDefault':
          output.push('SET', 'DEFAULT');
          if (node.def) {
            output.push(this.visit(node.def, context));
          }
          break;
        case 'AT_DropDefault':
          output.push('DROP', 'DEFAULT');
          break;
        case 'AT_AddConstraint':
          output.push('ADD');
          if (node.def) {
            output.push(this.visit(node.def, context));
          }
          break;
        case 'AT_DropConstraint':
          output.push('DROP', 'CONSTRAINT');
          if (node.name) {
            output.push(QuoteUtils.quote(node.name));
          }
          if (node.behavior === 'DROP_CASCADE') {
            output.push('CASCADE');
          } else if (node.behavior === 'DROP_RESTRICT') {
            output.push('RESTRICT');
          }
          break;
        case 'AT_ValidateConstraint':
          output.push('VALIDATE', 'CONSTRAINT');
          if (node.name) {
            output.push(QuoteUtils.quote(node.name));
          }
          break;
        case 'C':
          output.push('ADD');
          if (node.def) {
            output.push(this.visit(node.def, context));
          }
          break;
        case 'X':
          output.push('DROP', 'CONSTRAINT');
          if (node.name) {
            output.push(QuoteUtils.quote(node.name));
          }
          if (node.behavior === 'DROP_CASCADE') {
            output.push('CASCADE');
          } else if (node.behavior === 'DROP_RESTRICT') {
            output.push('RESTRICT');
          }
          break;
        case 'V':
          output.push('VALIDATE', 'CONSTRAINT');
          if (node.name) {
            output.push(QuoteUtils.quote(node.name));
          }
          break;
        default:
          throw new Error(`Unsupported AlterDomainStmt subtype: ${node.subtype}`);
      }
    }
    
    return output.join(' ');
  }

  PrepareStmt(node: t.PrepareStmt, context: DeparserContext): string {
    const output: string[] = ['PREPARE'];
    
    if (node.name) {
      output.push(node.name);
    }
    
    if (node.argtypes && node.argtypes.length > 0) {
      const argTypes = ListUtils.unwrapList(node.argtypes)
        .map(argType => this.visit(argType, context))
        .join(', ');
      output.push(`(${argTypes})`);
    }
    
    output.push('AS');
    
    if (node.query) {
      output.push(this.visit(node.query, context));
    }
    
    return output.join(' ');
  }

  ExecuteStmt(node: t.ExecuteStmt, context: DeparserContext): string {
    const output: string[] = ['EXECUTE'];
    
    if (node.name) {
      output.push(node.name);
    }
    
    if (node.params && node.params.length > 0) {
      const params = ListUtils.unwrapList(node.params)
        .map(param => this.visit(param, context))
        .join(', ');
      output.push(`(${params})`);
    }
    
    return output.join(' ');
  }

  DeallocateStmt(node: t.DeallocateStmt, context: DeparserContext): string {
    const output: string[] = ['DEALLOCATE'];
    
    if (node.isall) {
      output.push('ALL');
    } else if (node.name) {
      output.push(node.name);
    }
    
    return output.join(' ');
  }

  NotifyStmt(node: t.NotifyStmt, context: DeparserContext): string {
    const output: string[] = ['NOTIFY'];
    
    if (node.conditionname) {
      output.push(node.conditionname);
    }
    
    if (node.payload !== null && node.payload !== undefined) {
      output.push(',');
      output.push(`'${node.payload}'`);
    }
    
    return output.join(' ');
  }

  ListenStmt(node: t.ListenStmt, context: DeparserContext): string {
    const output: string[] = ['LISTEN'];
    
    if (node.conditionname) {
      output.push(node.conditionname);
    }
    
    return output.join(' ');
  }

  UnlistenStmt(node: t.UnlistenStmt, context: DeparserContext): string {
    const output: string[] = ['UNLISTEN'];
    
    if (node.conditionname) {
      output.push(node.conditionname);
    } else {
      output.push('*');
    }
    
    return output.join(' ');
  }

  CheckPointStmt(node: t.CheckPointStmt, context: DeparserContext): string {
    return 'CHECKPOINT';
  }

  LoadStmt(node: t.LoadStmt, context: DeparserContext): string {
    if (!node.filename) {
      throw new Error('LoadStmt requires filename');
    }
    return `LOAD '${node.filename}'`;
  }

  DiscardStmt(node: t.DiscardStmt, context: DeparserContext): string {
    switch (node.target) {
      case 'DISCARD_ALL':
        return 'DISCARD ALL';
      case 'DISCARD_PLANS':
        return 'DISCARD PLANS';
      case 'DISCARD_SEQUENCES':
        return 'DISCARD SEQUENCES';
      case 'DISCARD_TEMP':
        return 'DISCARD TEMP';
      default:
        throw new Error(`Unsupported DiscardStmt target: ${node.target}`);
    }
  }

  CommentStmt(node: t.CommentStmt, context: DeparserContext): string {
    const output: string[] = ['COMMENT ON'];
    
    if (node.objtype) {
      switch (node.objtype) {
        case 'OBJECT_TABLE':
          output.push('TABLE');
          break;
        case 'OBJECT_COLUMN':
          output.push('COLUMN');
          break;
        case 'OBJECT_INDEX':
          output.push('INDEX');
          break;
        case 'OBJECT_FUNCTION':
          output.push('FUNCTION');
          break;
        case 'OBJECT_VIEW':
          output.push('VIEW');
          break;
        case 'OBJECT_SCHEMA':
          output.push('SCHEMA');
          break;
        case 'OBJECT_DATABASE':
          output.push('DATABASE');
          break;
        default:
          output.push(node.objtype.replace('OBJECT_', ''));
      }
    }
    
    if (node.object) {
      output.push(this.visit(node.object, context));
    }
    
    output.push('IS');
    
    if (node.comment === null || node.comment === undefined) {
      output.push('NULL');
    } else if (node.comment) {
      output.push(`'${node.comment}'`);
    }
    
    return output.join(' ');
  }

  LockStmt(node: t.LockStmt, context: DeparserContext): string {
    const output: string[] = ['LOCK'];
    
    if (node.relations && node.relations.length > 0) {
      const relations = ListUtils.unwrapList(node.relations)
        .map(rel => this.visit(rel, context))
        .join(', ');
      output.push(relations);
    }
    
    if (node.mode !== undefined) {
      const lockModes = [
        'ACCESS SHARE',
        'ROW SHARE', 
        'ROW EXCLUSIVE',
        'SHARE UPDATE EXCLUSIVE',
        'SHARE',
        'SHARE ROW EXCLUSIVE',
        'EXCLUSIVE',
        'ACCESS EXCLUSIVE'
      ];
      
      if (node.mode >= 0 && node.mode < lockModes.length) {
        output.push('IN', lockModes[node.mode], 'MODE');
      }
    }
    
    if (node.nowait) {
      output.push('NOWAIT');
    }
    
    return output.join(' ');
  }

  CreatePolicyStmt(node: t.CreatePolicyStmt, context: DeparserContext): string {
    const output: string[] = ['CREATE', 'POLICY'];
    
    if (node.policy_name) {
      output.push(`"${node.policy_name}"`);
    }
    
    output.push('ON');
    
    if (node.table) {
      output.push(this.RangeVar(node.table, context));
    }
    
    if (node.cmd_name) {
      output.push('FOR', node.cmd_name);
    }
    
    if (node.roles && node.roles.length > 0) {
      output.push('TO');
      const roles = ListUtils.unwrapList(node.roles).map(role => this.visit(role, context));
      output.push(roles.join(', '));
    }
    
    if (node.qual) {
      output.push('USING');
      output.push(`(${this.visit(node.qual, context)})`);
    }
    
    if (node.with_check) {
      output.push('WITH CHECK');
      output.push(`(${this.visit(node.with_check, context)})`);
    }
    
    return output.join(' ');
  }

  AlterPolicyStmt(node: t.AlterPolicyStmt, context: DeparserContext): string {
    const output: string[] = ['ALTER', 'POLICY'];
    
    if (node.policy_name) {
      output.push(`"${node.policy_name}"`);
    }
    
    if (node.table) {
      output.push('ON');
      output.push(this.RangeVar(node.table, context));
    }
    
    if (node.roles && node.roles.length > 0) {
      output.push('TO');
      const roles = ListUtils.unwrapList(node.roles).map(role => this.visit(role, context));
      output.push(roles.join(', '));
    }
    
    if (node.qual) {
      output.push('USING');
      output.push(`(${this.visit(node.qual, context)})`);
    }
    
    if (node.with_check) {
      output.push('WITH CHECK');
      output.push(`(${this.visit(node.with_check, context)})`);
    }
    
    return output.join(' ');
  }

  CreateUserMappingStmt(node: t.CreateUserMappingStmt, context: DeparserContext): string {
    const output: string[] = ['CREATE'];
    
    if (node.if_not_exists) {
      output.push('IF', 'NOT', 'EXISTS');
    }
    
    output.push('USER', 'MAPPING');
    
    output.push('FOR');
    
    if (node.user) {
      output.push(this.RoleSpec(node.user, context));
    } else {
      output.push('CURRENT_USER');
    }
    
    output.push('SERVER');
    
    if (node.servername) {
      output.push(`"${node.servername}"`);
    }
    
    if (node.options && node.options.length > 0) {
      output.push('OPTIONS');
      const options = ListUtils.unwrapList(node.options).map(opt => this.visit(opt, context));
      output.push(`(${options.join(', ')})`);
    }
    
    return output.join(' ');
  }

  CreateStatsStmt(node: t.CreateStatsStmt, context: DeparserContext): string {
    const output: string[] = ['CREATE'];
    
    if (node.if_not_exists) {
      output.push('IF', 'NOT', 'EXISTS');
    }
    
    output.push('STATISTICS');
    
    if (node.defnames && node.defnames.length > 0) {
      const names = ListUtils.unwrapList(node.defnames).map(name => this.visit(name, context));
      output.push(names.join('.'));
    }
    
    if (node.stat_types && node.stat_types.length > 0) {
      const types = ListUtils.unwrapList(node.stat_types).map(type => this.visit(type, context));
      output.push(`(${types.join(', ')})`);
    }
    
    output.push('ON');
    
    if (node.exprs && node.exprs.length > 0) {
      const exprs = ListUtils.unwrapList(node.exprs).map(expr => this.visit(expr, context));
      output.push(exprs.join(', '));
    }
    
    if (node.relations && node.relations.length > 0) {
      output.push('FROM');
      const relations = ListUtils.unwrapList(node.relations).map(rel => this.visit(rel, context));
      output.push(relations.join(', '));
    }
    
    return output.join(' ');
  }

  CreatePublicationStmt(node: t.CreatePublicationStmt, context: DeparserContext): string {
    const output: string[] = ['CREATE', 'PUBLICATION'];
    
    if (node.pubname) {
      output.push(`"${node.pubname}"`);
    }
    
    if (node.pubobjects && node.pubobjects.length > 0) {
      output.push('FOR', 'TABLE');
      const tables = ListUtils.unwrapList(node.pubobjects).map(table => this.visit(table, context));
      output.push(tables.join(', '));
    } else if (node.for_all_tables) {
      output.push('FOR', 'ALL', 'TABLES');
    }
    
    if (node.options && node.options.length > 0) {
      output.push('WITH');
      const options = ListUtils.unwrapList(node.options).map(opt => this.visit(opt, context));
      output.push(`(${options.join(', ')})`);
    }
    
    return output.join(' ');
  }

  CreateSubscriptionStmt(node: t.CreateSubscriptionStmt, context: DeparserContext): string {
    const output: string[] = ['CREATE', 'SUBSCRIPTION'];
    
    if (node.subname) {
      output.push(`"${node.subname}"`);
    }
    
    output.push('CONNECTION');
    
    if (node.conninfo) {
      output.push(`'${node.conninfo}'`);
    }
    
    output.push('PUBLICATION');
    
    if (node.publication && node.publication.length > 0) {
      const publications = ListUtils.unwrapList(node.publication).map(pub => this.visit(pub, context));
      output.push(publications.join(', '));
    }
    
    if (node.options && node.options.length > 0) {
      output.push('WITH');
      const options = ListUtils.unwrapList(node.options).map(opt => this.visit(opt, context));
      output.push(`(${options.join(', ')})`);
    }
    
    return output.join(' ');
  }

  AlterPublicationStmt(node: t.AlterPublicationStmt, context: DeparserContext): string {
    const output: string[] = ['ALTER', 'PUBLICATION'];
    
    if (node.pubname) {
      output.push(`"${node.pubname}"`);
    }
    
    if (node.action) {
      switch (node.action) {
        case 'AP_AddObjects':
          output.push('ADD');
          break;
        case 'AP_DropObjects':
          output.push('DROP');
          break;
        case 'AP_SetObjects':
          output.push('SET');
          break;
        default:
          throw new Error(`Unsupported AlterPublicationStmt action: ${node.action}`);
      }
    }
    
    if (node.for_all_tables) {
      output.push('FOR ALL TABLES');
    } else if (node.pubobjects && node.pubobjects.length > 0) {
      output.push('FOR TABLE');
      const objects = ListUtils.unwrapList(node.pubobjects).map(obj => this.visit(obj, context));
      output.push(objects.join(', '));
    }
    
    if (node.options && node.options.length > 0) {
      output.push('WITH');
      const options = ListUtils.unwrapList(node.options).map(opt => this.visit(opt, context));
      output.push(`(${options.join(', ')})`);
    }
    
    return output.join(' ');
  }

  AlterSubscriptionStmt(node: t.AlterSubscriptionStmt, context: DeparserContext): string {
    const output: string[] = ['ALTER', 'SUBSCRIPTION'];
    
    if (node.subname) {
      output.push(`"${node.subname}"`);
    }
    
    if (node.kind) {
      switch (node.kind) {
        case 'ALTER_SUBSCRIPTION_OPTIONS':
          output.push('SET');
          break;
        case 'ALTER_SUBSCRIPTION_CONNECTION':
          output.push('CONNECTION');
          if (node.conninfo) {
            output.push(`'${node.conninfo}'`);
          }
          break;
        case 'ALTER_SUBSCRIPTION_SET_PUBLICATION':
          output.push('SET PUBLICATION');
          if (node.publication && node.publication.length > 0) {
            const publications = ListUtils.unwrapList(node.publication).map(pub => this.visit(pub, context));
            output.push(publications.join(', '));
          }
          break;
        case 'ALTER_SUBSCRIPTION_REFRESH':
          output.push('REFRESH PUBLICATION');
          break;
        case 'ALTER_SUBSCRIPTION_ENABLED':
          output.push('ENABLE');
          break;
        case 'ALTER_SUBSCRIPTION_SKIP':
          output.push('SKIP');
          break;
        default:
          throw new Error(`Unsupported AlterSubscriptionStmt kind: ${node.kind}`);
      }
    }
    
    if (node.options && node.options.length > 0) {
      output.push('WITH');
      const options = ListUtils.unwrapList(node.options).map(opt => this.visit(opt, context));
      output.push(`(${options.join(', ')})`);
    }
    
    return output.join(' ');
  }

  DropSubscriptionStmt(node: t.DropSubscriptionStmt, context: DeparserContext): string {
    const output: string[] = ['DROP', 'SUBSCRIPTION'];
    
    if (node.missing_ok) {
      output.push('IF EXISTS');
    }
    
    if (node.subname) {
      output.push(`"${node.subname}"`);
    }
    
    if (node.behavior) {
      switch (node.behavior) {
        case 'DROP_CASCADE':
          output.push('CASCADE');
          break;
        case 'DROP_RESTRICT':
          output.push('RESTRICT');
          break;
      }
    }
    
    return output.join(' ');
  }

  DoStmt(node: t.DoStmt, context: DeparserContext): string {
    const output: string[] = ['DO'];
    
    if (node.args && node.args.length > 0) {
      const args = ListUtils.unwrapList(node.args).map(arg => this.visit(arg, context));
      output.push(args.join(' '));
    }
    
    return output.join(' ');
  }

  InlineCodeBlock(node: t.InlineCodeBlock, context: DeparserContext): string {
    if (node.source_text) {
      return `$$${node.source_text}$$`;
    }
    return '$$$$';
  }

  CallContext(node: t.CallContext, context: DeparserContext): string {
    if (node.atomic !== undefined) {
      return node.atomic ? 'ATOMIC' : 'NOT ATOMIC';
    }
    return '';
  }

  ConstraintsSetStmt(node: t.ConstraintsSetStmt, context: DeparserContext): string {
    const output: string[] = ['SET', 'CONSTRAINTS'];
    
    if (node.constraints && node.constraints.length > 0) {
      const constraints = ListUtils.unwrapList(node.constraints).map(constraint => this.visit(constraint, context));
      output.push(constraints.join(', '));
    } else {
      output.push('ALL');
    }
    
    if (node.deferred !== undefined) {
      output.push(node.deferred ? 'DEFERRED' : 'IMMEDIATE');
    }
    
    return output.join(' ');
  }

  AlterSystemStmt(node: t.AlterSystemStmt, context: DeparserContext): string {
    const output: string[] = ['ALTER', 'SYSTEM'];
    
    if (node.setstmt) {
      const setStmt = this.VariableSetStmt(node.setstmt, context);
      const setStmtWithoutPrefix = setStmt.replace(/^SET\s+/, '');
      output.push('SET', setStmtWithoutPrefix);
    }
    
    return output.join(' ');
  }

  VacuumRelation(node: t.VacuumRelation, context: DeparserContext): string {
    const output: string[] = [];
    
    if (node.relation) {
      output.push(this.RangeVar(node.relation, context));
    }
    
    if (node.va_cols && node.va_cols.length > 0) {
      output.push('(');
      const columns = ListUtils.unwrapList(node.va_cols).map(col => this.visit(col, context));
      output.push(columns.join(', '));
      output.push(')');
    }
    
    return output.join(' ');
  }

  DropOwnedStmt(node: t.DropOwnedStmt, context: DeparserContext): string {
    const output: string[] = ['DROP', 'OWNED', 'BY'];
    
    if (node.roles && node.roles.length > 0) {
      const roles = ListUtils.unwrapList(node.roles).map(role => this.visit(role, context));
      output.push(roles.join(', '));
    }
    
    if (node.behavior) {
      switch (node.behavior) {
        case 'DROP_CASCADE':
          output.push('CASCADE');
          break;
        case 'DROP_RESTRICT':
          output.push('RESTRICT');
          break;
      }
    }
    
    return output.join(' ');
  }

  ReassignOwnedStmt(node: t.ReassignOwnedStmt, context: DeparserContext): string {
    const output: string[] = ['REASSIGN', 'OWNED', 'BY'];
    
    if (node.roles && node.roles.length > 0) {
      const roles = ListUtils.unwrapList(node.roles).map(role => this.visit(role, context));
      output.push(roles.join(', '));
    }
    
    output.push('TO');
    
    if (node.newrole) {
      output.push(this.RoleSpec(node.newrole, context));
    }
    
    return output.join(' ');
  }

  AlterTSDictionaryStmt(node: t.AlterTSDictionaryStmt, context: DeparserContext): string {
    const output: string[] = ['ALTER', 'TEXT', 'SEARCH', 'DICTIONARY'];
    
    if (node.dictname && node.dictname.length > 0) {
      const dictName = ListUtils.unwrapList(node.dictname).map(name => this.visit(name, context));
      output.push(dictName.join('.'));
    }
    
    if (node.options && node.options.length > 0) {
      output.push('(');
      const options = ListUtils.unwrapList(node.options).map(opt => this.visit(opt, context));
      output.push(options.join(', '));
      output.push(')');
    }
    
    return output.join(' ');
  }

  AlterTSConfigurationStmt(node: t.AlterTSConfigurationStmt, context: DeparserContext): string {
    const output: string[] = ['ALTER', 'TEXT', 'SEARCH', 'CONFIGURATION'];
    
    if (node.cfgname && node.cfgname.length > 0) {
      const cfgName = ListUtils.unwrapList(node.cfgname).map(name => this.visit(name, context));
      output.push(cfgName.join('.'));
    }
    
    if (node.kind) {
      switch (node.kind) {
        case 'ALTER_TSCONFIG_ADD_MAPPING':
          output.push('ADD', 'MAPPING', 'FOR');
          break;
        case 'ALTER_TSCONFIG_ALTER_MAPPING_FOR_TOKEN':
          output.push('ALTER', 'MAPPING', 'FOR');
          break;
        case 'ALTER_TSCONFIG_REPLACE_DICT':
          output.push('ALTER', 'MAPPING', 'REPLACE');
          break;
        case 'ALTER_TSCONFIG_REPLACE_DICT_FOR_TOKEN':
          output.push('ALTER', 'MAPPING', 'FOR');
          break;
        case 'ALTER_TSCONFIG_DROP_MAPPING':
          output.push('DROP', 'MAPPING', 'FOR');
          break;
        default:
          throw new Error(`Unsupported AlterTSConfigurationStmt kind: ${node.kind}`);
      }
    }
    
    if (node.tokentype && node.tokentype.length > 0) {
      const tokenTypes = ListUtils.unwrapList(node.tokentype).map(token => this.visit(token, context));
      output.push(tokenTypes.join(', '));
    }
    
    return output.join(' ');
  }

  ClosePortalStmt(node: t.ClosePortalStmt, context: DeparserContext): string {
    const output: string[] = ['CLOSE'];
    
    if (node.portalname) {
      output.push(QuoteUtils.quote(node.portalname));
    } else {
      output.push('ALL');
    }
    
    return output.join(' ');
  }

  FetchStmt(node: t.FetchStmt, context: DeparserContext): string {
    const output: string[] = ['FETCH'];
    
    if (node.direction) {
      switch (node.direction) {
        case 'FETCH_FORWARD':
          if (node.howMany !== undefined && node.howMany !== null) {
            output.push('FORWARD', node.howMany.toString());
          } else {
            output.push('FORWARD');
          }
          break;
        case 'FETCH_BACKWARD':
          if (node.howMany !== undefined && node.howMany !== null) {
            output.push('BACKWARD', node.howMany.toString());
          } else {
            output.push('BACKWARD');
          }
          break;
        case 'FETCH_ABSOLUTE':
          if (node.howMany !== undefined && node.howMany !== null) {
            output.push('ABSOLUTE', node.howMany.toString());
          }
          break;
        case 'FETCH_RELATIVE':
          if (node.howMany !== undefined && node.howMany !== null) {
            output.push('RELATIVE', node.howMany.toString());
          }
          break;
        default:
          throw new Error(`Unsupported FetchStmt direction: ${node.direction}`);
      }
    }
    
    if (node.portalname) {
      output.push('FROM', QuoteUtils.quote(node.portalname));
    }
    
    return output.join(' ');
  }

  AlterStatsStmt(node: t.AlterStatsStmt, context: DeparserContext): string {
    const output: string[] = ['ALTER', 'STATISTICS'];
    
    if (node.defnames && node.defnames.length > 0) {
      const names = ListUtils.unwrapList(node.defnames).map(name => this.visit(name, context));
      output.push(names.join('.'));
    }
    
    output.push('SET', 'STATISTICS');
    
    if (node.stxstattarget) {
      output.push(this.visit(node.stxstattarget, context));
    }
    
    return output.join(' ');
  }

  ObjectWithArgs(node: t.ObjectWithArgs, context: DeparserContext): string {
    const output: string[] = [];
    
    if (node.objname && node.objname.length > 0) {
      const names = ListUtils.unwrapList(node.objname).map(name => this.visit(name, context));
      output.push(names.join('.'));
    }
    
    if (node.objargs && node.objargs.length > 0) {
      output.push('(');
      const args = ListUtils.unwrapList(node.objargs).map(arg => this.visit(arg, context));
      output.push(args.join(', '));
      output.push(')');
    } else if (node.objfuncargs && node.objfuncargs.length > 0) {
      output.push('(');
      const funcArgs = ListUtils.unwrapList(node.objfuncargs).map(arg => this.visit(arg, context));
      output.push(funcArgs.join(', '));
      output.push(')');
    }
    
    return output.join(' ');
  }

  AlterOperatorStmt(node: t.AlterOperatorStmt, context: DeparserContext): string {
    const output: string[] = ['ALTER', 'OPERATOR'];
    
    if (node.opername) {
      output.push(this.ObjectWithArgs(node.opername, context));
    }
    
    output.push('SET');
    
    if (node.options && node.options.length > 0) {
      output.push('(');
      const options = ListUtils.unwrapList(node.options).map(opt => this.visit(opt, context));
      output.push(options.join(', '));
      output.push(')');
    }
    
    return output.join(' ');
  }

  AlterFdwStmt(node: t.AlterFdwStmt, context: DeparserContext): string {
    const output: string[] = ['ALTER', 'FOREIGN', 'DATA', 'WRAPPER'];
    
    if (node.fdwname) {
      output.push(QuoteUtils.quote(node.fdwname));
    }
    
    if (node.func_options && node.func_options.length > 0) {
      const funcOptions = ListUtils.unwrapList(node.func_options).map(opt => this.visit(opt, context));
      output.push(funcOptions.join(' '));
    }
    
    if (node.options && node.options.length > 0) {
      output.push('OPTIONS');
      output.push('(');
      const options = ListUtils.unwrapList(node.options).map(opt => this.visit(opt, context));
      output.push(options.join(', '));
      output.push(')');
    }
    
    return output.join(' ');
  }

  CreateForeignServerStmt(node: t.CreateForeignServerStmt, context: DeparserContext): string {
    const output: string[] = ['CREATE', 'SERVER'];
    
    if (node.if_not_exists) {
      output.push('IF', 'NOT', 'EXISTS');
    }
    
    if (node.servername) {
      output.push(QuoteUtils.quote(node.servername));
    }
    
    if (node.servertype) {
      output.push('TYPE', QuoteUtils.quote(node.servertype));
    }
    
    if (node.version) {
      output.push('VERSION', QuoteUtils.quote(node.version));
    }
    
    if (node.fdwname) {
      output.push('FOREIGN', 'DATA', 'WRAPPER', QuoteUtils.quote(node.fdwname));
    }
    
    if (node.options && node.options.length > 0) {
      output.push('OPTIONS');
      output.push('(');
      const options = ListUtils.unwrapList(node.options).map(opt => this.visit(opt, context));
      output.push(options.join(', '));
      output.push(')');
    }
    
    return output.join(' ');
  }

  AlterForeignServerStmt(node: t.AlterForeignServerStmt, context: DeparserContext): string {
    const output: string[] = ['ALTER', 'SERVER'];
    
    if (node.servername) {
      output.push(QuoteUtils.quote(node.servername));
    }
    
    if (node.version) {
      output.push('VERSION', QuoteUtils.quote(node.version));
    }
    
    if (node.options && node.options.length > 0) {
      output.push('OPTIONS');
      output.push('(');
      const options = ListUtils.unwrapList(node.options).map(opt => this.visit(opt, context));
      output.push(options.join(', '));
      output.push(')');
    }
    
    return output.join(' ');
  }

  AlterUserMappingStmt(node: t.AlterUserMappingStmt, context: DeparserContext): string {
    const output: string[] = ['ALTER', 'USER', 'MAPPING', 'FOR'];
    
    if (node.user) {
      output.push(this.RoleSpec(node.user, context));
    } else {
      output.push('CURRENT_USER');
    }
    
    output.push('SERVER');
    
    if (node.servername) {
      output.push(QuoteUtils.quote(node.servername));
    }
    
    if (node.options && node.options.length > 0) {
      output.push('OPTIONS');
      output.push('(');
      const options = ListUtils.unwrapList(node.options).map(opt => this.visit(opt, context));
      output.push(options.join(', '));
      output.push(')');
    }
    
    return output.join(' ');
  }

  DropUserMappingStmt(node: t.DropUserMappingStmt, context: DeparserContext): string {
    const output: string[] = ['DROP', 'USER', 'MAPPING'];
    
    if (node.missing_ok) {
      output.push('IF', 'EXISTS');
    }
    
    output.push('FOR');
    
    if (node.user) {
      output.push(this.RoleSpec(node.user, context));
    } else {
      output.push('CURRENT_USER');
    }
    
    output.push('SERVER');
    
    if (node.servername) {
      output.push(QuoteUtils.quote(node.servername));
    }
    
    return output.join(' ');
  }

  ImportForeignSchemaStmt(node: t.ImportForeignSchemaStmt, context: DeparserContext): string {
    const output: string[] = ['IMPORT', 'FOREIGN', 'SCHEMA'];
    
    if (node.remote_schema) {
      output.push(QuoteUtils.quote(node.remote_schema));
    }
    
    if (node.list_type) {
      switch (node.list_type) {
        case 'FDW_IMPORT_SCHEMA_ALL':
          break;
        case 'FDW_IMPORT_SCHEMA_LIMIT_TO':
          output.push('LIMIT', 'TO');
          if (node.table_list && node.table_list.length > 0) {
            output.push('(');
            const tables = ListUtils.unwrapList(node.table_list).map(table => this.visit(table, context));
            output.push(tables.join(', '));
            output.push(')');
          }
          break;
        case 'FDW_IMPORT_SCHEMA_EXCEPT':
          output.push('EXCEPT');
          if (node.table_list && node.table_list.length > 0) {
            output.push('(');
            const tables = ListUtils.unwrapList(node.table_list).map(table => this.visit(table, context));
            output.push(tables.join(', '));
            output.push(')');
          }
          break;
        default:
          throw new Error(`Unsupported ImportForeignSchemaStmt list_type: ${node.list_type}`);
      }
    }
    
    output.push('FROM', 'SERVER');
    
    if (node.server_name) {
      output.push(QuoteUtils.quote(node.server_name));
    }
    
    output.push('INTO');
    
    if (node.local_schema) {
      output.push(QuoteUtils.quote(node.local_schema));
    }
    
    if (node.options && node.options.length > 0) {
      output.push('OPTIONS');
      output.push('(');
      const options = ListUtils.unwrapList(node.options).map(opt => this.visit(opt, context));
      output.push(options.join(', '));
      output.push(')');
    }
    
    return output.join(' ');
  }

  ClusterStmt(node: t.ClusterStmt, context: DeparserContext): string {
    const output: string[] = ['CLUSTER'];
    
    if (node.relation) {
      output.push(this.RangeVar(node.relation, context));
      
      if (node.indexname) {
        output.push('USING', `"${node.indexname}"`);
      }
    }
    
    if (node.params && node.params.length > 0) {
      const params = ListUtils.unwrapList(node.params).map(param => this.visit(param, context));
      output.push(`(${params.join(', ')})`);
    }
    
    return output.join(' ');
  }

  VacuumStmt(node: t.VacuumStmt, context: DeparserContext): string {
    const output: string[] = ['VACUUM'];
    
    if (node.options && node.options.length > 0) {
      const options = ListUtils.unwrapList(node.options).map(option => this.visit(option, context));
      output.push(`(${options.join(', ')})`);
    }
    
    if (node.rels && node.rels.length > 0) {
      const relations = ListUtils.unwrapList(node.rels).map(rel => {
        if (rel.VacuumRelation) {
          const vacRel = rel.VacuumRelation;
          let relOutput = this.visit(vacRel.relation, context);
          
          if (vacRel.va_cols && vacRel.va_cols.length > 0) {
            const cols = ListUtils.unwrapList(vacRel.va_cols).map(col => this.visit(col, context));
            relOutput += ` (${cols.join(', ')})`;
          }
          
          return relOutput;
        }
        return this.visit(rel, context);
      });
      output.push(relations.join(', '));
    }
    
    return output.join(' ');
  }

  ExplainStmt(node: t.ExplainStmt, context: DeparserContext): string {
    const output: string[] = ['EXPLAIN'];
    
    if (node.options && node.options.length > 0) {
      const options = ListUtils.unwrapList(node.options).map(option => this.visit(option, context));
      output.push(`(${options.join(', ')})`);
    }
    
    if (node.query) {
      output.push(this.visit(node.query, context));
    }
    
    return output.join(' ');
  }

  ReindexStmt(node: t.ReindexStmt, context: DeparserContext): string {
    const output: string[] = ['REINDEX'];
    
    if (node.kind) {
      switch (node.kind) {
        case 'REINDEX_OBJECT_INDEX':
          output.push('INDEX');
          break;
        case 'REINDEX_OBJECT_TABLE':
          output.push('TABLE');
          break;
        case 'REINDEX_OBJECT_SCHEMA':
          output.push('SCHEMA');
          break;
        case 'REINDEX_OBJECT_SYSTEM':
          output.push('SYSTEM');
          break;
        case 'REINDEX_OBJECT_DATABASE':
          output.push('DATABASE');
          break;
        default:
          throw new Error(`Unsupported ReindexStmt kind: ${node.kind}`);
      }
    }
    
    if (node.relation) {
      output.push(this.RangeVar(node.relation, context));
    }
    
    if (node.name) {
      output.push(`"${node.name}"`);
    }
    
    if (node.params && node.params.length > 0) {
      const params = ListUtils.unwrapList(node.params).map(param => this.visit(param, context));
      output.push(`(${params.join(', ')})`);
    }
    
    return output.join(' ');
  }

  CallStmt(node: t.CallStmt, context: DeparserContext): string {
    const output: string[] = ['CALL'];
    
    if (node.funccall) {
      const funcCall = node.funccall as any;
      
      if (funcCall.funcname && funcCall.funcname.length > 0) {
        const funcNameParts = funcCall.funcname.map((nameNode: any) => {
          if (nameNode.String) {
            return nameNode.String.sval;
          }
          return this.visit(nameNode, context);
        });
        const funcName = funcNameParts.join('.');
        
        let argsStr = '';
        if (funcCall.args && funcCall.args.length > 0) {
          const argStrs = funcCall.args.map((arg: any) => this.visit(arg, context));
          argsStr = `(${argStrs.join(', ')})`;
        } else {
          argsStr = '()';
        }
        
        output.push(`${funcName}${argsStr}`);
      }
    } else if (node.funcexpr) {
      output.push(this.FuncExpr(node.funcexpr, context));
    } else {
      throw new Error('CallStmt requires either funccall or funcexpr');
    }
    
    return output.join(' ');
  }

  CreatedbStmt(node: t.CreatedbStmt, context: DeparserContext): string {
    const output: string[] = ['CREATE DATABASE'];
    
    if (!node.dbname) {
      throw new Error('CreatedbStmt requires dbname');
    }
    
    output.push(`"${node.dbname}"`);
    
    if (node.options && node.options.length > 0) {
      const options = ListUtils.unwrapList(node.options)
        .map(option => this.visit(option, context))
        .join(' ');
      output.push('WITH', options);
    }
    
    return output.join(' ');
  }

  DropdbStmt(node: t.DropdbStmt, context: DeparserContext): string {
    const output: string[] = ['DROP DATABASE'];
    
    if (node.missing_ok) {
      output.push('IF EXISTS');
    }
    
    if (!node.dbname) {
      throw new Error('DropdbStmt requires dbname');
    }
    
    output.push(`"${node.dbname}"`);
    
    if (node.options && node.options.length > 0) {
      const options = ListUtils.unwrapList(node.options)
        .map(option => this.visit(option, context))
        .join(' ');
      output.push('WITH', options);
    }
    
    return output.join(' ');
  }

  RenameStmt(node: t.RenameStmt, context: DeparserContext): string {
    const output: string[] = ['ALTER'];
    
    if (!node.renameType) {
      throw new Error('RenameStmt requires renameType');
    }
    
    switch (node.renameType) {
      case 'OBJECT_TABLE':
        output.push('TABLE');
        break;
      case 'OBJECT_VIEW':
        output.push('VIEW');
        break;
      case 'OBJECT_INDEX':
        output.push('INDEX');
        break;
      case 'OBJECT_SEQUENCE':
        output.push('SEQUENCE');
        break;
      case 'OBJECT_FUNCTION':
        output.push('FUNCTION');
        break;
      case 'OBJECT_PROCEDURE':
        output.push('PROCEDURE');
        break;
      case 'OBJECT_SCHEMA':
        output.push('SCHEMA');
        break;
      case 'OBJECT_DATABASE':
        output.push('DATABASE');
        break;
      case 'OBJECT_COLUMN':
        output.push('TABLE');
        break;
      case 'OBJECT_DOMAIN':
        output.push('DOMAIN');
        break;
      case 'OBJECT_TYPE':
        output.push('TYPE');
        break;
      case 'OBJECT_DOMCONSTRAINT':
        output.push('DOMAIN');
        break;
      default:
        throw new Error(`Unsupported RenameStmt renameType: ${node.renameType}`);
    }
    
    if (node.missing_ok) {
      output.push('IF EXISTS');
    }
    
    if (node.relation) {
      output.push(this.RangeVar(node.relation, context));
    } else if (node.object) {
      output.push(this.visit(node.object, context));
    }
    
    if (node.renameType === 'OBJECT_COLUMN' && node.subname) {
      output.push('RENAME COLUMN', `"${node.subname}"`, 'TO');
    } else if (node.renameType === 'OBJECT_DOMCONSTRAINT' && node.subname) {
      output.push('RENAME CONSTRAINT', `"${node.subname}"`, 'TO');
    } else {
      output.push('RENAME TO');
    }
    
    if (!node.newname) {
      throw new Error('RenameStmt requires newname');
    }
    
    output.push(`"${node.newname}"`);
    
    return output.join(' ');
  }

  AlterOwnerStmt(node: t.AlterOwnerStmt, context: DeparserContext): string {
    const output: string[] = ['ALTER'];
    
    if (!node.objectType) {
      throw new Error('AlterOwnerStmt requires objectType');
    }
    
    switch (node.objectType) {
      case 'OBJECT_TABLE':
        output.push('TABLE');
        break;
      case 'OBJECT_VIEW':
        output.push('VIEW');
        break;
      case 'OBJECT_INDEX':
        output.push('INDEX');
        break;
      case 'OBJECT_SEQUENCE':
        output.push('SEQUENCE');
        break;
      case 'OBJECT_FUNCTION':
        output.push('FUNCTION');
        break;
      case 'OBJECT_PROCEDURE':
        output.push('PROCEDURE');
        break;
      case 'OBJECT_SCHEMA':
        output.push('SCHEMA');
        break;
      case 'OBJECT_DATABASE':
        output.push('DATABASE');
        break;
      default:
        throw new Error(`Unsupported AlterOwnerStmt objectType: ${node.objectType}`);
    }
    
    if (node.relation) {
      output.push(this.RangeVar(node.relation, context));
    } else if (node.object) {
      output.push(this.visit(node.object, context));
    }
    
    output.push('OWNER TO');
    
    if (!node.newowner) {
      throw new Error('AlterOwnerStmt requires newowner');
    }
    
    output.push(this.RoleSpec(node.newowner, context));
    
    return output.join(' ');
  }

  GrantStmt(node: t.GrantStmt, context: DeparserContext): string {
    const output: string[] = [];
    
    if (node.is_grant) {
      output.push('GRANT');
    } else {
      output.push('REVOKE');
    }

    if (node.privileges && node.privileges.length > 0) {
      const privileges = ListUtils.unwrapList(node.privileges)
        .map(priv => this.visit(priv, context))
        .join(', ');
      output.push(privileges);
    } else {
      output.push('ALL PRIVILEGES');
    }

    output.push('ON');

    // Handle object type specification for ALTER DEFAULT PRIVILEGES
    if (node.objtype) {
      switch (node.objtype) {
        case 'OBJECT_TABLE':
          output.push('TABLES');
          break;
        case 'OBJECT_SEQUENCE':
          output.push('SEQUENCES');
          break;
        case 'OBJECT_FUNCTION':
          output.push('FUNCTIONS');
          break;
        case 'OBJECT_PROCEDURE':
          output.push('PROCEDURES');
          break;
        case 'OBJECT_ROUTINE':
          output.push('ROUTINES');
          break;
        case 'OBJECT_TYPE':
          output.push('TYPES');
          break;
        case 'OBJECT_SCHEMA':
          output.push('SCHEMAS');
          break;
        default:
          break;
      }
    }

    switch (node.targtype) {
      case 'ACL_TARGET_OBJECT':
        if (node.objects && node.objects.length > 0) {
          const objects = ListUtils.unwrapList(node.objects)
            .map(obj => this.visit(obj, context))
            .join(', ');
          output.push(objects);
        }
        break;
      case 'ACL_TARGET_ALL_IN_SCHEMA':
        output.push('ALL TABLES IN SCHEMA');
        if (node.objects && node.objects.length > 0) {
          const schemas = ListUtils.unwrapList(node.objects)
            .map(schema => this.visit(schema, context))
            .join(', ');
          output.push(schemas);
        }
        break;
      default:
        if (node.objects && node.objects.length > 0) {
          const objects = ListUtils.unwrapList(node.objects)
            .map(obj => this.visit(obj, context))
            .join(', ');
          output.push(objects);
        }
    }

    if (node.is_grant) {
      output.push('TO');
    } else {
      output.push('FROM');
    }

    if (node.grantees && node.grantees.length > 0) {
      const grantees = ListUtils.unwrapList(node.grantees)
        .map(grantee => this.visit(grantee, context))
        .join(', ');
      output.push(grantees);
    }

    if (node.grant_option && node.is_grant) {
      output.push('WITH GRANT OPTION');
    } else if (node.grant_option && !node.is_grant) {
      output.push('GRANT OPTION FOR');
    }

    // Only add behavior clauses for REVOKE statements, not for GRANT statements in ALTER DEFAULT PRIVILEGES
    if (!node.is_grant) {
      if (node.behavior === 'DROP_CASCADE') {
        output.push('CASCADE');
      } else if (node.behavior === 'DROP_RESTRICT') {
        output.push('RESTRICT');
      }
    }

    return output.join(' ');
  }

  GrantRoleStmt(node: t.GrantRoleStmt, context: DeparserContext): string {
    const output: string[] = [];
    
    if (node.is_grant) {
      output.push('GRANT');
    } else {
      output.push('REVOKE');
    }

    if (node.granted_roles && node.granted_roles.length > 0) {
      const roles = ListUtils.unwrapList(node.granted_roles)
        .map(role => this.visit(role, context))
        .join(', ');
      output.push(roles);
    }

    if (node.is_grant) {
      output.push('TO');
    } else {
      output.push('FROM');
    }

    if (node.grantee_roles && node.grantee_roles.length > 0) {
      const grantees = ListUtils.unwrapList(node.grantee_roles)
        .map(grantee => this.visit(grantee, context))
        .join(', ');
      output.push(grantees);
    }

    if (node.opt && node.opt.length > 0 && node.is_grant) {
      output.push('WITH ADMIN OPTION');
    } else if (node.opt && node.opt.length > 0 && !node.is_grant) {
      output.push('ADMIN OPTION FOR');
    }

    if (node.behavior === 'DROP_CASCADE') {
      output.push('CASCADE');
    } else if (node.behavior === 'DROP_RESTRICT') {
      output.push('RESTRICT');
    }

    return output.join(' ');
  }

  SecLabelStmt(node: t.SecLabelStmt, context: DeparserContext): string {
    const output: string[] = ['SECURITY LABEL'];

    if (node.provider) {
      output.push('FOR', `"${node.provider}"`);
    }

    output.push('ON');

    if (node.objtype) {
      switch (node.objtype) {
        case 'OBJECT_TABLE':
          output.push('TABLE');
          break;
        case 'OBJECT_COLUMN':
          output.push('COLUMN');
          break;
        case 'OBJECT_FUNCTION':
          output.push('FUNCTION');
          break;
        case 'OBJECT_SCHEMA':
          output.push('SCHEMA');
          break;
        case 'OBJECT_DATABASE':
          output.push('DATABASE');
          break;
        case 'OBJECT_ROLE':
          output.push('ROLE');
          break;
        default:
          output.push(node.objtype.replace('OBJECT_', ''));
      }
    }

    if (node.object) {
      output.push(this.visit(node.object, context));
    }

    output.push('IS');

    if (node.label) {
      output.push(`'${node.label}'`);
    } else {
      output.push('NULL');
    }

    return output.join(' ');
  }

  AlterDefaultPrivilegesStmt(node: t.AlterDefaultPrivilegesStmt, context: DeparserContext): string {
    const output: string[] = ['ALTER DEFAULT PRIVILEGES'];

    if (node.options && node.options.length > 0) {
      const options = ListUtils.unwrapList(node.options);
      for (const option of options) {
        const optionData = this.getNodeData(option);
        if (optionData.defname === 'schemas') {
          output.push('IN SCHEMA');
          if (optionData.arg) {
            const schemas = ListUtils.unwrapList(optionData.arg)
              .map(schema => this.visit(schema, context))
              .join(', ');
            output.push(schemas);
          }
        } else if (optionData.defname === 'roles') {
          output.push('FOR ROLE');
          if (optionData.arg) {
            const roles = ListUtils.unwrapList(optionData.arg)
              .map(role => this.visit(role, context))
              .join(', ');
            output.push(roles);
          }
        }
      }
    }

    if (node.action) {
      const actionStr = this.GrantStmt(node.action, context);
      output.push(actionStr);
    }

    return output.join(' ');
  }

  CreateConversionStmt(node: t.CreateConversionStmt, context: DeparserContext): string {
    const output: string[] = ['CREATE'];

    if (node.def) {
      output.push('DEFAULT');
    }

    output.push('CONVERSION');

    if (node.conversion_name && node.conversion_name.length > 0) {
      const conversionName = ListUtils.unwrapList(node.conversion_name)
        .map(name => this.visit(name, context))
        .join('.');
      output.push(QuoteUtils.quote(conversionName));
    }

    if (node.for_encoding_name) {
      output.push('FOR', `'${node.for_encoding_name}'`);
    }

    if (node.to_encoding_name) {
      output.push('TO', `'${node.to_encoding_name}'`);
    }

    if (node.func_name && node.func_name.length > 0) {
      output.push('FROM');
      const funcName = ListUtils.unwrapList(node.func_name)
        .map(name => this.visit(name, context))
        .join('.');
      output.push(funcName);
    }

    return output.join(' ');
  }

  CreateCastStmt(node: t.CreateCastStmt, context: DeparserContext): string {
    const output: string[] = ['CREATE CAST'];

    output.push('(');
    if (node.sourcetype) {
      output.push(this.TypeName(node.sourcetype, context));
    }
    output.push('AS');
    if (node.targettype) {
      output.push(this.TypeName(node.targettype, context));
    }
    output.push(')');

    if (node.func) {
      output.push('WITH FUNCTION');
      output.push(this.visit(node.func as any, context));
    } else if (node.inout) {
      output.push('WITH INOUT');
    } else {
      output.push('WITHOUT FUNCTION');
    }

    if (node.context) {
      switch (node.context) {
        case 'COERCION_IMPLICIT':
          output.push('AS IMPLICIT');
          break;
        case 'COERCION_ASSIGNMENT':
          output.push('AS ASSIGNMENT');
          break;
        case 'COERCION_EXPLICIT':
          break;
        default:
          throw new Error(`Unsupported CreateCastStmt context: ${node.context}`);
      }
    }

    if (node.context === 'COERCION_IMPLICIT') {
      output.push('AS IMPLICIT');
    } else if (node.context === 'COERCION_ASSIGNMENT') {
      output.push('AS ASSIGNMENT');
    }

    return output.join(' ');
  }

  CreatePLangStmt(node: t.CreatePLangStmt, context: DeparserContext): string {
    const output: string[] = ['CREATE'];

    if (node.replace) {
      output.push('OR REPLACE');
    }

    if (node.pltrusted) {
      output.push('TRUSTED');
    }

    output.push('LANGUAGE');

    if (node.plname) {
      output.push(QuoteUtils.quote(node.plname));
    }

    if (node.plhandler && node.plhandler.length > 0) {
      output.push('HANDLER');
      const handlerName = ListUtils.unwrapList(node.plhandler)
        .map(name => this.visit(name, context))
        .join('.');
      output.push(handlerName);
    }

    if (node.plinline && node.plinline.length > 0) {
      output.push('INLINE');
      const inlineName = ListUtils.unwrapList(node.plinline)
        .map(name => this.visit(name, context))
        .join('.');
      output.push(inlineName);
    }

    if (node.plvalidator && node.plvalidator.length > 0) {
      output.push('VALIDATOR');
      const validatorName = ListUtils.unwrapList(node.plvalidator)
        .map(name => this.visit(name, context))
        .join('.');
      output.push(validatorName);
    }

    return output.join(' ');
  }

  CreateTransformStmt(node: t.CreateTransformStmt, context: DeparserContext): string {
    const output: string[] = ['CREATE'];

    if (node.replace) {
      output.push('OR REPLACE');
    }

    output.push('TRANSFORM FOR');

    if (node.type_name) {
      output.push(this.TypeName(node.type_name, context));
    }

    output.push('LANGUAGE');

    if (node.lang) {
      output.push(QuoteUtils.quote(node.lang));
    }

    output.push('(');

    const transforms: string[] = [];
    if (node.fromsql) {
      const fromSqlName = ListUtils.unwrapList(node.fromsql)
        .map(name => this.visit(name, context))
        .join('.');
      transforms.push(`FROM SQL WITH FUNCTION ${fromSqlName}`);
    }

    if (node.tosql) {
      const toSqlName = ListUtils.unwrapList(node.tosql)
        .map(name => this.visit(name, context))
        .join('.');
      transforms.push(`TO SQL WITH FUNCTION ${toSqlName}`);
    }

    output.push(transforms.join(', '));
    output.push(')');

    return output.join(' ');
  }

  CreateTrigStmt(node: t.CreateTrigStmt, context: DeparserContext): string {
    const output: string[] = ['CREATE'];

    if (node.replace) {
      output.push('OR REPLACE');
    }

    if (node.isconstraint) {
      output.push('CONSTRAINT');
    }

    output.push('TRIGGER');

    if (node.trigname) {
      output.push(QuoteUtils.quote(node.trigname));
    }

    const timing: string[] = [];
    if (node.timing & 2) timing.push('BEFORE');
    if (node.timing & 4) timing.push('AFTER');
    if (node.timing & 8) timing.push('INSTEAD OF');
    output.push(timing.join(' '));

    const events: string[] = [];
    if (node.events & 16) events.push('INSERT');
    if (node.events & 8) events.push('DELETE');
    if (node.events & 4) events.push('UPDATE');
    if (node.events & 32) events.push('TRUNCATE');
    output.push(events.join(' OR '));

    if (node.columns && node.columns.length > 0) {
      output.push('OF');
      const columnNames = ListUtils.unwrapList(node.columns)
        .map(col => this.visit(col, context))
        .join(', ');
      output.push(columnNames);
    }

    output.push('ON');
    if (node.relation) {
      output.push(this.RangeVar(node.relation, context));
    }

    if (node.constrrel) {
      output.push('FROM');
      output.push(this.RangeVar(node.constrrel, context));
    }

    if (node.deferrable) {
      output.push('DEFERRABLE');
    }

    if (node.initdeferred) {
      output.push('INITIALLY DEFERRED');
    }

    if (node.row) {
      output.push('FOR EACH ROW');
    } else {
      output.push('FOR EACH STATEMENT');
    }

    if (node.whenClause) {
      output.push('WHEN');
      output.push('(');
      output.push(this.visit(node.whenClause, context));
      output.push(')');
    }

    output.push('EXECUTE');
    if (node.funcname && node.funcname.length > 0) {
      const funcName = ListUtils.unwrapList(node.funcname)
        .map(name => this.visit(name, context))
        .join('.');
      output.push('FUNCTION', funcName);
    }

    if (node.args && node.args.length > 0) {
      output.push('(');
      const args = ListUtils.unwrapList(node.args)
        .map(arg => this.visit(arg, context))
        .join(', ');
      output.push(args);
      output.push(')');
    } else {
      output.push('()');
    }

    return output.join(' ');
  }

  CreateEventTrigStmt(node: t.CreateEventTrigStmt, context: DeparserContext): string {
    const output: string[] = ['CREATE EVENT TRIGGER'];

    if (node.trigname) {
      output.push(QuoteUtils.quote(node.trigname));
    }

    output.push('ON');

    if (node.eventname) {
      output.push(node.eventname);
    }

    if (node.whenclause && node.whenclause.length > 0) {
      output.push('WHEN');
      const conditions = ListUtils.unwrapList(node.whenclause)
        .map(condition => this.visit(condition, context))
        .join(' AND ');
      output.push(conditions);
    }

    output.push('EXECUTE');

    if (node.funcname && node.funcname.length > 0) {
      const funcName = ListUtils.unwrapList(node.funcname)
        .map(name => this.visit(name, context))
        .join('.');
      output.push('FUNCTION', funcName + '()');
    }

    return output.join(' ');
  }

  AlterEventTrigStmt(node: t.AlterEventTrigStmt, context: DeparserContext): string {
    const output: string[] = ['ALTER EVENT TRIGGER'];

    if (node.trigname) {
      output.push(QuoteUtils.quote(node.trigname));
    }

    if (node.tgenabled) {
      switch (node.tgenabled) {
        case 'O':
          output.push('ENABLE');
          break;
        case 'D':
          output.push('DISABLE');
          break;
        case 'R':
          output.push('ENABLE REPLICA');
          break;
        case 'A':
          output.push('ENABLE ALWAYS');
          break;
        default:
          throw new Error(`Unsupported trigger enable state: ${node.tgenabled}`);
      }
    }

    return output.join(' ');
  }

  CreateOpClassStmt(node: t.CreateOpClassStmt, context: DeparserContext): string {
    const output: string[] = ['CREATE OPERATOR CLASS'];

    if (node.opclassname && node.opclassname.length > 0) {
      const className = ListUtils.unwrapList(node.opclassname)
        .map(name => this.visit(name, context))
        .join('.');
      output.push(className);
    }

    if (node.isDefault) {
      output.push('DEFAULT');
    }

    output.push('FOR TYPE');

    if (node.datatype) {
      output.push(this.TypeName(node.datatype, context));
    }

    output.push('USING');

    if (node.amname) {
      output.push(node.amname);
    }

    if (node.opfamilyname && node.opfamilyname.length > 0) {
      output.push('FAMILY');
      const familyName = ListUtils.unwrapList(node.opfamilyname)
        .map(name => this.visit(name, context))
        .join('.');
      output.push(familyName);
    }

    output.push('AS');

    if (node.items && node.items.length > 0) {
      const items = ListUtils.unwrapList(node.items)
        .map(item => this.visit(item, context))
        .join(', ');
      output.push(items);
    }

    return output.join(' ');
  }

  CreateOpFamilyStmt(node: t.CreateOpFamilyStmt, context: DeparserContext): string {
    const output: string[] = ['CREATE OPERATOR FAMILY'];

    if (node.opfamilyname && node.opfamilyname.length > 0) {
      const familyName = ListUtils.unwrapList(node.opfamilyname)
        .map(name => this.visit(name, context))
        .join('.');
      output.push(familyName);
    }

    output.push('USING');

    if (node.amname) {
      output.push(node.amname);
    }

    return output.join(' ');
  }

  AlterOpFamilyStmt(node: t.AlterOpFamilyStmt, context: DeparserContext): string {
    const output: string[] = ['ALTER OPERATOR FAMILY'];

    if (node.opfamilyname && node.opfamilyname.length > 0) {
      const familyName = ListUtils.unwrapList(node.opfamilyname)
        .map(name => this.visit(name, context))
        .join('.');
      output.push(familyName);
    }

    output.push('USING');

    if (node.amname) {
      output.push(node.amname);
    }

    if (node.isDrop) {
      output.push('DROP');
    } else {
      output.push('ADD');
    }

    if (node.items && node.items.length > 0) {
      const items = ListUtils.unwrapList(node.items)
        .map(item => this.visit(item, context))
        .join(', ');
      output.push(items);
    }

    return output.join(' ');
  }

  MergeStmt(node: t.MergeStmt, context: DeparserContext): string {
    const output: string[] = [];
    
    if (node.withClause) {
      output.push(this.WithClause(node.withClause, context));
    }
    
    output.push('MERGE INTO');
    
    if (node.relation) {
      output.push(this.RangeVar(node.relation, context));
    }
    
    if (node.sourceRelation) {
      output.push('USING');
      output.push(this.visit(node.sourceRelation, context));
    }
    
    if (node.joinCondition) {
      output.push('ON');
      output.push(this.visit(node.joinCondition, context));
    }
    
    if (node.mergeWhenClauses && node.mergeWhenClauses.length > 0) {
      const whenClauses = ListUtils.unwrapList(node.mergeWhenClauses)
        .map(clause => this.visit(clause, context))
        .join(' ');
      output.push(whenClauses);
    }
    
    return output.join(' ');
  }

  AlterTableMoveAllStmt(node: t.AlterTableMoveAllStmt, context: DeparserContext): string {
    const output: string[] = ['ALTER'];
    
    if (node.objtype === 'OBJECT_TABLE') {
      output.push('TABLE');
    } else if (node.objtype === 'OBJECT_INDEX') {
      output.push('INDEX');
    } else {
      output.push('TABLE');
    }
    
    output.push('ALL', 'IN', 'TABLESPACE');
    
    if (node.orig_tablespacename) {
      output.push(QuoteUtils.quote(node.orig_tablespacename));
    }
    
    output.push('SET', 'TABLESPACE');
    
    if (node.new_tablespacename) {
      output.push(QuoteUtils.quote(node.new_tablespacename));
    }
    
    if (node.nowait) {
      output.push('NOWAIT');
    }
    
    return output.join(' ');
  }

  CreateSeqStmt(node: t.CreateSeqStmt, context: DeparserContext): string {
    const output: string[] = ['CREATE', 'SEQUENCE'];
    
    if (node.if_not_exists) {
      output.push('IF NOT EXISTS');
    }
    
    if (node.sequence) {
      const sequenceName: string[] = [];
      const seq = node.sequence as any;
      if (seq.schemaname) {
        sequenceName.push(QuoteUtils.quote(seq.schemaname));
      }
      if (seq.relname) {
        sequenceName.push(QuoteUtils.quote(seq.relname));
      }
      output.push(sequenceName.join('.'));
    }
    
    if (node.options && node.options.length > 0) {
      const seqContext = { ...context, parentNodeType: 'CreateSeqStmt' };
      const optionStrs = ListUtils.unwrapList(node.options)
        .map(option => this.visit(option, seqContext))
        .join(' ');
      output.push(optionStrs);
    }
    
    return output.join(' ');
  }

  AlterSeqStmt(node: t.AlterSeqStmt, context: DeparserContext): string {
    const output: string[] = ['ALTER', 'SEQUENCE'];
    
    if (node.missing_ok) {
      output.push('IF EXISTS');
    }
    
    if (node.sequence) {
      const sequenceName: string[] = [];
      const seq = node.sequence as any;
      if (seq.schemaname) {
        sequenceName.push(QuoteUtils.quote(seq.schemaname));
      }
      if (seq.relname) {
        sequenceName.push(QuoteUtils.quote(seq.relname));
      }
      output.push(sequenceName.join('.'));
    }
    
    if (node.options && node.options.length > 0) {
      const seqContext = { ...context, parentNodeType: 'AlterSeqStmt' };
      const optionStrs = ListUtils.unwrapList(node.options)
        .map(option => this.visit(option, seqContext))
        .join(' ');
      output.push(optionStrs);
    }
    
    if (node.for_identity) {
      output.push('FOR IDENTITY');
    }
    
    return output.join(' ');
  }

  CompositeTypeStmt(node: t.CompositeTypeStmt, context: DeparserContext): string {
    const output: string[] = ['CREATE', 'TYPE'];
    
    if (node.typevar) {
      output.push(this.RangeVar(node.typevar, context));
    }
    
    output.push('AS');
    
    if (node.coldeflist && node.coldeflist.length > 0) {
      const colDefs = ListUtils.unwrapList(node.coldeflist)
        .map(colDef => this.visit(colDef, context))
        .join(', ');
      output.push(`(${colDefs})`);
    }
    
    return output.join(' ');
  }

  CreateRangeStmt(node: t.CreateRangeStmt, context: DeparserContext): string {
    const output: string[] = ['CREATE', 'TYPE'];
    
    if (node.typeName && node.typeName.length > 0) {
      const typeNameStr = ListUtils.unwrapList(node.typeName)
        .map(name => this.visit(name, context))
        .join('.');
      output.push(typeNameStr);
    }
    
    output.push('AS', 'RANGE');
    
    if (node.params && node.params.length > 0) {
      const paramStrs = ListUtils.unwrapList(node.params).map(param => {
        const paramData = this.getNodeData(param);
        if (paramData.defname && paramData.arg) {
          const argValue = this.visit(paramData.arg, context);
          return `${paramData.defname} = ${argValue}`;
        }
        return this.visit(param, context);
      });
      output.push(`(${paramStrs.join(', ')})`);
    }
    
    return output.join(' ');
  }

  AlterEnumStmt(node: t.AlterEnumStmt, context: DeparserContext): string {
    const output: string[] = ['ALTER', 'TYPE'];
    
    if (node.typeName && node.typeName.length > 0) {
      const typeNameStr = ListUtils.unwrapList(node.typeName)
        .map(name => this.visit(name, context))
        .join('.');
      output.push(typeNameStr);
    }
    
    if (node.oldVal && node.newVal) {
      output.push('RENAME', 'VALUE', `'${node.oldVal}'`, 'TO', `'${node.newVal}'`);
    } else if (node.newVal) {
      output.push('ADD', 'VALUE');
      if (node.skipIfNewValExists) {
        output.push('IF NOT EXISTS');
      }
      output.push(`'${node.newVal}'`);
      if (node.newValNeighbor) {
        if (node.newValIsAfter) {
          output.push('AFTER', `'${node.newValNeighbor}'`);
        } else {
          output.push('BEFORE', `'${node.newValNeighbor}'`);
        }
      }
    }
    
    return output.join(' ');
  }

  AlterRoleStmt(node: t.AlterRoleStmt, context: DeparserContext): string {
    const output: string[] = ['ALTER', 'ROLE'];
    
    if (node.role) {
      output.push(this.visit(node.role as any, context));
    }
    
    if (node.options) {
      const roleContext = { ...context, parentNodeType: 'AlterRoleStmt' };
      const options = ListUtils.unwrapList(node.options)
        .map(option => this.visit(option, roleContext))
        .join(' ');
      if (options) {
        output.push(options);
      }
    }
    
    return output.join(' ');
  }

  DropRoleStmt(node: t.DropRoleStmt, context: DeparserContext): string {
    const output: string[] = ['DROP', 'ROLE'];
    
    if (node.missing_ok) {
      output.push('IF EXISTS');
    }
    
    if (node.roles) {
      const roleNames = ListUtils.unwrapList(node.roles)
        .map(role => this.visit(role, context))
        .join(', ');
      output.push(roleNames);
    }
    
    return output.join(' ');
  }

  targetList(node: any, context: DeparserContext): string {
    if (!node || !Array.isArray(node)) {
      return '';
    }
    
    return node.map((target: any) => this.visit(target, context)).join(', ');
  }

  CreateAggregateStmt(node: t.DefineStmt, context: DeparserContext): string {
    const output: string[] = ['CREATE'];
    
    if (node.replace) {
      output.push('OR REPLACE');
    }
    
    output.push('AGGREGATE');
    
    if (node.defnames && node.defnames.length > 0) {
      const aggName = ListUtils.unwrapList(node.defnames)
        .map(name => this.visit(name, context))
        .join('.');
      output.push(aggName);
    }
    
    output.push('(');
    
    // Handle aggregate arguments/parameters
    if (node.args && node.args.length > 0) {
      const args = ListUtils.unwrapList(node.args)
        .map(arg => this.visit(arg, context))
        .join(', ');
      output.push(args);
    } else {
      output.push('*');
    }
    
    output.push(')');
    output.push('(');
    
    const options: string[] = [];
    
    if (node.definition && node.definition.length > 0) {
      const optionStrs = ListUtils.unwrapList(node.definition)
        .map(option => {
          const optionData = this.getNodeData(option);
          if (optionData.defname === 'sfunc' || optionData.defname === 'sfunc1') {
            const funcValue = this.visit(optionData.arg, context);
            return `SFUNC = ${funcValue}`;
          } else if (optionData.defname === 'stype' || optionData.defname === 'stype1') {
            const typeValue = this.visit(optionData.arg, context);
            return `STYPE = ${typeValue}`;
          } else if (optionData.defname === 'basetype') {
            const baseValue = this.visit(optionData.arg, context);
            return `BASETYPE = ${baseValue}`;
          } else if (optionData.defname === 'finalfunc') {
            const finalValue = this.visit(optionData.arg, context);
            return `FINALFUNC = ${finalValue}`;
          } else if (optionData.defname === 'initcond' || optionData.defname === 'initcond1') {
            const initValue = this.visit(optionData.arg, context);
            return `INITCOND = ${initValue}`;
          } else if (optionData.defname === 'combinefunc') {
            const combineValue = this.visit(optionData.arg, context);
            return `COMBINEFUNC = ${combineValue}`;
          } else if (optionData.defname === 'serialfunc') {
            const serialValue = this.visit(optionData.arg, context);
            return `SERIALFUNC = ${serialValue}`;
          } else if (optionData.defname === 'deserialfunc') {
            const deserialValue = this.visit(optionData.arg, context);
            return `DESERIALFUNC = ${deserialValue}`;
          } else if (optionData.defname === 'parallel') {
            const parallelValue = this.visit(optionData.arg, context);
            return `PARALLEL = ${parallelValue}`;
          }
          return this.visit(option, context);
        });
      options.push(...optionStrs);
    }
    
    output.push(options.join(', '));
    output.push(')');
    
    return output.join(' ');
  }

  CreateTableAsStmt(node: t.CreateTableAsStmt, context: DeparserContext): string {
    const output: string[] = ['CREATE'];
    
    if (node.objtype === 'OBJECT_MATVIEW') {
      output.push('MATERIALIZED VIEW');
    } else {
      output.push('TABLE');
    }
    
    if (node.if_not_exists) {
      output.push('IF NOT EXISTS');
    }
    
    if (node.into && node.into.rel) {
      output.push(this.visit(node.into.rel as any, context));
    }
    
    if (node.into && node.into.colNames && node.into.colNames.length > 0) {
      output.push('(');
      const colNames = ListUtils.unwrapList(node.into.colNames)
        .map(col => this.visit(col, context))
        .join(', ');
      output.push(colNames);
      output.push(')');
    }
    
    output.push('AS');
    
    if (node.query) {
      output.push(this.visit(node.query as any, context));
    }
    
    if (node.into && node.into.options && node.into.options.length > 0) {
      output.push('WITH');
      const options = ListUtils.unwrapList(node.into.options)
        .map(option => this.visit(option, context))
        .join(', ');
      output.push(`(${options})`);
    }
    
    return output.join(' ');
  }

  RefreshMatViewStmt(node: t.RefreshMatViewStmt, context: DeparserContext): string {
    const output: string[] = ['REFRESH', 'MATERIALIZED', 'VIEW'];
    
    if (node.concurrent) {
      output.push('CONCURRENTLY');
    }
    
    if (node.relation) {
      output.push(this.visit(node.relation as any, context));
    }
    
    if (node.skipData) {
      output.push('WITH NO DATA');
    }
    
    return output.join(' ');
  }



  AccessPriv(node: t.AccessPriv, context: DeparserContext): string {
    const output: string[] = [];
    
    if (node.priv_name) {
      output.push(node.priv_name.toUpperCase());
    } else {
      output.push('ALL');
    }
    
    if (node.cols && node.cols.length > 0) {
      output.push('(');
      const columns = ListUtils.unwrapList(node.cols).map(col => this.visit(col, context));
      output.push(columns.join(', '));
      output.push(')');
    }
    
    return output.join(' ');
  }

  aliasname(node: any, context: DeparserContext): string {
    if (typeof node === 'string') {
      return QuoteUtils.quote(node);
    }
    return this.visit(node, context);
  }

  DefineStmt(node: t.DefineStmt, context: DeparserContext): string {
    const output: string[] = [];
    
    if (!node.kind) {
      throw new Error('DefineStmt requires kind property');
    }
    
    switch (node.kind) {
      case 'OBJECT_OPERATOR':
        output.push('CREATE OPERATOR');
        
        if (node.defnames && node.defnames.length > 0) {
          output.push(ListUtils.unwrapList(node.defnames).map(name => this.visit(name, context)).join('.'));
        }
        
        if (node.definition && node.definition.length > 0) {
          output.push('(');
          const definitions = ListUtils.unwrapList(node.definition).map(def => {
            if (def.DefElem) {
              const defElem = def.DefElem;
              const defName = defElem.defname;
              const defValue = defElem.arg;
              
              if (defName && defValue) {
                return `${defName.toUpperCase()} = ${this.visit(defValue, context)}`;
              }
            }
            return this.visit(def, context);
          });
          output.push(definitions.join(', '));
          output.push(')');
        }
        break;
        
      case 'OBJECT_TYPE':
        output.push('CREATE TYPE');
        
        if (node.defnames && node.defnames.length > 0) {
          output.push(ListUtils.unwrapList(node.defnames).map(name => this.visit(name, context)).join('.'));
        }
        
        if (node.definition && node.definition.length > 0) {
          output.push('(');
          const definitions = ListUtils.unwrapList(node.definition).map(def => {
            if (def.DefElem) {
              const defElem = def.DefElem;
              const defName = defElem.defname;
              const defValue = defElem.arg;
              
              if (defName && defValue) {
                return `${defName} = ${this.visit(defValue, context)}`;
              }
            }
            return this.visit(def, context);
          });
          output.push(definitions.join(', '));
          output.push(')');
        }
        break;
        
      case 'OBJECT_AGGREGATE':
        output.push('CREATE AGGREGATE');
        
        if (node.defnames && node.defnames.length > 0) {
          const nameStrs = ListUtils.unwrapList(node.defnames).map(name => this.visit(name, context));
          output.push(nameStrs.join('.'));
        }
        
        if (node.args && node.args.length > 0) {
          const argStrs = ListUtils.unwrapList(node.args).map(arg => this.visit(arg, context));
          output.push(`(${argStrs.join(', ')})`);
        }
        
        if (node.definition && node.definition.length > 0) {
          output.push('(');
          const definitions = ListUtils.unwrapList(node.definition).map(def => {
            if (def.DefElem) {
              const defElem = def.DefElem;
              const defName = defElem.defname;
              const defValue = defElem.arg;
              
              if (defName && defValue) {
                return `${defName.toUpperCase()} = ${this.visit(defValue, context)}`;
              }
            }
            return this.visit(def, context);
          });
          output.push(definitions.join(', '));
          output.push(')');
        }
        break;
        
      default:
        throw new Error(`Unsupported DefineStmt kind: ${node.kind}`);
    }
    
    return output.join(' ');
  }

  AlterDatabaseStmt(node: t.AlterDatabaseStmt, context: DeparserContext): string {
    const output: string[] = ['ALTER', 'DATABASE'];
    
    if (node.dbname) {
      output.push(QuoteUtils.quote(node.dbname));
    }
    
    if (node.options && node.options.length > 0) {
      const options = ListUtils.unwrapList(node.options).map(opt => this.visit(opt, context));
      output.push(options.join(' '));
    }
    
    return output.join(' ');
  }

  AlterDatabaseRefreshCollStmt(node: t.AlterDatabaseRefreshCollStmt, context: DeparserContext): string {
    const output: string[] = ['ALTER', 'DATABASE'];
    
    if (node.dbname) {
      output.push(QuoteUtils.quote(node.dbname));
    }
    
    output.push('REFRESH', 'COLLATION', 'VERSION');
    
    return output.join(' ');
  }

  AlterDatabaseSetStmt(node: t.AlterDatabaseSetStmt, context: DeparserContext): string {
    const output: string[] = ['ALTER', 'DATABASE'];
    
    if (node.dbname) {
      output.push(QuoteUtils.quote(node.dbname));
    }
    
    if (node.setstmt) {
      const setClause = this.VariableSetStmt(node.setstmt, context);
      output.push(setClause);
    }
    
    return output.join(' ');
  }

  DeclareCursorStmt(node: t.DeclareCursorStmt, context: DeparserContext): string {
    const output: string[] = ['DECLARE'];
    
    if (node.portalname) {
      output.push(QuoteUtils.quote(node.portalname));
    }
    
    output.push('CURSOR');
    
    if (node.options) {
      // Handle cursor options like SCROLL, NO SCROLL, etc.
      if (node.options & 1) output.push('SCROLL');
      if (node.options & 2) output.push('NO SCROLL');
      if (node.options & 4) output.push('BINARY');
      if (node.options & 8) output.push('INSENSITIVE');
    }
    
    output.push('FOR');
    
    if (node.query) {
      output.push(this.visit(node.query, context));
    }
    
    return output.join(' ');
  }

  PublicationObjSpec(node: t.PublicationObjSpec, context: DeparserContext): string {
    const output: string[] = [];
    
    if (node.pubobjtype === 'PUBLICATIONOBJ_TABLE') {
      output.push('TABLE');
      if (node.pubtable) {
        output.push(this.PublicationTable(node.pubtable, context));
      }
    } else if (node.pubobjtype === 'PUBLICATIONOBJ_TABLES_IN_SCHEMA') {
      output.push('TABLES IN SCHEMA');
      if (node.name) {
        output.push(QuoteUtils.quote(node.name));
      }
    } else if (node.pubobjtype === 'PUBLICATIONOBJ_TABLES_IN_CUR_SCHEMA') {
      output.push('TABLES IN SCHEMA CURRENT_SCHEMA');
    }
    
    return output.join(' ');
  }

  PublicationTable(node: t.PublicationTable, context: DeparserContext): string {
    const output: string[] = [];
    
    if (node.relation) {
      output.push(this.RangeVar(node.relation, context));
    }
    
    if (node.columns && node.columns.length > 0) {
      const columns = ListUtils.unwrapList(node.columns).map(col => this.visit(col, context));
      output.push(`(${columns.join(', ')})`);
    }
    
    if (node.whereClause) {
      output.push('WHERE');
      output.push(this.visit(node.whereClause, context));
    }
    
    return output.join(' ');
  }

  CreateAmStmt(node: t.CreateAmStmt, context: DeparserContext): string {
    const output: string[] = ['CREATE', 'ACCESS', 'METHOD'];
    
    if (node.amname) {
      output.push(QuoteUtils.quote(node.amname));
    }
    
    if (node.amtype) {
      output.push('TYPE', node.amtype.toUpperCase());
    }
    
    if (node.handler_name && node.handler_name.length > 0) {
      output.push('HANDLER');
      const handlerName = ListUtils.unwrapList(node.handler_name)
        .map(name => this.visit(name, context))
        .join('.');
      output.push(handlerName);
    }
    
    return output.join(' ');
  }

  IntoClause(node: t.IntoClause, context: DeparserContext): string {
    const output: string[] = ['INTO'];
    
    if (node.rel) {
      output.push(this.RangeVar(node.rel, context));
    }
    
    if (node.colNames && node.colNames.length > 0) {
      const columns = ListUtils.unwrapList(node.colNames)
        .map(col => this.visit(col, context))
        .join(', ');
      output.push(`(${columns})`);
    }
    
    if (node.accessMethod) {
      output.push('USING', node.accessMethod);
    }
    
    if (node.options && node.options.length > 0) {
      output.push('WITH');
      const options = ListUtils.unwrapList(node.options)
        .map(opt => this.visit(opt, context))
        .join(', ');
      output.push(`(${options})`);
    }
    
    if (node.onCommit && node.onCommit !== 'ONCOMMIT_NOOP') {
      output.push('ON COMMIT');
      switch (node.onCommit) {
        case 'ONCOMMIT_PRESERVE_ROWS':
          output.push('PRESERVE ROWS');
          break;
        case 'ONCOMMIT_DELETE_ROWS':
          output.push('DELETE ROWS');
          break;
        case 'ONCOMMIT_DROP':
          output.push('DROP');
          break;
      }
    }
    
    if (node.tableSpaceName) {
      output.push('TABLESPACE', QuoteUtils.quote(node.tableSpaceName));
    }
    
    return output.join(' ');
  }

  OnConflictExpr(node: t.OnConflictExpr, context: DeparserContext): string {
    const output: string[] = ['ON CONFLICT'];
    
    if (node.arbiterElems && node.arbiterElems.length > 0) {
      const arbiters = ListUtils.unwrapList(node.arbiterElems)
        .map(elem => this.visit(elem, context))
        .join(', ');
      output.push(`(${arbiters})`);
    }
    
    if (node.arbiterWhere) {
      output.push('WHERE');
      output.push(this.visit(node.arbiterWhere, context));
    }
    
    if (node.action === 'ONCONFLICT_NOTHING') {
      output.push('DO NOTHING');
    } else if (node.action === 'ONCONFLICT_UPDATE') {
      output.push('DO UPDATE SET');
      if (node.onConflictSet && node.onConflictSet.length > 0) {
        const updates = ListUtils.unwrapList(node.onConflictSet)
          .map(set => this.visit(set, context))
          .join(', ');
        output.push(updates);
      }
      
      if (node.onConflictWhere) {
        output.push('WHERE');
        output.push(this.visit(node.onConflictWhere, context));
      }
    }
    
    return output.join(' ');
  }

  ScanToken(node: t.ScanToken, context: DeparserContext): string {
    return '';
  }

  CreateOpClassItem(node: t.CreateOpClassItem, context: DeparserContext): string {
    const output: string[] = [];
    
    if (node.itemtype === 1) {
      output.push('OPERATOR');
      if (node.number) {
        output.push(node.number.toString());
      }
      if (node.name) {
        output.push(this.ObjectWithArgs(node.name, context));
      }
    } else if (node.itemtype === 2) {
      output.push('FUNCTION');
      if (node.number) {
        output.push(node.number.toString());
      }
      if (node.name) {
        output.push(this.ObjectWithArgs(node.name, context));
      }
    } else if (node.itemtype === 3) {
      output.push('STORAGE');
      if (node.storedtype) {
        output.push(this.TypeName(node.storedtype, context));
      }
    }
    
    if (node.order_family && node.order_family.length > 0) {
      output.push('FOR ORDER BY');
      const orderFamily = ListUtils.unwrapList(node.order_family)
        .map(family => this.visit(family, context))
        .join('.');
      output.push(orderFamily);
    }
    
    if (node.class_args && node.class_args.length > 0) {
      const classArgs = ListUtils.unwrapList(node.class_args)
        .map(arg => this.visit(arg, context))
        .join(', ');
      output.push(`(${classArgs})`);
    }
    
    return output.join(' ');
  }

  Var(node: t.Var, context: DeparserContext): string {
    if (node.varno && node.varattno) {
      return `$${node.varno}.${node.varattno}`;
    }
    return '$var';
  }

  TableFunc(node: t.TableFunc, context: DeparserContext): string {
    const output: string[] = [];
    
    if (node.functype === 'TFT_XMLTABLE') {
      output.push('XMLTABLE');
      
      if (node.ns_names && node.ns_names.length > 0) {
        output.push('XMLNAMESPACES');
        const namespaces = ListUtils.unwrapList(node.ns_names)
          .map(ns => this.visit(ns, context))
          .join(', ');
        output.push(`(${namespaces})`);
      }
      
      if (node.rowexpr) {
        output.push(`(${this.visit(node.rowexpr, context)})`);
      }
      
      if (node.docexpr) {
        output.push('PASSING');
        output.push(this.visit(node.docexpr, context));
      }
      
      if (node.colexprs && node.colexprs.length > 0) {
        output.push('COLUMNS');
        const columns = ListUtils.unwrapList(node.colexprs)
          .map(col => this.visit(col, context))
          .join(', ');
        output.push(columns);
      }
    } else if (node.functype === 'TFT_JSON_TABLE') {
      output.push('JSON_TABLE');
      
      if (node.docexpr) {
        output.push(`(${this.visit(node.docexpr, context)})`);
      }
      
      if (node.rowexpr) {
        output.push(',');
        output.push(`'${this.visit(node.rowexpr, context)}'`);
      }
      
      if (node.colexprs && node.colexprs.length > 0) {
        output.push('COLUMNS');
        const columns = ListUtils.unwrapList(node.colexprs)
          .map(col => this.visit(col, context))
          .join(', ');
        output.push(`(${columns})`);
      }
    }
    
    return output.join(' ');
  }

  RangeTableFunc(node: t.RangeTableFunc, context: DeparserContext): string {
    const output: string[] = [];
    
    if (node.lateral) {
      output.push('LATERAL');
    }
    
    if (node.docexpr) {
      output.push(this.visit(node.docexpr, context));
    }
    
    if (node.rowexpr) {
      output.push('PASSING');
      output.push(this.visit(node.rowexpr, context));
    }
    
    if (node.columns && node.columns.length > 0) {
      output.push('COLUMNS');
      const columns = ListUtils.unwrapList(node.columns)
        .map(col => this.visit(col, context))
        .join(', ');
      output.push(`(${columns})`);
    }
    
    if (node.alias) {
      output.push(this.Alias(node.alias, context));
    }
    
    return output.join(' ');
  }

  RangeTableFuncCol(node: t.RangeTableFuncCol, context: DeparserContext): string {
    const output: string[] = [];
    
    if (node.colname) {
      output.push(QuoteUtils.quote(node.colname));
    }
    
    if (node.for_ordinality) {
      output.push('FOR ORDINALITY');
    } else if (node.typeName) {
      output.push(this.TypeName(node.typeName, context));
    }
    
    if (node.colexpr) {
      output.push('PATH');
      output.push(`'${this.visit(node.colexpr, context)}'`);
    }
    
    if (node.coldefexpr) {
      output.push('DEFAULT');
      output.push(this.visit(node.coldefexpr, context));
    }
    
    return output.join(' ');
  }

  JsonArrayQueryConstructor(node: t.JsonArrayQueryConstructor, context: DeparserContext): string {
    const output: string[] = ['JSON_ARRAYAGG'];
    
    if (node.query) {
      output.push(`(${this.visit(node.query, context)})`);
    }
    
    if (node.format) {
      output.push('FORMAT JSON');
    }
    
    if (node.output) {
      output.push('RETURNING TEXT');
    }
    
    if (node.absent_on_null) {
      output.push('ABSENT ON NULL');
    } else {
      output.push('NULL ON NULL');
    }
    
    return output.join(' ');
  }

  RangeFunction(node: t.RangeFunction, context: DeparserContext): string {
    const output: string[] = [];
    
    if (node.lateral) {
      output.push('LATERAL');
    }
    
    if (node.functions && node.functions.length > 0) {
      const functionStrs = ListUtils.unwrapList(node.functions)
        .filter(func => func != null && this.getNodeType(func) !== 'undefined')
        .map(func => {
          try {
            return this.visit(func, context);
          } catch (error) {
            console.warn(`Error processing function in RangeFunction: ${error instanceof Error ? error.message : String(error)}`);
            return '';
          }
        })
        .filter(str => str !== '');
      if (functionStrs.length > 0) {
        output.push(functionStrs.join(', '));
      }
    }
    
    if (node.ordinality) {
      output.push('WITH ORDINALITY');
    }
    
    if (node.alias) {
      output.push(this.Alias(node.alias, context));
    }
    
    if (node.coldeflist && node.coldeflist.length > 0) {
      const coldefStrs = ListUtils.unwrapList(node.coldeflist)
        .filter(coldef => coldef != null && this.getNodeType(coldef) !== 'undefined')
        .map(coldef => {
          try {
            return this.visit(coldef, context);
          } catch (error) {
            console.warn(`Error processing coldef in RangeFunction: ${error instanceof Error ? error.message : String(error)}`);
            return '';
          }
        })
        .filter(str => str !== '');
      if (coldefStrs.length > 0) {
        output.push(`(${coldefStrs.join(', ')})`);
      }
    }
    
    return output.join(' ');
  }

  XmlExpr(node: t.XmlExpr, context: DeparserContext): string {
    const output: string[] = [];
    
    switch (node.op) {
      case 'IS_XMLCONCAT':
        output.push('XMLCONCAT');
        break;
      case 'IS_XMLELEMENT':
        output.push('XMLELEMENT');
        break;
      case 'IS_XMLFOREST':
        output.push('XMLFOREST');
        break;
      case 'IS_XMLPARSE':
        output.push('XMLPARSE');
        break;
      case 'IS_XMLPI':
        output.push('XMLPI');
        break;
      case 'IS_XMLROOT':
        output.push('XMLROOT');
        break;
      case 'IS_XMLSERIALIZE':
        output.push('XMLSERIALIZE');
        break;
      case 'IS_DOCUMENT':
        output.push('DOCUMENT');
        break;
      default:
        throw new Error(`Unsupported XmlExpr op: ${node.op}`);
    }
    
    if (node.name) {
      output.push(`NAME ${QuoteUtils.quote(node.name)}`);
    }
    
    if (node.args && node.args.length > 0) {
      const argStrs = ListUtils.unwrapList(node.args).map(arg => this.visit(arg, context));
      output.push(`(${argStrs.join(', ')})`);
    }
    
    if (node.named_args && node.named_args.length > 0) {
      const namedArgStrs = ListUtils.unwrapList(node.named_args).map(arg => this.visit(arg, context));
      output.push(`XMLATTRIBUTES(${namedArgStrs.join(', ')})`);
    }
    
    return output.join(' ');
  }

  schemaname(node: any, context: DeparserContext): string {
    if (typeof node === 'string') {
      return QuoteUtils.quote(node);
    }
    if (node && node.String && node.String.sval) {
      return QuoteUtils.quote(node.String.sval);
    }
    return this.visit(node, context);
  }

  RangeTableSample(node: t.RangeTableSample, context: DeparserContext): string {
    const output: string[] = [];
    
    if (node.relation) {
      output.push(this.visit(node.relation as any, context));
    }
    
    output.push('TABLESAMPLE');
    
    if (node.method && node.method.length > 0) {
      const methodParts = node.method.map(m => this.visit(m, context));
      output.push(methodParts.join('.'));
    }
    
    if (node.args && node.args.length > 0) {
      const argStrs = node.args.map(arg => this.visit(arg, context));
      output.push(`(${argStrs.join(', ')})`);
    }
    
    if (node.repeatable) {
      output.push('REPEATABLE');
      output.push(`(${this.visit(node.repeatable as any, context)})`);
    }
    
    return output.join(' ');
  }

  XmlSerialize(node: t.XmlSerialize, context: DeparserContext): string {
    const output: string[] = ['XMLSERIALIZE'];
    
    output.push('(');
    
    if (node.typeName) {
      output.push('CONTENT');
      output.push(this.visit(node.expr as any, context));
      output.push('AS');
      output.push(this.TypeName(node.typeName, context));
    }
    
    output.push(')');
    
    return output.join(' ');
  }

  ctes(node: any, context: DeparserContext): string {
    if (!node || !Array.isArray(node)) {
      return '';
    }
    
    const cteStrs = node.map(cte => this.visit(cte, context));
    return cteStrs.join(', ');
  }

  RuleStmt(node: t.RuleStmt, context: DeparserContext): string {
    const output: string[] = ['CREATE'];
    
    if (node.replace) {
      output.push('OR REPLACE');
    }
    
    output.push('RULE');
    
    if (node.rulename) {
      output.push(QuoteUtils.quote(node.rulename));
    }
    
    output.push('AS ON');
    
    if (node.event) {
      switch (node.event) {
        case 'CMD_SELECT':
          output.push('SELECT');
          break;
        case 'CMD_INSERT':
          output.push('INSERT');
          break;
        case 'CMD_UPDATE':
          output.push('UPDATE');
          break;
        case 'CMD_DELETE':
          output.push('DELETE');
          break;
        default:
          output.push(node.event.toString());
      }
    }
    
    output.push('TO');
    
    if (node.relation) {
      output.push(this.visit(node.relation as any, context));
    }
    
    if (node.whereClause) {
      output.push('WHERE');
      output.push(this.visit(node.whereClause, context));
    }
    
    output.push('DO');
    
    if (node.instead) {
      output.push('INSTEAD');
    }
    
    if (node.actions && node.actions.length > 0) {
      if (node.actions.length === 1) {
        output.push(this.visit(node.actions[0], context));
      } else {
        output.push('(');
        const actionStrs = ListUtils.unwrapList(node.actions).map(action => this.visit(action, context));
        output.push(actionStrs.join('; '));
        output.push(')');
      }
    } else {
      output.push('NOTHING');
    }
    
    return output.join(' ');
  }

  RangeSubselect(node: t.RangeSubselect, context: DeparserContext): string {
    const output: string[] = [];
    
    if (node.lateral) {
      output.push('LATERAL');
    }
    
    if (node.subquery) {
      output.push('(');
      output.push(this.visit(node.subquery, context));
      output.push(')');
    }
    
    if (node.alias) {
      output.push(this.Alias(node.alias, context));
    }
    
    return output.join(' ');
  }

  relname(node: any, context: DeparserContext): string {
    if (typeof node === 'string') {
      return QuoteUtils.quote(node);
    }
    if (node && node.String && node.String.sval) {
      return QuoteUtils.quote(node.String.sval);
    }
    if (node && typeof node === 'object' && node.relname) {
      return QuoteUtils.quote(node.relname);
    }
    return this.visit(node, context);
  }

  rel(node: any, context: DeparserContext): string {
    if (typeof node === 'string') {
      return QuoteUtils.quote(node);
    }
    if (node && node.String && node.String.sval) {
      return QuoteUtils.quote(node.String.sval);
    }
    if (node && node.RangeVar) {
      return this.RangeVar(node.RangeVar, context);
    }
    if (node && typeof node === 'object' && node.relname) {
      return QuoteUtils.quote(node.relname);
    }
    return this.visit(node, context);
  }

  objname(node: any, context: DeparserContext): string {
    if (typeof node === 'string') {
      return QuoteUtils.quote(node);
    }
    if (node && node.String && node.String.sval) {
      return QuoteUtils.quote(node.String.sval);
    }
    if (Array.isArray(node)) {
      const parts = node.map(part => {
        if (part && part.String && part.String.sval) {
          return QuoteUtils.quote(part.String.sval);
        }
        return this.visit(part, context);
      });
      return parts.join('.');
    }
    return this.visit(node, context);
  }

  SQLValueFunction(node: t.SQLValueFunction, context: DeparserContext): string {
    switch (node.op) {
      case 'SVFOP_CURRENT_DATE':
        return 'CURRENT_DATE';
      case 'SVFOP_CURRENT_TIME':
        return 'CURRENT_TIME';
      case 'SVFOP_CURRENT_TIME_N':
        return `CURRENT_TIME(${node.typmod || 0})`;
      case 'SVFOP_CURRENT_TIMESTAMP':
        return 'CURRENT_TIMESTAMP';
      case 'SVFOP_CURRENT_TIMESTAMP_N':
        return `CURRENT_TIMESTAMP(${node.typmod || 0})`;
      case 'SVFOP_LOCALTIME':
        return 'LOCALTIME';
      case 'SVFOP_LOCALTIME_N':
        return `LOCALTIME(${node.typmod || 0})`;
      case 'SVFOP_LOCALTIMESTAMP':
        return 'LOCALTIMESTAMP';
      case 'SVFOP_LOCALTIMESTAMP_N':
        return `LOCALTIMESTAMP(${node.typmod || 0})`;
      case 'SVFOP_CURRENT_ROLE':
        return 'CURRENT_ROLE';
      case 'SVFOP_CURRENT_USER':
        return 'CURRENT_USER';
      case 'SVFOP_USER':
        return 'USER';
      case 'SVFOP_SESSION_USER':
        return 'SESSION_USER';
      case 'SVFOP_CURRENT_CATALOG':
        return 'CURRENT_CATALOG';
      case 'SVFOP_CURRENT_SCHEMA':
        return 'CURRENT_SCHEMA';
      default:
        throw new Error(`Unsupported SQLValueFunction op: ${node.op}`);
    }
  }

  GroupingFunc(node: t.GroupingFunc, context: DeparserContext): string {
    const output: string[] = ['GROUPING'];
    
    if (node.args && node.args.length > 0) {
      const argStrs = ListUtils.unwrapList(node.args).map(arg => this.visit(arg, context));
      output.push(`(${argStrs.join(', ')})`);
    } else {
      output.push('()');
    }
    
    return output.join('');
  }

  MultiAssignRef(node: t.MultiAssignRef, context: DeparserContext): string {
    const output: string[] = [];
    
    if (node.source) {
      output.push(this.visit(node.source, context));
    }
    
    if (node.colno > 0) {
      output.push(`[${node.colno}]`);
    }
    
    return output.join('');
  }

  SetToDefault(node: t.SetToDefault, context: DeparserContext): string {
    return 'DEFAULT';
  }

  CurrentOfExpr(node: t.CurrentOfExpr, context: DeparserContext): string {
    const output: string[] = ['CURRENT OF'];
    
    if (node.cursor_name) {
      output.push(QuoteUtils.quote(node.cursor_name));
    }
    
    if (node.cursor_param > 0) {
      output.push(`$${node.cursor_param}`);
    }
    
    return output.join(' ');
  }

  TableLikeClause(node: t.TableLikeClause, context: DeparserContext): string {
    const output: string[] = ['LIKE'];
    
    if (node.relation) {
      output.push(this.visit(node.relation as any, context));
    }
    
    if (node.options && typeof node.options === 'number') {
      const optionStrs: string[] = [];
      
      // Handle bitfield options for CREATE TABLE LIKE
      if (node.options & 0x01) optionStrs.push('INCLUDING COMMENTS');
      if (node.options & 0x02) optionStrs.push('INCLUDING CONSTRAINTS');
      if (node.options & 0x04) optionStrs.push('INCLUDING DEFAULTS');
      if (node.options & 0x08) optionStrs.push('INCLUDING GENERATED');
      if (node.options & 0x10) optionStrs.push('INCLUDING IDENTITY');
      if (node.options & 0x20) optionStrs.push('INCLUDING INDEXES');
      if (node.options & 0x40) optionStrs.push('INCLUDING STATISTICS');
      if (node.options & 0x80) optionStrs.push('INCLUDING STORAGE');
      
      if (optionStrs.length > 0) {
        output.push(optionStrs.join(' '));
      }
    }
    
    return output.join(' ');
  }

  AlterFunctionStmt(node: t.AlterFunctionStmt, context: DeparserContext): string {
    const output: string[] = ['ALTER FUNCTION'];
    
    if (node.func) {
      output.push(this.visit(node.func as any, context));
    }
    
    if (node.actions && node.actions.length > 0) {
      const actionStrs = ListUtils.unwrapList(node.actions).map(action => this.visit(action, context));
      output.push(actionStrs.join(' '));
    }
    
    return output.join(' ');
  }

  AlterObjectSchemaStmt(node: t.AlterObjectSchemaStmt, context: DeparserContext): string {
    const output: string[] = ['ALTER'];
    
    switch (node.objectType) {
      case 'OBJECT_TABLE':
        output.push('TABLE');
        break;
      case 'OBJECT_VIEW':
        output.push('VIEW');
        break;
      case 'OBJECT_FUNCTION':
        output.push('FUNCTION');
        break;
      case 'OBJECT_TYPE':
        output.push('TYPE');
        break;
      case 'OBJECT_DOMAIN':
        output.push('DOMAIN');
        break;
      case 'OBJECT_SEQUENCE':
        output.push('SEQUENCE');
        break;
      default:
        output.push(node.objectType.toString());
    }
    
    if (node.object) {
      output.push(this.visit(node.object as any, context));
    }
    
    output.push('SET SCHEMA');
    
    if (node.newschema) {
      output.push(QuoteUtils.quote(node.newschema));
    }
    
    return output.join(' ');
  }

  AlterRoleSetStmt(node: t.AlterRoleSetStmt, context: DeparserContext): string {
    const output: string[] = ['ALTER'];
    
    if (node.role) {
      output.push('ROLE');
      output.push(this.visit(node.role as any, context));
    } else {
      output.push('USER');
    }
    
    if (node.database) {
      output.push('IN DATABASE');
      output.push(QuoteUtils.quote(node.database));
    }
    
    if (node.setstmt) {
      output.push(this.visit(node.setstmt as any, context));
    }
    
    return output.join(' ');
  }

  CreateForeignTableStmt(node: t.CreateForeignTableStmt, context: DeparserContext): string {
    const output: string[] = ['CREATE FOREIGN TABLE'];
    
    if (node.base && node.base.relation) {
      output.push(this.visit(node.base.relation as any, context));
    }
    
    if (node.base && node.base.tableElts && node.base.tableElts.length > 0) {
      const elementStrs = ListUtils.unwrapList(node.base.tableElts).map(el => this.visit(el, context));
      output.push(`(${elementStrs.join(', ')})`);
    }
    
    if (node.servername) {
      output.push('SERVER');
      output.push(QuoteUtils.quote(node.servername));
    }
    
    if (node.options && node.options.length > 0) {
      const optionStrs = ListUtils.unwrapList(node.options).map(opt => this.visit(opt, context));
      output.push(`OPTIONS (${optionStrs.join(', ')})`);
    }
    
    return output.join(' ');
  }

}
