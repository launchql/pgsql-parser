import { Deparser } from '../../src/deparser';
import { OnCommitAction, ConstrType, A_Expr_Kind, CreateStmt } from '@pgsql/types';

describe('CREATE TABLE statements', () => {
  describe('basic CREATE TABLE', () => {
    it('should deparse simple CREATE TABLE', () => {
      const ast: { RawStmt: { stmt: { CreateStmt: CreateStmt } } } = {
        RawStmt: {
          stmt: {
            CreateStmt: {
              relation: {
                relname: 'users',
                inh: true,
                relpersistence: 'p'
              },
              tableElts: [
                {
                  ColumnDef: {
                    colname: 'id',
                    typeName: {
                      names: [{ String: { sval: 'int4' } }],
                      typemod: -1
                    }
                  }
                },
                {
                  ColumnDef: {
                    colname: 'name',
                    typeName: {
                      names: [{ String: { sval: 'text' } }],
                      typemod: -1
                    }
                  }
                }
              ],
              oncommit: "ONCOMMIT_NOOP" as OnCommitAction
            }
          }
        }
      };

      const result = Deparser.deparse(ast);
      expect(result).toBe('CREATE TABLE users (id int4, name text)');
    });

    it('should deparse CREATE TABLE IF NOT EXISTS', () => {
      const ast: { CreateStmt: CreateStmt } = {
        CreateStmt: {
          relation: {
            relname: 'products',
            inh: true,
            relpersistence: 'p'
          },
          tableElts: [
            {
              ColumnDef: {
                colname: 'product_id',
                typeName: {
                  names: [{ String: { sval: 'int4' } }],
                  typemod: -1
                }
              }
            }
          ],
          if_not_exists: true,
          oncommit: "ONCOMMIT_NOOP" as OnCommitAction
        }
      };

      const result = Deparser.deparse(ast);
      expect(result).toBe('CREATE TABLE IF NOT EXISTS products (product_id int4)');
    });

    it('should deparse CREATE TEMPORARY TABLE', () => {
      const ast: { CreateStmt: CreateStmt } = {
        CreateStmt: {
          relation: {
            relname: 'temp_data',
            inh: true,
            relpersistence: 't'
          },
          tableElts: [
            {
              ColumnDef: {
                colname: 'session_id',
                typeName: {
                  names: [{ String: { sval: 'text' } }],
                  typemod: -1
                }
              }
            }
          ],
          oncommit: "ONCOMMIT_NOOP" as OnCommitAction
        }
      };

      const result = Deparser.deparse(ast);
      expect(result).toBe('CREATE TEMPORARY TABLE temp_data (session_id text)');
    });

    it('should deparse CREATE TABLE with schema', () => {
      const ast: { CreateStmt: CreateStmt } = {
        CreateStmt: {
          relation: {
            relname: 'users',
            schemaname: 'public',
            inh: true,
            relpersistence: 'p'
          },
          tableElts: [
            {
              ColumnDef: {
                colname: 'id',
                typeName: {
                  names: [{ String: { sval: 'int4' } }],
                  typemod: -1
                }
              }
            }
          ],
          oncommit: "ONCOMMIT_NOOP" as OnCommitAction
        }
      };

      const result = Deparser.deparse(ast);
      expect(result).toBe('CREATE TABLE public.users (id int4)');
    });

    describe('CREATE TABLE with constraints', () => {
      it('should deparse CREATE TABLE with PRIMARY KEY', () => {
        const ast: { CreateStmt: CreateStmt } = {
          CreateStmt: {
            relation: {
              relname: 'orders',
              inh: true,
              relpersistence: 'p'
            },
            tableElts: [
              {
                ColumnDef: {
                  colname: 'order_id',
                  typeName: {
                    names: [{ String: { sval: 'int4' } }],
                    typemod: -1
                  },
                  constraints: [
                    {
                      Constraint: {
                        contype: "CONSTR_PRIMARY" as ConstrType,
                        location: 25
                      }
                    }
                  ]
                }
              }
            ],
            oncommit: "ONCOMMIT_NOOP" as OnCommitAction
          }
        };

        const result = Deparser.deparse(ast);
        expect(result).toBe('CREATE TABLE orders (order_id int4 PRIMARY KEY)');
      });

      it('should deparse CREATE TABLE with NOT NULL constraint', () => {
        const ast: { CreateStmt: CreateStmt } = {
          CreateStmt: {
            relation: {
              relname: 'customers',
              inh: true,
              relpersistence: 'p'
            },
            tableElts: [
              {
                ColumnDef: {
                  colname: 'email',
                  typeName: {
                    names: [{ String: { sval: 'text' } }],
                    typemod: -1
                  },
                  is_not_null: true
                }
              }
            ],
            oncommit: "ONCOMMIT_NOOP" as OnCommitAction
          }
        };

        const result = Deparser.deparse(ast);
        expect(result).toBe('CREATE TABLE customers (email text NOT NULL)');
      });

      it('should deparse CREATE TABLE with CHECK constraint', () => {
        const ast: { CreateStmt: CreateStmt } = {
          CreateStmt: {
            relation: {
              relname: 'products',
              inh: true,
              relpersistence: 'p'
            },
            tableElts: [
              {
                ColumnDef: {
                  colname: 'price',
                  typeName: {
                    names: [{ String: { sval: 'numeric' } }],
                    typemod: -1
                  },
                  constraints: [
                    {
                      Constraint: {
                        contype: "CONSTR_CHECK" as ConstrType,
                        raw_expr: {
                          A_Expr: {
                            kind: "AEXPR_OP" as A_Expr_Kind,
                            name: [{ String: { sval: '>' } }],
                            lexpr: {
                              ColumnRef: {
                                fields: [{ String: { sval: 'price' } }]
                              }
                            },
                            rexpr: {
                              A_Const: {
                                ival: {
                                  ival: 0
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  ]
                }
              }
            ],
            oncommit: "ONCOMMIT_NOOP" as OnCommitAction
          }
        };

        const result = Deparser.deparse(ast);
        expect(result).toBe('CREATE TABLE products (price numeric CHECK (price > 0))');
      });

      it('should deparse CREATE TABLE with UNIQUE constraint', () => {
        const ast: { CreateStmt: CreateStmt } = {
          CreateStmt: {
            relation: {
              relname: 'users',
              inh: true,
              relpersistence: 'p'
            },
            tableElts: [
              {
                ColumnDef: {
                  colname: 'username',
                  typeName: {
                    names: [{ String: { sval: 'text' } }],
                    typemod: -1
                  },
                  constraints: [
                    {
                      Constraint: {
                        contype: 'CONSTR_UNIQUE' as ConstrType
                      }
                    }
                  ]
                }
              }
            ],
            oncommit: "ONCOMMIT_NOOP" as OnCommitAction
          }
        };

        const result = Deparser.deparse(ast);
        expect(result).toBe('CREATE TABLE users (username text UNIQUE)');
      });
    });

    describe('CREATE TABLE with DEFAULT values', () => {
      it('should deparse CREATE TABLE with DEFAULT integer', () => {
        const ast: { CreateStmt: CreateStmt } = {
          CreateStmt: {
            relation: {
              relname: 'settings',
              inh: true,
              relpersistence: 'p'
            },
            tableElts: [
              {
                ColumnDef: {
                  colname: 'timeout',
                  typeName: {
                    names: [{ String: { sval: 'int4' } }],
                    typemod: -1
                  },
                  raw_default: {
                    A_Const: {
                      ival: {
                        ival: 30
                      }
                    }
                  }
                }
              }
            ],
            oncommit: "ONCOMMIT_NOOP" as OnCommitAction
          }
        };

        const result = Deparser.deparse(ast);
        expect(result).toBe('CREATE TABLE settings (timeout int4 DEFAULT 30)');
      });

      it('should deparse CREATE TABLE with DEFAULT string', () => {
        const ast: { CreateStmt: CreateStmt } = {
          CreateStmt: {
            relation: {
              relname: 'users',
              inh: true,
              relpersistence: 'p'
            },
            tableElts: [
              {
                ColumnDef: {
                  colname: 'status',
                  typeName: {
                    names: [{ String: { sval: 'text' } }],
                    typemod: -1
                  },
                  raw_default: {
                    A_Const: {
                      sval: {
                        sval: 'active'
                      }
                    }
                  }
                }
              }
            ],
            oncommit: "ONCOMMIT_NOOP" as OnCommitAction
          }
        };

        const result = Deparser.deparse(ast);
        expect(result).toBe('CREATE TABLE users (status text DEFAULT \'active\')');
      });

      it('should deparse CREATE TABLE with DEFAULT boolean', () => {
        const ast: { CreateStmt: CreateStmt } = {
          CreateStmt: {
            relation: {
              relname: 'features',
              inh: true,
              relpersistence: 'p'
            },
            tableElts: [
              {
                ColumnDef: {
                  colname: 'enabled',
                  typeName: {
                    names: [{ String: { sval: 'bool' } }],
                    typemod: -1
                  },
                  raw_default: {
                    A_Const: {
                      boolval: {
                        boolval: true
                      }
                    }
                  }
                }
              }
            ],
            oncommit: "ONCOMMIT_NOOP" as OnCommitAction
          }
        };

        const result = Deparser.deparse(ast);
        expect(result).toBe('CREATE TABLE features (enabled bool DEFAULT true)');
      });
    });

    describe('CREATE TABLE with various data types', () => {
      it('should deparse CREATE TABLE with multiple data types', () => {
        const ast: { CreateStmt: CreateStmt } = {
          CreateStmt: {
            relation: {
              relname: 'mixed_types',
              inh: true,
              relpersistence: 'p'
            },
            tableElts: [
              {
                ColumnDef: {
                  colname: 'id',
                  typeName: {
                    names: [{ String: { sval: 'int4' } }],
                    typemod: -1
                  }
                }
              },
              {
                ColumnDef: {
                  colname: 'name',
                  typeName: {
                    names: [{ String: { sval: 'varchar' } }],
                    typemod: 104
                  }
                }
              },
              {
                ColumnDef: {
                  colname: 'price',
                  typeName: {
                    names: [{ String: { sval: 'numeric' } }],
                    typemod: 655366
                  }
                }
              },
              {
                ColumnDef: {
                  colname: 'created_at',
                  typeName: {
                    names: [{ String: { sval: 'timestamp' } }],
                    typemod: -1
                  }
                }
              },
              {
                ColumnDef: {
                  colname: 'is_active',
                  typeName: {
                    names: [{ String: { sval: 'bool' } }],
                    typemod: -1
                  }
                }
              }
            ],
            oncommit: "ONCOMMIT_NOOP" as OnCommitAction
          }
        };

        const result = Deparser.deparse(ast);
        expect(result).toBe('CREATE TABLE mixed_types (id int4, name varchar(40), price numeric(10,2), created_at timestamp, is_active bool)');
      });
    });

    describe('CREATE TABLE with table-level constraints', () => {
      it('should deparse CREATE TABLE with table-level PRIMARY KEY', () => {
        const ast: { CreateStmt: CreateStmt } = {
          CreateStmt: {
            relation: {
              relname: 'composite_key',
              inh: true,
              relpersistence: 'p'
            },
            tableElts: [
              {
                ColumnDef: {
                  colname: 'user_id',
                  typeName: {
                    names: [{ String: { sval: 'int4' } }],
                    typemod: -1
                  }
                }
              },
              {
                ColumnDef: {
                  colname: 'role_id',
                  typeName: {
                    names: [{ String: { sval: 'int4' } }],
                    typemod: -1
                  }
                }
              },
              {
                Constraint: {
                  contype: "CONSTR_PRIMARY" as ConstrType,
                  keys: [{ String: { sval: 'user_id' } }, { String: { sval: 'role_id' } }]
                }
              }
            ],
            oncommit: "ONCOMMIT_NOOP" as OnCommitAction
          }
        };

        const result = Deparser.deparse(ast);
        expect(result).toBe('CREATE TABLE composite_key (user_id int4, role_id int4, PRIMARY KEY (user_id, role_id))');
      });

      it('should deparse CREATE TABLE with table-level CHECK constraint', () => {
        const ast: { CreateStmt: CreateStmt } = {
          CreateStmt: {
            relation: {
              relname: 'products',
              inh: true,
              relpersistence: 'p'
            },
            tableElts: [
              {
                ColumnDef: {
                  colname: 'price',
                  typeName: {
                    names: [{ String: { sval: 'numeric' } }],
                    typemod: -1
                  }
                }
              },
              {
                ColumnDef: {
                  colname: 'discounted_price',
                  typeName: {
                    names: [{ String: { sval: 'numeric' } }],
                    typemod: -1
                  }
                }
              },
              {
                Constraint: {
                  contype: "CONSTR_CHECK" as ConstrType,
                  raw_expr: {
                    A_Expr: {
                      kind: "AEXPR_OP" as A_Expr_Kind,
                      name: [{ String: { sval: '>' } }],
                      lexpr: {
                        ColumnRef: {
                          fields: [{ String: { sval: 'price' } }]
                        }
                      },
                      rexpr: {
                        ColumnRef: {
                          fields: [{ String: { sval: 'discounted_price' } }]
                        }
                      }
                    }
                  }
                }
              }
            ],
            oncommit: "ONCOMMIT_NOOP" as OnCommitAction
          }
        };

        const result = Deparser.deparse(ast);
        expect(result).toBe('CREATE TABLE products (price numeric, discounted_price numeric, CHECK (price > discounted_price))');
      });
    });
  });
});
