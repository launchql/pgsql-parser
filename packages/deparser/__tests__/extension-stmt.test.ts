import { Deparser } from '../src/deparser';
import { DeparserContext } from '../src/visitors/base';
import { DefElemAction } from '@pgsql/types';

describe('Extension Statement Deparsers', () => {
  const deparser = new Deparser([]);
  const context: DeparserContext = {};

  describe('CreateExtensionStmt', () => {
    it('should deparse CREATE EXTENSION statement', () => {
      const ast = {
        CreateExtensionStmt: {
          extname: 'uuid-ossp',
          if_not_exists: false,
          options: [] as any[]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE EXTENSION uuid-ossp');
    });

    it('should deparse CREATE EXTENSION IF NOT EXISTS statement', () => {
      const ast = {
        CreateExtensionStmt: {
          extname: 'postgis',
          if_not_exists: true,
          options: [] as any[]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE EXTENSION IF NOT EXISTS postgis');
    });

    it('should deparse CREATE EXTENSION with options', () => {
      const ast = {
        CreateExtensionStmt: {
          extname: 'hstore',
          if_not_exists: false,
          options: [
            {
              DefElem: {
                defname: 'schema',
                arg: { String: { sval: 'public' } },
                defaction: 'DEFELEM_UNSPEC',
                location: -1
              }
            }
          ]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE EXTENSION hstore SCHEMA public');
    });

    it('should deparse CREATE EXTENSION with version', () => {
      const ast = {
        CreateExtensionStmt: {
          extname: 'pg_stat_statements',
          if_not_exists: false,
          options: [
            {
              DefElem: {
                defname: 'version',
                arg: { String: { sval: '1.8' } },
                defaction: 'DEFELEM_UNSPEC',
                location: -1
              }
            }
          ]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE EXTENSION pg_stat_statements VERSION 1.8');
    });

    it('should deparse CREATE EXTENSION with multiple options', () => {
      const ast = {
        CreateExtensionStmt: {
          extname: 'plpgsql',
          if_not_exists: true,
          options: [
            {
              DefElem: {
                defname: 'schema',
                arg: { String: { sval: 'pg_catalog' } },
                defaction: 'DEFELEM_UNSPEC',
                location: -1
              }
            },
            {
              DefElem: {
                defname: 'version',
                arg: { String: { sval: '1.0' } },
                defaction: 'DEFELEM_UNSPEC',
                location: -1
              }
            }
          ]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE EXTENSION IF NOT EXISTS plpgsql SCHEMA pg_catalog VERSION 1.0');
    });
  });

  describe('AlterExtensionStmt', () => {
    it('should deparse ALTER EXTENSION statement', () => {
      const ast = {
        AlterExtensionStmt: {
          extname: 'postgis',
          options: [
            {
              DefElem: {
                defname: 'update',
                arg: null as any,
                defaction: 'DEFELEM_UNSPEC',
                location: -1
              }
            }
          ]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('ALTER EXTENSION postgis UPDATE');
    });

    it('should deparse ALTER EXTENSION UPDATE TO version', () => {
      const ast = {
        AlterExtensionStmt: {
          extname: 'uuid-ossp',
          options: [
            {
              DefElem: {
                defname: 'update',
                arg: null as any,
                defaction: 'DEFELEM_UNSPEC',
                location: -1
              }
            },
            {
              DefElem: {
                defname: 'to',
                arg: { String: { sval: '1.1' } },
                defaction: 'DEFELEM_UNSPEC',
                location: -1
              }
            }
          ]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('ALTER EXTENSION uuid-ossp UPDATE TO 1.1');
    });

    it('should deparse ALTER EXTENSION with schema change', () => {
      const ast = {
        AlterExtensionStmt: {
          extname: 'hstore',
          options: [
            {
              DefElem: {
                defname: 'set',
                arg: null as any,
                defaction: 'DEFELEM_UNSPEC',
                location: -1
              }
            },
            {
              DefElem: {
                defname: 'schema',
                arg: { String: { sval: 'extensions' } },
                defaction: 'DEFELEM_UNSPEC',
                location: -1
              }
            }
          ]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('ALTER EXTENSION hstore SET SCHEMA extensions');
    });
  });

  describe('CreateFdwStmt', () => {
    it('should deparse CREATE FOREIGN DATA WRAPPER statement', () => {
      const ast = {
        CreateFdwStmt: {
          fdwname: 'postgres_fdw',
          func_options: [] as any[],
          options: [] as any[]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE FOREIGN DATA WRAPPER postgres_fdw');
    });

    it('should deparse CREATE FOREIGN DATA WRAPPER with handler', () => {
      const ast = {
        CreateFdwStmt: {
          fdwname: 'file_fdw',
          func_options: [
            {
              DefElem: {
                defname: 'handler',
                arg: { String: { sval: 'file_fdw_handler' } },
                defaction: 'DEFELEM_UNSPEC',
                location: -1
              }
            }
          ],
          options: [] as any[]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE FOREIGN DATA WRAPPER file_fdw HANDLER file_fdw_handler');
    });

    it('should deparse CREATE FOREIGN DATA WRAPPER with validator', () => {
      const ast = {
        CreateFdwStmt: {
          fdwname: 'postgres_fdw',
          func_options: [
            {
              DefElem: {
                defname: 'validator',
                arg: { String: { sval: 'postgres_fdw_validator' } },
                defaction: 'DEFELEM_UNSPEC',
                location: -1
              }
            }
          ],
          options: [] as any[]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE FOREIGN DATA WRAPPER postgres_fdw VALIDATOR postgres_fdw_validator');
    });

    it('should deparse CREATE FOREIGN DATA WRAPPER with options', () => {
      const ast = {
        CreateFdwStmt: {
          fdwname: 'custom_fdw',
          func_options: [] as any[],
          options: [
            {
              DefElem: {
                defname: 'host',
                arg: { String: { sval: 'localhost' } },
                defaction: 'DEFELEM_UNSPEC',
                location: -1
              }
            },
            {
              DefElem: {
                defname: 'port',
                arg: { String: { sval: '5432' } },
                defaction: 'DEFELEM_UNSPEC',
                location: -1
              }
            }
          ]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE FOREIGN DATA WRAPPER custom_fdw OPTIONS (HOST localhost, PORT 5432)');
    });

    it('should deparse CREATE FOREIGN DATA WRAPPER with handler and options', () => {
      const ast = {
        CreateFdwStmt: {
          fdwname: 'postgres_fdw',
          func_options: [
            {
              DefElem: {
                defname: 'handler',
                arg: { String: { sval: 'postgres_fdw_handler' } },
                defaction: 'DEFELEM_UNSPEC',
                location: -1
              }
            },
            {
              DefElem: {
                defname: 'validator',
                arg: { String: { sval: 'postgres_fdw_validator' } },
                defaction: 'DEFELEM_UNSPEC',
                location: -1
              }
            }
          ],
          options: [
            {
              DefElem: {
                defname: 'debug',
                arg: { String: { sval: 'on' } },
                defaction: 'DEFELEM_UNSPEC',
                location: -1
              }
            }
          ]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE FOREIGN DATA WRAPPER postgres_fdw HANDLER postgres_fdw_handler VALIDATOR postgres_fdw_validator OPTIONS (DEBUG on)');
    });
  });
});
