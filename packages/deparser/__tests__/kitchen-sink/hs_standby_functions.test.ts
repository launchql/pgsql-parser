
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('hs_standby_functions', () => {
  fixtures.runFixtureTests([
  "hs_standby_functions-1.sql",
  "hs_standby_functions-2.sql",
  "hs_standby_functions-3.sql",
  "hs_standby_functions-4.sql",
  "hs_standby_functions-5.sql",
  "hs_standby_functions-6.sql",
  "hs_standby_functions-7.sql",
  "hs_standby_functions-8.sql"
]);
});
