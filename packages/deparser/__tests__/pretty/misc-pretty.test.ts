import { deparseSync } from '../../src';
import { parse } from 'libpg-query';
import { expectParseDeparse } from '../../test-utils';

const generateCoded = require('../../../../__fixtures__/generated/generated.json');

describe('Pretty Misc SQL formatting', () => {
  const testCases = [
    {
      key: 'pretty/misc-1.sql',
      description: 'Complex CTE with joins and aggregation'
    },
    {
      key: 'pretty/misc-2.sql',
      description: 'Window functions with FILTER and GROUPING SETS'
    },
    {
      key: 'pretty/misc-3.sql',
      description: 'LATERAL joins with JSON functions'
    },
    {
      key: 'pretty/misc-4.sql',
      description: 'EXISTS with nested subqueries and CASE'
    },
    {
      key: 'pretty/misc-5.sql',
      description: 'Nested CTEs with type casts and subqueries'
    },
    {
      key: 'pretty/misc-6.sql',
      description: 'Complex multi-table joins with nested conditions'
    },
    {
      key: 'pretty/misc-7.sql',
      description: 'Large Case Stmt'
    },
    {
      key: 'pretty/misc-8.sql',
      description: 'Large Case Stmt'
    },
    {
      key: 'pretty/misc-9.sql',
      description: 'Large Case Stmt'
    },
    {
      key: 'pretty/misc-10.sql',
      description: 'Where Clause'
    },
    {
      key: 'pretty/misc-11.sql',
      description: 'Lateral Join'
    },
    {
      key: 'pretty/misc-12.sql',
      description: 'Scalar Subquery'
    },
    {
      key: 'pretty/misc-13.sql',
      description: 'Window Function'
    }
  ];

  // Generate individual tests for each case and format type
  testCases.forEach(({ key, description }, index) => {
    const sql = generateCoded[key];
    const testName = `misc-${index + 1}`;

    it(`should format ${testName}: ${description} (pretty)`, async () => {
      const result = await expectParseDeparse(sql, { pretty: true });
      expect(result).toMatchSnapshot();
    });

    it(`should format ${testName}: ${description} (non-pretty)`, async () => {
      const result = await expectParseDeparse(sql, { pretty: false });
      expect(result).toMatchSnapshot();
    });
  });

  it('should validate AST equivalence for all misc cases', async () => {
    const allSql = testCases.map(({ key }) => generateCoded[key]);
    
    for (const sql of allSql) {
      await expectParseDeparse(sql, { pretty: false });
      await expectParseDeparse(sql, { pretty: true });
    }
  });
});
