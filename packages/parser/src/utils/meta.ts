import { toSpecialCamelCase } from './index';
import * as t from '@babel/types';

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
      const args = properties.map(([propKey, propValue]) => {
        return t.objectProperty(t.identifier(propKey), getValueNode(propValue));
      });
      return t.callExpression(
        t.memberExpression(t.identifier('ast'), t.identifier(functionName)),
        [t.objectExpression(args)]
      );
    }
  
    function getValueNode(value: any) {
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
  
    function traverse(node: any) {
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
  