
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('latest-postgres-misc_sanity', () => {
  fixtures.runFixtureTests([
  "misc_sanity-1.sql",
  "misc_sanity-2.sql",
  "misc_sanity-3.sql",
  "misc_sanity-4.sql",
  "misc_sanity-5.sql"
]);
});
