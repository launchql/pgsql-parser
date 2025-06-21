
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-tables-defaults', async () => {
  await fixtures.runFixtureTests([
  "original/tables/defaults-1.sql"
]);
});
