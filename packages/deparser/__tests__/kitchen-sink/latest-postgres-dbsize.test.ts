
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('latest-postgres-dbsize', () => {
  fixtures.runFixtureTests([
  "dbsize-1.sql",
  "dbsize-2.sql",
  "dbsize-3.sql",
  "dbsize-4.sql",
  "dbsize-5.sql",
  "dbsize-6.sql",
  "dbsize-7.sql",
  "dbsize-8.sql",
  "dbsize-9.sql",
  "dbsize-10.sql",
  "dbsize-11.sql",
  "dbsize-12.sql",
  "dbsize-13.sql",
  "dbsize-14.sql",
  "dbsize-15.sql",
  "dbsize-16.sql",
  "dbsize-17.sql",
  "dbsize-18.sql",
  "dbsize-19.sql",
  "dbsize-20.sql",
  "dbsize-21.sql",
  "dbsize-22.sql",
  "dbsize-23.sql",
  "dbsize-24.sql",
  "dbsize-25.sql"
]);
});
