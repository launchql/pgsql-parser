
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-tables-exclude', () => {
  fixtures.runFixtureTests([
  "original/tables/exclude-1.sql",
  "original/tables/exclude-2.sql"
]);
});
