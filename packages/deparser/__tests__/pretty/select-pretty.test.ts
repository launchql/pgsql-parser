import { expectParseDeparse } from '../../test-utils';

const generateCoded = require('../../../../__fixtures__/generated/generated.json');

describe('Pretty Misc SQL formatting', () => {
  const testCases = [
    'pretty/selects-1.sql',
    'pretty/selects-2.sql',
    'pretty/selects-3.sql',
    'pretty/selects-4.sql',
    'pretty/selects-5.sql',
    'pretty/selects-6.sql',
    'pretty/selects-7.sql',
    'pretty/selects-8.sql',
    'pretty/selects-9.sql',
    'pretty/selects-10.sql',
    'pretty/selects-11.sql',
    'pretty/selects-12.sql',
    'pretty/selects-13.sql',
    'pretty/selects-14.sql',
    'pretty/selects-15.sql'
  ];

  // Generate individual tests for each case and format type
  testCases.forEach((key, index) => {
    const sql = generateCoded[key];
    const testName = `misc-${index + 1}`;

    it(`should format ${testName}: ${key} (pretty)`, async () => {
      const result = await expectParseDeparse(sql, { pretty: true });
      expect(result).toMatchSnapshot();
    });

    it(`should format ${testName}: ${key} (non-pretty)`, async () => {
      const result = await expectParseDeparse(sql, { pretty: false });
      expect(result).toMatchSnapshot();
    });
  });

});
