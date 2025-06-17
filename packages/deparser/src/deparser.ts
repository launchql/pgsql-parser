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
        return this.formatter.format([
          this.visit(lexpr, context),
          'LIKE',
          this.visit(rexpr, context)
        ]);
      case 'AEXPR_ILIKE':
        return this.formatter.format([
          this.visit(lexpr, context),
          'ILIKE',
          this.visit(rexpr, context)
        ]);
      case 'AEXPR_SIMILAR':
        return this.formatter.format([
          this.visit(lexpr, context),
          'SIMILAR TO',
          this.visit(rexpr, context)
        ]);
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
    output.push(this.visit(node.relation as Node, context));

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
      const fromItems = fromList.map(item => this.deparse(item, context));
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
      const usingItems = usingList.map(item => this.deparse(item, context));
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
      this.TypeCast(node.typeName, context)
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
    return node.items.map(item => this.visit(item, context)).join(', ');
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
        output.push('REFERENCES');
        if (node.pktable) {
          output.push(this.RangeVar(node.pktable, context));
        }
        if (node.fk_attrs) {
          const attrs = ListUtils.unwrapList(node.fk_attrs);
          const attrStrs = attrs.map(attr => this.visit(attr, context));
          output.push(this.formatter.parens(attrStrs.join(', ')));
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

    if (node.winref) {
      result += `(${node.winref})`;
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
        return 'BEGIN';
      case 'TRANS_STMT_START':
        return 'START TRANSACTION';
      case 'TRANS_STMT_COMMIT':
        return 'COMMIT';
      case 'TRANS_STMT_ROLLBACK':
        return 'ROLLBACK';
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
      case 'VAR_RESET':
        return `RESET ${node.name}`;
      case 'VAR_RESET_ALL':
        return 'RESET ALL';
      default:
        throw new Error(`Unsupported VariableSetStmt kind: ${node.kind}`);
    }
  }

  VariableShowStmt(node: t.VariableShowStmt, context: DeparserContext): string {
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
      const objects = node.objects.map(objList => {
        if (Array.isArray(objList)) {
          return objList.map(obj => this.visit(obj, context)).join('.');
        }
        const objName = this.visit(objList, context);
        return objName;
      }).join(', ');
      output.push(objects);
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
        .map(relation => this.visit(relation, context))
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
          .map(ind => this.visit(ind, context))
          .join('');
        nameWithIndirection += indirectionStr;
      }

      output.push(nameWithIndirection);
    }

    output.push(':=');

    if (node.val) {
      const valueStr = this.SelectStmt(node.val, context);
      output.push(valueStr);
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
      const funcName = node.funcname.map(name => this.visit(name, context)).join('.');
      output.push(funcName);
    }
    
    output.push('(');
    
    if (node.parameters && node.parameters.length > 0) {
      const params = node.parameters
        .filter(param => {
          const paramData = this.getNodeData(param);
          return paramData.mode !== 'FUNC_PARAM_TABLE';
        })
        .map(param => this.visit(param, context));
      output.push(params.join(' , '));
    }
    
    output.push(')');
    
    const hasTableParams = node.parameters && node.parameters.some(param => {
      const paramData = this.getNodeData(param);
      return paramData.mode === 'FUNC_PARAM_TABLE';
    });
    
    if (hasTableParams) {
      output.push('RETURNS TABLE (');
      const tableParams = node.parameters
        .filter(param => {
          const paramData = this.getNodeData(param);
          return paramData.mode === 'FUNC_PARAM_TABLE';
        })
        .map(param => this.visit(param, context));
      output.push(tableParams.join(', '));
      output.push(')');
    } else if (node.returnType) {
      output.push('RETURNS');
      output.push(this.TypeName(node.returnType as any, context));
    }
    
    if (node.options && node.options.length > 0) {
      const options = node.options.map(opt => this.visit(opt, context));
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
    
    if (node.comment === null) {
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

    if (node.behavior === 'DROP_CASCADE') {
      output.push('CASCADE');
    } else if (node.behavior === 'DROP_RESTRICT') {
      output.push('RESTRICT');
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
      // TODO implement ObjectWithArgs 
    } else if (node.inout) {
      output.push('WITH INOUT');
    } else {
      output.push('WITHOUT FUNCTION');
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
}
