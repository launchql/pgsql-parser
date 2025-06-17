
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('init_privs', () => {
  fixtures.runFixtureTests([
  "init_privs-1.sql",
  "init_privs-2.sql",
  "init_privs-3.sql",
  "init_privs-4.sql"
]);
});
