
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-tables-temp', () => {
  fixtures.runFixtureTests([
  "original/tables/temp-1.sql",
  "original/tables/temp-2.sql",
  "original/tables/temp-3.sql",
  "original/tables/temp-4.sql",
  "original/tables/temp-5.sql",
  "original/tables/temp-6.sql"
]);
});
