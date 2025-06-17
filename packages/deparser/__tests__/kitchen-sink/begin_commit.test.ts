
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('begin_commit', () => {
  fixtures.runFixtureTests([
  "begin_commit-1.sql",
  "begin_commit-2.sql",
  "begin_commit-3.sql"
]);
});
