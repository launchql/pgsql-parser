
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-tables-on_update', async () => {
  await fixtures.runFixtureTests([
  "original/tables/on_update-1.sql"
]);
});
