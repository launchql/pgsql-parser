import { Deparser } from '../src/deparser';
describe('CREATE TABLE statements', () => {
  describe('basic CREATE TABLE', () => {
    it('should deparse simple CREATE TABLE', () => {
      const ast = {
        RawStmt: {
          stmt: {
            CreateStmt: {
              relation: {
                RangeVar: {
                  relname: 'users',
                  inh: true,
                  relpersistence: 'p'
                }
              },
              tableElts: [
                {
                  ColumnDef: {
                    colname: 'id',
                    typeName: {
                      TypeName: {
                        names: [
                          {
                            String: {
                              sval: 'int4'
                            }
                          }
                        ],
                        typemod: -1
                      }
                    },
                    is_local: true,
                    is_not_null: false
                  }
                },
                {
                  ColumnDef: {
                    colname: 'name',
                    typeName: {
                      TypeName: {
                        names: [
                          {
                            String: {
                              sval: 'text'
                            }
                          }
                        ],
                        typemod: -1
                      }
                    },
                    is_local: true,
                    is_not_null: false
                  }
                }
              ],
              oncommit: 'ONCOMMIT_NOOP'
            }
          },
          stmt_location: 0
        }
      };

      const result = Deparser.deparse(ast);
      expect(result).toContain('CREATE TABLE users');
      expect(result).toContain('id int4');
      expect(result).toContain('name text');
    });

    it('should deparse CREATE TABLE IF NOT EXISTS', () => {
      const ast = {
        RawStmt: {
          stmt: {
            CreateStmt: {
              relation: {
                RangeVar: {
                  relname: 'products',
                  inh: true,
                  relpersistence: 'p'
                }
              },
              tableElts: [
                {
                  ColumnDef: {
                    colname: 'product_id',
                    typeName: {
                      TypeName: {
                        names: [
                          {
                            String: {
                              sval: 'int4'
                            }
                          }
                        ],
                        typemod: -1
                      }
                    },
                    is_local: true,
                    is_not_null: false
                  }
                }
              ],
              if_not_exists: true,
              oncommit: 'ONCOMMIT_NOOP'
            }
          },
          stmt_location: 0
        }
      };

      const result = Deparser.deparse(ast);
      expect(result).toContain('CREATE TABLE IF NOT EXISTS products');
      expect(result).toContain('product_id int4');
    });

    it('should deparse CREATE TEMPORARY TABLE', () => {
      const ast = {
        RawStmt: {
          stmt: {
            CreateStmt: {
              relation: {
                RangeVar: {
                  relname: 'temp_data',
                  inh: true,
                  relpersistence: 't'
                }
              },
              tableElts: [
                {
                  ColumnDef: {
                    colname: 'session_id',
                    typeName: {
                      TypeName: {
                        names: [
                          {
                            String: {
                              sval: 'text'
                            }
                          }
                        ],
                        typemod: -1
                      }
                    },
                    is_local: true,
                    is_not_null: false
                  }
                }
              ],
              oncommit: 'ONCOMMIT_NOOP'
            }
          },
          stmt_location: 0
        }
      };

      const result = Deparser.deparse(ast);
      expect(result).toContain('CREATE');
      expect(result).toContain('TABLE temp_data');
      expect(result).toContain('session_id text');
    });
  });

  describe('CREATE TABLE with constraints', () => {
    it('should deparse CREATE TABLE with PRIMARY KEY', () => {
      const ast = {
        RawStmt: {
          stmt: {
            CreateStmt: {
              relation: {
                RangeVar: {
                  relname: 'orders',
                  inh: true,
                  relpersistence: 'p'
                }
              },
              tableElts: [
                {
                  ColumnDef: {
                    colname: 'order_id',
                    typeName: {
                      TypeName: {
                        names: [
                          {
                            String: {
                              sval: 'int4'
                            }
                          }
                        ],
                        typemod: -1
                      }
                    },
                    constraints: [
                      {
                        Constraint: {
                          contype: 'CONSTR_PRIMARY',
                          location: 25
                        }
                      }
                    ],
                    is_local: true,
                    is_not_null: false
                  }
                }
              ],
              oncommit: 'ONCOMMIT_NOOP'
            }
          },
          stmt_location: 0
        }
      };

      const result = Deparser.deparse(ast);
      expect(result).toContain('CREATE TABLE orders');
      expect(result).toContain('order_id int4');
      expect(result).toContain('PRIMARY KEY');
    });

    it('should deparse CREATE TABLE with NOT NULL constraint', () => {
      const ast = {
        RawStmt: {
          stmt: {
            CreateStmt: {
              relation: {
                RangeVar: {
                  relname: 'customers',
                  inh: true,
                  relpersistence: 'p'
                }
              },
              tableElts: [
                {
                  ColumnDef: {
                    colname: 'email',
                    typeName: {
                      TypeName: {
                        names: [
                          {
                            String: {
                              sval: 'text'
                            }
                          }
                        ],
                        typemod: -1
                      }
                    },
                    is_local: true,
                    is_not_null: true
                  }
                }
              ],
              oncommit: 'ONCOMMIT_NOOP'
            }
          },
          stmt_location: 0
        }
      };

      const result = Deparser.deparse(ast);
      expect(result).toContain('CREATE TABLE customers');
      expect(result).toContain('email text');
      expect(result).toContain('NOT NULL');
    });

    it('should deparse CREATE TABLE with CHECK constraint', () => {
      const ast = {
        RawStmt: {
          stmt: {
            CreateStmt: {
              relation: {
                RangeVar: {
                  relname: 'products',
                  inh: true,
                  relpersistence: 'p'
                }
              },
              tableElts: [
                {
                  ColumnDef: {
                    colname: 'price',
                    typeName: {
                      TypeName: {
                        names: [
                          {
                            String: {
                              sval: 'numeric'
                            }
                          }
                        ],
                        typemod: -1
                      }
                    },
                    constraints: [
                      {
                        Constraint: {
                          contype: 'CONSTR_CHECK',
                          raw_expr: {
                            A_Expr: {
                              kind: 'AEXPR_OP',
                              name: [
                                {
                                  String: {
                                    sval: '>'
                                  }
                                }
                              ],
                              lexpr: {
                                ColumnRef: {
                                  fields: [
                                    {
                                      String: {
                                        sval: 'price'
                                      }
                                    }
                                  ]
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
                          },
                          location: 30
                        }
                      }
                    ],
                    is_local: true,
                    is_not_null: false
                  }
                }
              ],
              oncommit: 'ONCOMMIT_NOOP'
            }
          },
          stmt_location: 0
        }
      };

      const result = Deparser.deparse(ast);
      expect(result).toContain('CREATE TABLE products');
      expect(result).toContain('price numeric');
      expect(result).toContain('CHECK');
      expect(result).toContain('price > 0');
    });

    it('should deparse CREATE TABLE with UNIQUE constraint', () => {
      const ast = {
        RawStmt: {
          stmt: {
            CreateStmt: {
              relation: {
                RangeVar: {
                  relname: 'users',
                  inh: true,
                  relpersistence: 'p'
                }
              },
              tableElts: [
                {
                  ColumnDef: {
                    colname: 'username',
                    typeName: {
                      TypeName: {
                        names: [
                          {
                            String: {
                              sval: 'text'
                            }
                          }
                        ],
                        typemod: -1
                      }
                    },
                    constraints: [
                      {
                        Constraint: {
                          contype: 'CONSTR_UNIQUE',
                          location: 25
                        }
                      }
                    ],
                    is_local: true,
                    is_not_null: false
                  }
                }
              ],
              oncommit: 'ONCOMMIT_NOOP'
            }
          },
          stmt_location: 0
        }
      };

      const result = Deparser.deparse(ast);
      expect(result).toContain('CREATE TABLE users');
      expect(result).toContain('username text');
      expect(result).toContain('UNIQUE');
    });
  });

  describe('CREATE TABLE with DEFAULT values', () => {
    it('should deparse CREATE TABLE with DEFAULT integer', () => {
      const ast = {
        RawStmt: {
          stmt: {
            CreateStmt: {
              relation: {
                RangeVar: {
                  relname: 'settings',
                  inh: true,
                  relpersistence: 'p'
                }
              },
              tableElts: [
                {
                  ColumnDef: {
                    colname: 'timeout',
                    typeName: {
                      TypeName: {
                        names: [
                          {
                            String: {
                              sval: 'int4'
                            }
                          }
                        ],
                        typemod: -1
                      }
                    },
                    raw_default: {
                      A_Const: {
                        ival: {
                          ival: 30
                        }
                      }
                    },
                    is_local: true,
                    is_not_null: false
                  }
                }
              ],
              oncommit: 'ONCOMMIT_NOOP'
            }
          },
          stmt_location: 0
        }
      };

      const result = Deparser.deparse(ast);
      expect(result).toContain('CREATE TABLE settings');
      expect(result).toContain('timeout int4');
      expect(result).toContain('DEFAULT 30');
    });

    it('should deparse CREATE TABLE with DEFAULT string', () => {
      const ast = {
        RawStmt: {
          stmt: {
            CreateStmt: {
              relation: {
                RangeVar: {
                  relname: 'users',
                  inh: true,
                  relpersistence: 'p'
                }
              },
              tableElts: [
                {
                  ColumnDef: {
                    colname: 'status',
                    typeName: {
                      TypeName: {
                        names: [
                          {
                            String: {
                              sval: 'text'
                            }
                          }
                        ],
                        typemod: -1
                      }
                    },
                    raw_default: {
                      A_Const: {
                        sval: {
                          sval: 'active'
                        }
                      }
                    },
                    is_local: true,
                    is_not_null: false
                  }
                }
              ],
              oncommit: 'ONCOMMIT_NOOP'
            }
          },
          stmt_location: 0
        }
      };

      const result = Deparser.deparse(ast);
      expect(result).toContain('CREATE TABLE users');
      expect(result).toContain('status text');
      expect(result).toContain('DEFAULT \'active\'');
    });

    it('should deparse CREATE TABLE with DEFAULT boolean', () => {
      const ast = {
        RawStmt: {
          stmt: {
            CreateStmt: {
              relation: {
                RangeVar: {
                  relname: 'features',
                  inh: true,
                  relpersistence: 'p'
                }
              },
              tableElts: [
                {
                  ColumnDef: {
                    colname: 'enabled',
                    typeName: {
                      TypeName: {
                        names: [
                          {
                            String: {
                              sval: 'bool'
                            }
                          }
                        ],
                        typemod: -1
                      }
                    },
                    raw_default: {
                      A_Const: {
                        boolval: {
                          boolval: true
                        }
                      }
                    },
                    is_local: true,
                    is_not_null: false
                  }
                }
              ],
              oncommit: 'ONCOMMIT_NOOP'
            }
          },
          stmt_location: 0
        }
      };

      const result = Deparser.deparse(ast);
      expect(result).toContain('CREATE TABLE features');
      expect(result).toContain('enabled bool');
      expect(result).toContain('DEFAULT true');
    });
  });

  describe('CREATE TABLE with various data types', () => {
    it('should deparse CREATE TABLE with multiple data types', () => {
      const ast = {
        RawStmt: {
          stmt: {
            CreateStmt: {
              relation: {
                RangeVar: {
                  relname: 'mixed_types',
                  inh: true,
                  relpersistence: 'p'
                }
              },
              tableElts: [
                {
                  ColumnDef: {
                    colname: 'id',
                    typeName: {
                      TypeName: {
                        names: [
                          {
                            String: {
                              sval: 'int4'
                            }
                          }
                        ],
                        typemod: -1
                      }
                    },
                    is_local: true,
                    is_not_null: false
                  }
                },
                {
                  ColumnDef: {
                    colname: 'name',
                    typeName: {
                      TypeName: {
                        names: [
                          {
                            String: {
                              sval: 'varchar'
                            }
                          }
                        ],
                        typemod: 104
                      }
                    },
                    is_local: true,
                    is_not_null: false
                  }
                },
                {
                  ColumnDef: {
                    colname: 'price',
                    typeName: {
                      TypeName: {
                        names: [
                          {
                            String: {
                              sval: 'numeric'
                            }
                          }
                        ],
                        typemod: 655366
                      }
                    },
                    is_local: true,
                    is_not_null: false
                  }
                },
                {
                  ColumnDef: {
                    colname: 'created_at',
                    typeName: {
                      TypeName: {
                        names: [
                          {
                            String: {
                              sval: 'timestamp'
                            }
                          }
                        ],
                        typemod: -1
                      }
                    },
                    is_local: true,
                    is_not_null: false
                  }
                },
                {
                  ColumnDef: {
                    colname: 'is_active',
                    typeName: {
                      TypeName: {
                        names: [
                          {
                            String: {
                              sval: 'bool'
                            }
                          }
                        ],
                        typemod: -1
                      }
                    },
                    is_local: true,
                    is_not_null: false
                  }
                }
              ],
              oncommit: 'ONCOMMIT_NOOP'
            }
          },
          stmt_location: 0
        }
      };

      const result = Deparser.deparse(ast);
      expect(result).toContain('CREATE TABLE mixed_types');
      expect(result).toContain('id int4');
      expect(result).toContain('name varchar');
      expect(result).toContain('price numeric');
      expect(result).toContain('created_at timestamp');
      expect(result).toContain('is_active bool');
    });
  });

  describe('CREATE TABLE with table-level constraints', () => {
    it('should deparse CREATE TABLE with table-level PRIMARY KEY', () => {
      const ast = {
        RawStmt: {
          stmt: {
            CreateStmt: {
              relation: {
                RangeVar: {
                  relname: 'composite_key',
                  inh: true,
                  relpersistence: 'p'
                }
              },
              tableElts: [
                {
                  ColumnDef: {
                    colname: 'user_id',
                    typeName: {
                      TypeName: {
                        names: [
                          {
                            String: {
                              sval: 'int4'
                            }
                          }
                        ],
                        typemod: -1
                      }
                    },
                    is_local: true,
                    is_not_null: false
                  }
                },
                {
                  ColumnDef: {
                    colname: 'role_id',
                    typeName: {
                      TypeName: {
                        names: [
                          {
                            String: {
                              sval: 'int4'
                            }
                          }
                        ],
                        typemod: -1
                      }
                    },
                    is_local: true,
                    is_not_null: false
                  }
                },
                {
                  Constraint: {
                    contype: 'CONSTR_PRIMARY',
                    keys: [
                      {
                        String: {
                          sval: 'user_id'
                        }
                      },
                      {
                        String: {
                          sval: 'role_id'
                        }
                      }
                    ],
                    location: 50
                  }
                }
              ],
              oncommit: 'ONCOMMIT_NOOP'
            }
          },
          stmt_location: 0
        }
      };

      const result = Deparser.deparse(ast);
      expect(result).toContain('CREATE TABLE composite_key');
      expect(result).toContain('user_id int4');
      expect(result).toContain('role_id int4');
      expect(result).toContain('PRIMARY KEY');
    });

    it('should deparse CREATE TABLE with table-level CHECK constraint', () => {
      const ast = {
        RawStmt: {
          stmt: {
            CreateStmt: {
              relation: {
                RangeVar: {
                  relname: 'products',
                  inh: true,
                  relpersistence: 'p'
                }
              },
              tableElts: [
                {
                  ColumnDef: {
                    colname: 'price',
                    typeName: {
                      TypeName: {
                        names: [
                          {
                            String: {
                              sval: 'numeric'
                            }
                          }
                        ],
                        typemod: -1
                      }
                    },
                    is_local: true,
                    is_not_null: false
                  }
                },
                {
                  ColumnDef: {
                    colname: 'discounted_price',
                    typeName: {
                      TypeName: {
                        names: [
                          {
                            String: {
                              sval: 'numeric'
                            }
                          }
                        ],
                        typemod: -1
                      }
                    },
                    is_local: true,
                    is_not_null: false
                  }
                },
                {
                  Constraint: {
                    contype: 'CONSTR_CHECK',
                    raw_expr: {
                      A_Expr: {
                        kind: 'AEXPR_OP',
                        name: [
                          {
                            String: {
                              sval: '>'
                            }
                          }
                        ],
                        lexpr: {
                          ColumnRef: {
                            fields: [
                              {
                                String: {
                                  sval: 'price'
                                }
                              }
                            ]
                          }
                        },
                        rexpr: {
                          ColumnRef: {
                            fields: [
                              {
                                String: {
                                  sval: 'discounted_price'
                                }
                              }
                            ]
                          }
                        }
                      }
                    },
                    location: 80
                  }
                }
              ],
              oncommit: 'ONCOMMIT_NOOP'
            }
          },
          stmt_location: 0
        }
      };

      const result = Deparser.deparse(ast);
      expect(result).toContain('CREATE TABLE products');
      expect(result).toContain('price numeric');
      expect(result).toContain('discounted_price numeric');
      expect(result).toContain('CHECK');
      expect(result).toContain('price > discounted_price');
    });
  });
});
