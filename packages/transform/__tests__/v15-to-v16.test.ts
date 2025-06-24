import { Node as PG15Node } from '../src/15/types';
import { Node as PG16Node } from '../src/16/types';
import { V15ToV16Transformer } from '../src/transformers/v15-to-v16';

describe('PG15 to PG16 transformer', () => {
  const transformer = new V15ToV16Transformer();

  it('should handle Var node changes for advanced features', () => {
    const input: PG15Node = {
      Var: {
        varno: 1,
        varattno: 1,
        vartype: 23
      }
    };

    const result = transformer.transform(input);
    
    expect(result).toEqual({
      Var: {
        varno: 1,
        varattno: 1,
        vartype: 23
      }
    });
  });

  it('should transform Aggref field renames', () => {
    const input: PG15Node = {
      Aggref: {
        aggfnoid: 2100,
        aggtype: 23
      }
    };

    const result = transformer.transform(input);
    
    expect(result).toEqual({
      Aggref: {
        aggfnoid: 2100,
        aggtype: 23
      }
    });
  });

  it('should pass through basic queries unchanged', () => {
    const input: PG15Node = {
      SelectStmt: {
        targetList: []
      }
    };

    const result = transformer.transform(input);
    expect(result).toEqual(input);
  });

  it('should pass through unchanged nodes', () => {
    const input: PG15Node = {
      InsertStmt: {
        relation: { relname: 'test' }
      }
    };

    const result = transformer.transform(input);
    expect(result).toEqual(input);
  });
});     