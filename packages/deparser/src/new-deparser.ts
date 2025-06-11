import { Node } from '@pgsql/types';
import { SqlFormatter } from './utils/sql-formatter';
import { ExpressionVisitor } from './visitors/expression-visitor';
import { StatementVisitor } from './visitors/statement-visitor';
import { TypeVisitor } from './visitors/type-visitor';
import { UtilityVisitor } from './visitors/utility-visitor';
import { ValueVisitor } from './visitors/value-visitor';
import { DeparserContext } from './visitors/base';

export interface DeparserOptions {
  newline?: string;
  tab?: string;
}

export class NewDeparser {
  private formatter: SqlFormatter;
  private expressionVisitor: ExpressionVisitor;
  private statementVisitor: StatementVisitor;
  private typeVisitor: TypeVisitor;
  private utilityVisitor: UtilityVisitor;
  private valueVisitor: ValueVisitor;
  private tree: Node[];

  constructor(tree: Node | Node[], opts: DeparserOptions = {}) {
    this.formatter = new SqlFormatter(opts.newline, opts.tab);
    this.expressionVisitor = new ExpressionVisitor(this.formatter);
    this.typeVisitor = new TypeVisitor(this.formatter, this.expressionVisitor);
    this.statementVisitor = new StatementVisitor(this.formatter, this.expressionVisitor, this);
    this.utilityVisitor = new UtilityVisitor(this.formatter, this.expressionVisitor, this.typeVisitor);
    this.valueVisitor = new ValueVisitor();
    
    this.tree = Array.isArray(tree) ? tree : [tree];
  }

  static deparse(query: Node | Node[], opts: DeparserOptions = {}): string {
    return new NewDeparser(query, opts).deparseQuery();
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

    const nodeType = Object.keys(node)[0];

    try {
      if (this.isValueNode(nodeType)) {
        return this.valueVisitor.visit(node, context);
      } else if (this.isStatementNode(nodeType)) {
        return this.statementVisitor.visit(node, context);
      } else if (this.isTypeNode(nodeType)) {
        return this.typeVisitor.visit(node, context);
      } else if (this.isExpressionNode(nodeType)) {
        return this.expressionVisitor.visit(node, context);
      } else if (this.isUtilityNode(nodeType)) {
        return this.utilityVisitor.visit(node, context);
      } else {
        throw new Error(`Unknown node type: ${nodeType}`);
      }
    } catch (error) {
      throw new Error(`Error deparsing ${nodeType}: ${(error as Error).message}`);
    }
  }

  private isStatementNode(nodeType: string): boolean {
    const statementTypes = new Set([
      'RawStmt', 'SelectStmt', 'InsertStmt', 'UpdateStmt', 'DeleteStmt',
      'WithClause', 'ResTarget'
    ]);
    return statementTypes.has(nodeType);
  }

  private isExpressionNode(nodeType: string): boolean {
    const expressionTypes = new Set([
      'A_Expr', 'BoolExpr', 'FuncCall', 'A_Const', 'ColumnRef', 'A_ArrayExpr',
      'A_Indices', 'A_Indirection', 'A_Star', 'CaseExpr', 'CoalesceExpr',
      'TypeCast', 'CollateClause', 'BooleanTest', 'NullTest', 'SubLink',
      'CaseWhen', 'WindowDef', 'SortBy', 'GroupingSet', 'WindowClause',
      'CommonTableExpr', 'SetToDefault', 'ParamRef', 'MinMaxExpr', 'SQLValueFunction',
      'XmlExpr', 'NullIfExpr', 'RowExpr', 'RowCompareExpr', 'CoerceToDomain',
      'CoerceToDomainValue', 'CurrentOfExpr', 'InferenceElem',
      'TargetEntry', 'RangeTblRef', 'JoinExpr', 'FromExpr', 'OnConflictExpr',
      'names'
    ]);
    return expressionTypes.has(nodeType);
  }

  private isTypeNode(nodeType: string): boolean {
    const typeTypes = new Set([
      'TypeName', 'Alias', 'RangeVar'
    ]);
    return typeTypes.has(nodeType);
  }

  private isUtilityNode(nodeType: string): boolean {
    const utilityTypes = new Set([
      'CreateStmt', 'DropStmt', 'AlterTableStmt', 'IndexStmt', 'ViewStmt',
      'CreateFunctionStmt', 'TruncateStmt', 'CommentStmt', 'DefineStmt',
      'CompositeTypeStmt', 'RenameStmt', 'AlterOwnerStmt', 'AlterObjectSchemaStmt',
      'DoStmt', 'VariableSetStmt', 'VariableShowStmt', 'ExplainStmt', 'CreateTrigStmt'
    ]);
    return utilityTypes.has(nodeType);
  }

  private isValueNode(nodeType: string): boolean {
    const valueTypes = new Set([
      'String', 'Integer', 'Float', 'Boolean', 'BitString', 'Null'
    ]);
    return valueTypes.has(nodeType);
  }
}
