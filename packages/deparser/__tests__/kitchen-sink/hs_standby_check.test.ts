
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('hs_standby_check', () => {
  fixtures.runFixtureTests([
  "hs_standby_check-1.sql"
]);
});
