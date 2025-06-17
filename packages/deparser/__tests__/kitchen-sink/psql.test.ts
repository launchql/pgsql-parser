
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('psql', () => {
  fixtures.runFixtureTests([
  "psql-1.sql",
  "psql-2.sql",
  "psql-3.sql",
  "psql-4.sql",
  "psql-5.sql",
  "psql-6.sql",
  "psql-7.sql",
  "psql-8.sql",
  "psql-9.sql"
]);
});
