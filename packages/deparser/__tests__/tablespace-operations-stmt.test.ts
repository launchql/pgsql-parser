import { Deparser } from '../src/deparser';
import { DeparserContext } from '../src/visitors/base';

describe('Tablespace Operations Statement Deparsers', () => {
  const deparser = new Deparser([]);
  const context: DeparserContext = {};

  describe('AlterTableMoveAllStmt', () => {
    it('should deparse ALTER TABLE ALL IN TABLESPACE statement for tables', () => {
      const ast = {
        AlterTableMoveAllStmt: {
          orig_tablespacename: 'old_tablespace',
          objtype: 'OBJECT_TABLE',
          roles: [] as any[],
          new_tablespacename: 'new_tablespace',
          nowait: false
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('ALTER TABLE ALL IN TABLESPACE old_tablespace SET TABLESPACE new_tablespace');
    });

    it('should deparse ALTER INDEX ALL IN TABLESPACE statement', () => {
      const ast = {
        AlterTableMoveAllStmt: {
          orig_tablespacename: 'old_space',
          objtype: 'OBJECT_INDEX',
          roles: [] as any[],
          new_tablespacename: 'new_space',
          nowait: false
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('ALTER INDEX ALL IN TABLESPACE old_space SET TABLESPACE new_space');
    });

    it('should deparse ALTER TABLE ALL IN TABLESPACE with NOWAIT', () => {
      const ast = {
        AlterTableMoveAllStmt: {
          orig_tablespacename: 'source_space',
          objtype: 'OBJECT_TABLE',
          roles: [] as any[],
          new_tablespacename: 'target_space',
          nowait: true
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('ALTER TABLE ALL IN TABLESPACE source_space SET TABLESPACE target_space NOWAIT');
    });

    it('should deparse ALTER TABLE ALL IN TABLESPACE without object type', () => {
      const ast = {
        AlterTableMoveAllStmt: {
          orig_tablespacename: 'old_ts',
          objtype: null as any,
          roles: [] as any[],
          new_tablespacename: 'new_ts',
          nowait: false
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('ALTER TABLE ALL IN TABLESPACE old_ts SET TABLESPACE new_ts');
    });
  });
});
