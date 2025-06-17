
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('pg_catalog', () => {
  fixtures.runFixtureTests([
  "pg_catalog-1.sql",
  "pg_catalog-2.sql",
  "pg_catalog-3.sql",
  "pg_catalog-4.sql"
]);
});
