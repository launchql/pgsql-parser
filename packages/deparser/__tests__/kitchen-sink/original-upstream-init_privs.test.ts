
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-upstream-init_privs', () => {
  fixtures.runFixtureTests([
  "original/upstream/init_privs-1.sql",
  "original/upstream/init_privs-2.sql",
  "original/upstream/init_privs-3.sql",
  "original/upstream/init_privs-4.sql"
]);
});
