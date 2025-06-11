import { BaseVisitor, DeparserContext } from './base';
import { Node, A_Expr, BoolExpr, FuncCall, A_Const, ColumnRef, A_ArrayExpr, A_Indices, A_Indirection, A_Star, CaseExpr, CoalesceExpr, TypeCast, CollateClause, BooleanTest, NullTest } from '@pgsql/types';
import { QuoteUtils } from '../utils/quote-utils';
import { ListUtils } from '../utils/list-utils';
import { SqlFormatter } from '../utils/sql-formatter';

export class ExpressionVisitor extends BaseVisitor {
  private formatter: SqlFormatter;

  constructor(formatter: SqlFormatter) {
    super();
    this.formatter = formatter;
  }

  visit(node: Node, context: DeparserContext = {}): string {
    const nodeType = this.getNodeType(node);
    const nodeData = this.getNodeData(node);

    switch (nodeType) {
      case 'A_Expr':
        return this.AExpr(nodeData, context);
      case 'BoolExpr':
        return this.BoolExpr(nodeData, context);
      case 'FuncCall':
        return this.FuncCall(nodeData, context);
      case 'A_Const':
        return this.AConst(nodeData, context);
      case 'ColumnRef':
        return this.ColumnRef(nodeData, context);
      case 'A_ArrayExpr':
        return this.AArrayExpr(nodeData, context);
      case 'A_Indices':
        return this.AIndices(nodeData, context);
      case 'A_Indirection':
        return this.AIndirection(nodeData, context);
      case 'A_Star':
        return this.AStar(nodeData, context);
      case 'CaseExpr':
        return this.CaseExpr(nodeData, context);
      case 'CoalesceExpr':
        return this.CoalesceExpr(nodeData, context);
      case 'TypeCast':
        return this.TypeCast(nodeData, context);
      case 'CollateClause':
        return this.CollateClause(nodeData, context);
      case 'BooleanTest':
        return this.BooleanTest(nodeData, context);
      case 'NullTest':
        return this.NullTest(nodeData, context);
      case 'SubLink':
        return this.SubLink(nodeData, context);
      case 'CaseWhen':
        return this.CaseWhen(nodeData, context);
      case 'WindowDef':
        return this.WindowDef(nodeData, context);
      case 'SortBy':
        return this.SortBy(nodeData, context);
      case 'GroupingSet':
        return this.GroupingSet(nodeData, context);
      case 'CommonTableExpr':
        return this.CommonTableExpr(nodeData, context);
      case 'ParamRef':
        return this.ParamRef(nodeData, context);
      case 'MinMaxExpr':
        return this.MinMaxExpr(nodeData, context);
      case 'RowExpr':
        return this.RowExpr(nodeData, context);
      case 'JoinExpr':
        return this.JoinExpr(nodeData, context);
      case 'FromExpr':
        return this.FromExpr(nodeData, context);
      case 'names':
        return this.Names(nodeData, context);
      case 'String':
        return this.String(nodeData, context);
      default:
        throw new Error(`Expression visitor does not handle node type: ${nodeType}`);
    }
  }

  private AExpr(node: A_Expr, context: DeparserContext): string {
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

  private BoolExpr(node: BoolExpr, context: DeparserContext): string {
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

  private FuncCall(node: FuncCall, context: DeparserContext): string {
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

  private AConst(node: A_Const, context: DeparserContext): string {
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

  private ColumnRef(node: ColumnRef, context: DeparserContext): string {
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

  private AArrayExpr(node: A_ArrayExpr, context: DeparserContext): string {
    const elements = ListUtils.unwrapList(node.elements);
    const elementStrs = elements.map(el => this.visit(el, context));
    return `ARRAY[${elementStrs.join(', ')}]`;
  }

  private AIndices(node: A_Indices, context: DeparserContext): string {
    if (node.lidx) {
      return `[${this.visit(node.lidx, context)}:${this.visit(node.uidx, context)}]`;
    }
    return `[${this.visit(node.uidx, context)}]`;
  }

  private AIndirection(node: A_Indirection, context: DeparserContext): string {
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

  private AStar(node: A_Star, context: DeparserContext): string {
    return '*';
  }

  private CaseExpr(node: CaseExpr, context: DeparserContext): string {
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

  private CoalesceExpr(node: CoalesceExpr, context: DeparserContext): string {
    const args = ListUtils.unwrapList(node.args);
    const argStrs = args.map(arg => this.visit(arg, context));
    return `COALESCE(${argStrs.join(', ')})`;
  }

  private TypeCast(node: TypeCast, context: DeparserContext): string {
    return this.formatter.format([
      this.visit(node.arg, context),
      '::',
      this.visit(node.typeName, context)
    ]);
  }

  private CollateClause(node: CollateClause, context: DeparserContext): string {
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

  private BooleanTest(node: BooleanTest, context: DeparserContext): string {
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

  private NullTest(node: NullTest, context: DeparserContext): string {
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

  private Names(node: any, context: DeparserContext): string {
    if (Array.isArray(node)) {
      return node.map(name => {
        if (typeof name === 'string') {
          return name;
        }
        return this.visit(name, context);
      }).join('.');
    }
    if (typeof node === 'string') {
      return node;
    }
    return this.visit(node, context);
  }

  private String(node: any, context: DeparserContext): string {
    return node.str || node.sval || '';
  }
}
