
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('latest-postgres-delete', () => {
  fixtures.runFixtureTests([
  "delete-1.sql",
  "delete-2.sql",
  "delete-3.sql",
  "delete-4.sql",
  "delete-5.sql",
  "delete-6.sql",
  "delete-7.sql",
  "delete-8.sql",
  "delete-9.sql",
  "delete-10.sql"
]);
});
