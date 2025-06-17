
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('select_distinct_on', () => {
  fixtures.runFixtureTests([
  "select_distinct_on-1.sql",
  "select_distinct_on-2.sql",
  "select_distinct_on-3.sql",
  "select_distinct_on-4.sql"
]);
});
