
import type { Node, ParseResult } from '@pgsql/types';
import type { FieldSpec, NodeSpec } from '@pgsql/transform';
import { PG17RuntimeSchema as runtimeSchema } from '@pgsql/transform';

const schemaMap = new Map<string, NodeSpec>(runtimeSchema.map((spec: NodeSpec) => [spec.name, spec]));

export type NodeTag = keyof Node;

export class NodePath<TTag extends string = string> {
  constructor(
    public tag: TTag,
    public node: any,
    public parent: NodePath | null = null,
    public keyPath: readonly (string | number)[] = []
  ) {}

  get path(): (string | number)[] {
    return [...this.keyPath];
  }

  get key(): string | number {
    return this.keyPath[this.keyPath.length - 1] ?? '';
  }
}

export type Walker<TNodePath extends NodePath = NodePath> = (
  path: TNodePath,
) => boolean | void;

export type Visitor = {
  [key: string]: Walker<NodePath>;
};

/**
 * Walks the tree of PostgreSQL AST nodes using runtime schema for precise traversal.
 * 
 * If a callback returns `false`, the walk will continue to the next sibling
 * node, rather than recurse into the children of the current node.
 */
export function walk(
  root: any,
  callback: Walker | Visitor,
  parent: NodePath | null = null,
  keyPath: readonly (string | number)[] = [],
): void {
  const actualCallback: Walker = typeof callback === 'function' 
    ? callback 
    : (path: NodePath) => {
        const visitor = callback as Visitor;
        const visitFn = visitor[path.tag];
        return visitFn ? visitFn(path) : undefined;
      };

  if (Array.isArray(root)) {
    root.forEach((node, index) => {
      walk(node, actualCallback, parent, [...keyPath, index]);
    });
  } else if (typeof root === 'object' && root !== null) {
    const keys = Object.keys(root);
    if (keys.length === 1 && /^[A-Z]/.test(keys[0])) {
      const tag = keys[0];
      const nodeData = root[tag];
      const path = new NodePath(tag, nodeData, parent, keyPath);
      
      if (actualCallback(path) === false) {
        return;
      }

      const nodeSpec = schemaMap.get(tag);
      if (nodeSpec) {
        for (const field of nodeSpec.fields) {
          if (field.type === 'Node' && nodeData[field.name] != null) {
            const value = nodeData[field.name];
            if (field.isArray && Array.isArray(value)) {
              value.forEach((item, index) => {
                walk(item, actualCallback, path, [...path.keyPath, field.name, index]);
              });
            } else if (!field.isArray) {
              walk(value, actualCallback, path, [...path.keyPath, field.name]);
            }
          }
        }
      } else {
        for (const key in nodeData) {
          const value = nodeData[key];
          if (Array.isArray(value)) {
            value.forEach((item, index) => {
              if (typeof item === 'object' && item !== null) {
                walk(item, actualCallback, path, [...path.keyPath, key, index]);
              }
            });
          } else if (typeof value === 'object' && value !== null) {
            walk(value, actualCallback, path, [...path.keyPath, key]);
          }
        }
      }
    } else {
      for (const key of keys) {
        walk(root[key], actualCallback, parent, [...keyPath, key]);
      }
    }
  }
}

export type VisitorContext = {
  path: (string | number)[];
  parent: any;
  key: string | number;
};

export function visit(
  node: any,
  visitor: { [key: string]: (node: any, ctx: VisitorContext) => void },
  ctx: VisitorContext = { path: [], parent: null, key: '' }
): void {
  const legacyVisitor: Visitor = {};
  
  for (const [nodeType, visitFn] of Object.entries(visitor)) {
    legacyVisitor[nodeType] = (path: NodePath) => {
      const legacyCtx: VisitorContext = {
        path: path.path,
        parent: path.parent?.node || null,
        key: path.key
      };
      visitFn(path.node, legacyCtx);
    };
  }
  
  walk(node, legacyVisitor);
}
