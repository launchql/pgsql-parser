
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-tables-match', () => {
  fixtures.runFixtureTests([
  "original/tables/match-1.sql",
  "original/tables/match-2.sql",
  "original/tables/match-3.sql",
  "original/tables/match-4.sql",
  "original/tables/match-5.sql",
  "original/tables/match-6.sql"
]);
});
