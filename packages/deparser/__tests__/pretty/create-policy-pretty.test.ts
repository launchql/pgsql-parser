import { expectParseDeparse } from '../../test-utils';

describe('Pretty CREATE POLICY formatting', () => {
  const basicPolicySql = `CREATE POLICY user_policy ON users FOR ALL TO authenticated_users USING (user_id = current_user_id());`;
  
  const complexPolicySql = `CREATE POLICY admin_policy ON sensitive_data AS RESTRICTIVE FOR SELECT TO admin_role USING (department = current_user_department()) WITH CHECK (approved = true);`;

  const veryComplexPolicySql = `CREATE POLICY complex_policy ON sensitive_data AS RESTRICTIVE FOR SELECT TO admin_role USING (department = current_user_department() AND EXISTS (SELECT 1 FROM user_permissions WHERE user_id = current_user_id() AND permission = 'read_sensitive')) WITH CHECK (approved = true AND created_by = current_user_id());`;

  const simplePolicySql = `CREATE POLICY simple_policy ON posts FOR SELECT TO public USING (published = true);`;

  it('should format basic CREATE POLICY with pretty option enabled', async () => {
    const result = await expectParseDeparse(basicPolicySql, { pretty: true });
    expect(result).toMatchSnapshot();
  });

  it('should maintain single-line format when pretty option disabled', async () => {
    const result = await expectParseDeparse(basicPolicySql, { pretty: false });
    expect(result).toMatchSnapshot();
  });

  it('should format complex CREATE POLICY with pretty option enabled', async () => {
    const result = await expectParseDeparse(complexPolicySql, { pretty: true });
    expect(result).toMatchSnapshot();
  });

  it('should maintain single-line format for complex policy when pretty disabled', async () => {
    const result = await expectParseDeparse(complexPolicySql, { pretty: false });
    expect(result).toMatchSnapshot();
  });

  it('should format simple CREATE POLICY with pretty option enabled', async () => {
    const result = await expectParseDeparse(simplePolicySql, { pretty: true });
    expect(result).toMatchSnapshot();
  });

  it('should format very complex CREATE POLICY with pretty option enabled', async () => {
    const result = await expectParseDeparse(veryComplexPolicySql, { pretty: true });
    expect(result).toMatchSnapshot();
  });

  it('should use custom newline and tab characters in pretty mode', async () => {
    const result = await expectParseDeparse(basicPolicySql, { 
      pretty: true, 
      newline: '\r\n', 
      tab: '    ' 
    });
    expect(result).toMatchSnapshot();
  });
});
