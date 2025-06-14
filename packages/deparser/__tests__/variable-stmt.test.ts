import { Deparser } from '../src/deparser';
import { DeparserContext } from '../src/visitors/base';
import { parse } from '@pgsql/parser';
import { cleanTree } from '../src/utils';

describe('Variable Statement Deparsers', () => {
  const deparser = new Deparser([]);
  const context: DeparserContext = {};

  describe('VariableSetStmt', () => {
    it('should deparse SET variable = value statement', () => {
      const ast = {
        VariableSetStmt: {
          kind: 'VAR_SET_VALUE',
          name: 'timezone',
          args: [{ A_Const: { sval: { sval: 'UTC' }, location: 15 } }]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('SET timezone = \'UTC\'');
      
      const correctAst = parse('SET timezone = \'UTC\'');
      expect(cleanTree(ast)).toEqual(cleanTree(correctAst.stmts![0].stmt));
    });

    it('should deparse SET LOCAL variable = value statement', () => {
      const ast = {
        VariableSetStmt: {
          kind: 'VAR_SET_VALUE',
          name: 'work_mem',
          args: [{ A_Const: { sval: { sval: '64MB' }, location: 21 } }],
          is_local: true
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('SET LOCAL work_mem = \'64MB\'');
      
      const correctAst = parse('SET LOCAL work_mem = \'64MB\'');
      expect(cleanTree(ast)).toEqual(cleanTree(correctAst.stmts![0].stmt));
    });

    it('should deparse SET variable TO DEFAULT statement', () => {
      const ast = {
        VariableSetStmt: {
          kind: 'VAR_SET_DEFAULT',
          name: 'timezone'
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('SET timezone TO DEFAULT');
      
      const correctAst = parse('SET timezone TO DEFAULT');
      expect(cleanTree(ast)).toEqual(cleanTree(correctAst.stmts![0].stmt));
    });

    it('should deparse SET variable FROM CURRENT statement', () => {
      const ast = {
        VariableSetStmt: {
          kind: 'VAR_SET_CURRENT',
          name: 'timezone'
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('SET timezone FROM CURRENT');
      
      const correctAst = parse('SET timezone FROM CURRENT');
      expect(cleanTree(ast)).toEqual(cleanTree(correctAst.stmts![0].stmt));
    });

    it('should deparse RESET variable statement', () => {
      const ast = {
        VariableSetStmt: {
          kind: 'VAR_RESET',
          name: 'timezone'
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('RESET timezone');
      
      const correctAst = parse('RESET timezone');
      expect(cleanTree(ast)).toEqual(cleanTree(correctAst.stmts![0].stmt));
    });

    it('should deparse RESET ALL statement', () => {
      const ast = {
        VariableSetStmt: {
          kind: 'VAR_RESET_ALL'
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('RESET ALL');
      
      const correctAst = parse('RESET ALL');
      expect(cleanTree(ast)).toEqual(cleanTree(correctAst.stmts![0].stmt));
    });

    it('should throw error for unsupported variable set kind', () => {
      const ast = {
        VariableSetStmt: {
          kind: 'INVALID_KIND' as any,
          name: 'test',
          args: null as any[] | null,
          is_local: false
        }
      };
      
      expect(() => deparser.visit(ast, context)).toThrow('Unsupported VariableSetStmt kind: INVALID_KIND');
    });
  });

  describe('VariableShowStmt', () => {
    it('should deparse SHOW variable statement', () => {
      const ast = {
        VariableShowStmt: {
          name: 'timezone'
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('SHOW timezone');
      
      const correctAst = parse('SHOW timezone');
      expect(cleanTree(ast)).toEqual(cleanTree(correctAst.stmts![0].stmt));
    });

    it('should deparse SHOW ALL statement', () => {
      const ast = {
        VariableShowStmt: {
          name: 'all'
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('SHOW all');
      
      const correctAst = parse('SHOW all');
      expect(cleanTree(ast)).toEqual(cleanTree(correctAst.stmts![0].stmt));
    });

    it('should deparse SHOW with complex variable name', () => {
      const ast = {
        VariableShowStmt: {
          name: 'log_statement'
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('SHOW log_statement');
      
      const correctAst = parse('SHOW log_statement');
      expect(cleanTree(ast)).toEqual(cleanTree(correctAst.stmts![0].stmt));
    });
  });
});
