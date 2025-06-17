
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('comment', () => {
  fixtures.runFixtureTests([
  "comment-1.sql",
  "comment-2.sql",
  "comment-3.sql",
  "comment-4.sql",
  "comment-5.sql",
  "comment-6.sql",
  "comment-7.sql",
  "comment-8.sql",
  "comment-9.sql",
  "comment-10.sql"
]);
});
