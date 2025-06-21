
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-query-003', async () => {
  await fixtures.runFixtureTests([
  "original/query-003-1.sql"
]);
});
