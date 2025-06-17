import { Deparser } from '../../src/deparser';
import { DeparserContext } from '../../src/visitors/base';
import { CoercionForm } from '@pgsql/types';

describe('Expression Statement Deparsers', () => {
  const deparser = new Deparser([]);
  const context: DeparserContext = {};

  describe('OpExpr', () => {
    it('should deparse binary operator expression', () => {
      const ast = {
        OpExpr: {
          opno: 96, // = operator
          args: [
            { Integer: { ival: 1 } },
            { Integer: { ival: 2 } }
          ],
          opfuncid: 65,
          opresulttype: 16,
          opretset: false,
          opcollid: 0,
          inputcollid: 0,
          location: -1
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('1 = 2');
    });

    it('should deparse unary operator expression', () => {
      const ast = {
        OpExpr: {
          opno: 484, // - operator
          args: [
            { Integer: { ival: 5 } }
          ],
          opfuncid: 65,
          opresulttype: 23,
          opretset: false,
          opcollid: 0,
          inputcollid: 0,
          location: -1
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('- 5');
    });
  });

  describe('DistinctExpr', () => {
    it('should deparse IS DISTINCT FROM expression', () => {
      const ast = {
        DistinctExpr: {
          opno: 96,
          args: [
            { String: { sval: 'value1' } },
            { String: { sval: 'value2' } }
          ],
          opfuncid: 65,
          opresulttype: 16,
          opretset: false,
          opcollid: 0,
          inputcollid: 0,
          location: -1
        }
      };
      
      expect(deparser.visit(ast, context)).toBe("'value1' IS DISTINCT FROM 'value2'");
    });
  });

  describe('NullIfExpr', () => {
    it('should deparse NULLIF expression', () => {
      const ast = {
        NullIfExpr: {
          opno: 96,
          args: [
            { String: { sval: 'test' } },
            { String: { sval: 'empty' } }
          ],
          opfuncid: 65,
          opresulttype: 25,
          opretset: false,
          opcollid: 0,
          inputcollid: 0,
          location: -1
        }
      };
      
      expect(deparser.visit(ast, context)).toBe("NULLIF('test', 'empty')");
    });
  });

  describe('ScalarArrayOpExpr', () => {
    it('should deparse scalar = ANY(array) expression', () => {
      const ast = {
        ScalarArrayOpExpr: {
          opno: 96, // = operator
          opfuncid: 65,
          useOr: true,
          inputcollid: 0,
          args: [
            { Integer: { ival: 1 } },
            {
              A_ArrayExpr: {
                elements: [
                  { Integer: { ival: 1 } },
                  { Integer: { ival: 2 } },
                  { Integer: { ival: 3 } }
                ],
                location: -1
              }
            }
          ],
          location: -1
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('1 = ANY(ARRAY[1, 2, 3])');
    });

    it('should deparse scalar = ALL(array) expression', () => {
      const ast = {
        ScalarArrayOpExpr: {
          opno: 96, // = operator
          opfuncid: 65,
          useOr: false,
          inputcollid: 0,
          args: [
            { Integer: { ival: 1 } },
            {
              A_ArrayExpr: {
                elements: [
                  { Integer: { ival: 1 } },
                  { Integer: { ival: 1 } }
                ],
                location: -1
              }
            }
          ],
          location: -1
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('1 = ALL(ARRAY[1, 1])');
    });
  });

  describe('Aggref', () => {
    it('should deparse COUNT(*) aggregate', () => {
      const ast = {
        Aggref: {
          aggfnoid: 2101, // count function
          aggtype: 20,
          aggcollid: 0,
          inputcollid: 0,
          aggtranstype: 20,
          aggargtypes: [] as any[],
          aggdirectargs: null as any,
          args: null as any,
          aggorder: null as any,
          aggdistinct: null as any,
          aggfilter: null as any,
          aggstar: true,
          aggvariadic: false,
          aggkind: 'n',
          agglevelsup: 0,
          aggsplit: 'AGGSPLIT_SIMPLE',
          aggno: -1,
          aggtransno: -1,
          location: -1
        }
      } as any;
      
      expect(deparser.visit(ast, context)).toBe('count(*)');
    });

    it('should deparse SUM(column) aggregate', () => {
      const ast = {
        Aggref: {
          aggfnoid: 2104, // sum function
          aggtype: 1700,
          aggcollid: 0,
          inputcollid: 0,
          aggtranstype: 17,
          aggargtypes: [23] as any[],
          aggdirectargs: null as any,
          args: [
            {
              ColumnRef: {
                fields: [{ String: { sval: 'amount' } }],
                location: -1
              }
            }
          ],
          aggorder: null as any,
          aggdistinct: null as any,
          aggfilter: null as any,
          aggstar: false,
          aggvariadic: false,
          aggkind: 'n',
          agglevelsup: 0,
          aggsplit: 'AGGSPLIT_SIMPLE',
          aggno: -1,
          aggtransno: -1,
          location: -1
        }
      } as any;
      
      expect(deparser.visit(ast, context)).toBe('sum(amount)');
    });

    it('should deparse COUNT(DISTINCT column) aggregate', () => {
      const ast = {
        Aggref: {
          aggfnoid: 2101, // count function
          aggtype: 20,
          aggcollid: 0,
          inputcollid: 0,
          aggtranstype: 20,
          aggargtypes: [25] as any[],
          aggdirectargs: null as any,
          args: [
            {
              ColumnRef: {
                fields: [{ String: { sval: 'user_id' } }],
                location: -1
              }
            }
          ],
          aggorder: null as any,
          aggdistinct: [
            {
              ColumnRef: {
                fields: [{ String: { sval: 'user_id' } }],
                location: -1
              }
            }
          ],
          aggfilter: null as any,
          aggstar: false,
          aggvariadic: false,
          aggkind: 'n',
          agglevelsup: 0,
          aggsplit: 'AGGSPLIT_SIMPLE',
          aggno: -1,
          aggtransno: -1,
          location: -1
        }
      } as any;
      
      expect(deparser.visit(ast, context)).toBe('count(DISTINCT user_id)');
    });
  });

  describe('WindowFunc', () => {
    it('should deparse ROW_NUMBER() OVER() window function', () => {
      const ast = {
        WindowFunc: {
          winfnoid: 3100, // row_number function
          wintype: 20,
          wincollid: 0,
          inputcollid: 0,
          args: null as any,
          aggfilter: null as any,
          winref: null as any,
          winstar: false,
          winagg: false,
          location: -1
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('row_number() OVER ()');
    });

    it('should deparse RANK() OVER(ORDER BY column) window function', () => {
      const ast = {
        WindowFunc: {
          winfnoid: 3101, // rank function
          wintype: 20,
          wincollid: 0,
          inputcollid: 0,
          args: null as any,
          aggfilter: null as any,
          winref: 1 as any,
          winstar: false,
          winagg: false,
          location: -1
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('rank() OVER (ORDER BY created_at ASC)');
    });
  });



  describe('Type Coercion Expressions', () => {
    it('should deparse RelabelType transparently', () => {
      const ast = {
        RelabelType: {
          arg: { String: { sval: 'test' } },
          resulttype: 25,
          resulttypmod: -1,
          resultcollid: 0,
          relabelformat: 'COERCE_IMPLICIT_CAST' as CoercionForm,
          location: -1
        }
      };
      
      expect(deparser.visit(ast, context)).toBe("'test'");
    });

    it('should deparse CoerceViaIO transparently', () => {
      const ast = {
        CoerceViaIO: {
          arg: { Integer: { ival: 42 } },
          resulttype: 25,
          resultcollid: 0,
          coerceformat: 'COERCE_EXPLICIT_CAST' as CoercionForm,
          location: -1
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('42');
    });

    it('should deparse ArrayCoerceExpr transparently', () => {
      const ast = {
        ArrayCoerceExpr: {
          arg: {
            A_ArrayExpr: {
              elements: [{ Integer: { ival: 1 } }, { Integer: { ival: 2 } }],
              location: -1
            }
          },
          elemexpr: null as any,
          resulttype: 1007,
          resulttypmod: -1,
          resultcollid: 0,
          coerceformat: 'COERCE_EXPLICIT_CAST' as CoercionForm,
          location: -1
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('ARRAY[1, 2]');
    });

    it('should deparse ConvertRowtypeExpr transparently', () => {
      const ast = {
        ConvertRowtypeExpr: {
          arg: {
            RowExpr: {
              args: [{ Integer: { ival: 1 } }, { String: { sval: 'test' } }],
              row_typeid: 2249,
              row_format: 'COERCE_EXPLICIT_CALL' as CoercionForm,
              colnames: null as any,
              location: -1
            }
          },
          resulttype: 2249,
          convertformat: 'COERCE_EXPLICIT_CAST' as CoercionForm,
          location: -1
        }
      };
      
      expect(deparser.visit(ast, context)).toBe("ROW(1, 'test')");
    });
  });
});
