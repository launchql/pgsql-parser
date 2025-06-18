
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('latest-postgres-md5', () => {
  fixtures.runFixtureTests([
  "md5-1.sql",
  "md5-2.sql",
  "md5-3.sql",
  "md5-4.sql",
  "md5-5.sql",
  "md5-6.sql",
  "md5-7.sql",
  "md5-8.sql",
  "md5-9.sql",
  "md5-10.sql",
  "md5-11.sql",
  "md5-12.sql",
  "md5-13.sql",
  "md5-14.sql"
]);
});
