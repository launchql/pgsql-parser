
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-upstream-random', () => {
  fixtures.runFixtureTests([
  "original/upstream/random-1.sql",
  "original/upstream/random-2.sql",
  "original/upstream/random-3.sql",
  "original/upstream/random-4.sql",
  "original/upstream/random-5.sql",
  "original/upstream/random-6.sql",
  "original/upstream/random-7.sql",
  "original/upstream/random-8.sql"
]);
});
