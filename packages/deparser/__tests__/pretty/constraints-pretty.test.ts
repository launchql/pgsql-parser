import { PrettyTest } from '../../test-utils/PrettyTest';
const prettyTest = new PrettyTest([
  'pretty/constraints-1.sql',
  'pretty/constraints-2.sql',
  'pretty/constraints-3.sql',
  'pretty/constraints-4.sql',
  'pretty/constraints-5.sql',
  'pretty/constraints-6.sql',
  'pretty/constraints-7.sql',
  'pretty/constraints-8.sql',
  'pretty/constraints-9.sql',
  'pretty/constraints-10.sql',
  'pretty/constraints-11.sql',
  'pretty/constraints-12.sql',
  'pretty/constraints-13.sql',
  'pretty/constraints-14.sql',
  'pretty/constraints-15.sql',
  'pretty/constraints-16.sql',
  'pretty/constraints-17.sql',
]);

prettyTest.generateTests();