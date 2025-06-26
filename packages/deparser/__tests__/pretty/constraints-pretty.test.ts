import { PrettyTest } from '../../test-utils/PrettyTest';
const prettyTest = new PrettyTest([
  'pretty/constraints-1.sql',
  'pretty/constraints-2.sql',
  'pretty/constraints-3.sql',
  'pretty/constraints-4.sql',
], 'constraints');

prettyTest.generateTests();