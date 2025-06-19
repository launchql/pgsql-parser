import { Node } from '@pgsql/types';

export interface DeparserContext {
  isStringLiteral?: boolean;
  parentNodeTypes: string[];
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

  protected formatList(items: any[], separator: string = ', ', prefix: string = '', formatter: (item: any) => string): string {
    if (!items || items.length === 0) {
      return '';
    }

    return items
      .map(item => `${prefix}${formatter(item)}`)
      .join(separator);
  }

  protected formatParts(parts: string[], separator: string = ' '): string {
    return parts.filter(part => part !== null && part !== undefined && part !== '').join(separator);
  }

  protected formatParens(content: string): string {
    return `(${content})`;
  }

  protected formatIndent(text: string, count: number = 1): string {
    return text;
  }
}
