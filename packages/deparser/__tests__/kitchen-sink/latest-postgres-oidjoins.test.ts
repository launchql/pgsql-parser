
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('latest-postgres-oidjoins', () => {
  fixtures.runFixtureTests([
  "oidjoins-1.sql"
]);
});
