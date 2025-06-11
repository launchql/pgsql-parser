import { BaseVisitor, DeparserContext } from './base';
import { Node, SelectStmt, InsertStmt, UpdateStmt, DeleteStmt, RawStmt, WithClause, ResTarget } from '@pgsql/types';
import { QuoteUtils } from '../utils/quote-utils';
import { ListUtils } from '../utils/list-utils';
import { SqlFormatter } from '../utils/sql-formatter';

export class StatementVisitor extends BaseVisitor {
  private formatter: SqlFormatter;
  private expressionVisitor: any;
  private deparser: any;

  constructor(formatter: SqlFormatter, expressionVisitor: any, deparser?: any) {
    super();
    this.formatter = formatter;
    this.expressionVisitor = expressionVisitor;
    this.deparser = deparser;
  }

  visit(node: Node, context: DeparserContext = {}): string {
    const nodeType = this.getNodeType(node);
    const nodeData = this.getNodeData(node);

    switch (nodeType) {
      case 'RawStmt':
        return this.RawStmt(nodeData, context);
      case 'SelectStmt':
        return this.SelectStmt(nodeData, context);
      case 'InsertStmt':
        return this.InsertStmt(nodeData, context);
      case 'UpdateStmt':
        return this.UpdateStmt(nodeData, context);
      case 'DeleteStmt':
        return this.DeleteStmt(nodeData, context);
      case 'WithClause':
        return this.WithClause(nodeData, context);
      case 'ResTarget':
        return this.ResTarget(nodeData, context);
      default:
        throw new Error(`Statement visitor does not handle node type: ${nodeType}`);
    }
  }

  private RawStmt(node: RawStmt, context: DeparserContext): string {
    if (node.stmt_len) {
      return this.visit(node.stmt, context) + ';';
    }
    return this.visit(node.stmt, context);
  }

  private SelectStmt(node: SelectStmt, context: DeparserContext): string {
    const output: string[] = [];

    if (node && node.withClause) {
      output.push(this.visit(node.withClause, context));
    }

    if (node && (!node.op || (node.op as string) === 'SETOP_NONE')) {
      if (node.valuesLists == null) {
        output.push('SELECT');
      }
    } else if (node && node.op) {
      output.push(this.formatter.parens(this.SelectStmt(node.larg as SelectStmt, context)));

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
        output.push(this.formatter.parens(this.SelectStmt(node.rarg as SelectStmt, context)));
      }
    }

    if (node && node.distinctClause) {
      const distinctClause = ListUtils.unwrapList(node.distinctClause);
      if (distinctClause.length > 0 && Object.keys(distinctClause[0]).length > 0) {
        output.push('DISTINCT ON');
        const clause = distinctClause
          .map(e => this.expressionVisitor.visit(e, { ...context, select: true }))
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
        .map(e => this.deparser ? this.deparser.deparse(e, { ...context, from: true }) : this.expressionVisitor.visit(e, { ...context, from: true }))
        .join(`, ${this.formatter.newline()}`);
      output.push(this.formatter.indent(fromItems));
    }

    if (node && node.whereClause) {
      output.push('WHERE');
      output.push(this.formatter.indent(this.expressionVisitor.visit(node.whereClause, context)));
    }

    if (node && node.valuesLists) {
      output.push('VALUES');
      const lists = ListUtils.unwrapList(node.valuesLists).map(list => {
        const values = ListUtils.unwrapList(list).map(val => this.expressionVisitor.visit(val, context));
        return this.formatter.parens(values.join(', '));
      });
      output.push(lists.join(', '));
    }

    if (node && node.groupClause) {
      output.push('GROUP BY');
      const groupList = ListUtils.unwrapList(node.groupClause);
      const groupItems = groupList
        .map(e => this.expressionVisitor.visit(e, { ...context, group: true }))
        .join(`, ${this.formatter.newline()}`);
      output.push(this.formatter.indent(groupItems));
    }

    if (node && node.havingClause) {
      output.push('HAVING');
      output.push(this.formatter.indent(this.expressionVisitor.visit(node.havingClause, context)));
    }

    if (node && node.sortClause) {
      output.push('ORDER BY');
      const sortList = ListUtils.unwrapList(node.sortClause);
      const sortItems = sortList
        .map(e => this.expressionVisitor.visit(e, { ...context, sort: true }))
        .join(`, ${this.formatter.newline()}`);
      output.push(this.formatter.indent(sortItems));
    }

    if (node && node.limitCount) {
      output.push('LIMIT');
      output.push(this.formatter.indent(this.expressionVisitor.visit(node.limitCount, context)));
    }

    if (node && node.limitOffset) {
      output.push('OFFSET');
      output.push(this.formatter.indent(this.expressionVisitor.visit(node.limitOffset, context)));
    }

    return output.join(' ');
  }

  private InsertStmt(node: InsertStmt, context: DeparserContext): string {

    const output: string[] = [];

    if (node && node.withClause) {
      output.push(this.visit(node.withClause, context));
    }

    output.push('INSERT INTO');
    if (node && node.relation) {
      output.push(this.deparser ? this.deparser.deparse(node.relation, context) : this.expressionVisitor.visit(node.relation, context));
    }

    if (node && node.cols) {
      const cols = ListUtils.unwrapList(node.cols);
      if (cols && cols.length) {
        const colNames = cols.map(col => this.visit(col, context));
        output.push(this.formatter.parens(colNames.join(', ')));
      }
    }

    if (node && node.selectStmt) {
      output.push(this.deparser ? this.deparser.deparse(node.selectStmt, context) : this.visit(node.selectStmt, context));
    } else {
      output.push('DEFAULT VALUES');
    }

    if (node.onConflictClause) {
      const clause = node.onConflictClause;
      output.push('ON CONFLICT');

      if (clause.infer?.indexElems) {
        const indexElems = ListUtils.unwrapList(clause.infer.indexElems);
        const elemStrs = indexElems.map(elem => this.expressionVisitor.visit(elem, context));
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

  private UpdateStmt(node: UpdateStmt, context: DeparserContext): string {
    const output: string[] = [];

    if (node.withClause) {
      output.push(this.visit(node.withClause, context));
    }

    output.push('UPDATE');
    if (node.relation) {
      output.push(this.deparser ? this.deparser.deparse(node.relation, context) : this.expressionVisitor.visit(node.relation, context));
    }
    output.push('SET');

    const targetList = ListUtils.unwrapList(node.targetList);
    if (targetList && targetList.length) {
      const firstTarget = targetList[0] as any;
      if (firstTarget.ResTarget?.val?.MultiAssignRef) {
        const names = targetList.map((target: any) => target.ResTarget.name);
        output.push(this.formatter.parens(names.join(',')));
        output.push('=');
        output.push(this.expressionVisitor.visit(firstTarget.ResTarget.val, context));
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
      const fromItems = fromList.map(item => this.deparser ? this.deparser.deparse(item, context) : this.expressionVisitor.visit(item, context));
      output.push(fromItems.join(', '));
    }

    if (node.whereClause) {
      output.push('WHERE');
      output.push(this.expressionVisitor.visit(node.whereClause, context));
    }

    if (node.returningList) {
      output.push('RETURNING');
      output.push(this.deparseReturningList(node.returningList, context));
    }

    return output.join(' ');
  }

  private DeleteStmt(node: DeleteStmt, context: DeparserContext): string {
    const output: string[] = [];

    if (node.withClause) {
      output.push(this.visit(node.withClause, context));
    }

    output.push('DELETE');
    output.push('FROM');
    output.push(this.deparser ? this.deparser.deparse(node.relation, context) : this.expressionVisitor.visit(node.relation, context));

    if (node.usingClause) {
      output.push('USING');
      const usingList = ListUtils.unwrapList(node.usingClause);
      const usingItems = usingList.map(item => this.deparser ? this.deparser.deparse(item, context) : this.expressionVisitor.visit(item, context));
      output.push(usingItems.join(', '));
    }

    if (node.whereClause) {
      output.push('WHERE');
      output.push(this.expressionVisitor.visit(node.whereClause, context));
    }

    if (node.returningList) {
      output.push('RETURNING');
      output.push(this.deparseReturningList(node.returningList, context));
    }

    return output.join(' ');
  }

  private WithClause(node: WithClause, context: DeparserContext): string {
    const output: string[] = ['WITH'];
    
    if (node.recursive) {
      output.push('RECURSIVE');
    }
    
    const ctes = ListUtils.unwrapList(node.ctes);
    const cteStrs = ctes.map(cte => this.expressionVisitor.visit(cte, context));
    output.push(cteStrs.join(', '));
    
    return output.join(' ');
  }

  private ResTarget(node: ResTarget, context: DeparserContext): string {
    const output: string[] = [];
    
    if (context.update && node.name) {
      output.push(QuoteUtils.quote(node.name));
      output.push('=');
      if (node.val) {
        output.push(this.deparser ? this.deparser.deparse(node.val, context) : this.expressionVisitor.visit(node.val, context));
      }
    } else {
      if (node.val) {
        output.push(this.deparser ? this.deparser.deparse(node.val, context) : this.expressionVisitor.visit(node.val, context));
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
        const val = this.expressionVisitor.visit(resTarget.val, context);
        const alias = resTarget.name ? ` AS ${QuoteUtils.quote(resTarget.name)}` : '';
        return val + alias;
      })
      .join(',');
  }
}
