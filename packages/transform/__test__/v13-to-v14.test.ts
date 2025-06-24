import { Node as PG13Node } from '../src/13/types';
import { Node as PG14Node } from '../src/14/types';

describe('PG13 to PG14 transformer', () => {
  // TODO: Implement transformer tests
  // Key changes in v13 → v14:
  // - Field rename: relkind → objtype in AlterTableStmt, CreateTableAsStmt
  
  it('should transform AlterTableStmt relkind to objtype', () => {
    // Test implementation needed
  });

  it('should transform CreateTableAsStmt relkind to objtype', () => {
    // Test implementation needed
  });

  it('should pass through unchanged nodes', () => {
    // Test implementation needed
  });
}); 