
type KnownNode = any;

export type VisitorContext = {
  path: (string | number)[];
  parent: any;
  key: string | number;
};

export type Visitor = {
  [key: string]: (node: any, ctx: VisitorContext) => void;
};

/**
 * Recursively visits a PostgreSQL AST node, calling any matching visitor functions
 */
export function visit(
  node: KnownNode,
  visitor: Visitor,
  ctx: VisitorContext = { path: [], parent: null, key: '' }
): void {
  if (node == null || typeof node !== 'object') return;

  const nodeType = Object.keys(node)[0];
  const nodeData = (node as any)[nodeType];

  const visitFn = visitor[nodeType];
  if (visitFn) {
    visitFn(nodeData, ctx);
  }

  for (const key in nodeData) {
    const value = nodeData[key];
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === 'object' && item !== null && Object.keys(item).length === 1) {
          visit(item, visitor, {
            parent: value,
            key: index,
            path: [...ctx.path, nodeType, key, index],
          });
        }
      });
    } else if (typeof value === 'object' && value !== null && Object.keys(value).length === 1) {
      visit(value, visitor, {
        parent: nodeData,
        key,
        path: [...ctx.path, nodeType, key],
      });
    }
  }
}
