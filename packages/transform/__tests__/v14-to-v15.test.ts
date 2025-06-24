import { Node as PG14Node } from '../src/14/types';
import { Node as PG15Node } from '../src/15/types';
import { V14ToV15Transformer } from '../src/transformers/v14-to-v15';

describe('PG14 to PG15 transformer', () => {
  const transformer = new V14ToV15Transformer();

  it('should transform A_Const structure from nested val to direct fields', () => {
    const input: PG14Node = {
      A_Const: {
        val: {
          String: { str: 'hello' }
        },
        location: 0
      }
    };

    const result = transformer.transform(input);
    
    expect(result).toEqual({
      A_Const: {
        sval: { sval: 'hello' },
        location: 0
      }
    });
  });

  it('should transform String field from str to sval', () => {
    const input: PG14Node = {
      String: { str: 'test' }
    };

    const result = transformer.transform(input);
    
    expect(result).toEqual({
      String: { sval: 'test' }
    });
  });

  it('should transform BitString field from str to bsval', () => {
    const input: PG14Node = {
      BitString: { str: '101010' }
    };

    const result = transformer.transform(input);
    
    expect(result).toEqual({
      BitString: { bsval: '101010' }
    });
  });

  it('should transform Float field from str to fval', () => {
    const input: PG14Node = {
      Float: { str: '3.14' }
    };

    const result = transformer.transform(input);
    
    expect(result).toEqual({
      Float: { fval: '3.14' }
    });
  });

  it('should transform AlterPublicationStmt fields', () => {
    const input: PG14Node = {
      AlterPublicationStmt: {
        pubname: 'test_pub',
        tables: [{ RangeVar: { relname: 'test' } }],
        tableAction: 'DEFELEM_ADD'
      }
    };

    const result = transformer.transform(input);
    
    expect(result).toEqual({
      AlterPublicationStmt: {
        pubname: 'test_pub',
        pubobjects: [{ RangeVar: { relname: 'test' } }],
        action: 'DEFELEM_ADD'
      }
    });
  });

  it('should pass through unchanged nodes', () => {
    const input: PG14Node = {
      SelectStmt: {
        targetList: []
      }
    };

    const result = transformer.transform(input);
    expect(result).toEqual(input);
  });
});       