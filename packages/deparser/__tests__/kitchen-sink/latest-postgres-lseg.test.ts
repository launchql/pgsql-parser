
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('latest-postgres-lseg', () => {
  fixtures.runFixtureTests([
  "lseg-1.sql",
  "lseg-2.sql",
  "lseg-3.sql",
  "lseg-4.sql",
  "lseg-5.sql",
  "lseg-6.sql",
  "lseg-7.sql",
  "lseg-8.sql",
  "lseg-9.sql",
  "lseg-10.sql",
  "lseg-11.sql",
  "lseg-12.sql",
  "lseg-13.sql",
  "lseg-14.sql",
  "lseg-15.sql",
  "lseg-16.sql"
]);
});
