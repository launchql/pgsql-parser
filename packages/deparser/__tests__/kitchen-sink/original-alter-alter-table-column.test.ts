
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-alter-alter-table-column', async () => {
  await fixtures.runFixtureTests([
  "original/alter/alter-table-column-1.sql"
]);
});
