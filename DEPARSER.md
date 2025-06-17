# PostgreSQL Deparser for PG17: Architecture Analysis and Implementation Guide

## Executive Summary

This document provides a comprehensive analysis of the current PostgreSQL deparser implementation and outlines the approach for rebuilding it to support PostgreSQL 17 compatibility. The deparser is responsible for converting Abstract Syntax Trees (ASTs) back into SQL strings, enabling symmetric parsing and deparsing operations.

### Key Objectives
- Fix critical TypeName method signature error causing build failures
- Upgrade from PostgreSQL 13 to PostgreSQL 17 compatibility
- Improve node unwrapping and visitor pattern architecture
- Enhance test coverage and maintainability
- Provide comprehensive documentation for future development

### Current Status
- **Build Status**: Failing due to TypeName property access error
- **PostgreSQL Version**: Transitioning from PG13 to PG17
- **Architecture**: Visitor pattern with wrapped and unwrapped node types
- **Test Coverage**: Basic CREATE TABLE statements implemented

## Current Architecture Analysis

### Visitor Pattern Implementation

The current deparser uses a visitor pattern implemented in `packages/deparser/src/deparser.ts`. The core architecture consists of:

```typescript
export class Deparser implements DeparserVisitor {
  private formatter: SqlFormatter;
  private tree: Node[];

  visit(node: Node, context: DeparserContext = {}): string {
    const nodeType = this.getNodeType(node);
    const nodeData = this.getNodeData(node);
    
    if (this[nodeType]) {
      return this[nodeType](node, context);
    }
    
    throw new Error(`Unsupported node type: ${nodeType}`);
  }

  getNodeType(node: Node): string {
    return Object.keys(node)[0];
  }

  getNodeData(node: Node): any {
    const type = this.getNodeType(node);
    return (node as any)[type];
  }
}
```

### Key Components

1. **SqlFormatter**: Handles SQL formatting with configurable newlines and tabs
2. **QuoteUtils**: Manages identifier quoting and escaping
3. **ListUtils**: Utilities for unwrapping and processing node lists
4. **DeparserContext**: Context object passed through visitor methods
5. **Node Types**: Type definitions from `@pgsql/types`

### Current Utility Classes

- **SqlFormatter**: Provides consistent SQL formatting
- **QuoteUtils**: Handles identifier quoting based on PostgreSQL rules
- **ListUtils**: Unwraps List nodes and processes arrays
- **DeparserVisitor**: Interface defining visitor method signatures

## Reference Materials Analysis

### PostgreSQL C Implementation (`postgres_deparse.c`)

The C reference implementation provides comprehensive patterns for:

**Key Functions**:
- `deparseStringLiteral()`: String escaping and quoting
- `isReservedKeyword()`: Keyword detection for quoting
- `deparseAnyName()`: Name list processing
- `deparseExpr()`: Expression handling
- `deparseTypeName()`: Type name processing

**Context Handling**:
```c
typedef enum DeparseNodeContext {
  DEPARSE_NODE_CONTEXT_NONE,
  DEPARSE_NODE_CONTEXT_INSERT_RELATION,
  DEPARSE_NODE_CONTEXT_A_EXPR,
  DEPARSE_NODE_CONTEXT_CREATE_TYPE,
  DEPARSE_NODE_CONTEXT_ALTER_TYPE,
  DEPARSE_NODE_CONTEXT_SET_STATEMENT,
  DEPARSE_NODE_CONTEXT_FUNC_EXPR,
  DEPARSE_NODE_CONTEXT_IDENTIFIER,
  DEPARSE_NODE_CONTEXT_CONSTANT
} DeparseNodeContext;
```

### Legacy PG13 Implementation (`reference/deparser.ts`)

The old implementation (4,221 lines) provides insights into:

- Function-based approach vs. class-based visitor pattern
- Direct property access without proper unwrapping
- Extensive use of utility functions for formatting
- Complex type modification handling

**Key Patterns**:
```typescript
function deparse(node, context) {
  if (node.TypeName) {
    return deparseTypeName(node.TypeName);
  }
  // ... other node types
}
```

### Node Types (`@pgsql/types`)

These are the types you should use to navigate the deparse, study them well!

## Test Requirements Analysis

- ONLY focus on deparser/kitchen-sink tests for now
- after kitchen-sink is passing, you can do deparser/ast-driven/

If a test fails, the stderr will give meaningful info to solve the issue:

      ❌ AST_MISMATCH: simple-5.sql
      ❌ INPUT SQL: SELECT * FROM table_name WHERE last_name SIMILAR TO '%(b|d)%'
      ❌ DEPARSED SQL: SELECT * FROM table_name WHERE last_name SIMILAR TO pg_catalog.similar_to_escape('%(b|d)%')

      ❌ AST COMPARISON:
      EXPECTED AST:
      [
        {
          "stmt": {
            "SelectStmt": {
              "targetList": [
                {
                  "ResTarget": {
                    "val": {
                      "ColumnRef": {
                        "fields": [
                          {
                            "A_Star": {}
                          }
                        ]
                      }
                    }
                  }
                }
              ],
              "fromClause": [
                {
                  "RangeVar": {
                    "relname": "table_name",
                    "inh": true,
                    "relpersistence": "p"
                  }
                }
              ],
              "whereClause": {
                "A_Expr": {
                  "kind": "AEXPR_SIMILAR",
                  "name": [
                    {
                      "String": {
                        "sval": "~"
                      }
                    }
                  ],
                  "lexpr": {
                    "ColumnRef": {
                      "fields": [
                        {
                          "String": {
                            "sval": "last_name"
                          }
                        }
                      ]
                    }
                  },
                  "rexpr": {
                    "FuncCall": {
                      "funcname": [
                        {
                          "String": {
                            "sval": "pg_catalog"
                          }
                        },
                        {
                          "String": {
                            "sval": "similar_to_escape"
                          }
                        }
                      ],
                      "args": [
                        {
                          "A_Const": {
                            "sval": {
                              "sval": "%(b|d)%"
                            }
                          }
                        }
                      ],
                      "funcformat": "COERCE_EXPLICIT_CALL"
                    }
                  }
                }
              },
              "limitOption": "LIMIT_OPTION_DEFAULT",
              "op": "SETOP_NONE"
            }
          }
        }
      ]

      ACTUAL AST:
      [
        {
          "stmt": {
            "SelectStmt": {
              "targetList": [
                {
                  "ResTarget": {
                    "val": {
                      "ColumnRef": {
                        "fields": [
                          {
                            "A_Star": {}
                          }
                        ]
                      }
                    }
                  }
                }
              ],
              "fromClause": [
                {
                  "RangeVar": {
                    "relname": "table_name",
                    "inh": true,
                    "relpersistence": "p"
                  }
                }
              ],
              "whereClause": {
                "A_Expr": {
                  "kind": "AEXPR_SIMILAR",
                  "name": [
                    {
                      "String": {
                        "sval": "~"
                      }
                    }
                  ],
                  "lexpr": {
                    "ColumnRef": {
                      "fields": [
                        {
                          "String": {
                            "sval": "last_name"
                          }
                        }
                      ]
                    }
                  },
                  "rexpr": {
                    "FuncCall": {
                      "funcname": [
                        {
                          "String": {
                            "sval": "pg_catalog"
                          }
                        },
                        {
                          "String": {
                            "sval": "similar_to_escape"
                          }
                        }
                      ],
                      "args": [
                        {
                          "FuncCall": {
                            "funcname": [
                              {
                                "String": {
                                  "sval": "pg_catalog"
                                }
                              },
                              {
                                "String": {
                                  "sval": "similar_to_escape"
                                }
                              }
                            ],
                            "args": [
                              {
                                "A_Const": {
                                  "sval": {
                                    "sval": "%(b|d)%"
                                  }
                                }
                              }
                            ],
                            "funcformat": "COERCE_EXPLICIT_CALL"
                          }
                        }
                      ],
                      "funcformat": "COERCE_EXPLICIT_CALL"
                    }
                  }
                }
              },
              "limitOption": "LIMIT_OPTION_DEFAULT",
              "op": "SETOP_NONE"
            }
          }
        }
      ]

      DIFF (what's missing from actual vs expected):
      - Expected
      + Received

        Array [
          Object {
            "stmt": Object {
              "SelectStmt": Object {
                "fromClause": Array [
                  Object {
                    "RangeVar": Object {
                      "inh": true,
                      "location": undefined,
                      "relname": "table_name",
                      "relpersistence": "p",
                    },
                  },
                ],
                "limitOption": "LIMIT_OPTION_DEFAULT",
                "op": "SETOP_NONE",
                "targetList": Array [
                  Object {
                    "ResTarget": Object {
                      "location": undefined,
                      "val": Object {
                        "ColumnRef": Object {
                          "fields": Array [
                            Object {
                              "A_Star": Object {},
                            },
                          ],
                          "location": undefined,
                        },
                      },
                    },
                  },
                ],
                "whereClause": Object {
                  "A_Expr": Object {
                    "kind": "AEXPR_SIMILAR",
                    "lexpr": Object {
                      "ColumnRef": Object {
                        "fields": Array [
                          Object {
                            "String": Object {
                              "sval": "last_name",
                            },
                          },
                        ],
                        "location": undefined,
                      },
                    },
                    "location": undefined,
                    "name": Array [
                      Object {
                        "String": Object {
                          "sval": "~",
                        },
                      },
                    ],
                    "rexpr": Object {
                      "FuncCall": Object {
                        "args": Array [
                          Object {
      +                     "FuncCall": Object {
      +                       "args": Array [
      +                         Object {
                                  "A_Const": Object {
                                    "location": undefined,
                                    "sval": Object {
                                      "sval": "%(b|d)%",
      +                             },
      +                           },
      +                         },
      +                       ],
      +                       "funcformat": "COERCE_EXPLICIT_CALL",
      +                       "funcname": Array [
      +                         Object {
      +                           "String": Object {
      +                             "sval": "pg_catalog",
      +                           },
                                },
      +                         Object {
      +                           "String": Object {
      +                             "sval": "similar_to_escape",
      +                           },
      +                         },
      +                       ],
      +                       "location": undefined,
                            },
                          },
                        ],
                        "funcformat": "COERCE_EXPLICIT_CALL",
                        "funcname": Array [
                          Object {
                            "String": Object {
                              "sval": "pg_catalog",
                            },
                          },
                          Object {
                            "String": Object {
                              "sval": "similar_to_escape",
                            },
                          },
                        ],
                        "location": undefined,
                      },
                    },
                  },
                },
              },
            },
          },
        ]

The simple-5.sql in this case comes from __fixtures__/generated/generated.json, but you may need even need to look there, since the error messgage gives you the expected AST and Expected SQL. 

Essentially, pay attention to the kitchen sink errors, and work on each test, one by one. The AST is the most important part to pay attention to, as is shows what the difference between the deparsed SQL's AST and the expected SQL's AST is.
  

## Proposed Architecture

### 1. Context Enhancement

If we have special cases, we can augement and levearage a deparserContext:

**Expanded Context System**:
```typescript
export interface DeparserContext {
  // Current context
  parentNode?: Node;
  parentNodeType?: string;
  parentField?: string;
  
  // New context enhancements
  indentLevel?: number;
  inSubquery?: boolean;
  inConstraint?: boolean;
  inExpression?: boolean;
  
  // PostgreSQL 17 specific
  jsonFormatting?: boolean;
  xmlFormatting?: boolean;
  partitionContext?: boolean;
}
```

### 2. Utility Function Organization

**Enhanced QuoteUtils**:
```typescript
export class QuoteUtils {
  static quote(identifier: string): string {
    if (!identifier) return '';
    
    // Check if quoting is needed
    if (this.needsQuoting(identifier)) {
      return `"${identifier.replace(/"/g, '""')}"`;
    }
    
    return identifier;
  }
  
  private static needsQuoting(identifier: string): boolean {
    // PostgreSQL identifier rules
    if (!/^[a-z_][a-z0-9_$]*$/.test(identifier)) {
      return true;
    }
    
    // Check reserved keywords
    return RESERVED_KEYWORDS.has(identifier.toLowerCase());
  }
}
```

**Enhanced ListUtils**:
```typescript
export class ListUtils {
  static unwrapList(listNode: any): any[] {
    if (!listNode) return [];
    
    if (listNode.List) {
      return listNode.List.items || [];
    }
    
    if (Array.isArray(listNode)) {
      return listNode;
    }
    
    return [listNode];
  }
  
  static processNodeList(nodes: any[], visitor: (node: any) => string): string[] {
    return this.unwrapList(nodes).map(visitor);
  }
}
```