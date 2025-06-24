import { ASTTransformer } from '../src/transformer';
import { Node as PG13Node } from '../src/13/types';
import { Node as PG17Node } from '../src/17/types';

describe('AST Transformer Integration', () => {
  const transformer = new ASTTransformer();

  it('should handle multi-version transformations', () => {
    const pg13Ast: PG13Node = {
      SelectStmt: {
        targetList: [
          {
            ResTarget: {
              val: {
                A_Const: {
                  ival: { ival: 42 }
                }
              }
            }
          }
        ]
      }
    };

    const pg17Ast = transformer.transform13To17(pg13Ast);
    
    expect(pg17Ast).toBeDefined();
    expect(pg17Ast.SelectStmt).toBeDefined();
  });

  it('should maintain AST validity across all transformations', () => {
    const simpleAst: PG13Node = {
      SelectStmt: {
        targetList: []
      }
    };

    const pg14Ast = transformer.transform(simpleAst, 13, 14);
    const pg15Ast = transformer.transform(pg14Ast, 14, 15);
    const pg16Ast = transformer.transform(pg15Ast, 15, 16);
    const pg17Ast = transformer.transform(pg16Ast, 16, 17);

    expect(pg17Ast).toBeDefined();
    expect(pg17Ast.SelectStmt).toBeDefined();
  });

  it('should handle same-version transformation', () => {
    const ast: PG13Node = { SelectStmt: { targetList: [] } };
    const result = transformer.transform(ast, 13, 13);
    expect(result).toBe(ast);
  });

  it('should throw error for backwards transformation', () => {
    const ast: PG13Node = { SelectStmt: { targetList: [] } };
    expect(() => transformer.transform(ast, 15, 13)).toThrow('Cannot transform backwards');
  });

  it('should handle A_Const transformation through multiple versions', () => {
    const pg13Ast: PG13Node = {
      A_Const: {
        ival: { ival: 123 },
        location: 0
      }
    };

    const pg17Ast = transformer.transform(pg13Ast, 13, 17);
    
    expect(pg17Ast).toEqual({
      A_Const: {
        ival: { ival: 123 },
        location: 0
      }
    });
  });
});
