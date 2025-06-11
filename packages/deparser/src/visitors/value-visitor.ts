import { BaseVisitor, DeparserContext } from './base';
import { Node } from '@pgsql/types';
import { QuoteUtils } from '../utils/quote-utils';

export class ValueVisitor extends BaseVisitor {
  visit(node: Node, context: DeparserContext = {}): string {
    const nodeType = this.getNodeType(node);
    const nodeData = this.getNodeData(node);

    switch (nodeType) {
      case 'String':
        return this.String(nodeData, context);
      case 'Integer':
        return this.Integer(nodeData, context);
      case 'Float':
        return this.Float(nodeData, context);
      case 'Boolean':
        return this.Boolean(nodeData, context);
      case 'BitString':
        return this.BitString(nodeData, context);
      case 'Null':
        return this.Null(nodeData, context);
      default:
        throw new Error(`Value visitor does not handle node type: ${nodeType}`);
    }
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
}
