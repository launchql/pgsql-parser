
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('latest-postgres-database', () => {
  fixtures.runFixtureTests([
  "database-1.sql",
  "database-2.sql",
  "database-3.sql",
  "database-4.sql",
  "database-5.sql",
  "database-6.sql",
  "database-7.sql",
  "database-8.sql",
  "database-9.sql",
  "database-10.sql",
  "database-11.sql",
  "database-12.sql",
  "database-13.sql",
  "database-14.sql",
  "database-15.sql",
  "database-16.sql"
]);
});
