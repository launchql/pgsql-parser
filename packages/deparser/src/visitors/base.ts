import { Node } from '@pgsql/types';

export interface DeparserContext {
  [key: string]: any;
}

export interface DeparserVisitor {
  visit(node: Node, context?: DeparserContext): string;
}

export abstract class BaseVisitor implements DeparserVisitor {
  abstract visit(node: Node, context?: DeparserContext): string;

  protected getNodeType(node: Node): string {
    return Object.keys(node)[0];
  }

  protected getNodeData(node: Node): any {
    const type = this.getNodeType(node);
    return (node as any)[type];
  }
}
