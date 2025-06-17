import { Deparser } from '../../src/deparser';
import { DeparserContext } from '../../src/visitors/base';
import { parse } from '@pgsql/parser';
import { cleanTree } from '../../src/utils';
import { TransactionStmt } from '@pgsql/types';

describe('TransactionStmt Deparser', () => {
  const deparser = new Deparser([]);
  const context: DeparserContext = {};

  it('should deparse BEGIN statement', () => {
    const ast: { TransactionStmt: TransactionStmt } = {
      TransactionStmt: {
        kind: "TRANS_STMT_BEGIN",
        location: -1
      }
    };
    
    expect(deparser.visit(ast, context)).toBe('BEGIN');
    
    const correctAst = parse('BEGIN');
    expect(cleanTree(ast)).toEqual(cleanTree(correctAst.stmts![0].stmt));
  });

  it('should deparse START TRANSACTION statement', () => {
    const ast: { TransactionStmt: TransactionStmt } = {
      TransactionStmt: {
        kind: "TRANS_STMT_START",
        location: -1
      }
    };
    
    expect(deparser.visit(ast, context)).toBe('START TRANSACTION');
    
    const correctAst = parse('START TRANSACTION');
    expect(cleanTree(ast)).toEqual(cleanTree(correctAst.stmts![0].stmt));
  });

  it('should deparse COMMIT statement', () => {
    const ast: { TransactionStmt: TransactionStmt } = {
      TransactionStmt: {
        kind: "TRANS_STMT_COMMIT",
        location: -1
      }
    };
    
    expect(deparser.visit(ast, context)).toBe('COMMIT');
    
    const correctAst = parse('COMMIT');
    expect(cleanTree(ast)).toEqual(cleanTree(correctAst.stmts![0].stmt));
  });

  it('should deparse ROLLBACK statement', () => {
    const ast: { TransactionStmt: TransactionStmt } = {
      TransactionStmt: {
        kind: "TRANS_STMT_ROLLBACK",
        location: -1
      }
    };
    
    expect(deparser.visit(ast, context)).toBe('ROLLBACK');
    
    const correctAst = parse('ROLLBACK');
    expect(cleanTree(ast)).toEqual(cleanTree(correctAst.stmts![0].stmt));
  });

  it('should deparse SAVEPOINT statement', () => {
    const ast: { TransactionStmt: TransactionStmt } = {
      TransactionStmt: {
        kind: "TRANS_STMT_SAVEPOINT",
        savepoint_name: 'sp1',
        location: -1
      }
    };
    
    expect(deparser.visit(ast, context)).toBe('SAVEPOINT sp1');
    
    const correctAst = parse('SAVEPOINT sp1');
    expect(cleanTree(ast)).toEqual(cleanTree(correctAst.stmts![0].stmt));
  });

  it('should deparse RELEASE SAVEPOINT statement', () => {
    const ast: { TransactionStmt: TransactionStmt } = {
      TransactionStmt: {
        kind: "TRANS_STMT_RELEASE",
        savepoint_name: 'sp1',
        location: -1
      }
    };
    
    expect(deparser.visit(ast, context)).toBe('RELEASE SAVEPOINT sp1');
    
    const correctAst = parse('RELEASE SAVEPOINT sp1');
    expect(cleanTree(ast)).toEqual(cleanTree(correctAst.stmts![0].stmt));
  });

  it('should deparse ROLLBACK TO statement', () => {
    const ast: { TransactionStmt: TransactionStmt } = {
      TransactionStmt: {
        kind: "TRANS_STMT_ROLLBACK_TO",
        savepoint_name: 'sp1',
        location: -1
      }
    };
    
    expect(deparser.visit(ast, context)).toBe('ROLLBACK TO sp1');
    
    const correctAst = parse('ROLLBACK TO sp1');
    expect(cleanTree(ast)).toEqual(cleanTree(correctAst.stmts![0].stmt));
  });

  it('should deparse PREPARE TRANSACTION statement', () => {
    const ast: { TransactionStmt: TransactionStmt } = {
      TransactionStmt: {
        kind: "TRANS_STMT_PREPARE",
        gid: 'test_gid',
        location: -1
      }
    };
    
    expect(deparser.visit(ast, context)).toBe('PREPARE TRANSACTION \'test_gid\'');
    
    const correctAst = parse('PREPARE TRANSACTION \'test_gid\'');
    expect(cleanTree(ast)).toEqual(cleanTree(correctAst.stmts![0].stmt));
  });

  it('should deparse COMMIT PREPARED statement', () => {
    const ast: { TransactionStmt: TransactionStmt } = {
      TransactionStmt: {
        kind: "TRANS_STMT_COMMIT_PREPARED",
        gid: 'test_gid',
        location: -1
      }
    };
    
    expect(deparser.visit(ast, context)).toBe('COMMIT PREPARED \'test_gid\'');
    
    const correctAst = parse('COMMIT PREPARED \'test_gid\'');
    expect(cleanTree(ast)).toEqual(cleanTree(correctAst.stmts![0].stmt));
  });

  it('should deparse ROLLBACK PREPARED statement', () => {
    const ast: { TransactionStmt: TransactionStmt } = {
      TransactionStmt: {
        kind: "TRANS_STMT_ROLLBACK_PREPARED",
        gid: 'test_gid',
        location: -1
      }
    };
    
    expect(deparser.visit(ast, context)).toBe('ROLLBACK PREPARED \'test_gid\'');
    
    const correctAst = parse('ROLLBACK PREPARED \'test_gid\'');
    expect(cleanTree(ast)).toEqual(cleanTree(correctAst.stmts![0].stmt));
  });

  it('should throw error for unsupported transaction statement kind', () => {
    const ast = {
      TransactionStmt: {
        kind: 'INVALID_KIND' as any,
        options: [] as any[],
        savepoint_name: undefined as string | undefined,
        gid: undefined as string | undefined,
        chain: false,
        location: -1
      }
    };
    
    expect(() => deparser.visit(ast, context)).toThrow('Unsupported TransactionStmt kind: INVALID_KIND');
  });
});
