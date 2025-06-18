
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-pg_catalog', () => {
  fixtures.runFixtureTests([
  "original/pg_catalog-1.sql",
  "original/pg_catalog-2.sql",
  "original/pg_catalog-3.sql",
  "original/pg_catalog-4.sql"
]);
});
