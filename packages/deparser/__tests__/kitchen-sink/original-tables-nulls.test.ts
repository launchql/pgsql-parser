
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-tables-nulls', () => {
  fixtures.runFixtureTests([
  "original/tables/nulls-1.sql",
  "original/tables/nulls-2.sql",
  "original/tables/nulls-3.sql"
]);
});
