
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-tables-defaults', () => {
  fixtures.runFixtureTests([
  "original/tables/defaults-1.sql"
]);
});
