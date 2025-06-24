
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils(13, 14);

it('original-upstream-select_distinct_on', async () => {
  await fixtures.runFixtureTests([
  "original/upstream/select_distinct_on-1.sql",
  "original/upstream/select_distinct_on-2.sql",
  "original/upstream/select_distinct_on-3.sql",
  "original/upstream/select_distinct_on-4.sql"
]);
});
