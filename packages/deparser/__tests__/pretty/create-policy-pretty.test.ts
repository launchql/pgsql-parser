import { expectParseDeparse } from '../../test-utils';

const generateCoded = require('../../../../__fixtures__/generated/generated.json');

describe('Pretty Misc SQL formatting', () => {
  const testCases = [
    'pretty/create_policy-1.sql',
    'pretty/create_policy-2.sql',
    'pretty/create_policy-3.sql',
    'pretty/create_policy-4.sql',
    'pretty/create_policy-5.sql',
    'pretty/create_policy-6.sql',
    'pretty/create_policy-7.sql',
  ];

  // Generate individual tests for each case and format type
  testCases.forEach((testName, index) => {
    const sql = generateCoded[testName];

    it(`should format ${testName}: (pretty)`, async () => {
      const result = await expectParseDeparse(sql, { pretty: true });
      expect(result).toMatchSnapshot();
    });

    it(`should format ${testName}: (non-pretty)`, async () => {
      const result = await expectParseDeparse(sql, { pretty: false });
      expect(result).toMatchSnapshot();
    });
  });

});
