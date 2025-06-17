
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('grants', () => {
  fixtures.runFixtureTests([
  "grants-1.sql",
  "grants-2.sql",
  "grants-3.sql"
]);
});
