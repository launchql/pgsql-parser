import { PrettyTest } from '../../test-utils/PrettyTest';
const prettyTest = new PrettyTest([
  'pretty/create_policy-1.sql',
  'pretty/create_policy-2.sql',
  'pretty/create_policy-3.sql',
  'pretty/create_policy-4.sql',
  'pretty/create_policy-5.sql',
  'pretty/create_policy-6.sql',
  'pretty/create_policy-7.sql',
]);

prettyTest.generateTests();