
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('match', () => {
  fixtures.runFixtureTests([
  "match-1.sql",
  "match-2.sql",
  "match-3.sql",
  "match-4.sql",
  "match-5.sql",
  "match-6.sql"
]);
});
