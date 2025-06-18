
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('latest-postgres-sysviews', () => {
  fixtures.runFixtureTests([
  "sysviews-1.sql",
  "sysviews-2.sql",
  "sysviews-3.sql",
  "sysviews-4.sql",
  "sysviews-5.sql",
  "sysviews-6.sql",
  "sysviews-7.sql",
  "sysviews-8.sql",
  "sysviews-9.sql",
  "sysviews-10.sql",
  "sysviews-11.sql",
  "sysviews-12.sql",
  "sysviews-13.sql",
  "sysviews-14.sql",
  "sysviews-15.sql",
  "sysviews-16.sql",
  "sysviews-17.sql",
  "sysviews-18.sql",
  "sysviews-19.sql",
  "sysviews-20.sql",
  "sysviews-21.sql",
  "sysviews-22.sql",
  "sysviews-23.sql",
  "sysviews-24.sql",
  "sysviews-25.sql",
  "sysviews-26.sql",
  "sysviews-27.sql"
]);
});
