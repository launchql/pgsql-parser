
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('latest-postgres-select_having', () => {
  fixtures.runFixtureTests([
  "select_having-1.sql",
  "select_having-2.sql",
  "select_having-3.sql",
  "select_having-4.sql",
  "select_having-5.sql",
  "select_having-6.sql",
  "select_having-7.sql",
  "select_having-8.sql",
  "select_having-9.sql",
  "select_having-10.sql",
  "select_having-11.sql",
  "select_having-12.sql",
  "select_having-13.sql",
  "select_having-14.sql",
  "select_having-15.sql",
  "select_having-16.sql",
  "select_having-17.sql",
  "select_having-18.sql",
  "select_having-19.sql",
  "select_having-20.sql",
  "select_having-21.sql",
  "select_having-22.sql",
  "select_having-23.sql"
]);
});
