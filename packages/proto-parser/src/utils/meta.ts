import { toSpecialCamelCase } from './index';
import * as t from '@babel/types';
import { Node } from '@pgsql/types';

export interface FieldSpec {
  name: string;
  type: string;
  isNode: boolean;
  isArray: boolean;
  optional: boolean;
}

export interface NodeSpec {
  name: string;
  isNode: boolean;
  fields: FieldSpec[];
}

/**
 * Converts an AST (Abstract Syntax Tree) representation of a SQL query into
 * a meta-level AST that represents the code to generate the original AST.
 * This meta-level AST can then be used to programmatically construct the AST
 * for similar SQL queries. Essentially, it's an AST that describes how to
 * build an AST, enabling dynamic code generation based on the structure of
 * the original SQL AST. 
 */

// TODO — handle TypeName and SPECIAL_TYPES cases

export function generateTsAstCodeFromPgAst(ast: any): any {
    function createAstNode(functionName: string, properties: any) {
      const args = properties.map(([propKey, propValue]: [string, any]) => {
        return t.objectProperty(t.identifier(propKey), getValueNode(propValue));
      });
      return t.callExpression(
        t.memberExpression(t.identifier('ast'), t.identifier(functionName)),
        [t.objectExpression(args)]
      );
    }
  
    function getValueNode(value: any): t.Expression {
      if (typeof value === 'object') {
        return value === null ? t.nullLiteral() : traverse(value);
      }
      switch (typeof value) {
        case 'boolean':
          return t.booleanLiteral(value);
        case 'number':
          return t.numericLiteral(value);
        case 'string':
          return t.stringLiteral(value);
        default:
          return t.stringLiteral(String(value)); // Fallback for other types
      }
    }
  
    function traverse(node: any): t.Expression {
      if (Array.isArray(node)) {
        return t.arrayExpression(node.map(traverse));
      } else if (node && typeof node === 'object') {
        const entries = Object.entries(node);
        if (entries.length === 0) return t.objectExpression([]);
  
        const [key, value] = entries[0]; // Processing one key-value pair per object
        const functionName = toSpecialCamelCase(key);
        return createAstNode(functionName, Object.entries(value));
      }
  
      return getValueNode(node);
    }
  
    return traverse(ast);
  }

/**
 * Generates TypeScript code from a PostgreSQL AST using runtime schema information.
 * Uses t.ast.* for wrapped nodes and t.nodes.* for structure templates.
 */
export function generateTsAstCodeFromPgAstWithSchema(ast: Node, runtimeSchema: NodeSpec[]): any {
    // Create a map for quick lookup of node specs by name
    const schemaMap = new Map<string, NodeSpec>();
    runtimeSchema.forEach(spec => {
      schemaMap.set(spec.name, spec);
    });

    function createAstNode(functionName: string, properties: any, isWrapped: boolean, nodeSpec?: NodeSpec, forceUnwrapped: boolean = false) {
      const args = properties.map(([propKey, propValue]: [string, any]) => {
        // Check if this field should be treated as a node based on schema
        let processedValue;
        if (nodeSpec) {
          const fieldSpec = nodeSpec.fields.find(f => f.name === propKey);
          if (fieldSpec && fieldSpec.isNode) {
            // This field expects a node
            if (fieldSpec.isArray && Array.isArray(propValue)) {
              // Handle array of nodes - need to check if items should be treated as specific node types
              const itemNodeSpec = schemaMap.get(fieldSpec.type);
              if (itemNodeSpec) {
                processedValue = t.arrayExpression(propValue.map(item => {
                  if (item && typeof item === 'object' && !Array.isArray(item)) {
                    // Check if this is already a wrapped node
                    const entries = Object.entries(item);
                    if (entries.length === 1 && schemaMap.has(entries[0][0])) {
                      // Already wrapped
                      return traverse(item, forceUnwrapped);
                    } else {
                      // Not wrapped - treat as the expected type
                      return createAstNode(
                        toSpecialCamelCase(fieldSpec.type),
                        Object.entries(item).filter(([_, v]) => v !== undefined),
                        itemNodeSpec.isNode && !forceUnwrapped,
                        itemNodeSpec,
                        forceUnwrapped
                      );
                    }
                  }
                  return traverse(item, forceUnwrapped);
                }));
              } else {
                processedValue = t.arrayExpression(propValue.map(item => traverse(item, forceUnwrapped)));
              }
            } else if (!fieldSpec.isArray && propValue && typeof propValue === 'object' && !Array.isArray(propValue)) {
              // Single node - need to detect the actual node type
              // Since the field expects a generic "Node", we need to identify what type of node this is
              processedValue = traverse(propValue, forceUnwrapped);
            } else {
              processedValue = getValueNode(propValue);
            }
          } else {
            processedValue = getValueNode(propValue);
          }
        } else {
          processedValue = getValueNode(propValue);
        }
        
        return t.objectProperty(t.identifier(propKey), processedValue);
      });
      
      // Use t.ast.* for wrapped nodes, t.nodes.* for non-wrapped
      // forceUnwrapped overrides the isWrapped flag
      const namespace = (isWrapped && !forceUnwrapped) ? 'ast' : 'nodes';
      
      return t.callExpression(
        t.memberExpression(
          t.memberExpression(t.identifier('t'), t.identifier(namespace)),
          t.identifier(functionName)
        ),
        [t.objectExpression(args)]
      );
    }
  
    function getValueNode(value: any): t.Expression {
      if (typeof value === 'object') {
        return value === null ? t.nullLiteral() : traverse(value);
      }
      switch (typeof value) {
        case 'boolean':
          return t.booleanLiteral(value);
        case 'number':
          return t.numericLiteral(value);
        case 'string':
          return t.stringLiteral(value);
        default:
          return t.stringLiteral(String(value)); // Fallback for other types
      }
    }
  
    function traverse(node: any, forceUnwrapped: boolean = false): t.Expression {
      if (Array.isArray(node)) {
        return t.arrayExpression(node.map(item => traverse(item, forceUnwrapped)));
      } else if (node && typeof node === 'object') {
        const entries = Object.entries(node);
        if (entries.length === 0) return t.objectExpression([]);
  
        // Check if this is a wrapped node (has single key that matches a node type)
        if (entries.length === 1) {
          const [key, value] = entries[0];
          const nodeSpec = schemaMap.get(key);
          
          if (nodeSpec) {
            // This is a wrapped node
            const functionName = toSpecialCamelCase(key);
            const isWrapped = nodeSpec.isNode && !forceUnwrapped;
            
            // Process the node's fields preserving the original order
            const properties: [string, any][] = [];
            
            if (value && typeof value === 'object') {
              // Process fields in the order they appear in the value object
              Object.entries(value).forEach(([k, v]) => {
                if (v !== undefined) {
                  properties.push([k, v]);
                }
              });
            }
            
            return createAstNode(functionName, properties, isWrapped, nodeSpec, forceUnwrapped);
          }
        }
        
        // Not a wrapped node - but it might be an unwrapped node
        // Try to identify the node type by matching properties
        let identifiedNodeType: string | null = null;
        let identifiedNodeSpec: NodeSpec | null = null;
        let bestMatchCount = 0;
        
        // Check if this object matches any known node type
        const objKeys = Object.keys(node);
        
        for (const [nodeName, nodeSpec] of schemaMap.entries()) {
          // Check if the object has properties that match this node type
          const nodeFields = nodeSpec.fields.map(f => f.name);
          
          // Check if all object keys are valid fields for this node type
          const allPropsValid = objKeys.every(key => nodeFields.includes(key));
          
          // Check if we have at least one field that belongs to this node type
          const hasNodeFields = objKeys.length > 0 && objKeys.some(key => nodeFields.includes(key));
          
          if (allPropsValid && hasNodeFields) {
            // Count matching fields
            const matchingFieldCount = objKeys.filter(key => nodeFields.includes(key)).length;
            
            // Select the node type with the most matching fields
            if (matchingFieldCount > bestMatchCount) {
              bestMatchCount = matchingFieldCount;
              identifiedNodeType = nodeName;
              identifiedNodeSpec = nodeSpec;
            }
          }
        }
        
        if (identifiedNodeType && identifiedNodeSpec) {
          // This is an unwrapped node
          const properties = entries.filter(([_, v]) => v !== undefined);
          // Since this node is not wrapped, we should use t.nodes.* regardless of the schema's isNode value
          return createAstNode(
            toSpecialCamelCase(identifiedNodeType),
            properties,
            false, // isWrapped = false for unwrapped nodes
            identifiedNodeSpec,
            true // forceUnwrapped = true
          );
        }
        
        // Not a node - treat as a plain object
        const properties = entries.filter(([_, v]) => v !== undefined);
        return t.objectExpression(
          properties.map(([k, v]) => t.objectProperty(t.identifier(k), traverse(v, forceUnwrapped)))
        );
      }
  
      return getValueNode(node);
    }
  
    return traverse(ast);
  }
  