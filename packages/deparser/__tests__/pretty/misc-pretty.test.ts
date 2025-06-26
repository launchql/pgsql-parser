import { deparseSync } from '../../src';
import { parse } from 'libpg-query';
import { expectParseDeparse } from '../../test-utils';

const generateCoded = require('../../../../__fixtures__/generated/generated.json');

describe('Pretty Misc SQL formatting', () => {
  const testCases = [
    'pretty/misc-1.sql',
    'pretty/misc-2.sql',
    'pretty/misc-3.sql',
    'pretty/misc-4.sql',
    'pretty/misc-5.sql',
    'pretty/misc-6.sql',
    'pretty/misc-7.sql',
    'pretty/misc-8.sql',
    'pretty/misc-9.sql',
    'pretty/misc-10.sql',
    'pretty/misc-11.sql',
    'pretty/misc-12.sql',
    'pretty/misc-13.sql',
    'pretty/misc-14.sql',
    'pretty/misc-15.sql',
    'pretty/misc-16.sql'
  ];

  // Generate individual tests for each case and format type
  testCases.forEach((key) => {
    const sql = generateCoded[key];
    const testName = key.split('-')[1];

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
