
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('latest-postgres-reindex_catalog', () => {
  fixtures.runFixtureTests([
  "reindex_catalog-1.sql",
  "reindex_catalog-2.sql",
  "reindex_catalog-3.sql",
  "reindex_catalog-4.sql",
  "reindex_catalog-5.sql",
  "reindex_catalog-6.sql",
  "reindex_catalog-7.sql",
  "reindex_catalog-8.sql",
  "reindex_catalog-9.sql",
  "reindex_catalog-10.sql",
  "reindex_catalog-11.sql",
  "reindex_catalog-12.sql",
  "reindex_catalog-13.sql",
  "reindex_catalog-14.sql",
  "reindex_catalog-15.sql",
  "reindex_catalog-16.sql",
  "reindex_catalog-17.sql",
  "reindex_catalog-18.sql",
  "reindex_catalog-19.sql",
  "reindex_catalog-20.sql"
]);
});
