import { Node as PG13Node } from '../src/13/types';
import { Node as PG14Node } from '../src/14/types';
import { V13ToV14Transformer } from '../src/transformers/v13-to-v14';

describe('PG13 to PG14 transformer', () => {
  const transformer = new V13ToV14Transformer();

  it('should pass through AlterTableStmt unchanged', () => {
    const input: PG13Node = {
      AlterTableStmt: {
        relation: { relname: 'test_table' },
        objtype: 'OBJECT_TABLE',
        cmds: []
      }
    };

    const result = transformer.transform(input);
    
    expect(result).toEqual({
      AlterTableStmt: {
        relation: { relname: 'test_table' },
        objtype: 'OBJECT_TABLE',
        cmds: []
      }
    });
  });

  it('should pass through CreateTableAsStmt unchanged', () => {
    const input: PG13Node = {
      CreateTableAsStmt: {
        query: { SelectStmt: {} },
        objtype: 'OBJECT_TABLE'
      }
    };

    const result = transformer.transform(input);
    
    expect(result).toEqual({
      CreateTableAsStmt: {
        query: { SelectStmt: {} },
        objtype: 'OBJECT_TABLE'
      }
    });
  });

  it('should pass through unchanged nodes', () => {
    const input: PG13Node = {
      SelectStmt: {
        targetList: []
      }
    };

    const result = transformer.transform(input);
    expect(result).toEqual(input);
  });
});     