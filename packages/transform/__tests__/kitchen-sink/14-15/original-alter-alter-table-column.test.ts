
import { FixtureTestUtils } from '../../../test-utils';
const fixtures = new FixtureTestUtils(14, 15);

it('original-alter-alter-table-column', async () => {
  await fixtures.runFixtureTests([
  "original/alter/alter-table-column-1.sql"
]);
});
