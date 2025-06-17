import { Deparser } from '../../src/deparser';
import { DeparserContext } from '../../src/visitors/base';
import { parse } from '@pgsql/parser';
import { cleanTree } from '../../src/utils';
import { DefElemAction } from '@pgsql/types';

describe('Sequence Statement Deparsers', () => {
  const deparser = new Deparser([]);
  const context: DeparserContext = {};

  describe('CreateSeqStmt', () => {
    it('should deparse CREATE SEQUENCE statement', () => {
      const ast = {
        CreateSeqStmt: {
          sequence: {
            relname: 'test_seq',
            inh: true,
            relpersistence: 'p',
            location: -1
          }
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE SEQUENCE test_seq');
      
      const correctAst = parse('CREATE SEQUENCE test_seq');
      expect(cleanTree(ast)).toEqual(cleanTree(correctAst.stmts![0].stmt));
    });

    it('should deparse CREATE SEQUENCE IF NOT EXISTS statement', () => {
      const ast = {
        CreateSeqStmt: {
          sequence: {
            schemaname: 'public',
            relname: 'my_sequence',
            inh: true,
            relpersistence: 'p',
            location: -1
          },
          if_not_exists: true
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE SEQUENCE IF NOT EXISTS public.my_sequence');
      
      const correctAst = parse('CREATE SEQUENCE IF NOT EXISTS public.my_sequence');
      expect(cleanTree(ast)).toEqual(cleanTree(correctAst.stmts![0].stmt));
    });

    it('should deparse CREATE SEQUENCE with options', () => {
      const ast = {
        CreateSeqStmt: {
          sequence: {
            relname: 'counter_seq',
            inh: true,
            relpersistence: 'p',
            location: -1
          },
          options: [
            {
              DefElem: {
                defname: 'start',
                arg: { Integer: { ival: 100 } },
                defaction: 'DEFELEM_UNSPEC' as DefElemAction,
                location: -1
              }
            },
            {
              DefElem: {
                defname: 'increment',
                arg: { Integer: { ival: 5 } },
                defaction: 'DEFELEM_UNSPEC' as DefElemAction,
                location: -1
              }
            }
          ]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE SEQUENCE counter_seq START 100 INCREMENT 5');
      
      const correctAst = parse('CREATE SEQUENCE counter_seq START 100 INCREMENT 5');
      expect(cleanTree(ast)).toEqual(cleanTree(correctAst.stmts![0].stmt));
    });
  });

  describe('AlterSeqStmt', () => {
    it('should deparse ALTER SEQUENCE statement', () => {
      const ast = {
        AlterSeqStmt: {
          sequence: {
            relname: 'test_seq',
            inh: true,
            relpersistence: 'p',
            location: -1
          },
          options: [
            {
              DefElem: {
                defname: 'restart',
                arg: { Integer: { ival: 1 } },
                defaction: 'DEFELEM_UNSPEC' as DefElemAction,
                location: -1
              }
            }
          ]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('ALTER SEQUENCE test_seq RESTART 1');
      
      const correctAst = parse('ALTER SEQUENCE test_seq RESTART 1');
      expect(cleanTree(ast)).toEqual(cleanTree(correctAst.stmts![0].stmt));
    });

    it('should deparse ALTER SEQUENCE with schema name', () => {
      const ast = {
        AlterSeqStmt: {
          sequence: {
            schemaname: 'public',
            relname: 'my_seq',
            inh: true,
            relpersistence: 'p',
            location: -1
          },
          options: [
            {
              DefElem: {
                defname: 'restart',
                arg: { Integer: { ival: 1 } },
                defaction: 'DEFELEM_UNSPEC' as DefElemAction,
                location: -1
              }
            }
          ]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('ALTER SEQUENCE public.my_seq RESTART 1');
      
      const correctAst = parse('ALTER SEQUENCE public.my_seq RESTART 1');
      expect(cleanTree(ast)).toEqual(cleanTree(correctAst.stmts![0].stmt));
    });

    it('should deparse ALTER SEQUENCE with MAXVALUE option', () => {
      const ast = {
        AlterSeqStmt: {
          sequence: {
            relname: 'identity_seq',
            inh: true,
            relpersistence: 'p',
            location: -1
          },
          options: [
            {
              DefElem: {
                defname: 'maxvalue',
                arg: { Integer: { ival: 1000 } },
                defaction: 'DEFELEM_UNSPEC' as DefElemAction,
                location: -1
              }
            }
          ]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('ALTER SEQUENCE identity_seq MAXVALUE 1000');
      
      const correctAst = parse('ALTER SEQUENCE identity_seq MAXVALUE 1000');
      expect(cleanTree(ast)).toEqual(cleanTree(correctAst.stmts![0].stmt));
    });
  });
});
