
import { FixtureTestUtils } from '../../../test-utils';
const fixtures = new FixtureTestUtils(15, 16);

it('original-query-003', async () => {
  await fixtures.runFixtureTests([
  "original/query-003-1.sql"
]);
});
