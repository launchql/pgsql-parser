import { Node } from '@pgsql/types';
import { SqlFormatter } from './utils/sql-formatter';
import { ConsolidatedVisitor } from './visitors/consolidated-visitor';
import { DeparserContext } from './visitors/base';

export interface DeparserOptions {
  newline?: string;
  tab?: string;
}

export class Deparser {
  private formatter: SqlFormatter;
  private consolidatedVisitor: ConsolidatedVisitor;
  private tree: Node[];

  constructor(tree: Node | Node[], opts: DeparserOptions = {}) {
    this.formatter = new SqlFormatter(opts.newline, opts.tab);
    this.consolidatedVisitor = new ConsolidatedVisitor(this.formatter, this);
    
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
      return this.consolidatedVisitor.visit(node, context);
    } catch (error) {
      const nodeType = Object.keys(node)[0];
      throw new Error(`Error deparsing ${nodeType}: ${(error as Error).message}`);
    }
  }


}
