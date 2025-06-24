import { Node as PG16Node } from '../src/16/types';
import { Node as PG17Node } from '../src/17/types';
import { V16ToV17Transformer } from '../src/transformers/v16-to-v17';

describe('PG16 to PG17 transformer', () => {
  const transformer = new V16ToV17Transformer();

  it('should pass through all nodes unchanged', () => {
    const input: PG16Node = {
      SelectStmt: {
        targetList: [
          {
            ResTarget: {
              val: { A_Const: { sval: { sval: 'test' } } }
            }
          }
        ]
      }
    };

    const result = transformer.transform(input);
    expect(result).toEqual(input);
  });

  it('should maintain AST structure integrity', () => {
    const input: PG16Node = {
      InsertStmt: {
        relation: { relname: 'users' },
        selectStmt: {
          SelectStmt: {
            targetList: []
          }
        }
      }
    };

    const result = transformer.transform(input);
    expect(result).toEqual(input);
  });

  it('should handle complex queries without modification', () => {
    const input: PG16Node = {
      SelectStmt: {
        targetList: [],
        fromClause: [
          {
            JoinExpr: {
              jointype: 'JOIN_INNER',
              larg: { RangeVar: { relname: 'table1' } },
              rarg: { RangeVar: { relname: 'table2' } }
            }
          }
        ]
      }
    };

    const result = transformer.transform(input);
    expect(result).toEqual(input);
  });
});         