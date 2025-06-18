
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-upstream-select_distinct_on', () => {
  fixtures.runFixtureTests([
  "original/upstream/select_distinct_on-1.sql",
  "original/upstream/select_distinct_on-2.sql",
  "original/upstream/select_distinct_on-3.sql",
  "original/upstream/select_distinct_on-4.sql"
]);
});
