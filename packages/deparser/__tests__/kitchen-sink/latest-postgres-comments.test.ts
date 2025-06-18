
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('latest-postgres-comments', () => {
  fixtures.runFixtureTests([
  "comments-1.sql",
  "comments-2.sql",
  "comments-3.sql",
  "comments-4.sql",
  "comments-5.sql",
  "comments-6.sql"
]);
});
