
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-upstream-hs_standby_check', async () => {
  await fixtures.runFixtureTests([
  "original/upstream/hs_standby_check-1.sql"
]);
});
