
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-tables-unique', async () => {
  await fixtures.runFixtureTests([
  "original/tables/unique-1.sql",
  "original/tables/unique-2.sql",
  "original/tables/unique-3.sql",
  "original/tables/unique-4.sql"
]);
});
