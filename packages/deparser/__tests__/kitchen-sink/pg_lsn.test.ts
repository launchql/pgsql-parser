
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('pg_lsn', () => {
  fixtures.runFixtureTests([
  "pg_lsn-1.sql",
  "pg_lsn-2.sql",
  "pg_lsn-3.sql",
  "pg_lsn-4.sql",
  "pg_lsn-5.sql",
  "pg_lsn-6.sql",
  "pg_lsn-7.sql",
  "pg_lsn-8.sql",
  "pg_lsn-9.sql",
  "pg_lsn-10.sql",
  "pg_lsn-11.sql",
  "pg_lsn-12.sql",
  "pg_lsn-13.sql",
  "pg_lsn-14.sql",
  "pg_lsn-15.sql",
  "pg_lsn-16.sql",
  "pg_lsn-17.sql"
]);
});
