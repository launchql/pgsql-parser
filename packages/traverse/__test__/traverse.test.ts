import type { Visitor } from '../src';
import { visit } from '../src';

describe('traverse', () => {
  it('should visit SelectStmt nodes', () => {
    const selectStmtVisited: any[] = [];
    const rangeVarVisited: any[] = [];
    
    const visitor: Visitor = {
      SelectStmt: (node, ctx) => {
        selectStmtVisited.push({ node, ctx });
      },
      RangeVar: (node, ctx) => {
        rangeVarVisited.push({ node, ctx });
      }
    };

    const ast = {
      SelectStmt: {
        targetList: [
          {
            ResTarget: {
              val: {
                ColumnRef: {
                  fields: [{ A_Star: {} }]
                }
              }
            }
          }
        ],
        fromClause: [
          {
            RangeVar: {
              relname: 'users',
              inh: true,
              relpersistence: 'p'
            }
          }
        ],
        limitOption: 'LIMIT_OPTION_DEFAULT',
        op: 'SETOP_NONE'
      }
    };

    visit(ast, visitor);

    expect(selectStmtVisited).toHaveLength(1);
    expect(rangeVarVisited).toHaveLength(1);
    expect(rangeVarVisited[0].node.relname).toBe('users');
  });

  it('should handle ParseResult nodes', () => {
    const parseResultVisited: any[] = [];
    const rawStmtVisited: any[] = [];
    
    const visitor: Visitor = {
      ParseResult: (node, ctx) => {
        parseResultVisited.push({ node, ctx });
      },
      RawStmt: (node, ctx) => {
        rawStmtVisited.push({ node, ctx });
      }
    };

    const parseResult = {
      ParseResult: {
        version: 170004,
        stmts: [
          {
            RawStmt: {
              stmt: {
                SelectStmt: {
                  targetList: [] as any[],
                  limitOption: 'LIMIT_OPTION_DEFAULT',
                  op: 'SETOP_NONE'
                }
              }
            }
          }
        ]
      }
    };

    visit(parseResult, visitor);

    expect(parseResultVisited).toHaveLength(1);
    expect(rawStmtVisited).toHaveLength(1);
  });

  it('should provide correct visitor context', () => {
    const contexts: any[] = [];
    
    const visitor: Visitor = {
      RangeVar: (node, ctx) => {
        contexts.push(ctx);
      }
    };

    const ast = {
      SelectStmt: {
        fromClause: [
          {
            RangeVar: {
              relname: 'users',
              inh: true,
              relpersistence: 'p'
            }
          }
        ]
      }
    };

    visit(ast, visitor);

    expect(contexts).toHaveLength(1);
    expect(contexts[0].path).toEqual(['SelectStmt', 'fromClause', 0]);
    expect(contexts[0].key).toBe(0);
    expect(Array.isArray(contexts[0].parent)).toBe(true);
  });

  it('should handle null and undefined nodes gracefully', () => {
    const visitor: Visitor = {
      SelectStmt: () => {
        throw new Error('Should not be called');
      }
    };

    expect(() => visit(null as any, visitor)).not.toThrow();
    expect(() => visit(undefined as any, visitor)).not.toThrow();
    expect(() => visit('string' as any, visitor)).not.toThrow();
  });

  it('should handle nested complex AST structures', () => {
    const visitedNodes: string[] = [];
    
    const visitor: Visitor = {
      SelectStmt: () => visitedNodes.push('SelectStmt'),
      ResTarget: () => visitedNodes.push('ResTarget'),
      ColumnRef: () => visitedNodes.push('ColumnRef'),
      A_Star: () => visitedNodes.push('A_Star'),
      RangeVar: () => visitedNodes.push('RangeVar'),
      A_Expr: () => visitedNodes.push('A_Expr'),
      A_Const: () => visitedNodes.push('A_Const')
    };

    const complexAst = {
      SelectStmt: {
        targetList: [
          {
            ResTarget: {
              val: {
                ColumnRef: {
                  fields: [{ A_Star: {} }]
                }
              }
            }
          }
        ],
        fromClause: [
          {
            RangeVar: {
              relname: 'users',
              inh: true,
              relpersistence: 'p'
            }
          }
        ],
        whereClause: {
          A_Expr: {
            kind: 'AEXPR_OP',
            name: [{ String: { sval: '=' } }],
            lexpr: {
              ColumnRef: {
                fields: [{ String: { sval: 'id' } }]
              }
            },
            rexpr: {
              A_Const: {
                ival: { Integer: { ival: 1 } }
              }
            }
          }
        },
        limitOption: 'LIMIT_OPTION_DEFAULT',
        op: 'SETOP_NONE'
      }
    };

    visit(complexAst, visitor);

    expect(visitedNodes).toContain('SelectStmt');
    expect(visitedNodes).toContain('ResTarget');
    expect(visitedNodes).toContain('ColumnRef');
    expect(visitedNodes).toContain('A_Star');
    expect(visitedNodes).toContain('RangeVar');
    expect(visitedNodes).toContain('A_Expr');
    expect(visitedNodes).toContain('A_Const');
  });

  it('should handle arrays of nodes correctly', () => {
    const targetListVisited: any[] = [];
    
    const visitor: Visitor = {
      ResTarget: (node, ctx) => {
        targetListVisited.push({ node, ctx });
      }
    };

    const ast = {
      SelectStmt: {
        targetList: [
          {
            ResTarget: {
              val: {
                ColumnRef: {
                  fields: [{ String: { sval: 'name' } }]
                }
              }
            }
          },
          {
            ResTarget: {
              val: {
                ColumnRef: {
                  fields: [{ String: { sval: 'email' } }]
                }
              }
            }
          }
        ],
        limitOption: 'LIMIT_OPTION_DEFAULT',
        op: 'SETOP_NONE'
      }
    };

    visit(ast, visitor);

    expect(targetListVisited).toHaveLength(2);
    expect(targetListVisited[0].ctx.key).toBe(0);
    expect(targetListVisited[1].ctx.key).toBe(1);
    expect(targetListVisited[0].ctx.path).toEqual(['SelectStmt', 'targetList', 0]);
    expect(targetListVisited[1].ctx.path).toEqual(['SelectStmt', 'targetList', 1]);
  });
});
