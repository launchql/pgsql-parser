
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('sanity_check', () => {
  fixtures.runFixtureTests([
  "sanity_check-1.sql",
  "sanity_check-2.sql",
  "sanity_check-3.sql"
]);
});
