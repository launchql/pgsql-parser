
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('default-privs', () => {
  fixtures.runFixtureTests([
  "default-privs-1.sql",
  "default-privs-2.sql",
  "default-privs-3.sql",
  "default-privs-4.sql",
  "default-privs-5.sql",
  "default-privs-6.sql",
  "default-privs-7.sql"
]);
});
