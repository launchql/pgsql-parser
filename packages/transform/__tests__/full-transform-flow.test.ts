import { Parser } from '@pgsql/parser';
import { deparse } from 'pgsql-deparser';
import { PG13ToPG17Transformer } from '../src/transformer';

import generated from '../../../__fixtures__/generated/generated.json';
import { cleanTree } from '../test-utils/clean-tree';

describe('Full Transform Flow Tests', () => {
  const testFiles = [
    'original/upstream/plpgsql-86.sql',
    'original/upstream/plpgsql-202.sql',
    'original/upstream/plpgsql-203.sql',
    'original/upstream/plpgsql-204.sql',
    'original/upstream/plpgsql-205.sql',
    'original/upstream/plpgsql-206.sql',
    'original/upstream/plpgsql-207.sql',
    'original/upstream/plpgsql-208.sql',
    'original/upstream/plpgsql-209.sql',
    'original/upstream/plpgsql-210.sql',
    'original/upstream/plpgsql-211.sql',
    'original/upstream/plpgsql-212.sql',
    'original/upstream/plpgsql-213.sql',
    'original/upstream/plpgsql-214.sql',
    'original/upstream/plpgsql-215.sql',
    'original/upstream/plpgsql-216.sql',
    'original/upstream/plpgsql-217.sql',
    'original/upstream/plpgsql-218.sql',
    'original/upstream/plpgsql-219.sql',
    'original/upstream/plpgsql-220.sql',
    'original/upstream/plpgsql-221.sql',
    'original/upstream/plpgsql-222.sql',
    'original/upstream/plpgsql-223.sql',
    "pretty/select_statements-1.sql",
    "pretty/select_statements-2.sql",
    "pretty/select_statements-3.sql",
    "pretty/select_statements-4.sql",
    "pretty/select_statements-5.sql",
    "pretty/select_statements-6.sql",
    "pretty/misc-1.sql",
    "pretty/misc-2.sql",
    "pretty/misc-3.sql",
    "pretty/misc-4.sql",
    // "pretty/misc-5.sql",
    "pretty/misc-6.sql",
    "pretty/misc-7.sql",
    "pretty/misc-8.sql",
    "pretty/misc-9.sql",
    "pretty/misc-10.sql",
    "pretty/misc-11.sql",
    "pretty/misc-12.sql",
    "pretty/misc-13.sql",
    "pretty/create_table-1.sql",
    "pretty/create_table-2.sql",
    "pretty/create_table-3.sql",
    "pretty/create_table-4.sql",
    "pretty/create_table-5.sql",
    "pretty/create_policy-1.sql",
    "pretty/create_policy-2.sql",
    "pretty/create_policy-3.sql",
    "pretty/create_policy-4.sql",
    "pretty/constraints-1.sql",
    "pretty/constraints-2.sql",
    "pretty/constraints-4.sql",
  ];

  // Initialize parsers and transformer once for all tests
  const pg13Parser = new Parser({ version: 13 });
  const pg17Parser = new Parser({ version: 17 });
  const transformer = new PG13ToPG17Transformer();

  testFiles.forEach((filename) => {
    it(`tests end-to-end flow for ${filename}`, async () => {
      const sql = generated[filename as keyof typeof generated];

      // Step 1: Parse with PG13
      const pg13Ast = await pg13Parser.parse(sql);

      // Step 2: Transform PG13 → PG17
      const pg17Ast = transformer.transform(pg13Ast as any);

      // Step 3: Deparse with PG17 deparser
      const deparsedSql = await deparse(pg17Ast, {
        pretty: true
      });

      // Step 4: Parse with PG13
      const pg13Ast2 = await pg13Parser.parse(deparsedSql);
      // console.log({pg13Ast});
      // console.log({pg13Ast2});
      
      // Step 5: Compare the two ASTs
      // expect(cleanTree(pg13Ast2)).toEqual(cleanTree(pg13Ast));
      // Step 6: Parse with PG13
      const pg17Ast2 = await pg17Parser.parse(deparsedSql);
      // console.log({pg17Ast2});

      // Step 7: Compare the two ASTs
      // expect(cleanTree(pg17Ast2)).toEqual(cleanTree(pg17Ast));
      
      // Step 3: Deparse with PG17 deparser
      const deparsedSql2 = await deparse(pg17Ast2 as any, {
        pretty: true
      });

      // Step 9: Compare the two deparsed SQLs
      expect(deparsedSql2).toEqual(deparsedSql);

      // console.log(`Result for ${filename}:`, deparsedSql);

      // Add assertions here if needed
      expect(deparsedSql).toBeDefined();
      expect(typeof deparsedSql).toBe('string');
    });
  });
});
