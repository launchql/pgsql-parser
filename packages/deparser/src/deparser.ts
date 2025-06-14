import { Node } from '@pgsql/types';
import { SqlFormatter } from './utils/sql-formatter';
import { DeparserContext, DeparserVisitor } from './visitors/base';
import { QuoteUtils } from './utils/quote-utils';
import { ListUtils } from './utils/list-utils';

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

  private getNodeType(node: Node): string {
    return Object.keys(node)[0];
  }

  private getNodeData(node: Node): any {
    const type = this.getNodeType(node);
    return (node as any)[type];
  }

  private RawStmt(node: any, context: DeparserContext): string {
    if (node.stmt_len) {
      return this.deparse(node.stmt, context) + ';';
    }
    return this.deparse(node.stmt, context);
  }

  private SelectStmt(node: any, context: DeparserContext): string {
    const output: string[] = [];

    if (node && node.withClause) {
      output.push(this.visit(node.withClause, context));
    }

    if (node && (!node.op || (node.op as string) === 'SETOP_NONE')) {
      if (node.valuesLists == null) {
        output.push('SELECT');
      }
    } else if (node && node.op) {
      output.push(this.formatter.parens(this.SelectStmt(node.larg as any, context)));

      switch (node.op as string) {
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
          throw new Error(`Bad SelectStmt op: ${node.op}`);
      }

      if (node && node.all) {
        output.push('ALL');
      }

      if (node) {
        output.push(this.formatter.parens(this.SelectStmt(node.rarg as any, context)));
      }
    }

    if (node && node.distinctClause) {
      const distinctClause = ListUtils.unwrapList(node.distinctClause);
      if (distinctClause.length > 0 && Object.keys(distinctClause[0]).length > 0) {
        output.push('DISTINCT ON');
        const clause = distinctClause
          .map(e => this.visit(e, { ...context, select: true }))
          .join(`, ${this.formatter.newline()}`);
        output.push(this.formatter.parens(clause));
      } else {
        output.push('DISTINCT');
      }
    }

    if (node && node.targetList) {
      const targetList = ListUtils.unwrapList(node.targetList);
      const targets = targetList
        .map(e => this.visit(e, { ...context, select: true }))
        .join(`, ${this.formatter.newline()}`);
      output.push(this.formatter.indent(targets));
    }

    if (node && node.intoClause) {
      output.push('INTO');
      output.push(this.formatter.indent(this.visit(node.intoClause, context)));
    }

    if (node && node.fromClause) {
      output.push('FROM');
      const fromList = ListUtils.unwrapList(node.fromClause);
      const fromItems = fromList
        .map(e => this.deparse(e, { ...context, from: true }))
        .join(`, ${this.formatter.newline()}`);
      output.push(this.formatter.indent(fromItems));
    }

    if (node && node.whereClause) {
      output.push('WHERE');
      output.push(this.formatter.indent(this.visit(node.whereClause, context)));
    }

    if (node && node.valuesLists) {
      output.push('VALUES');
      const lists = ListUtils.unwrapList(node.valuesLists).map(list => {
        const values = ListUtils.unwrapList(list).map(val => this.visit(val, context));
        return this.formatter.parens(values.join(', '));
      });
      output.push(lists.join(', '));
    }

    if (node && node.groupClause) {
      output.push('GROUP BY');
      const groupList = ListUtils.unwrapList(node.groupClause);
      const groupItems = groupList
        .map(e => this.visit(e, { ...context, group: true }))
        .join(`, ${this.formatter.newline()}`);
      output.push(this.formatter.indent(groupItems));
    }

    if (node && node.havingClause) {
      output.push('HAVING');
      output.push(this.formatter.indent(this.visit(node.havingClause, context)));
    }

    if (node && node.sortClause) {
      output.push('ORDER BY');
      const sortList = ListUtils.unwrapList(node.sortClause);
      const sortItems = sortList
        .map(e => this.visit(e, { ...context, sort: true }))
        .join(`, ${this.formatter.newline()}`);
      output.push(this.formatter.indent(sortItems));
    }

    if (node && node.limitCount) {
      output.push('LIMIT');
      output.push(this.formatter.indent(this.visit(node.limitCount, context)));
    }

    if (node && node.limitOffset) {
      output.push('OFFSET');
      output.push(this.formatter.indent(this.visit(node.limitOffset, context)));
    }

    return output.join(' ');
  }

  private A_Expr(node: any, context: DeparserContext): string {
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

  private deparseOperatorName(name: any[]): string {
    if (!name || name.length === 0) {
      return '';
    }
    
    return name.map(n => {
      if (n.String) {
        return n.String.sval || n.String.str;
      }
      return this.visit(n, {});
    }).join('.');
  }

  private InsertStmt(node: any, context: DeparserContext): string {
    const output: string[] = [];

    if (node && node.withClause) {
      output.push(this.visit(node.withClause, context));
    }

    output.push('INSERT INTO');
    if (node && node.relation) {
      output.push(this.deparse(node.relation, context));
    }

    if (node && node.cols) {
      const cols = ListUtils.unwrapList(node.cols);
      if (cols && cols.length) {
        const colNames = cols.map(col => this.visit(col, context));
        output.push(this.formatter.parens(colNames.join(', ')));
      }
    }

    if (node && node.selectStmt) {
      output.push(this.deparse(node.selectStmt, context));
    } else {
      output.push('DEFAULT VALUES');
    }

    if (node.onConflictClause) {
      const clause = node.onConflictClause;
      output.push('ON CONFLICT');

      if (clause.infer?.indexElems) {
        const indexElems = ListUtils.unwrapList(clause.infer.indexElems);
        const elemStrs = indexElems.map(elem => this.visit(elem, context));
        output.push(this.formatter.parens(elemStrs.join(', ')));
      } else if (clause.infer?.conname) {
        output.push('ON CONSTRAINT');
        output.push(clause.infer.conname);
      }

      switch (clause.action as string) {
        case 'ONCONFLICT_NOTHING':
          output.push('DO NOTHING');
          break;
        case 'ONCONFLICT_UPDATE':
          output.push('DO');
          output.push(this.UpdateStmt(clause as any, context));
          break;
        default:
          throw new Error('Unhandled CONFLICT CLAUSE');
      }
    }

    if (node.returningList) {
      output.push('RETURNING');
      output.push(this.deparseReturningList(node.returningList, context));
    }

    return output.join(' ');
  }

  private UpdateStmt(node: any, context: DeparserContext): string {
    const output: string[] = [];

    if (node.withClause) {
      output.push(this.visit(node.withClause, context));
    }

    output.push('UPDATE');
    if (node.relation) {
      output.push(this.deparse(node.relation, context));
    }
    output.push('SET');

    const targetList = ListUtils.unwrapList(node.targetList);
    if (targetList && targetList.length) {
      const firstTarget = targetList[0] as any;
      if (firstTarget.ResTarget?.val?.MultiAssignRef) {
        const names = targetList.map((target: any) => target.ResTarget.name);
        output.push(this.formatter.parens(names.join(',')));
        output.push('=');
        output.push(this.visit(firstTarget.ResTarget.val, context));
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

  private DeleteStmt(node: any, context: DeparserContext): string {
    const output: string[] = [];

    if (node.withClause) {
      output.push(this.visit(node.withClause, context));
    }

    output.push('DELETE');
    output.push('FROM');
    output.push(this.deparse(node.relation, context));

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

  private WithClause(node: any, context: DeparserContext): string {
    const output: string[] = ['WITH'];
    
    if (node.recursive) {
      output.push('RECURSIVE');
    }
    
    const ctes = ListUtils.unwrapList(node.ctes);
    const cteStrs = ctes.map(cte => this.visit(cte, context));
    output.push(cteStrs.join(', '));
    
    return output.join(' ');
  }

  private ResTarget(node: any, context: DeparserContext): string {
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

  private deparseReturningList(list: Node[], context: DeparserContext): string {
    return ListUtils.unwrapList(list)
      .map(returning => {
        const resTarget = (returning as any).ResTarget;
        const val = this.visit(resTarget.val, context);
        const alias = resTarget.name ? ` AS ${QuoteUtils.quote(resTarget.name)}` : '';
        return val + alias;
      })
      .join(',');
  }

  private BoolExpr(node: any, context: DeparserContext): string {
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

  private FuncCall(node: any, context: DeparserContext): string {
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
      result += ` OVER ${this.visit(node.over, context)}`;
    }

    return result;
  }

  private A_Const(node: any, context: DeparserContext): string {
    if (node.ival) {
      return node.ival.ival.toString();
    } else if (node.fval) {
      return node.fval.fval;
    } else if (node.sval) {
      return QuoteUtils.escape(node.sval.sval);
    } else if (node.boolval !== undefined) {
      return node.boolval.boolval ? 'true' : 'false';
    } else if (node.bsval) {
      return node.bsval.bsval;
    } else if (node.isnull) {
      return 'NULL';
    }
    return 'NULL';
  }

  private ColumnRef(node: any, context: DeparserContext): string {
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

  private TypeName(node: any, context: DeparserContext): string {
    const names = ListUtils.unwrapList(node.names);
    const catalogAndType = names.map(name => {
      return this.deparse(name, context);
    });
    const catalog = catalogAndType[0];
    const type = catalogAndType[1];

    const args = node.typmods ? this.formatTypeMods(node.typmods, context) : null;

    const mods = (name: string, size: string | null) => {
      if (size != null) {
        return `${name}(${size})`;
      }
      return name;
    };

    if (catalog === 'char' && !type) {
      return mods('"char"', args);
    }
    
    if (catalog === 'pg_catalog' && type === 'char') {
      return mods('pg_catalog."char"', args);
    }

    if (catalog !== 'pg_catalog') {
      const quotedNames = names.map(name => {
        const nameStr = this.deparse(name, context);
        return QuoteUtils.quote(nameStr);
      });
      return mods(quotedNames.join('.'), args);
    }

    const pgTypeName = this.getPgCatalogTypeName(type, args);
    return mods(pgTypeName, args);
  }

  private Alias(node: any, context: DeparserContext): string {
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

  private RangeVar(node: any, context: DeparserContext): string {
    const output: string[] = [];

    if (node.schemaname) {
      output.push(QuoteUtils.quote(node.schemaname));
      output.push('.');
    }

    output.push(QuoteUtils.quote(node.relname));

    if (node.alias) {
      const aliasStr = this.deparse(node.alias, context);
      output.push(aliasStr);
    }

    return output.join(' ');
  }

  private formatTypeMods(typmods: Node[], context: DeparserContext): string | null {
    if (!typmods || typmods.length === 0) {
      return null;
    }

    const mods = ListUtils.unwrapList(typmods);
    return mods.map(mod => {
      return this.deparse(mod, context);
    }).join(', ');
  }

  private getPgCatalogTypeName(typeName: string, size: string | null): string {
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

  private A_ArrayExpr(node: any, context: DeparserContext): string {
    const elements = ListUtils.unwrapList(node.elements);
    const elementStrs = elements.map(el => this.visit(el, context));
    return `ARRAY[${elementStrs.join(', ')}]`;
  }

  private A_Indices(node: any, context: DeparserContext): string {
    if (node.lidx) {
      return `[${this.visit(node.lidx, context)}:${this.visit(node.uidx, context)}]`;
    }
    return `[${this.visit(node.uidx, context)}]`;
  }

  private A_Indirection(node: any, context: DeparserContext): string {
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

  private A_Star(node: any, context: DeparserContext): string { 
    return '*'; 
  }

  private CaseExpr(node: any, context: DeparserContext): string {
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

  private CoalesceExpr(node: any, context: DeparserContext): string {
    const args = ListUtils.unwrapList(node.args);
    const argStrs = args.map(arg => this.visit(arg, context));
    return `COALESCE(${argStrs.join(', ')})`;
  }

  private TypeCast(node: any, context: DeparserContext): string {
    return this.formatter.format([
      this.visit(node.arg, context),
      '::',
      this.visit(node.typeName, context)
    ]);
  }

  private CollateClause(node: any, context: DeparserContext): string {
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

  private BooleanTest(node: any, context: DeparserContext): string {
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

  private NullTest(node: any, context: DeparserContext): string {
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

  private String(node: any, context: DeparserContext): string { 
    return node.str || node.sval || ''; 
  }
  
  private Integer(node: any, context: DeparserContext): string { 
    return node.ival?.toString() || '0'; 
  }
  
  private Float(node: any, context: DeparserContext): string { 
    return node.str || '0.0'; 
  }
  
  private Boolean(node: any, context: DeparserContext): string { 
    return node.boolval ? 'true' : 'false'; 
  }
  
  private BitString(node: any, context: DeparserContext): string { 
    return `B'${node.str}'`; 
  }
  
  private Null(node: any, context: DeparserContext): string { 
    return 'NULL'; 
  }

  private CreateStmt(node: any, context: DeparserContext): string {
    const output: string[] = ['CREATE'];

    if (node.if_not_exists) {
      output.push('TABLE IF NOT EXISTS');
    } else {
      output.push('TABLE');
    }

    output.push(this.visit(node.relation, context));

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

  private ColumnDef(node: any, context: DeparserContext): string {
    const output: string[] = [];

    if (node.colname) {
      output.push(QuoteUtils.quote(node.colname));
    }

    if (node.typeName) {
      output.push(this.visit(node.typeName, context));
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

  private Constraint(node: any, context: DeparserContext): string {
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
        break;
      case 'CONSTR_UNIQUE':
        output.push('UNIQUE');
        break;
      case 'CONSTR_FOREIGN':
        output.push('REFERENCES');
        if (node.pktable) {
          output.push(this.visit(node.pktable, context));
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

  private SubLink(node: any, context: DeparserContext): string {
    return this.formatter.parens(this.visit(node.subselect, context));
  }

  private CaseWhen(node: any, context: DeparserContext): string {
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

  private WindowDef(node: any, context: DeparserContext): string {
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
      output.push(this.formatter.parens(windowParts.join(' ')));
    }
    
    return output.join(' ');
  }

  private SortBy(node: any, context: DeparserContext): string {
    const output: string[] = [];
    
    if (node.node) {
      output.push(this.visit(node.node, context));
    }
    
    if (node.sortby_dir === 'SORTBY_USING' && node.useOp) {
      output.push('USING');
      const useOp = ListUtils.unwrapList(node.useOp);
      output.push(useOp.map(op => this.visit(op, context)).join('.'));
    } else if (node.sortby_dir === 1 || node.sortby_dir === 'SORTBY_ASC') {
      output.push('ASC');
    } else if (node.sortby_dir === 2 || node.sortby_dir === 'SORTBY_DESC') {
      output.push('DESC');
    }
    
    if (node.sortby_nulls === 1 || node.sortby_nulls === 'SORTBY_NULLS_FIRST') {
      output.push('NULLS FIRST');
    } else if (node.sortby_nulls === 2 || node.sortby_nulls === 'SORTBY_NULLS_LAST') {
      output.push('NULLS LAST');
    }
    
    return output.join(' ');
  }

  private GroupingSet(node: any, context: DeparserContext): string {
    if (node.kind === 0) {
      const content = ListUtils.unwrapList(node.content);
      const contentStrs = content.map(c => this.visit(c, context));
      return this.formatter.parens(contentStrs.join(', '));
    } else if (node.kind === 1) {
      return 'ROLLUP';
    } else if (node.kind === 2) {
      return 'CUBE';
    } else if (node.kind === 3) {
      return 'GROUPING SETS';
    }
    return '';
  }

  private CommonTableExpr(node: any, context: DeparserContext): string {
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

  private ParamRef(node: any, context: DeparserContext): string {
    return `$${node.number}`;
  }

  private MinMaxExpr(node: any, context: DeparserContext): string {
    const args = ListUtils.unwrapList(node.args);
    const argStrs = args.map(arg => this.visit(arg, context));
    
    if (node.op === 0) {
      return `GREATEST(${argStrs.join(', ')})`;
    } else {
      return `LEAST(${argStrs.join(', ')})`;
    }
  }

  private RowExpr(node: any, context: DeparserContext): string {
    const args = ListUtils.unwrapList(node.args);
    const argStrs = args.map(arg => this.visit(arg, context));
    return `ROW(${argStrs.join(', ')})`;
  }

  private JoinExpr(node: any, context: DeparserContext): string {
    const output: string[] = [];
    
    if (node.larg) {
      output.push(this.visit(node.larg, context));
    }
    
    switch (node.jointype) {
      case 0:
        output.push('INNER JOIN');
        break;
      case 1:
        output.push('LEFT JOIN');
        break;
      case 2:
        output.push('FULL JOIN');
        break;
      case 3:
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

  private FromExpr(node: any, context: DeparserContext): string {
    const fromlist = ListUtils.unwrapList(node.fromlist);
    const fromStrs = fromlist.map(item => this.visit(item, context));
    
    let result = fromStrs.join(', ');
    
    if (node.quals) {
      result += ` WHERE ${this.visit(node.quals, context)}`;
    }
    
    return result;
  }

}
