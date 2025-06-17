
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('privs-and-defaults', () => {
  fixtures.runFixtureTests([
  "privs-and-defaults-1.sql",
  "privs-and-defaults-2.sql",
  "privs-and-defaults-3.sql",
  "privs-and-defaults-4.sql",
  "privs-and-defaults-5.sql",
  "privs-and-defaults-6.sql",
  "privs-and-defaults-7.sql",
  "privs-and-defaults-8.sql"
]);
});
