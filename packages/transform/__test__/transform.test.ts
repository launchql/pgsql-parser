import { transformPG13ToPG17 } from '../src/index';
import { Node as PG13Node } from '../src/13/types';
import { Node as PG17Node } from '../src/17/types';

const describe = (name: string, fn: () => void) => {
  console.log(`\n=== ${name} ===`);
  fn();
};

const test = (name: string, fn: () => void) => {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.log(`✗ ${name}: ${error}`);
  }
};

const expect = (actual: any) => ({
  toEqual: (expected: any) => {
    const actualStr = JSON.stringify(actual, null, 2);
    const expectedStr = JSON.stringify(expected, null, 2);
    if (actualStr !== expectedStr) {
      throw new Error(`Expected ${expectedStr} but got ${actualStr}`);
    }
  },
  toBe: (expected: any) => {
    if (actual !== expected) {
      throw new Error(`Expected ${expected} but got ${actual}`);
    }
  },
  toBeUndefined: () => {
    if (actual !== undefined) {
      throw new Error(`Expected undefined but got ${actual}`);
    }
  },
  toHaveLength: (length: number) => {
    if (!actual || actual.length !== length) {
      throw new Error(`Expected length ${length} but got ${actual?.length}`);
    }
  }
});

describe('PG13 to PG17 transformer', () => {
  test('transforms basic string node', () => {
    const pg13Node: PG13Node = {
      String: { sval: 'test' }
    };
    const result = transformPG13ToPG17(pg13Node);
    expect(result).toEqual({ String: { sval: 'test' } });
  });

  test('transforms integer node', () => {
    const pg13Node: PG13Node = {
      Integer: { ival: 42 }
    };
    const result = transformPG13ToPG17(pg13Node);
    expect(result).toEqual({ Integer: { ival: 42 } });
  });

  test('transforms boolean node', () => {
    const pg13Node: PG13Node = {
      Boolean: { boolval: true }
    };
    const result = transformPG13ToPG17(pg13Node);
    expect(result).toEqual({ Boolean: { boolval: true } });
  });

  test('transforms A_Const with string value', () => {
    const pg13Node: PG13Node = {
      A_Const: {
        sval: { sval: 'hello' },
        location: 0
      }
    };
    const result = transformPG13ToPG17(pg13Node);
    expect(result).toEqual({
      A_Const: {
        ival: undefined,
        fval: undefined,
        boolval: undefined,
        sval: { sval: 'hello' },
        bsval: undefined,
        isnull: undefined,
        location: 0
      }
    });
  });

  test('transforms TableFunc with new PG17 fields', () => {
    const pg13Node: PG13Node = {
      TableFunc: {
        ns_uris: [],
        ns_names: [],
        docexpr: undefined,
        rowexpr: undefined,
        colnames: [],
        coltypes: [],
        coltypmods: [],
        colcollations: [],
        colexprs: [],
        coldefexprs: [],
        notnulls: [],
        ordinalitycol: 0,
        location: 0
      }
    };
    const result = transformPG13ToPG17(pg13Node) as { TableFunc: any };
    
    expect(result.TableFunc.functype).toBeUndefined();
    expect(result.TableFunc.colvalexprs).toBeUndefined();
    expect(result.TableFunc.passingvalexprs).toBeUndefined();
    expect(result.TableFunc.plan).toBeUndefined();
    expect(result.TableFunc.ns_uris).toEqual([]);
    expect(result.TableFunc.location).toBe(0);
  });

  test('transforms List with nested nodes', () => {
    const pg13Node: PG13Node = {
      List: {
        items: [
          { String: { sval: 'item1' } },
          { String: { sval: 'item2' } }
        ]
      }
    };
    const result = transformPG13ToPG17(pg13Node);
    expect(result).toEqual({
      List: {
        items: [
          { String: { sval: 'item1' } },
          { String: { sval: 'item2' } }
        ]
      }
    });
  });

  test('transforms RangeVar with alias', () => {
    const pg13Node: PG13Node = {
      RangeVar: {
        schemaname: 'public',
        relname: 'users',
        alias: {
          aliasname: 'u',
          colnames: []
        },
        location: 10
      }
    };
    const result = transformPG13ToPG17(pg13Node);
    expect(result).toEqual({
      RangeVar: {
        catalogname: undefined,
        schemaname: 'public',
        relname: 'users',
        inh: undefined,
        relpersistence: undefined,
        alias: {
          aliasname: 'u',
          colnames: []
        },
        location: 10
      }
    });
  });

  test('handles PG17-only node types by passing through', () => {
    const pg17OnlyNode = {
      WindowFuncRunCondition: {
        xpr: undefined,
        opno: 123,
        inputcollid: 456,
        wfunc_left: true,
        arg: undefined
      }
    };
    
    const result = transformPG13ToPG17(pg17OnlyNode as any);
    expect(result).toEqual(pg17OnlyNode);
  });

  test('transforms complex nested structure', () => {
    const pg13Node: PG13Node = {
      Query: {
        commandType: 'CMD_SELECT',
        querySource: 'QSRC_ORIGINAL',
        canSetTag: true,
        utilityStmt: undefined,
        resultRelation: 0,
        hasAggs: false,
        hasWindowFuncs: false,
        hasTargetSRFs: false,
        hasSubLinks: false,
        hasDistinctOn: false,
        hasRecursive: false,
        hasModifyingCTE: false,
        hasForUpdate: false,
        hasRowSecurity: false,
        isReturn: false,
        cteList: [],
        rtable: [
          {
            RangeVar: {
              relname: 'test_table',
              location: 0
            }
          }
        ],
        jointree: {
          fromlist: [],
          quals: undefined
        },
        targetList: [
          {
            ResTarget: {
              name: 'column1',
              val: { String: { sval: 'value1' } },
              location: 5
            }
          }
        ],
        stmt_location: 0,
        stmt_len: 25
      }
    };

    const result = transformPG13ToPG17(pg13Node);
    expect('Query' in result).toBe(true);
    if ('Query' in result) {
      expect(result.Query.commandType).toBe('CMD_SELECT');
      expect(result.Query.rtable).toHaveLength(1);
      expect(result.Query.targetList).toHaveLength(1);
    }
  });

  test('throws error for unknown node type', () => {
    const unknownNode = { UnknownType: { someField: 'value' } };
    try {
      transformPG13ToPG17(unknownNode as any);
      throw new Error('Expected function to throw');
    } catch (error: any) {
      if (!error.message.includes('Unknown node type')) {
        throw new Error(`Expected "Unknown node type" error but got: ${error.message}`);
      }
    }
  });
});

console.log('Running PG13 to PG17 transformer tests...');
