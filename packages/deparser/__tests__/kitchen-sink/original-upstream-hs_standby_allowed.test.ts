
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-upstream-hs_standby_allowed', () => {
  fixtures.runFixtureTests([
  "original/upstream/hs_standby_allowed-1.sql",
  "original/upstream/hs_standby_allowed-2.sql",
  "original/upstream/hs_standby_allowed-3.sql"
]);
});
