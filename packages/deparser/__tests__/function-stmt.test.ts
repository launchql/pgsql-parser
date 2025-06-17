import { Deparser } from '../src/deparser';
import { DeparserContext } from '../src/visitors/base';

describe('Function Statement Deparsers', () => {
  const deparser = new Deparser([]);
  const context: DeparserContext = {};

  describe('CreateFunctionStmt', () => {
    it('should deparse CREATE FUNCTION statement', () => {
      const ast = {
        CreateFunctionStmt: {
          is_procedure: false,
          replace: false,
          funcname: [
            { String: { sval: 'calculate_total' } }
          ],
          parameters: [
            {
              FunctionParameter: {
                name: 'amount',
                argType: {
                  names: [{ String: { sval: 'numeric' } }],
                  typemod: -1
                },
                mode: 'FUNC_PARAM_IN' as any,
                defexpr: null as any
              }
            }
          ],
          returnType: {
            names: [{ String: { sval: 'numeric' } }],
            typemod: -1
          },
          options: [] as any[],
          sql_body: null as any
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE FUNCTION calculate_total ( IN amount numeric ) RETURNS numeric');
    });

    it('should deparse CREATE OR REPLACE FUNCTION statement', () => {
      const ast = {
        CreateFunctionStmt: {
          is_procedure: false,
          replace: true,
          funcname: [
            { String: { sval: 'get_user_name' } }
          ],
          parameters: [
            {
              FunctionParameter: {
                name: 'user_id',
                argType: {
                  names: [{ String: { sval: 'integer' } }],
                  typemod: -1
                },
                mode: 'FUNC_PARAM_IN' as any,
                defexpr: null as any
              }
            }
          ],
          returnType: {
            names: [{ String: { sval: 'text' } }],
            typemod: -1
          },
          options: [] as any[],
          sql_body: null as any
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE OR REPLACE FUNCTION get_user_name ( IN user_id integer ) RETURNS text');
    });

    it('should deparse CREATE PROCEDURE statement', () => {
      const ast = {
        CreateFunctionStmt: {
          is_procedure: true,
          replace: false,
          funcname: [
            { String: { sval: 'update_user_status' } }
          ],
          parameters: [
            {
              FunctionParameter: {
                name: 'user_id',
                argType: {
                  names: [{ String: { sval: 'integer' } }],
                  typemod: -1
                },
                mode: 'FUNC_PARAM_IN' as any,
                defexpr: null as any
              }
            },
            {
              FunctionParameter: {
                name: 'status',
                argType: {
                  names: [{ String: { sval: 'text' } }],
                  typemod: -1
                },
                mode: 'FUNC_PARAM_IN' as any,
                defexpr: null as any
              }
            }
          ],
          returnType: null as any,
          options: [] as any[],
          sql_body: null as any
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE PROCEDURE update_user_status ( IN user_id integer , IN status text )');
    });

    it('should deparse function with schema-qualified name', () => {
      const ast = {
        CreateFunctionStmt: {
          is_procedure: false,
          replace: false,
          funcname: [
            { String: { sval: 'public' } },
            { String: { sval: 'calculate_tax' } }
          ],
          parameters: [
            {
              FunctionParameter: {
                name: 'amount',
                argType: {
                  names: [{ String: { sval: 'numeric' } }],
                  typemod: -1
                },
                mode: 'FUNC_PARAM_IN' as any,
                defexpr: null as any
              }
            }
          ],
          returnType: {
            names: [{ String: { sval: 'numeric' } }],
            typemod: -1
          },
          options: [] as any[],
          sql_body: null as any
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE FUNCTION public.calculate_tax ( IN amount numeric ) RETURNS numeric');
    });

    it('should deparse function with OUT parameters', () => {
      const ast = {
        CreateFunctionStmt: {
          is_procedure: false,
          replace: false,
          funcname: [
            { String: { sval: 'get_user_info' } }
          ],
          parameters: [
            {
              FunctionParameter: {
                name: 'user_id',
                argType: {
                  names: [{ String: { sval: 'integer' } }],
                  typemod: -1
                },
                mode: 'FUNC_PARAM_IN' as any,
                defexpr: null as any
              }
            },
            {
              FunctionParameter: {
                name: 'user_name',
                argType: {
                  names: [{ String: { sval: 'text' } }],
                  typemod: -1
                },
                mode: 'FUNC_PARAM_OUT' as any,
                defexpr: null as any
              }
            },
            {
              FunctionParameter: {
                name: 'user_email',
                argType: {
                  names: [{ String: { sval: 'text' } }],
                  typemod: -1
                },
                mode: 'FUNC_PARAM_OUT' as any,
                defexpr: null as any
              }
            }
          ],
          returnType: null as any,
          options: [] as any[],
          sql_body: null as any
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE FUNCTION get_user_info ( IN user_id integer , OUT user_name text , OUT user_email text )');
    });

    it('should deparse function with VARIADIC parameter', () => {
      const ast = {
        CreateFunctionStmt: {
          is_procedure: false,
          replace: false,
          funcname: [
            { String: { sval: 'sum_values' } }
          ],
          parameters: [
            {
              FunctionParameter: {
                name: 'values',
                argType: {
                  names: [{ String: { sval: 'numeric' } }],
                  typemod: -1,
                  arrayBounds: [{}] as any[],
                  location: -1
                },
                mode: 'FUNC_PARAM_VARIADIC' as any,
                defexpr: null as any
              }
            }
          ],
          returnType: {
            names: [{ String: { sval: 'numeric' } }],
            typemod: -1
          },
          options: [] as any[],
          sql_body: null as any
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE FUNCTION sum_values ( VARIADIC values numeric[] ) RETURNS numeric');
    });

    it('should deparse function with default parameter value', () => {
      const ast = {
        CreateFunctionStmt: {
          is_procedure: false,
          replace: false,
          funcname: [
            { String: { sval: 'calculate_discount' } }
          ],
          parameters: [
            {
              FunctionParameter: {
                name: 'amount',
                argType: {
                  names: [{ String: { sval: 'numeric' } }],
                  typemod: -1
                },
                mode: 'FUNC_PARAM_IN' as any,
                defexpr: null as any
              }
            },
            {
              FunctionParameter: {
                name: 'rate',
                argType: {
                  names: [{ String: { sval: 'numeric' } }],
                  typemod: -1
                },
                mode: 'FUNC_PARAM_IN' as any,
                defexpr: {
                  A_Const: {
                    isnull: false,
                    val: {
                      Float: { fval: '0.1' }
                    },
                    location: -1
                  }
                }
              }
            }
          ],
          returnType: {
            names: [{ String: { sval: 'numeric' } }],
            typemod: -1
          },
          options: [] as any[],
          sql_body: null as any
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE FUNCTION calculate_discount ( IN amount numeric , IN rate numeric DEFAULT 0.1 ) RETURNS numeric');
    });

    it('should deparse function without parameters', () => {
      const ast = {
        CreateFunctionStmt: {
          is_procedure: false,
          replace: false,
          funcname: [
            { String: { sval: 'get_current_timestamp' } }
          ],
          parameters: [] as any[],
          returnType: {
            names: [{ String: { sval: 'timestamp' } }],
            typemod: -1
          },
          options: [] as any[],
          sql_body: null as any
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE FUNCTION get_current_timestamp ( ) RETURNS timestamp');
    });
  });

  describe('FunctionParameter', () => {
    it('should deparse IN parameter', () => {
      const ast = {
        FunctionParameter: {
          name: 'user_id',
          argType: {
            names: [{ String: { sval: 'integer' } }],
            typemod: -1,
            arrayBounds: null as any,
            location: -1
          },
          mode: 'FUNC_PARAM_IN',
          defexpr: null as any
        }
      };
      
      expect(deparser.visit(ast as any, context)).toBe('IN user_id integer');
    });

    it('should deparse OUT parameter', () => {
      const ast = {
        FunctionParameter: {
          name: 'result',
          argType: {
            names: [{ String: { sval: 'text' } }],
            typemod: -1,
            arrayBounds: null as any,
            location: -1
          },
          mode: 'FUNC_PARAM_OUT',
          defexpr: null as any
        }
      };
      
      expect(deparser.visit(ast as any, context)).toBe('OUT result text');
    });

    it('should deparse INOUT parameter', () => {
      const ast = {
        FunctionParameter: {
          name: 'counter',
          argType: {
            names: [{ String: { sval: 'integer' } }],
            typemod: -1,
            arrayBounds: null as any,
            location: -1
          },
          mode: 'FUNC_PARAM_INOUT',
          defexpr: null as any
        }
      };
      
      expect(deparser.visit(ast as any, context)).toBe('INOUT counter integer');
    });

    it('should deparse VARIADIC parameter', () => {
      const ast = {
        FunctionParameter: {
          name: 'values',
          argType: {
            names: [{ String: { sval: 'text' } }],
            typemod: -1,
            arrayBounds: [{}] as any[],
            location: -1
          },
          mode: 'FUNC_PARAM_VARIADIC',
          defexpr: null as any
        }
      };
      
      expect(deparser.visit(ast as any, context)).toBe('VARIADIC values text[]');
    });

    it('should deparse parameter with default value', () => {
      const ast = {
        FunctionParameter: {
          name: 'limit_count',
          argType: {
            names: [{ String: { sval: 'integer' } }],
            typemod: -1,
            arrayBounds: null as any,
            location: -1
          },
          mode: 'FUNC_PARAM_IN',
          defexpr: {
            A_Const: {
              isnull: false,
              val: {
                Integer: { ival: 10 }
              },
              location: -1
            }
          }
        }
      };
      
      expect(deparser.visit(ast as any, context)).toBe('IN limit_count integer DEFAULT 10');
    });
  });
});
