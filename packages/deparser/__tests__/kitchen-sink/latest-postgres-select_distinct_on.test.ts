
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('latest-postgres-select_distinct_on', () => {
  fixtures.runFixtureTests([
  "select_distinct_on-1.sql",
  "select_distinct_on-2.sql",
  "select_distinct_on-3.sql",
  "select_distinct_on-4.sql",
  "select_distinct_on-5.sql",
  "select_distinct_on-6.sql",
  "select_distinct_on-7.sql",
  "select_distinct_on-8.sql"
]);
});
