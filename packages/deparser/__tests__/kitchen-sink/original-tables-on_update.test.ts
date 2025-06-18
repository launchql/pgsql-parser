
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-tables-on_update', () => {
  fixtures.runFixtureTests([
  "original/tables/on_update-1.sql"
]);
});
