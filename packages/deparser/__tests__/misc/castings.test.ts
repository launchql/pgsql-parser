import { expectParseDeparse } from '../../test-utils';

it('should format foreign key constraint with pretty option enabled', async () => {
    const sql = `SELECT CAST('123' AS INTEGER);`;
    const result = await expectParseDeparse(sql, { pretty: true });
    expect(result).toMatchSnapshot();
});
