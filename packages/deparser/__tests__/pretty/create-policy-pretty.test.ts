import { deparseSync } from '../../src';
import { parse } from 'libpg-query';
import { expectParseDeparse } from '../../test-utils';

describe('Pretty CREATE POLICY formatting', () => {
  const basicPolicySql = `CREATE POLICY user_policy ON users FOR ALL TO authenticated_users USING (user_id = current_user_id());`;
  
  const complexPolicySql = `CREATE POLICY admin_policy ON sensitive_data AS RESTRICTIVE FOR SELECT TO admin_role USING (department = current_user_department()) WITH CHECK (approved = true);`;

  const simplePolicySql = `CREATE POLICY simple_policy ON posts FOR SELECT TO public USING (published = true);`;

  it('should format basic CREATE POLICY with pretty option enabled', async () => {
    const parsed = await parse(basicPolicySql);
    const result = deparseSync(parsed, { pretty: true });
    expect(result).toMatchSnapshot();
  });

  it('should maintain single-line format when pretty option disabled', async () => {
    const parsed = await parse(basicPolicySql);
    const result = deparseSync(parsed, { pretty: false });
    expect(result).toMatchSnapshot();
  });

  it('should format complex CREATE POLICY with pretty option enabled', async () => {
    const parsed = await parse(complexPolicySql);
    const result = deparseSync(parsed, { pretty: true });
    expect(result).toMatchSnapshot();
  });

  it('should maintain single-line format for complex policy when pretty disabled', async () => {
    const parsed = await parse(complexPolicySql);
    const result = deparseSync(parsed, { pretty: false });
    expect(result).toMatchSnapshot();
  });

  it('should format simple CREATE POLICY with pretty option enabled', async () => {
    const parsed = await parse(simplePolicySql);
    const result = deparseSync(parsed, { pretty: true });
    expect(result).toMatchSnapshot();
  });

  it('should use custom newline and tab characters in pretty mode', async () => {
    const parsed = await parse(basicPolicySql);
    const result = deparseSync(parsed, { 
      pretty: true, 
      newline: '\r\n', 
      tab: '    ' 
    });
    expect(result).toMatchSnapshot();
  });

  it('should validate AST equivalence between original and pretty-formatted SQL', async () => {
    const testCases = [
      basicPolicySql,
      complexPolicySql,
      simplePolicySql
    ];

    for (const sql of testCases) {
      await expectParseDeparse(sql, { pretty: true });
    }
  });
});
