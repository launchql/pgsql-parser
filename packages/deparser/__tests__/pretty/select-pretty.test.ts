import { deparseSync } from '../../src';
import { parse } from 'libpg-query';
import { TestUtils } from '../../test-utils';

describe('Pretty SELECT formatting', () => {
  const basicSelectSql = `SELECT id, name, email FROM users WHERE active = true;`;
  
  const complexSelectSql = `SELECT u.id, u.name, u.email, p.title FROM users u JOIN profiles p ON u.id = p.user_id WHERE u.active = true AND u.created_at > '2023-01-01' GROUP BY u.id, u.name, u.email, p.title HAVING COUNT(*) > 1 ORDER BY u.created_at DESC, u.name ASC LIMIT 10 OFFSET 5;`;

  const selectWithSubquerySql = `SELECT id, name FROM users WHERE id IN (SELECT user_id FROM orders WHERE total > 100);`;

  const selectUnionSql = `SELECT name FROM customers UNION ALL SELECT name FROM suppliers ORDER BY name;`;

  it('should format basic SELECT with pretty option enabled', async () => {
    const parsed = await parse(basicSelectSql);
    const result = deparseSync(parsed, { pretty: true });
    expect(result).toMatchSnapshot();
  });

  it('should maintain single-line format when pretty option disabled', async () => {
    const parsed = await parse(basicSelectSql);
    const result = deparseSync(parsed, { pretty: false });
    expect(result).toMatchSnapshot();
  });

  it('should format complex SELECT with pretty option enabled', async () => {
    const parsed = await parse(complexSelectSql);
    const result = deparseSync(parsed, { pretty: true });
    expect(result).toMatchSnapshot();
  });

  it('should maintain single-line format for complex SELECT when pretty disabled', async () => {
    const parsed = await parse(complexSelectSql);
    const result = deparseSync(parsed, { pretty: false });
    expect(result).toMatchSnapshot();
  });

  it('should format SELECT with subquery with pretty option enabled', async () => {
    const parsed = await parse(selectWithSubquerySql);
    const result = deparseSync(parsed, { pretty: true });
    expect(result).toMatchSnapshot();
  });

  it('should format SELECT with UNION with pretty option enabled', async () => {
    const parsed = await parse(selectUnionSql);
    const result = deparseSync(parsed, { pretty: true });
    expect(result).toMatchSnapshot();
  });

  it('should use custom newline and tab characters in pretty mode', async () => {
    const parsed = await parse(basicSelectSql);
    const result = deparseSync(parsed, { 
      pretty: true, 
      newline: '\r\n', 
      tab: '    ' 
    });
    expect(result).toMatchSnapshot();
  });

  it('should validate AST equivalence between original and pretty-formatted SQL', async () => {
    const testUtils = new TestUtils();
    const testCases = [
      { name: 'basic SELECT', sql: basicSelectSql },
      { name: 'complex SELECT', sql: complexSelectSql },
      { name: 'SELECT with subquery', sql: selectWithSubquerySql },
      { name: 'SELECT with UNION', sql: selectUnionSql }
    ];

    for (const testCase of testCases) {
      const originalParsed = await parse(testCase.sql);
      const prettyFormatted = deparseSync(originalParsed, { pretty: true });
      await testUtils.expectAstMatch(`pretty-${testCase.name}`, prettyFormatted);
    }
  });
});
