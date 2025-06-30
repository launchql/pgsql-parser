import { PrettyTest } from '../../test-utils/PrettyTest';

const testCases = [
  'pretty/cte-1.sql',
  'pretty/cte-2.sql',
  'pretty/cte-3.sql',
  'pretty/cte-4.sql',
];

const prettyTest = new PrettyTest(testCases);
prettyTest.generateTests();