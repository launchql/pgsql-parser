import { Deparser } from '../../src/deparser';
import { A_Expr_Kind, LimitOption, SetOperation, CoercionForm } from '@pgsql/types';

describe('Deparser', () => {
  describe('basic SQL statements', () => {
    it('should deparse SELECT 1', () => {
      const ast = {
        RawStmt: {
          stmt: {
            SelectStmt: {
              targetList: [
                {
                  ResTarget: {
                    val: {
                      A_Const: {
                        ival: {
                          ival: 1
                        },
                        location: 7
                      }
                    },
                    location: 7
                  }
                }
              ],
              limitOption: "LIMIT_OPTION_DEFAULT" as LimitOption,
              op: "SETOP_NONE" as SetOperation
            }
          },
          stmt_location: 0
        }
      };

      const result = Deparser.deparse(ast);
      expect(result).toBe('SELECT 1');
    });

    it('should deparse SELECT with WHERE clause', () => {
      const ast = {
        RawStmt: {
          stmt: {
            SelectStmt: {
              targetList: [
                {
                  ResTarget: {
                    val: {
                      ColumnRef: {
                        fields: [
                          {
                            A_Star: {}
                          }
                        ],
                        location: 7
                      }
                    },
                    location: 7
                  }
                }
              ],
              fromClause: [
                {
                  RangeVar: {
                    relname: "users",
                    inh: true,
                    relpersistence: "p",
                    location: 14
                  }
                }
              ],
              whereClause: {
                A_Expr: {
                  kind: "AEXPR_OP" as A_Expr_Kind,
                  name: [
                    {
                      String: {
                        sval: "="
                      }
                    }
                  ],
                  lexpr: {
                    ColumnRef: {
                      fields: [
                        {
                          String: {
                            sval: "name"
                          }
                        }
                      ],
                      location: 26
                    }
                  },
                  rexpr: {
                    A_Const: {
                      sval: {
                        sval: "Alice"
                      },
                      location: 33
                    }
                  },
                  location: 31
                }
              },
              limitOption: "LIMIT_OPTION_DEFAULT" as LimitOption,
              op: "SETOP_NONE" as SetOperation
            }
          },
          stmt_location: 0
        }
      };

      const result = Deparser.deparse(ast);
      expect(result).toContain('SELECT *');
      expect(result).toContain('FROM users');
      expect(result).toContain('WHERE name = \'Alice\'');
    });

    it('should deparse INSERT statement', () => {
      const ast = {
        RawStmt: {
          stmt: {
            InsertStmt: {
              relation: {
                relname: 'items',
                inh: true,
                relpersistence: 'p',
                location: -1
              },
              cols: [
                {
                  ResTarget: {
                    name: 'id',
                    location: 20
                  }
                },
                {
                  ResTarget: {
                    name: 'label',
                    location: 24
                  }
                }
              ],
              selectStmt: {
                SelectStmt: {
                  valuesLists: [
                    {
                      List: {
                        items: [
                          {
                            A_Const: {
                              ival: {
                                ival: 1
                              },
                              location: 35
                            }
                          },
                          {
                            A_Const: {
                              sval: {
                                sval: 'thing'
                              },
                              location: 38
                            }
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      };

      const result = Deparser.deparse(ast);
      expect(result).toContain('INSERT INTO items');
      expect(result).toContain('VALUES');
    });

    it('should deparse UPDATE statement', () => {
      const ast = {
        RawStmt: {
          stmt: {
            UpdateStmt: {
              relation: {
                relname: 'orders',
                inh: true,
                relpersistence: 'p',
                location: -1
              },
              targetList: [
                {
                  ResTarget: {
                    name: 'status',
                    val: {
                      A_Const: {
                        sval: {
                          sval: 'shipped'
                        },
                        location: 25
                      }
                    },
                    location: 15
                  }
                }
              ],
              whereClause: {
                A_Expr: {
                  kind: "AEXPR_OP" as A_Expr_Kind,
                  name: [
                    {
                      String: {
                        sval: '='
                      }
                    }
                  ],
                  lexpr: {
                    ColumnRef: {
                      fields: [
                        {
                          String: {
                            sval: 'id'
                          }
                        }
                      ]
                    }
                  },
                  rexpr: {
                    A_Const: {
                      ival: {
                        ival: 5
                      },
                      location: 45
                    }
                  }
                }
              }
            }
          }
        }
      };

      const result = Deparser.deparse(ast);
      expect(result).toContain('UPDATE orders');
      expect(result).toContain('SET');
      expect(result).toContain('WHERE id = 5');
    });

    it('should deparse DELETE statement', () => {
      const ast = {
        RawStmt: {
          stmt: {
            DeleteStmt: {
              relation: {
                relname: 'sessions',
                inh: true,
                relpersistence: 'p',
                location: -1
              },
              whereClause: {
                A_Expr: {
                  kind: "AEXPR_OP" as A_Expr_Kind,
                  name: [
                    {
                      String: {
                        sval: '='
                      }
                    }
                  ],
                  lexpr: {
                    ColumnRef: {
                      fields: [
                        {
                          String: {
                            sval: 'expired'
                          }
                        }
                      ]
                    }
                  },
                  rexpr: {
                    A_Const: {
                      boolval: {
                        boolval: true
                      },
                      location: 45
                    }
                  }
                }
              }
            }
          }
        }
      };

      const result = Deparser.deparse(ast);
      expect(result).toContain('DELETE FROM sessions');
      expect(result).toContain('WHERE expired = true');
    });
    it('should deparse JSON path query', () => {
      const ast = {
        RawStmt: {
          stmt: {
            SelectStmt: {
              targetList: [
                {
                  ResTarget: {
                    val: {
                      FuncCall: {
                        funcname: [{ String: { sval: 'jsonb_path_query' } }],
                        args: [
                          {
                            ColumnRef: {
                              fields: [{ String: { sval: 'doc' } }]
                            }
                          },
                          {
                            A_Const: {
                              sval: { sval: '$.store.book[*] ? (@.price < 10)' }
                            }
                          }
                        ]
                      }
                    }
                  }
                }
              ],
              fromClause: [
                {
                  RangeVar: {
                    relname: 'books'
                  }
                }
              ]
            }
          }
        }
      };

      const result = Deparser.deparse(ast);
      expect(result).toContain('SELECT jsonb_path_query(doc, \'$.store.book[*] ? (@.price < 10)\')');
    });

  });

});

