
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('hs_standby_allowed', () => {
  fixtures.runFixtureTests([
  "hs_standby_allowed-1.sql",
  "hs_standby_allowed-2.sql",
  "hs_standby_allowed-3.sql"
]);
});
